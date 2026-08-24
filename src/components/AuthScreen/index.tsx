import React, { useState } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword 
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../../firebase';
import { ThemeToggle, Theme } from '../ThemeToggle';
import styles from './AuthScreen.module.css';

interface AuthScreenProps {
  onGuestLogin?: () => void;
  theme?: Theme;
  onToggleTheme?: () => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ 
  onGuestLogin,
  theme = 'dark',
  onToggleTheme
}) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        await setDoc(doc(db, 'users', user.uid), {
          email: user.email,
          createdAt: new Date().toISOString(),
          isFormCompleted: false
        }, { merge: true });
      }
    } catch (err: any) {
      setError('Falha na autenticação. Verifique os dados e tente novamente.');
      console.error(err);
    }
  };

  return (
    <div className={styles.wrapper}>
      {/* Botão de Tema no Topo */}
      {onToggleTheme && (
        <div className={styles.topBar}>
          <ThemeToggle theme={theme} onToggleTheme={onToggleTheme} />
        </div>
      )}

      <div className={styles.card}>
        <h2>{isLogin ? 'Entrar no Gym App 🏋️' : 'Criar Conta 🚀'}</h2>
        
        {error && <p className={styles.error}>{error}</p>}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label>E-mail</label>
            <input 
              type="email" 
              placeholder="seu@email.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
          </div>

          <div className={styles.inputGroup}>
            <label>Senha</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          </div>

          <button type="submit" className={styles.btnPrimary}>
            {isLogin ? 'Entrar' : 'Cadastrar'}
          </button>
        </form>

        <button 
          type="button" 
          className={styles.btnToggle}
          onClick={() => setIsLogin(!isLogin)}
        >
          {isLogin ? 'Não tem uma conta? Cadastre-se' : 'Já tem uma conta? Faça login'}
        </button>

        {/* Opção Continuar sem conta (Modo Teste) */}
        <div className={styles.guestSection}>
          <div className={styles.guestButtonWrapper}>
            <button
              type="button"
              className={styles.btnGuest}
              onClick={onGuestLogin}
            >
              Continuar sem conta
              <span className={styles.helpIcon}>❓</span>
            </button>
            <span className={styles.tooltipText}>
              Ao utilizar o site sem conta, você estará apenas efetuando um teste, onde os dados não serão salvos, será gerado um treino de acordo com o músculo que deseja treinar.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};