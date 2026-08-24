import React from 'react';
import styles from './ThemeToggle.module.css';

export type Theme = 'dark' | 'light';

interface ThemeToggleProps {
  theme: Theme;
  onToggleTheme: () => void;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ theme, onToggleTheme }) => {
  return (
    <button
      type="button"
      className={styles.toggleBtn}
      onClick={onToggleTheme}
      title={theme === 'dark' ? 'Mudar para Tema Claro ☀️' : 'Mudar para Tema Escuro 🌙'}
    >
      {theme === 'dark' ? '☀️ Claro' : '🌙 Escuro'}
    </button>
  );
};
