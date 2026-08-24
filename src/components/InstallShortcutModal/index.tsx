import React from 'react';
import styles from './InstallShortcutModal.module.css';

interface InstallShortcutModalProps {
  onClose: () => void;
}

export const InstallShortcutModal: React.FC<InstallShortcutModalProps> = ({ onClose }) => {
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h3>Adicionar à Tela Inicial</h3>
          <button className={styles.btnClose} onClick={onClose} title="Fechar">
            &times;
          </button>
        </div>

        <div className={styles.stepList}>
          {isIOS ? (
            <>
              <div className={styles.stepItem}>
                <span className={styles.stepBadge}>1</span>
                <p className={styles.stepText}>
                  No navegador Safari do seu iPhone, toque no ícone de <strong>Compartilhar</strong> (o quadrado com uma seta para cima na barra inferior).
                </p>
              </div>
              <div className={styles.stepItem}>
                <span className={styles.stepBadge}>2</span>
                <p className={styles.stepText}>
                  Role o menu para baixo e selecione a opção <strong>"Adicionar à Tela de Início"</strong>.
                </p>
              </div>
              <div className={styles.stepItem}>
                <span className={styles.stepBadge}>3</span>
                <p className={styles.stepText}>
                  Confirme em <strong>"Adicionar"</strong> no canto superior direito. O ícone do Gym App surgirá na sua tela inicial!
                </p>
              </div>
            </>
          ) : (
            <>
              <div className={styles.stepItem}>
                <span className={styles.stepBadge}>1</span>
                <p className={styles.stepText}>
                  Clique no menu de opções do seu navegador (os <strong>três pontos verticais ⋮</strong> no canto superior).
                </p>
              </div>
              <div className={styles.stepItem}>
                <span className={styles.stepBadge}>2</span>
                <p className={styles.stepText}>
                  Selecione a opção <strong>"Instalar aplicativo"</strong> ou <strong>"Criar atalho..."</strong> / <strong>"Adicionar à Tela Inicial"</strong>.
                </p>
              </div>
              <div className={styles.stepItem}>
                <span className={styles.stepBadge}>3</span>
                <p className={styles.stepText}>
                  Pronto! O aplicativo abrirá em uma janela dedicada em 1 clique direto na sua tela inicial.
                </p>
              </div>
            </>
          )}
        </div>

        <button type="button" className={styles.btnUnderstand} onClick={onClose}>
          Entendido
        </button>
      </div>
    </div>
  );
};
