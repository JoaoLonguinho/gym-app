import React, { useEffect, useState } from 'react';
import { signOut } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../../firebase';
import { generateWorkoutRoutine, EstiloTreino } from '../../utils/workoutGenerator';
import { ThemeToggle, Theme } from '../ThemeToggle';
import styles from './OnboardingForm.module.css';

interface OnboardingFormProps {
  onSkip?: () => void;
  onComplete?: () => void;
  theme?: Theme;
  onToggleTheme?: () => void;
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

const SUB_FIELD_CONFIG: Record<EstiloTreino, { label: string; options: Array<{ value: string; label: string }> }> = {
  musculacao: {
    label: 'Foco / Prioridade Muscular',
    options: [
      { value: 'Equilibrado', label: 'Equilibrado (Corpo Todo)' },
      { value: 'Superiores', label: 'Prioridade em Superiores (Peito, Costas, Braços)' },
      { value: 'Inferiores', label: 'Prioridade em Inferiores (Pernas e Glúteos)' },
    ],
  },
  powerlifting: {
    label: 'Foco no Levantamento Principal',
    options: [
      { value: 'Equilibrado', label: 'Equilibrado (Agachamento, Supino e Terra)' },
      { value: 'Agachamento', label: 'Foco em Agachamento (Squat)' },
      { value: 'Supino', label: 'Foco em Supino (Bench Press)' },
      { value: 'Levantamento Terra', label: 'Foco em Levantamento Terra (Deadlift)' },
    ],
  },
  luta: {
    label: 'Estilo de Luta / Arte Marcial',
    options: [
      { value: 'Geral', label: 'Geral (Preparação Física Funcional)' },
      { value: 'Jiu-Jitsu', label: 'Jiu-Jitsu (BJJ)' },
      { value: 'Muay Thai', label: 'Muay Thai / Strikers' },
      { value: 'Boxe', label: 'Boxe' },
      { value: 'Judô', label: 'Judô' },
      { value: 'MMA', label: 'MMA (Artes Marciais Mistas)' },
    ],
  },
  cardio: {
    label: 'Equipamento / Modalidade Principal',
    options: [
      { value: 'Variado', label: 'Variado (Estações Múltiplas)' },
      { value: 'Esteira', label: 'Esteira (Corrida / Caminhada)' },
      { value: 'Bicicleta Ergométrica', label: 'Bicicleta Ergométrica / Spinning' },
      { value: 'Elíptico', label: 'Elíptico' },
      { value: 'Remo', label: 'Remo Seco (Rowing)' },
      { value: 'Corrida de Rua', label: 'Corrida de Rua' },
    ],
  },
  yoga: {
    label: 'Estilo de Yoga',
    options: [
      { value: 'Geral', label: 'Geral (Flexibilidade e Respiratório)' },
      { value: 'Hatha Yoga', label: 'Hatha Yoga' },
      { value: 'Vinyasa Flow', label: 'Vinyasa Flow' },
      { value: 'Ashtanga', label: 'Ashtanga Yoga' },
      { value: 'Yin Yoga', label: 'Yin Yoga' },
    ],
  },
  danca: {
    label: 'Tipo de Dança',
    options: [
      { value: 'Geral', label: 'Geral (Dança e Ritmos)' },
      { value: 'Ritmos Urbanos', label: 'Ritmos Urbanos / Hip Hop' },
      { value: 'Salsa / Bachata', label: 'Salsa / Bachata / Dança de Salão' },
      { value: 'FitDance', label: 'FitDance / AeroDança' },
      { value: 'Ballet Fitness', label: 'Ballet Fitness' },
      { value: 'Zumba', label: 'Zumba' },
    ],
  },
  ginastica: {
    label: 'Foco Calistênico / Ginástico',
    options: [
      { value: 'Geral', label: 'Geral (Condicionamento Corporal)' },
      { value: 'Força em Barra / Paralelas', label: 'Força em Barra e Paralelas' },
      { value: 'Equilíbrio e Solo', label: 'Equilíbrio e Exercícios no Solo' },
      { value: 'Flexibilidade', label: 'Flexibilidade e Mobilidade Articular' },
    ],
  },
};

export const OnboardingForm: React.FC<OnboardingFormProps> = ({ 
  onSkip, 
  onComplete,
  theme = 'dark',
  onToggleTheme
}) => {
  const [estilo, setEstilo] = useState<EstiloTreino>('musculacao');
  const [subFoco, setSubFoco] = useState<string>('Equilibrado');
  const [altura, setAltura] = useState('');
  const [peso, setPeso] = useState('');
  const [metaPeso, setMetaPeso] = useState('');
  const [diasTreino, setDiasTreino] = useState('3');
  const [diasSemana, setDiasSemana] = useState<string[]>([
    'Segunda-feira',
    'Quarta-feira',
    'Sexta-feira'
  ]);
  const [lesao, setLesao] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // Atualizar Psicologia das Cores em tempo real
  useEffect(() => {
    document.documentElement.setAttribute('data-style', estilo);
  }, [estilo]);

  // Atualizar subFoco padrão ao trocar de estilo
  const handleEstiloChange = (novoEstilo: EstiloTreino) => {
    setEstilo(novoEstilo);
    const defaultConfig = SUB_FIELD_CONFIG[novoEstilo];
    if (defaultConfig && defaultConfig.options.length > 0) {
      setSubFoco(defaultConfig.options[0].value);
    }
  };

  useEffect(() => {
    const loadUserData = async () => {
      const user = auth.currentUser;
      if (!user) return;
      try {
        const docSnap = await getDoc(doc(db, 'users', user.uid));
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.estilo) setEstilo(data.estilo as EstiloTreino);
          if (data.foco) setSubFoco(data.foco);
          if (data.altura) setAltura(String(data.altura));
          if (data.peso) setPeso(String(data.peso));
          if (data.metaPeso) setMetaPeso(String(data.metaPeso));
          if (data.diasTreino) setDiasTreino(String(data.diasTreino));
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
      const rotinaTreino = generateWorkoutRoutine(count, diasSemana, subFoco, estilo);

      await setDoc(doc(db, 'users', user.uid), {
        estilo,
        foco: subFoco,
        altura: altura ? Number(altura) : null,
        peso: peso ? Number(peso) : null,
        metaPeso: metaPeso ? Number(metaPeso) : null,
        diasTreino: count,
        diasSemana,
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
        const rotinaPadrao = generateWorkoutRoutine(3, ['Segunda-feira', 'Quarta-feira', 'Sexta-feira'], subFoco, estilo);
        await setDoc(doc(db, 'users', user.uid), {
          estilo,
          foco: subFoco,
          isFormCompleted: true,
          skippedOnboarding: true,
          diasTreino: 3,
          diasSemana: ['Segunda-feira', 'Quarta-feira', 'Sexta-feira'],
          rotinaTreino: rotinaPadrao,
          updatedAt: new Date().toISOString()
        }, { merge: true });
      } catch (err) {
        console.error('Erro ao pular onboarding no Firestore:', err);
      }
    }
    if (onSkip) onSkip();
  };

  const currentSubConfig = SUB_FIELD_CONFIG[estilo];

  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <div className={styles.headerActions}>
          {onToggleTheme && <ThemeToggle theme={theme} onToggleTheme={onToggleTheme} />}
          <button onClick={handleLogout} className={styles.btnLogout}>
            Sair
          </button>
        </div>

        <h2>Personalize seu treino</h2>
        <p className={styles.subtitle}>
          Responda a estas perguntas para criarmos a melhor rotina para você.
        </p>

        {error && <p className={styles.subtitle} style={{ color: '#f87171' }}>{error}</p>}

        <form onSubmit={handleSubmit} className={styles.form}>
          {/* Pergunta Principal: Estilo de Treino */}
          <div className={styles.inputGroup}>
            <label>Qual seu estilo de treino?</label>
            <select 
              value={estilo} 
              onChange={(e) => handleEstiloChange(e.target.value as EstiloTreino)}
            >
              <option value="musculacao">Musculação</option>
              <option value="powerlifting">Powerlifting</option>
              <option value="luta">Luta</option>
              <option value="cardio">Cárdio</option>
              <option value="yoga">Yoga</option>
              <option value="danca">Dança</option>
              <option value="ginastica">Ginástica</option>
            </select>
          </div>

          {/* Subcampo Condicional Dinâmico para TODAS as 7 modalidades */}
          {currentSubConfig && (
            <div className={styles.inputGroup} style={{ borderLeft: '3px solid var(--primary-color)', paddingLeft: '12px' }}>
              <label>{currentSubConfig.label}</label>
              <select value={subFoco} onChange={(e) => setSubFoco(e.target.value)}>
                {currentSubConfig.options.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          )}

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
              <option value="2">2 dias por semana</option>
              <option value="3">3 dias por semana</option>
              <option value="4">4 dias por semana</option>
              <option value="5">5 dias por semana</option>
              <option value="6">6 dias por semana</option>
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
            <label>Possui alguma lesão ou limitação? (Opcional)</label>
            <input 
              type="text" 
              placeholder="Ex: Dor no joelho esquerdo, lombar..." 
              value={lesao} 
              onChange={(e) => setLesao(e.target.value)} 
            />
          </div>

          <button type="submit" disabled={saving} className={styles.btnPrimary}>
            {saving ? 'Salvando...' : 'Salvar e Gerar Treinos'}
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