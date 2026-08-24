import React, { useEffect, useState } from 'react';
import { InstallShortcutModal } from '../InstallShortcutModal';
import styles from './InstallShortcutButton.module.css';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export const InstallShortcutButton: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstructionModal, setShowInstructionModal] = useState<boolean>(false);
  const [isStandalone, setIsStandalone] = useState<boolean>(false);

  useEffect(() => {
    // Detectar se a aplicação já está rodando como app instalado (standalone)
    const isAppInstalled = window.matchMedia('(display-mode: standalone)').matches || (navigator as any).standalone;
    if (isAppInstalled) {
      setIsStandalone(true);
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  // Se já estiver rodando em janela própria/standalone, esconde o botão
  if (isStandalone) {
    return null;
  }

  const handleClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult.outcome === 'accepted') {
        setDeferredPrompt(null);
      }
    } else {
      setShowInstructionModal(true);
    }
  };

  return (
    <>
      <button
        type="button"
        className={styles.btnInstall}
        onClick={handleClick}
        title="Adicionar o Gym App à Tela Inicial do celular ou desktop"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
          <line x1="12" y1="18" x2="12.01" y2="18" />
          <polyline points="9 11 12 14 15 11" />
          <line x1="12" y1="6" x2="12" y2="14" />
        </svg>
        <span>Adicionar à Tela Inicial</span>
      </button>

      {showInstructionModal && (
        <InstallShortcutModal onClose={() => setShowInstructionModal(false)} />
      )}
    </>
  );
};
