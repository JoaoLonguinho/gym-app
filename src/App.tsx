import React, { useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import { auth, db } from './firebase';
import { AuthScreen } from './components/AuthScreen';
import { OnboardingForm } from './components/OnboardingForm';
import { Dashboard } from './components/Dashboard';
import { Theme } from './components/ThemeToggle';

export const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isGuestMode, setIsGuestMode] = useState<boolean>(false);
  const [isFormCompleted, setIsFormCompleted] = useState<boolean>(false);
  const [isEditingOnboarding, setIsEditingOnboarding] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);

  // Gerenciamento de Tema Claro/Escuro salvo em localStorage
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem('gym_app_theme') as Theme;
    return saved || 'dark';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('gym_app_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  useEffect(() => {
    let unsubscribeFirestore: (() => void) | null = null;

    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);

      if (unsubscribeFirestore) {
        unsubscribeFirestore();
        unsubscribeFirestore = null;
      }

      if (currentUser) {
        setIsGuestMode(false);
        setLoading(true);
        const userDocRef = doc(db, 'users', currentUser.uid);
        unsubscribeFirestore = onSnapshot(
          userDocRef,
          (docSnap) => {
            if (docSnap.exists() && docSnap.data().isFormCompleted === true) {
              setIsFormCompleted(true);
            } else {
              setIsFormCompleted(false);
            }
            setLoading(false);
          },
          (error) => {
            console.error('Erro ao ler dados do usuário no Firestore:', error);
            setLoading(false);
          }
        );
      } else {
        setIsFormCompleted(false);
        setIsEditingOnboarding(false);
        setLoading(false);
      }
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeFirestore) {
        unsubscribeFirestore();
      }
    };
  }, []);

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        backgroundColor: 'var(--bg-main)',
        color: 'var(--text-primary)',
        fontFamily: 'sans-serif'
      }}>
        <p>Carregando aplicação...</p>
      </div>
    );
  }

  // 1. MODO VISITANTE (Sem Conta)
  if (isGuestMode) {
    if (isEditingOnboarding) {
      return (
        <OnboardingForm 
          theme={theme}
          onToggleTheme={toggleTheme}
          onSkip={() => setIsEditingOnboarding(false)} 
          onComplete={() => setIsEditingOnboarding(false)} 
        />
      );
    }
    return (
      <Dashboard 
        theme={theme}
        onToggleTheme={toggleTheme}
        isGuestMode={true}
        onExitGuestMode={() => setIsGuestMode(false)}
        onOpenOnboarding={() => setIsEditingOnboarding(true)}
      />
    );
  }

  // 2. DESLOGADO -> Mostrar Tela de Login / Cadastro
  if (!user) {
    return (
      <AuthScreen 
        theme={theme}
        onToggleTheme={toggleTheme}
        onGuestLogin={() => setIsGuestMode(true)} 
      />
    );
  }

  // 3. LOGADO (mas não completou o formulário ou solicitou editar) -> Mostrar Formulário
  if (!isFormCompleted || isEditingOnboarding) {
    return (
      <OnboardingForm 
        theme={theme}
        onToggleTheme={toggleTheme}
        onSkip={() => {
          setIsFormCompleted(true);
          setIsEditingOnboarding(false);
        }} 
        onComplete={() => {
          setIsFormCompleted(true);
          setIsEditingOnboarding(false);
        }} 
      />
    );
  }

  // 4. LOGADO E COM FORMULÁRIO COMPLETO -> Mostrar Dashboard
  return (
    <Dashboard 
      theme={theme}
      onToggleTheme={toggleTheme}
      onOpenOnboarding={() => setIsEditingOnboarding(true)} 
    />
  );
};

export default App;