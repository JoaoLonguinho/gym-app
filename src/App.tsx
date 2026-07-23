import React, { useState, useEffect } from 'react';
import './App.css';
import { Login } from './components/Login';
import { OnboardingForm } from './components/OnboardingForm';
import { auth, db } from './firebase';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

function App() {
  /** Currently authenticated Firebase user */
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  
  /** Indicates whether initial auth and user status checks are pending */
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  /** Determines if the onboarding screen should be displayed */
  const [requiresOnboarding, setRequiresOnboarding] = useState<boolean>(false);

  /**
   * Queries Firestore to determine if the user has completed or skipped onboarding.
   */
  const checkOnboardingStatus = async (userId: string) => {
    try {
      const userDocRef = doc(db, 'users', userId);
      const userSnap = await getDoc(userDocRef);

      if (userSnap.exists() && userSnap.data().isFormCompleted) {
        setRequiresOnboarding(false);
      } else {
        setRequiresOnboarding(true);
      }
    } catch (error) {
      console.error('Error fetching user onboarding status:', error);
      setRequiresOnboarding(false);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        await checkOnboardingStatus(user.uid);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = () => {
    signOut(auth);
  };

  if (isLoading) {
    return (
      <div className="App">
        <p style={{ color: '#fff' }}>Loading...</p>
      </div>
    );
  }

  return (
    <div className="App">
      {!currentUser ? (
        <Login />
      ) : requiresOnboarding ? (
        <OnboardingForm 
          userId={currentUser.uid} 
          onComplete={() => setRequiresOnboarding(false)} 
        />
      ) : (
        <div style={{ color: '#fff', textAlign: 'center' }}>
          <h2>Welcome to Gym App! 👋</h2>
          <p>Email: {currentUser.email}</p>
          <button 
            onClick={handleLogout}
            style={{
              padding: '0.8rem 1.5rem',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: '#f38ba8',
              color: '#11111b',
              fontWeight: 'bold',
              cursor: 'pointer',
              marginTop: '1rem'
            }}
          >
            Sign Out 🚪
          </button>
        </div>
      )}
    </div>
  );
}

export default App;