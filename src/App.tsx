import React, { useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from './firebase';
import { AuthScreen } from './components/AuthScreen';
import { OnboardingForm } from './components/OnboardingForm';
import { Dashboard } from './components/Dashboard';

export const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [puluOnboarding, setPuluOnboarding] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
      if (!currentUser) {
        setPuluOnboarding(false);
      }
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        backgroundColor: '#0f172a',
        color: '#ffffff',
        fontFamily: 'sans-serif'
      }}>
        <p>Carregando aplicação...</p>
      </div>
    );
  }

  // 1. DESLOGADO -> Mostrar Tela de Login / Cadastro
  if (!user) {
    return <AuthScreen />;
  }

  // 2. LOGADO (mas ainda não pulou/completou onboarding) -> Mostrar Formulário
  if (!puluOnboarding) {
    return (
      <OnboardingForm 
        onSkip={() => setPuluOnboarding(true)} 
        onComplete={() => setPuluOnboarding(true)} 
      />
    );
  }

  // 3. LOGADO E LIBERADO -> Mostrar Dashboard
  return <Dashboard />;
};

export default App;