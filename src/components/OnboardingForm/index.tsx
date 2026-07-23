import React, { useState } from 'react';
import styles from './OnboardingForm.module.css';
import { db } from '../../firebase';
import { doc, setDoc } from 'firebase/firestore';

interface OnboardingFormProps {
  /** Firebase unique user identifier */
  userId: string;
  /** Callback triggered after form completion or skip */
  onComplete: () => void;
}

export const OnboardingForm: React.FC<OnboardingFormProps> = ({ userId, onComplete }) => {
  /** User physical parameters */
  const [height, setHeight] = useState<string>('');
  const [currentWeight, setCurrentWeight] = useState<string>('');
  const [targetWeight, setTargetWeight] = useState<string>('');
  
  /** Workout preferences */
  const [weeklyFrequency, setWeeklyFrequency] = useState<string>('3');
  const [focusPreference, setFocusPreference] = useState<string>('balanced');
  const [injuryDetails, setInjuryDetails] = useState<string>('');
  
  /** Asynchronous operation state */
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  /**
   * Persists onboarding answers into Firestore and marks the form as completed.
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await setDoc(doc(db, 'users', userId), {
        height: Number(height),
        currentWeight: Number(currentWeight),
        targetWeight: Number(targetWeight),
        weeklyFrequency: Number(weeklyFrequency),
        focusPreference,
        injuryDetails: injuryDetails || 'Nenhuma',
        isFormCompleted: true,
        updatedAt: new Date()
      }, { merge: true });

      onComplete();
    } catch (error) {
      console.error('Failed to save onboarding data:', error);
      alert('Ocorreu um erro ao salvar seus dados. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Bypasses the initial setup by setting `isFormCompleted` to true without physical metrics.
   */
  const handleSkip = async () => {
    setIsSubmitting(true);
    try {
      await setDoc(doc(db, 'users', userId), {
        isFormCompleted: true
      }, { merge: true });

      onComplete();
    } catch (error) {
      console.error('Failed to skip onboarding form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Vamos personalizar seu treino! 🎯</h2>
      <p className={styles.subtitle}>Responda a estas perguntas para criarmos a melhor rotina para você.</p>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.fieldGroup}>
          <label className={styles.label}>Altura (cm)</label>
          <input 
            type="number" 
            placeholder="Ex: 175" 
            value={height} 
            onChange={(e) => setHeight(e.target.value)} 
            className={styles.input} 
            required
          />
        </div>

        <div className={styles.fieldGroup}>
          <label className={styles.label}>Peso Atual (kg)</label>
          <input 
            type="number" 
            step="0.1" 
            placeholder="Ex: 70.5" 
            value={currentWeight} 
            onChange={(e) => setCurrentWeight(e.target.value)} 
            className={styles.input} 
            required
          />
        </div>

        <div className={styles.fieldGroup}>
          <label className={styles.label}>Meta de Peso (kg)</label>
          <input 
            type="number" 
            step="0.1" 
            placeholder="Ex: 75.0" 
            value={targetWeight} 
            onChange={(e) => setTargetWeight(e.target.value)} 
            className={styles.input} 
            required
          />
        </div>

        <div className={styles.fieldGroup}>
          <label className={styles.label}>Quantos dias pretende treinar por semana?</label>
          <select 
            value={weeklyFrequency} 
            onChange={(e) => setWeeklyFrequency(e.target.value)} 
            className={styles.input}
          >
            <option value="2">2 dias por semana</option>
            <option value="3">3 dias por semana</option>
            <option value="4">4 dias por semana</option>
            <option value="5">5 dias por semana</option>
            <option value="6">6 dias por semana</option>
          </select>
        </div>

        <div className={styles.fieldGroup}>
          <label className={styles.label}>Preferência de foco</label>
          <select 
            value={focusPreference} 
            onChange={(e) => setFocusPreference(e.target.value)} 
            className={styles.input}
          >
            <option value="balanced">Corpo todo (Equilibrado)</option>
            <option value="upper">Membros Superiores</option>
            <option value="lower">Membros Inferiores</option>
          </select>
        </div>

        <div className={styles.fieldGroup}>
          <label className={styles.label}>Possui alguma lesão ou limitação? (Opcional)</label>
          <input 
            type="text" 
            placeholder="Ex: Dor no joelho esquerdo, lombar..." 
            value={injuryDetails} 
            onChange={(e) => setInjuryDetails(e.target.value)} 
            className={styles.input} 
          />
        </div>

        <button type="submit" className={styles.button} disabled={isSubmitting}>
          {isSubmitting ? 'Salvando...' : 'Salvar e Continuar 🚀'}
        </button>
      </form>

      <button onClick={handleSkip} className={styles.skipButton} disabled={isSubmitting}>
        Pular formulário inicial
      </button>
    </div>
  );
};