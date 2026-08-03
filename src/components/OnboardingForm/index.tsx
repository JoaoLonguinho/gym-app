import React, { useEffect, useState } from 'react';
import { signOut } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../../firebase';
import { generateWorkoutRoutine, FocoTreino } from '../../utils/workoutGenerator';
import styles from './OnboardingForm.module.css';

interface OnboardingFormProps {
  onSkip?: () => void;
  onComplete?: () => void;
}

const TODOS_DIAS_SEMANA = [
  'Segunda-feira',
  'Terça-feira',
  'Quarta-feira',
  'Quinta-feira',
  'Sexta-feira',
  'Sábado',
  'Domingo'
];

export const OnboardingForm: React.FC<OnboardingFormProps> = ({ onSkip, onComplete }) => {
  const [altura, setAltura] = useState('');
  const [peso, setPeso] = useState('');
  const [metaPeso, setMetaPeso] = useState('');
  const [diasTreino, setDiasTreino] = useState('3');
  const [diasSemana, setDiasSemana] = useState<string[]>([
    'Segunda-feira',
    'Quarta-feira',
    'Sexta-feira'
  ]);
  const [foco, setFoco] = useState<FocoTreino>('Equilibrado');
  const [lesao, setLesao] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadUserData = async () => {
      const user = auth.currentUser;
      if (!user) return;
      try {
        const docSnap = await getDoc(doc(db, 'users', user.uid));
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.altura) setAltura(String(data.altura));
          if (data.peso) setPeso(String(data.peso));
          if (data.metaPeso) setMetaPeso(String(data.metaPeso));
          if (data.diasTreino) setDiasTreino(String(data.diasTreino));
          if (data.foco) setFoco(data.foco as FocoTreino);
          if (data.lesao) setLesao(data.lesao);
          if (Array.isArray(data.diasSemana) && data.diasSemana.length > 0) {
            setDiasSemana(data.diasSemana);
          }
        }
      } catch (err) {
        console.error('Erro ao carregar dados do usuário:', err);
      }
    };
    loadUserData();
  }, []);

  const handleDiasTreinoChange = (val: string) => {
    setDiasTreino(val);
    const count = Number(val);
    if (diasSemana.length > count) {
      setDiasSemana(diasSemana.slice(0, count));
    } else if (diasSemana.length < count) {
      const adicionais = TODOS_DIAS_SEMANA.filter(d => !diasSemana.includes(d)).slice(0, count - diasSemana.length);
      setDiasSemana([...diasSemana, ...adicionais]);
    }
  };

  const toggleDiaSemana = (dia: string) => {
    const targetCount = Number(diasTreino);
    if (diasSemana.includes(dia)) {
      if (diasSemana.length > 1) {
        setDiasSemana(diasSemana.filter(d => d !== dia));
      }
    } else {
      if (diasSemana.length < targetCount) {
        setDiasSemana([...diasSemana, dia]);
      } else {
        setDiasSemana([...diasSemana.slice(1), dia]);
      }
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error('Erro ao sair:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (!user) {
      setError('Usuário não autenticado.');
      return;
    }

    const count = Number(diasTreino);
    if (diasSemana.length !== count) {
      setError(`Selecione exatamente ${count} dias da semana para o seu treino.`);
      return;
    }

    setSaving(true);
    setError('');

    try {
      const rotinaTreino = generateWorkoutRoutine(count, diasSemana, foco);

      await setDoc(doc(db, 'users', user.uid), {
        altura: altura ? Number(altura) : null,
        peso: peso ? Number(peso) : null,
        metaPeso: metaPeso ? Number(metaPeso) : null,
        diasTreino: count,
        diasSemana,
        foco,
        lesao: lesao.trim() || null,
        rotinaTreino,
        isFormCompleted: true,
        skippedOnboarding: false,
        updatedAt: new Date().toISOString()
      }, { merge: true });

      setSaving(false);
      if (onComplete) onComplete();
    } catch (err: any) {
      console.error('Erro ao salvar onboarding:', err);
      setError('Erro ao salvar suas informações. Tente novamente.');
      setSaving(false);
    }
  };

  const handleSkip = async () => {
    const user = auth.currentUser;
    if (user) {
      try {
        const rotinaPadrao = generateWorkoutRoutine(3, ['Segunda-feira', 'Quarta-feira', 'Sexta-feira'], 'Equilibrado');
        await setDoc(doc(db, 'users', user.uid), {
          isFormCompleted: true,
          skippedOnboarding: true,
          diasTreino: 3,
          diasSemana: ['Segunda-feira', 'Quarta-feira', 'Sexta-feira'],
          foco: 'Equilibrado',
          rotinaTreino: rotinaPadrao,
          updatedAt: new Date().toISOString()
        }, { merge: true });
      } catch (err) {
        console.error('Erro ao pular onboarding no Firestore:', err);
      }
    }
    if (onSkip) onSkip();
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <div className={styles.headerActions}>
          <button onClick={handleLogout} className={styles.btnLogout}>
            Sair
          </button>
        </div>

        <h2>Vamos personalizar seu treino! 🎯</h2>
        <p className={styles.subtitle}>
          Responda a estas perguntas para criarmos a melhor rotina para você.
        </p>

        {error && <p className={styles.subtitle} style={{ color: '#f87171' }}>{error}</p>}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label>Altura (cm)</label>
            <input 
              type="number" 
              placeholder="Ex: 175" 
              value={altura} 
              onChange={(e) => setAltura(e.target.value)} 
            />
          </div>

          <div className={styles.inputGroup}>
            <label>Peso Atual (kg)</label>
            <input 
              type="number" 
              placeholder="Ex: 70.5" 
              value={peso} 
              onChange={(e) => setPeso(e.target.value)} 
            />
          </div>

          <div className={styles.inputGroup}>
            <label>Meta de Peso (kg)</label>
            <input 
              type="number" 
              placeholder="Ex: 75.0" 
              value={metaPeso} 
              onChange={(e) => setMetaPeso(e.target.value)} 
            />
          </div>

          <div className={styles.inputGroup}>
            <label>Quantos dias pretende treinar durante a semana?</label>
            <select value={diasTreino} onChange={(e) => handleDiasTreinoChange(e.target.value)}>
              <option value="2">2 dias por semana (1 Superiores / 1 Inferiores)</option>
              <option value="3">3 dias por semana</option>
              <option value="4">4 dias por semana (2 Superiores / 2 Inferiores)</option>
              <option value="5">5 dias por semana</option>
              <option value="6">6 dias por semana (3 Superiores / 3 Inferiores)</option>
            </select>
          </div>

          <div className={styles.inputGroup}>
            <label>Escolha os {diasTreino} dias da semana que irá treinar:</label>
            <div className={styles.daysGrid}>
              {TODOS_DIAS_SEMANA.map((dia) => {
                const isSelected = diasSemana.includes(dia);
                const exibeShort = dia.replace('-feira', '');
                return (
                  <div
                    key={dia}
                    className={`${styles.dayChip} ${isSelected ? styles.dayChipActive : ''}`}
                    onClick={() => toggleDiaSemana(dia)}
                  >
                    {exibeShort}
                  </div>
                );
              })}
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label>Foco / Prioridade Muscular</label>
            <select value={foco} onChange={(e) => setFoco(e.target.value as FocoTreino)}>
              <option value="Equilibrado">Equilibrado (Corpo Todo)</option>
              <option value="Superiores">Prioridade em Superiores (Peito, Costas, Braços)</option>
              <option value="Inferiores">Prioridade em Inferiores (Pernas e Glúteos)</option>
            </select>
          </div>

          <div className={styles.inputGroup}>
            <label>Possui alguma lesão ou limitação? (Opcional)</label>
            <input 
              type="text" 
              placeholder="Ex: Dor no joelho esquerdo, lombar..." 
              value={lesao} 
              onChange={(e) => setLesao(e.target.value)} 
            />
          </div>

          <button type="submit" disabled={saving} className={styles.btnPrimary}>
            {saving ? 'Salvando...' : 'Salvar e Gerar Treinos 🚀'}
          </button>

          <button 
            type="button" 
            className={styles.btnSecondary}
            onClick={handleSkip}
          >
            Pular formulário inicial
          </button>
        </form>
      </div>
    </div>
  );
};