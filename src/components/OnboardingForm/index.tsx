import React, { useState } from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase';
import styles from './OnboardingForm.module.css';

interface OnboardingFormProps {
  onSkip?: () => void;
  onComplete?: () => void;
}

export const OnboardingForm: React.FC<OnboardingFormProps> = ({ onSkip, onComplete }) => {
  const [altura, setAltura] = useState('');
  const [peso, setPeso] = useState('');
  const [metaPeso, setMetaPeso] = useState('');
  const [diasTreino, setDiasTreino] = useState('3');
  const [foco, setFoco] = useState('Corpo todo (Equilibrado)');
  const [lesao, setLesao] = useState('');

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Erro ao sair:', error);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aqui no futuro salvará no Firestore
    if (onComplete) onComplete();
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        {/* Botão de Logout superior */}
        <div className={styles.headerActions}>
          <button onClick={handleLogout} className={styles.btnLogout}>
            Sair
          </button>
        </div>

        <h2>Vamos personalizar seu treino! 🎯</h2>
        <p className={styles.subtitle}>
          Responda a estas perguntas para criarmos a melhor rotina para você.
        </p>

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
            <label>Quantos dias pretende treinar por semana?</label>
            <select value={diasTreino} onChange={(e) => setDiasTreino(e.target.value)}>
              <option value="2">2 dias por semana</option>
              <option value="3">3 dias por semana</option>
              <option value="4">4 dias por semana</option>
              <option value="5">5 dias por semana</option>
              <option value="6">6 dias por semana</option>
            </select>
          </div>

          <div className={styles.inputGroup}>
            <label>Preferência de foco</label>
            <select value={foco} onChange={(e) => setFoco(e.target.value)}>
              <option value="Corpo todo (Equilibrado)">Corpo todo (Equilibrado)</option>
              <option value="Hipertrofia">Hipertrofia / Ganho de Massa</option>
              <option value="Emagrecimento">Emagrecimento / Definição</option>
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

          <button type="submit" className={styles.btnPrimary}>
            Salvar e Continuar 🚀
          </button>

          <button 
            type="button" 
            className={styles.btnSecondary}
            onClick={onSkip}
          >
            Pular formulário inicial
          </button>
        </form>
      </div>
    </div>
  );
};