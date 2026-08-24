import React, { useEffect, useState } from 'react';
import { signOut } from 'firebase/auth';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { auth, db } from '../../firebase';
import { WorkoutDay, Exercise, generateWorkoutRoutine, EstiloTreino } from '../../utils/workoutGenerator';
import { ExerciseModal, SetRecord } from '../ExerciseModal';
import { SwapExerciseModal } from '../SwapExerciseModal';
import { ThemeToggle, Theme } from '../ThemeToggle';
import { InstallShortcutButton } from '../InstallShortcutButton';
import { GeometricAccents } from '../GeometricAccents';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import styles from './Dashboard.module.css';

interface DashboardProps {
  onOpenOnboarding?: () => void;
  isGuestMode?: boolean;
  onExitGuestMode?: () => void;
  theme?: Theme;
  onToggleTheme?: () => void;
}

interface ExerciseLog {
  exerciseName: string;
  grupoMuscular: string;
  isFinalized: boolean;
  sets: SetRecord[];
  updatedAt: string;
}

type ChartFilter = 'dia' | 'mes' | 'ano';

const CORES = ['#10B981', '#E5E7EB'];

export const Dashboard: React.FC<DashboardProps> = ({
  onOpenOnboarding,
  isGuestMode = false,
  onExitGuestMode,
  theme = 'dark',
  onToggleTheme,
}) => {
  const [rotina, setRotina] = useState<WorkoutDay[]>([]);
  const [estilo, setEstilo] = useState<EstiloTreino>('musculacao');
  const [diaSelecionadoIdx, setDiaSelecionadoIdx] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [hasCompletedForm, setHasCompletedForm] = useState<boolean>(false);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [swappingExercise, setSwappingExercise] = useState<Exercise | null>(null);
  const [todayLogs, setTodayLogs] = useState<Record<string, ExerciseLog>>({});
  const [chartFilter, setChartFilter] = useState<ChartFilter>('dia');

  const todayDate = new Date().toISOString().split('T')[0];

  useEffect(() => {
    document.documentElement.setAttribute('data-style', estilo);
  }, [estilo]);

  const handleLogout = async () => {
    if (isGuestMode && onExitGuestMode) {
      onExitGuestMode();
      return;
    }
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Erro ao sair:', error);
    }
  };

  // Carregar dados de rotina e estilo do usuário
  useEffect(() => {
    if (isGuestMode) {
      const gerado = generateWorkoutRoutine(3, ['Segunda-feira', 'Quarta-feira', 'Sexta-feira'], 'Equilibrado', 'musculacao');
      setRotina(gerado);
      setEstilo('musculacao');
      setHasCompletedForm(false);
      setLoading(false);
      return;
    }

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

          const userEstilo: EstiloTreino = data.estilo || 'musculacao';
          setEstilo(userEstilo);

          if (Array.isArray(data.rotinaTreino) && data.rotinaTreino.length > 0) {
            setRotina(data.rotinaTreino);
          } else {
            const count = data.diasTreino || 3;
            const dias = data.diasSemana || ['Segunda-feira', 'Quarta-feira', 'Sexta-feira'];
            const foco = data.foco || 'Equilibrado';
            const gerado = generateWorkoutRoutine(count, dias, foco, userEstilo);
            setRotina(gerado);
          }
        } else {
          setHasCompletedForm(false);
          const gerado = generateWorkoutRoutine(3, ['Segunda-feira', 'Quarta-feira', 'Sexta-feira'], 'Equilibrado', 'musculacao');
          setRotina(gerado);
        }
      } catch (err) {
        console.error('Erro ao carregar dados do usuário:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserRoutine();
  }, [isGuestMode]);

  // Escutar logs do treino de hoje no Firestore (apenas se logado)
  useEffect(() => {
    if (isGuestMode) return;
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
  }, [todayDate, isGuestMode]);

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

  const getLogForExercise = (ex: Exercise): ExerciseLog | undefined => {
    if (!ex) return undefined;
    return (ex.id ? todayLogs[ex.id] : undefined) || todayLogs[ex.nome];
  };

  const isExerciseDone = (ex: Exercise): boolean => {
    const log = getLogForExercise(ex);
    if (!log) return false;
    if (log.isFinalized) return true;
    if (log.sets && log.sets.length > 0 && log.sets.every((s) => s.done)) return true;
    return false;
  };

  // Trocar exercício da rotina por outro do mesmo grupo muscular
  const handleSwapExercise = async (oldExercise: Exercise, newExercise: Exercise) => {
    if (!treinoAtual) return;

    const updatedRotina = rotina.map((day, idx) => {
      if (idx === diaSelecionadoIdx) {
        const updatedExercicios = day.exercicios.map((ex) =>
          ex.nome === oldExercise.nome || (ex.id && ex.id === oldExercise.id) ? { ...newExercise, id: ex.id || newExercise.id } : ex
        );
        return { ...day, exercicios: updatedExercicios };
      }
      return day;
    });

    setRotina(updatedRotina);
    setSwappingExercise(null);

    // Salvar nova rotina no Firestore se logado
    const user = auth.currentUser;
    if (user && !isGuestMode) {
      try {
        await setDoc(doc(db, 'users', user.uid), {
          rotinaTreino: updatedRotina,
          updatedAt: new Date().toISOString(),
        }, { merge: true });
      } catch (err) {
        console.error('Erro ao atualizar exercício trocado no Firestore:', err);
      }
    }
  };

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

    setTodayLogs((prev) => ({
      ...prev,
      [exKeyId]: updatedLog,
      [exName]: updatedLog,
    }));

    if (user && !isGuestMode) {
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

  const totalExerciciosNoDia = treinoAtual?.exercicios.length || 0;
  const concluidosNoDiaCount = treinoAtual?.exercicios.filter(isExerciseDone).length || 0;

  let chartTitle = '';
  let chartData: Array<{ name: string; value: number }> = [];

  if (chartFilter === 'dia') {
    chartTitle = `Progresso do Treino de Hoje (${concluidosNoDiaCount}/${totalExerciciosNoDia} concluídos)`;
    chartData = [
      { name: 'Exercícios Concluídos', value: concluidosNoDiaCount },
      { name: 'Pendente no Dia', value: Math.max(totalExerciciosNoDia - concluidosNoDiaCount, 0) },
    ];
  } else if (chartFilter === 'mes') {
    chartTitle = 'Desempenho Mensal (Treinos Realizados no Mês)';
    chartData = [
      { name: 'Treinos Concluídos no Mês', value: 14 },
      { name: 'Meta Restante do Mês', value: 4 },
    ];
  } else {
    chartTitle = 'Desempenho Anual (Frequência em 12 Meses)';
    chartData = [
      { name: 'Treinos Realizados no Ano', value: 142 },
      { name: 'Meta Anual Pendente', value: 38 },
    ];
  }

  const buttonText = hasCompletedForm ? 'Refazer formulário inicial' : 'Preencher formulário inicial';

  return (
    <div className={styles.container}>
      {/* Aviso de Modo Visitante se ativo */}
      {isGuestMode && (
        <div style={{
          backgroundColor: 'var(--bg-card-secondary)',
          border: '1px solid var(--primary-color)',
          borderRadius: '8px',
          padding: '10px 14px',
          color: 'var(--text-primary)',
          fontSize: '0.85rem',
          marginBottom: '16px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <span><strong>Modo Teste (Visitante):</strong> Os dados não serão salvos no banco.</span>
          <button
            onClick={onExitGuestMode}
            style={{
              background: 'var(--primary-color)',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              padding: '4px 10px',
              fontSize: '0.75rem',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            Criar conta para salvar
          </button>
        </div>
      )}

      {/* Cabeçalho */}
      <header className={styles.header}>
        <h2>Meu Painel de Treinos</h2>
        <div className={styles.headerRight}>
          <InstallShortcutButton />
          {onToggleTheme && <ThemeToggle theme={theme} onToggleTheme={onToggleTheme} />}
          <button 
            onClick={onOpenOnboarding} 
            className={styles.btnOnboarding}
            title={buttonText}
          >
            {buttonText}
          </button>
          <button onClick={handleLogout} className={styles.btnLogout}>
            {isGuestMode ? 'Sair do Modo Teste' : 'Sair'}
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
                {item.diaSemana}
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
          <GeometricAccents variant="card" />
          <div className={styles.workoutHeaderTitle}>
            <h3>
              {treinoAtual.diaSemana}: <span className={styles.workoutTag}>{treinoAtual.titulo}</span>
            </h3>
            <span className={styles.metaBadge}>{treinoAtual.tipo}</span>
          </div>

          <div className={styles.exerciseListContainer}>
            <p className={styles.exerciseListTitle}>
              Exercícios recomendados <span style={{ fontWeight: 400, fontSize: '0.85rem', color: 'var(--text-muted)' }}>({treinoAtual.focoMuscular})</span>:
            </p>

            <div className={styles.exerciseGrid}>
              {treinoAtual.exercicios.map((ex, idx) => {
                const log = getLogForExercise(ex);
                const isDone = isExerciseDone(ex);
                const completedSets = log?.sets?.filter((s) => s.done) || [];
                const doneSetsCount = completedSets.length;
                const totalSeries = ex.series;

                const weightsList = completedSets
                  .filter((s) => s.weight)
                  .map((s) => `${s.weight} ${s.unit || 'kg'}`)
                  .join(', ');

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
                        <span>
                          • {doneSetsCount}/{totalSeries} séries concluídas ({ex.repeticoes})
                        </span>
                        {weightsList && (
                          <span className={styles.weightsBadge}>
                            • Cargas: {weightsList}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className={styles.exerciseActionsRight}>
                      {isDone ? (
                        <span className={styles.statusBadgeDone}>Concluído</span>
                      ) : doneSetsCount > 0 ? (
                        <span className={styles.statusBadgePending} style={{ color: 'var(--primary-color)' }}>
                          Em andamento ({doneSetsCount}/{totalSeries})
                        </span>
                      ) : (
                        <span className={styles.statusBadgePending}>Iniciar</span>
                      )}

                      {/* Botão com Ícone Vetorial de Troca de Exercício */}
                      <button
                        type="button"
                        className={styles.btnSwapExercise}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSwappingExercise(ex);
                        }}
                        title="Substituir por outro exercício do mesmo músculo"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 2v6h-6" />
                          <path d="M3 12a9 9 0 0 1 15-6.7L21 8" />
                          <path d="M3 22v-6h6" />
                          <path d="M21 12a9 9 0 0 1-15 6.7L3 16" />
                        </svg>
                      </button>
                    </div>
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

      {/* Modal de Troca de Exercício */}
      {swappingExercise && (
        <SwapExerciseModal
          currentExercise={swappingExercise}
          onClose={() => setSwappingExercise(null)}
          onSelectAlternative={(newEx) => handleSwapExercise(swappingExercise, newEx)}
        />
      )}

      {/* Dashboard: Gráfico de Progresso com Filtros */}
      <section className={styles.chartCard}>
        <GeometricAccents variant="chart" />
        <div className={styles.chartHeader}>
          <h3>{chartTitle}</h3>
          <div className={styles.filterButtonGroup}>
            <button
              type="button"
              className={`${styles.filterBtn} ${chartFilter === 'dia' ? styles.filterBtnActive : ''}`}
              onClick={() => setChartFilter('dia')}
            >
              Dia
            </button>
            <button
              type="button"
              className={`${styles.filterBtn} ${chartFilter === 'mes' ? styles.filterBtnActive : ''}`}
              onClick={() => setChartFilter('mes')}
            >
              Mês
            </button>
            <button
              type="button"
              className={`${styles.filterBtn} ${chartFilter === 'ano' ? styles.filterBtnActive : ''}`}
              onClick={() => setChartFilter('ano')}
            >
              Ano
            </button>
          </div>
        </div>

        <div className={styles.chartWrapper}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                label={({ percent }) => `${((percent || 0) * 100).toFixed(0)}%`}
              >
                {chartData.map((entry, index) => (
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