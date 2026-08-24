import React from 'react';
import { Exercise, getAlternativeExercises } from '../../utils/workoutGenerator';
import styles from './SwapExerciseModal.module.css';

interface SwapExerciseModalProps {
  currentExercise: Exercise;
  onClose: () => void;
  onSelectAlternative: (newExercise: Exercise) => void;
}

export const SwapExerciseModal: React.FC<SwapExerciseModalProps> = ({
  currentExercise,
  onClose,
  onSelectAlternative,
}) => {
  const alternatives = getAlternativeExercises(currentExercise.grupoMuscular, currentExercise.nome);

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Cabeçalho */}
        <div className={styles.header}>
          <div>
            <h3 className={styles.headerTitle}>Substituir Exercício</h3>
            <p className={styles.subtitle}>
              Opções alternadas para <strong>{currentExercise.grupoMuscular}</strong>
            </p>
          </div>
          <button className={styles.btnClose} onClick={onClose} title="Fechar">
            &times;
          </button>
        </div>

        {/* Lista de Alternativas */}
        <div className={styles.optionsGrid}>
          {alternatives.map((altEx, idx) => (
            <div
              key={idx}
              className={styles.optionCard}
              onClick={() => onSelectAlternative(altEx)}
            >
              <div className={styles.optionInfo}>
                <span className={styles.optionName}>{altEx.nome}</span>
                <span className={styles.optionMeta}>
                  {altEx.grupoMuscular} • {altEx.series}x ({altEx.repeticoes})
                </span>
              </div>
              <button
                type="button"
                className={styles.btnSelectOption}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectAlternative(altEx);
                }}
              >
                Selecionar
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
