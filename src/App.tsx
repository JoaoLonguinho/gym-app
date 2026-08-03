import React, { useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import { auth, db } from './firebase';
import { AuthScreen } from './components/AuthScreen';
import { OnboardingForm } from './components/OnboardingForm';
import { Dashboard } from './components/Dashboard';

export const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isFormCompleted, setIsFormCompleted] = useState<boolean>(false);
  const [isEditingOnboarding, setIsEditingOnboarding] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribeFirestore: (() => void) | null = null;

    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);

      if (unsubscribeFirestore) {
        unsubscribeFirestore();
        unsubscribeFirestore = null;
      }

      if (currentUser) {
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

  // 2. LOGADO (mas não completou o formulário ou solicitou editar) -> Mostrar Formulário
  if (!isFormCompleted || isEditingOnboarding) {
    return (
      <OnboardingForm 
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

  // 3. LOGADO E COM FORMULÁRIO COMPLETO -> Mostrar Dashboard
  return <Dashboard onOpenOnboarding={() => setIsEditingOnboarding(true)} />;
};

export default App;