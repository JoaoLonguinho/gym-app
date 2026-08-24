import React from 'react';
import styles from './GeometricAccents.module.css';

interface GeometricAccentsProps {
  variant?: 'card' | 'header' | 'chart';
}

export const GeometricAccents: React.FC<GeometricAccentsProps> = ({ variant = 'card' }) => {
  return (
    <div className={styles.accentsWrapper}>
      {variant === 'card' && (
        <svg width="100%" height="100%" className={styles.svgAccent}>
          {/* Matriz de Pontos Halftone (Canto Superior Direito) */}
          <g transform="translate(240, 10)" opacity="0.25">
            <circle cx="5" cy="5" r="2.5" fill="var(--graphic-accent-color)" />
            <circle cx="17" cy="5" r="2.5" fill="var(--graphic-accent-color)" />
            <circle cx="29" cy="5" r="2.5" fill="var(--graphic-accent-color)" />
            <circle cx="41" cy="5" r="2.5" fill="var(--graphic-accent-color)" />
            <circle cx="5" cy="17" r="2.5" fill="var(--graphic-accent-color)" />
            <circle cx="17" cy="17" r="2.5" fill="var(--graphic-accent-color)" />
            <circle cx="29" cy="17" r="2.5" fill="var(--graphic-accent-color)" />
            <circle cx="41" cy="17" r="2.5" fill="var(--graphic-accent-color)" />
            <circle cx="5" cy="29" r="2.5" fill="var(--graphic-accent-color)" />
            <circle cx="17" cy="29" r="2.5" fill="var(--graphic-accent-color)" />
            <circle cx="29" cy="29" r="2.5" fill="var(--graphic-accent-color)" />
            <circle cx="41" cy="29" r="2.5" fill="var(--graphic-accent-color)" />
          </g>

          {/* Linha Zig-Zag (Canto Inferior Direito) */}
          <path
            d="M260,140 L266,134 L272,140 L278,134 L284,140 L290,134 L296,140"
            stroke="var(--graphic-accent-color)"
            strokeWidth="2.5"
            fill="none"
            opacity="0.25"
          />

          {/* Cubo Isométrico 3D Wireframe (Canto Inferior Esquerdo) */}
          <g transform="translate(15, 120)" opacity="0.25">
            <polygon points="12,2 22,7 12,12 2,7" stroke="var(--graphic-accent-color)" strokeWidth="1.5" fill="none" />
            <polygon points="2,7 12,12 12,22 2,17" stroke="var(--graphic-accent-color)" strokeWidth="1.5" fill="none" />
            <polygon points="12,12 22,7 22,17 12,22" stroke="var(--graphic-accent-color)" strokeWidth="1.5" fill="none" />
          </g>
        </svg>
      )}

      {variant === 'chart' && (
        <svg width="100%" height="100%" className={styles.svgAccent}>
          {/* Arcos Concêntricos (Canto Superior Direito) */}
          <g transform="translate(260, -10)" opacity="0.2">
            <circle cx="40" cy="40" r="30" stroke="var(--graphic-accent-color)" strokeWidth="2" strokeDasharray="4 4" fill="none" />
            <circle cx="40" cy="40" r="20" stroke="var(--graphic-accent-color)" strokeWidth="2" fill="none" />
            <circle cx="40" cy="40" r="10" fill="var(--graphic-accent-color)" />
          </g>

          {/* Chevrons Geometricos (Canto Inferior Esquerdo) */}
          <g transform="translate(15, 210)" opacity="0.2">
            <path d="M0,0 L6,6 L12,0" stroke="var(--graphic-accent-color)" strokeWidth="2.5" fill="none" />
            <path d="M14,0 L20,6 L26,0" stroke="var(--graphic-accent-color)" strokeWidth="2.5" fill="none" />
            <path d="M28,0 L34,6 L40,0" stroke="var(--graphic-accent-color)" strokeWidth="2.5" fill="none" />
          </g>
        </svg>
      )}

      {variant === 'header' && (
        <svg width="100%" height="100%" className={styles.svgAccent}>
          {/* Matriz Triangular e Setas no Cabeçalho */}
          <g transform="translate(10, 10)" opacity="0.2">
            <line x1="0" y1="0" x2="30" y2="0" stroke="var(--graphic-accent-color)" strokeWidth="2" strokeDasharray="3 3" />
            <polygon points="35,0 30,-3 30,3" fill="var(--graphic-accent-color)" />
          </g>
        </svg>
      )}
    </div>
  );
};
