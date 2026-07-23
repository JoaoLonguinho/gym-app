import React, { useState } from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import styles from './Dashboard.module.css';

const mockDataTreinos = [
  { name: 'Treino A (Peito/Tríceps)', value: 12 },
  { name: 'Treino B (Costas/Bíceps)', value: 8 },
  { name: 'Treino C (Pernas)', value: 10 },
  { name: 'Treino D (Ombros)', value: 4 },
];

const CORES = ['#3B82F6', '#10B981', '#F59E0B', '#EC4899'];

export const Dashboard: React.FC = () => {
  const [mostrarExercicios, setMostrarExercicios] = useState(false);

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Erro ao sair:', error);
    }
  };

  return (
    <div className={styles.container}>
      {/* Cabeçalho */}
      <header className={styles.header}>
        <h2>Meu Painel de Treinos</h2>
        <button onClick={handleLogout} className={styles.btnLogout}>
          Sair
        </button>
      </header>

      {/* Guia: Treino de Hoje */}
      <section 
        className={styles.todayWorkoutCard}
        onClick={() => setMostrarExercicios(!mostrarExercicios)}
      >
        <div className={styles.workoutHeaderTitle}>
          <h3>
            🏋️ Treino de hoje: <span className={styles.workoutTag}>Treino A (Peito e Tríceps)</span>
          </h3>
          <span className={styles.toggleHint}>
            {mostrarExercicios ? '▲ Ocultar exercícios' : '▼ Ver exercícios'}
          </span>
        </div>

        {mostrarExercicios && (
          <div className={styles.exerciseListContainer}>
            <p className={styles.exerciseListTitle}>Exercícios recomendados:</p>
            <ul className={styles.exerciseList}>
              <li>Supino Reto com Barra — 4 séries x 10 repetições</li>
              <li>Supino Inclinado com Halteres — 3 séries x 12 repetições</li>
              <li>Crossover na Polia — 3 séries x 15 repetições</li>
              <li>Tríceps Corda na Polia — 4 séries x 12 repetições</li>
              <li>Tríceps Testa — 3 séries x 10 repetições</li>
            </ul>
          </div>
        )}
      </section>

      {/* Dashboard: Gráfico de Pizza */}
      <section className={styles.chartCard}>
        <h3>📊 Frequência de Treinos Realizados</h3>
        <div className={styles.chartWrapper}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={mockDataTreinos}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
              >
                {mockDataTreinos.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={CORES[index % CORES.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </section>
    </div>
  );
};