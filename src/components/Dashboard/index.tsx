import React, { useEffect, useState } from 'react';
import { signOut } from 'firebase/auth';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { auth, db } from '../../firebase';
import { WorkoutDay, Exercise, generateWorkoutRoutine } from '../../utils/workoutGenerator';
import { ExerciseModal, SetRecord } from '../ExerciseModal';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import styles from './Dashboard.module.css';

interface DashboardProps {
  onOpenOnboarding?: () => void;
}

interface ExerciseLog {
  exerciseName: string;
  grupoMuscular: string;
  isFinalized: boolean;
  sets: SetRecord[];
  updatedAt: string;
}

const CORES = ['#10B981', '#E5E7EB'];

export const Dashboard: React.FC<DashboardProps> = ({ onOpenOnboarding }) => {
  const [rotina, setRotina] = useState<WorkoutDay[]>([]);
  const [diaSelecionadoIdx, setDiaSelecionadoIdx] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [hasCompletedForm, setHasCompletedForm] = useState<boolean>(false);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [todayLogs, setTodayLogs] = useState<Record<string, ExerciseLog>>({});

  const todayDate = new Date().toISOString().split('T')[0];

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Erro ao sair:', error);
    }
  };

  // Carregar dados de rotina do usuário
  useEffect(() => {
    const fetchUserRoutine = async () => {
      const user = auth.currentUser;
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const docSnap = await getDoc(doc(db, 'users', user.uid));
        if (docSnap.exists()) {
          const data = docSnap.data();
          const isFullCompleted = Boolean(data.isFormCompleted && !data.skippedOnboarding);
          setHasCompletedForm(isFullCompleted);

          if (Array.isArray(data.rotinaTreino) && data.rotinaTreino.length > 0) {
            setRotina(data.rotinaTreino);
          } else {
            const count = data.diasTreino || 3;
            const dias = data.diasSemana || ['Segunda-feira', 'Quarta-feira', 'Sexta-feira'];
            const foco = data.foco || 'Equilibrado';
            const gerado = generateWorkoutRoutine(count, dias, foco);
            setRotina(gerado);
          }
        } else {
          setHasCompletedForm(false);
          const gerado = generateWorkoutRoutine(3, ['Segunda-feira', 'Quarta-feira', 'Sexta-feira'], 'Equilibrado');
          setRotina(gerado);
        }
      } catch (err) {
        console.error('Erro ao carregar dados do usuário:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserRoutine();
  }, []);

  // Escutar logs do treino de hoje em tempo real do Firestore
  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const logRef = doc(db, 'users', user.uid, 'workoutLogs', todayDate);
    const unsubscribe = onSnapshot(
      logRef,
      (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.exercises) {
            setTodayLogs((prev) => ({
              ...prev,
              ...(data.exercises as Record<string, ExerciseLog>),
            }));
          }
        }
      },
      (error) => {
        console.error('Erro ao ler logs de treino do Firestore:', error);
      }
    );

    return () => unsubscribe();
  }, [todayDate]);

  // Selecionar o dia de hoje por padrão
  useEffect(() => {
    if (rotina.length > 0) {
      const diasSemanaMap = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
      const hojeNome = diasSemanaMap[new Date().getDay()];
      const idxHoje = rotina.findIndex(r => r.diaSemana === hojeNome || r.diaSemana.startsWith(hojeNome.replace('-feira', '')));
      if (idxHoje !== -1) {
        setDiaSelecionadoIdx(idxHoje);
      }
    }
  }, [rotina]);

  const treinoAtual = rotina[diaSelecionadoIdx] || rotina[0];

  // Auxiliar para recuperar o log de um exercício de forma flexível por ID ou Nome
  const getLogForExercise = (ex: Exercise): ExerciseLog | undefined => {
    if (!ex) return undefined;
    return (ex.id ? todayLogs[ex.id] : undefined) || todayLogs[ex.nome];
  };

  // Verificar se o exercício está concluído
  const isExerciseDone = (ex: Exercise): boolean => {
    const log = getLogForExercise(ex);
    if (!log) return false;
    if (log.isFinalized) return true;
    if (log.sets && log.sets.length > 0 && log.sets.every((s) => s.done)) return true;
    return false;
  };

  // Sincronizar alteração de séries/cargas no Firestore e no estado local imediatamente
  const handleUpdateSetsInFirestore = async (
    exerciseId: string,
    sets: SetRecord[],
    isFinalized: boolean
  ) => {
    const user = auth.currentUser;
    if (!treinoAtual) return;

    const exName = selectedExercise?.nome || exerciseId;
    const exGrupo = selectedExercise?.grupoMuscular || 'Geral';
    const exKeyId = selectedExercise?.id || exerciseId;
    const isCompleted = isFinalized || (sets.length > 0 && sets.every((s) => s.done));

    const updatedLog: ExerciseLog = {
      exerciseName: exName,
      grupoMuscular: exGrupo,
      isFinalized: isCompleted,
      sets,
      updatedAt: new Date().toISOString(),
    };

    // 1. Atualizar estado React local instantaneamente
    setTodayLogs((prev) => ({
      ...prev,
      [exKeyId]: updatedLog,
      [exName]: updatedLog,
    }));

    // 2. Persistir no Firestore sob a chave do ID e do Nome para garantia total
    if (user) {
      try {
        const logRef = doc(db, 'users', user.uid, 'workoutLogs', todayDate);
        await setDoc(
          logRef,
          {
            date: todayDate,
            workoutTitle: treinoAtual.titulo,
            diaSemana: treinoAtual.diaSemana,
            updatedAt: new Date().toISOString(),
            exercises: {
              [exKeyId]: updatedLog,
              [exName]: updatedLog,
            },
          },
          { merge: true }
        );
      } catch (err) {
        console.error('Erro ao salvar progresso no Firestore:', err);
      }
    }
  };

  // Calcular estatísticas do dia para o gráfico
  const totalExerciciosNoDia = treinoAtual?.exercicios.length || 0;
  const concluidosNoDiaCount = treinoAtual?.exercicios.filter(isExerciseDone).length || 0;

  const mockDataTreinos = [
    { name: 'Exercícios Concluídos', value: concluidosNoDiaCount },
    { name: 'Pendente no Dia', value: Math.max(totalExerciciosNoDia - concluidosNoDiaCount, 0) },
  ];

  const buttonText = hasCompletedForm ? 'Refazer formulário inicial' : 'Preencher formulário inicial';

  return (
    <div className={styles.container}>
      {/* Cabeçalho */}
      <header className={styles.header}>
        <h2>Meu Painel de Treinos</h2>
        <div className={styles.headerRight}>
          <button 
            onClick={onOpenOnboarding} 
            className={styles.btnOnboarding}
            title={buttonText}
          >
            📋 {buttonText}
          </button>
          <button onClick={handleLogout} className={styles.btnLogout}>
            Sair
          </button>
        </div>
      </header>

      {/* Abas dos dias da semana */}
      {rotina.length > 0 && (
        <div className={styles.tabsContainer}>
          {rotina.map((item, index) => {
            const isActive = index === diaSelecionadoIdx;
            return (
              <button
                key={index}
                className={`${styles.tabButton} ${isActive ? styles.tabButtonActive : ''}`}
                onClick={() => setDiaSelecionadoIdx(index)}
              >
                📅 {item.diaSemana}
              </button>
            );
          })}
        </div>
      )}

      {/* Card do Treino Selecionado */}
      {loading ? (
        <p>Carregando sua rotina de treino...</p>
      ) : treinoAtual ? (
        <section className={styles.todayWorkoutCard}>
          <div className={styles.workoutHeaderTitle}>
            <h3>
              🏋️ {treinoAtual.diaSemana}: <span className={styles.workoutTag}>{treinoAtual.titulo}</span>
            </h3>
            <span className={styles.metaBadge}>{treinoAtual.tipo}</span>
          </div>

          <div className={styles.exerciseListContainer}>
            <p className={styles.exerciseListTitle}>
              Exercícios recomendados <span style={{ fontWeight: 400, fontSize: '0.85rem', color: '#6b7280' }}>({treinoAtual.focoMuscular})</span>:
            </p>

            <div className={styles.exerciseGrid}>
              {treinoAtual.exercicios.map((ex, idx) => {
                const log = getLogForExercise(ex);
                const isDone = isExerciseDone(ex);
                const lastWeight = log?.sets?.find((s) => s.weight)?.weight;

                return (
                  <div
                    key={idx}
                    className={`${styles.exerciseRowCard} ${isDone ? styles.exerciseRowCardDone : ''}`}
                    onClick={() => setSelectedExercise(ex)}
                  >
                    <div className={styles.exerciseRowInfo}>
                      <span className={styles.exerciseRowName}>{ex.nome}</span>
                      <div className={styles.exerciseRowMeta}>
                        <span className={styles.muscleTag}>{ex.grupoMuscular}</span>
                        <span>• {ex.series} séries x {ex.repeticoes}</span>
                        {lastWeight && (
                          <span style={{ color: '#8b5cf6', fontWeight: 600 }}>
                            • {lastWeight} kg/lbs
                          </span>
                        )}
                      </div>
                    </div>

                    {isDone ? (
                      <span className={styles.statusBadgeDone}>✓ Concluído</span>
                    ) : (
                      <span className={styles.statusBadgePending}>Iniciar ▶</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      ) : (
        <p>Nenhum treino configurado. Clique em "{buttonText}" acima para gerar sua rotina!</p>
      )}

      {/* Modal de Exercício */}
      {selectedExercise && (
        <ExerciseModal
          exercise={selectedExercise}
          initialCompleted={isExerciseDone(selectedExercise)}
          initialSets={getLogForExercise(selectedExercise)?.sets}
          onClose={() => setSelectedExercise(null)}
          onUpdateSets={(exerciseId, sets, isFinalized) =>
            handleUpdateSetsInFirestore(exerciseId, sets, isFinalized)
          }
        />
      )}

      {/* Dashboard: Gráfico de Progresso */}
      <section className={styles.chartCard}>
        <h3>📊 Progresso do Treino de Hoje ({concluidosNoDiaCount}/{totalExerciciosNoDia} concluídos)</h3>
        <div className={styles.chartWrapper}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={mockDataTreinos}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                label={({ percent }) => `${((percent || 0) * 100).toFixed(0)}%`}
              >
                {mockDataTreinos.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={CORES[index % CORES.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </section>
    </div>
  );
};