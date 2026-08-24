import React, { useEffect, useState } from 'react';
import { Exercise } from '../../utils/workoutGenerator';
import styles from './ExerciseModal.module.css';

export interface SetRecord {
  setNum: number;
  weight: string;
  unit?: 'kg' | 'lbs';
  done: boolean;
}

interface ExerciseModalProps {
  exercise: Exercise;
  initialCompleted?: boolean;
  initialSets?: SetRecord[];
  onClose: () => void;
  onUpdateSets: (exerciseId: string, sets: SetRecord[], isFinalized: boolean) => void;
}

export const ExerciseModal: React.FC<ExerciseModalProps> = ({
  exercise,
  initialCompleted = false,
  initialSets,
  onClose,
  onUpdateSets,
}) => {
  const [unit, setUnit] = useState<'kg' | 'lbs'>('kg');

  const [sets, setSets] = useState<SetRecord[]>(() => {
    if (initialSets && initialSets.length > 0) {
      if (initialSets[0]?.unit) {
        setUnit(initialSets[0].unit);
      }
      return initialSets;
    }
    return Array.from({ length: exercise.series }, (_, i) => ({
      setNum: i + 1,
      weight: '',
      unit: 'kg',
      done: initialCompleted,
    }));
  });

  const [stopwatchSeconds, setStopwatchSeconds] = useState<number>(0);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);

  const isAllSetsDone = sets.length > 0 && sets.every((s) => s.done);

  // Cronômetro crescente de descanso (00:00 -> 00:01 -> ...)
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setStopwatchSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning]);

  const handleUnitChange = (newUnit: 'kg' | 'lbs') => {
    setUnit(newUnit);
    const updated = sets.map((s) => ({ ...s, unit: newUnit }));
    setSets(updated);
    const exerciseId = exercise.id || exercise.nome;
    const allDone = updated.every((s) => s.done);
    onUpdateSets(exerciseId, updated, allDone);
  };

  const toggleSetDone = (index: number) => {
    const updated = sets.map((s, i) => {
      if (i === index) {
        const isNowDone = !s.done;
        if (isNowDone) {
          setStopwatchSeconds(0);
          setIsTimerRunning(true);
        }
        return { ...s, done: isNowDone, unit };
      }
      return { ...s, unit: s.unit || unit };
    });

    setSets(updated);
    const exerciseId = exercise.id || exercise.nome;
    const allDone = updated.every((s) => s.done);
    onUpdateSets(exerciseId, updated, allDone);
  };

  const handleWeightChange = (index: number, val: string) => {
    const updated = sets.map((s, i) => (i === index ? { ...s, weight: val, unit } : s));
    setSets(updated);
    const exerciseId = exercise.id || exercise.nome;
    const allDone = updated.every((s) => s.done);
    onUpdateSets(exerciseId, updated, allDone);
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const handleFinalizeToggle = () => {
    const exerciseId = exercise.id || exercise.nome;
    const targetDoneState = !isAllSetsDone;
    const updatedSets = sets.map((s) => ({ ...s, done: targetDoneState, unit }));
    setSets(updatedSets);
    onUpdateSets(exerciseId, updatedSets, targetDoneState);
    onClose();
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Cabeçalho */}
        <div className={styles.header}>
          <div>
            <h3 className={styles.headerTitle}>{exercise.nome}</h3>
            <div className={styles.badgeGroup}>
              <span className={styles.badge}>{exercise.grupoMuscular}</span>
              <span className={styles.badgeReps}>{exercise.series}x {exercise.repeticoes}</span>
            </div>
          </div>
          <button className={styles.btnClose} onClick={onClose} title="Fechar">
            &times;
          </button>
        </div>

        {/* Unidade e Séries */}
        <div className={styles.setsContainer}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>
              Séries e Carga por Série
            </span>
            <div style={{ display: 'flex', gap: '4px', background: 'var(--bg-card-secondary)', padding: '2px', borderRadius: '6px' }}>
              <button
                type="button"
                onClick={() => handleUnitChange('kg')}
                style={{
                  padding: '2px 8px',
                  borderRadius: '4px',
                  border: 'none',
                  background: unit === 'kg' ? 'var(--primary-color)' : 'transparent',
                  color: '#fff',
                  fontSize: '0.75rem',
                  cursor: 'pointer',
                  fontWeight: 600
                }}
              >
                kg
              </button>
              <button
                type="button"
                onClick={() => handleUnitChange('lbs')}
                style={{
                  padding: '2px 8px',
                  borderRadius: '4px',
                  border: 'none',
                  background: unit === 'lbs' ? 'var(--primary-color)' : 'transparent',
                  color: '#fff',
                  fontSize: '0.75rem',
                  cursor: 'pointer',
                  fontWeight: 600
                }}
              >
                lbs
              </button>
            </div>
          </div>

          {sets.map((set, idx) => (
            <div
              key={idx}
              className={`${styles.setRow} ${set.done ? styles.setRowDone : ''}`}
            >
              <span className={styles.setLabel}>{set.setNum}ª Série</span>

              <div className={styles.weightInputGroup}>
                <input
                  type="number"
                  placeholder="0"
                  value={set.weight}
                  onChange={(e) => handleWeightChange(idx, e.target.value)}
                  className={styles.weightInput}
                />
                <span className={styles.unitText}>{unit}</span>
              </div>

              <button
                type="button"
                className={`${styles.btnSetCheck} ${set.done ? styles.btnSetCheckCompleted : ''}`}
                onClick={() => toggleSetDone(idx)}
              >
                {set.done ? 'Concluída' : 'Concluir Série'}
              </button>
            </div>
          ))}
        </div>

        {/* Cronômetro de Descanso Crescente */}
        <div className={styles.timerCard}>
          <p className={styles.timerTitle}>Tempo de Descanso</p>
          <div className={`${styles.timerValue} ${isTimerRunning ? styles.timerValueRunning : ''}`}>
            {formatTimer(stopwatchSeconds)}
          </div>
          <div className={styles.timerControls}>
            <button
              type="button"
              className={styles.btnTimer}
              onClick={() => setIsTimerRunning(!isTimerRunning)}
            >
              {isTimerRunning ? 'Pausar' : 'Iniciar'}
            </button>
            <button
              type="button"
              className={styles.btnTimer}
              onClick={() => {
                setStopwatchSeconds(0);
                setIsTimerRunning(false);
              }}
            >
              Zerar
            </button>
          </div>
        </div>

        {/* Botão de Alternar Conclusão */}
        <button
          type="button"
          className={styles.btnFinalize}
          onClick={handleFinalizeToggle}
          style={{
            background: isAllSetsDone
              ? 'linear-gradient(90deg, #ef4444 0%, #dc2626 100%)'
              : 'var(--primary-gradient)',
          }}
        >
          {isAllSetsDone ? 'Desmarcar Exercício como Concluído' : 'Finalizar Exercício'}
        </button>
      </div>
    </div>
  );
};
