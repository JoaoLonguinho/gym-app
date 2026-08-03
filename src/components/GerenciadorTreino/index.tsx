import React, { useState, useEffect } from 'react';
import styles from './GerenciadorTreino.module.css';

// 1. Tipagem base dos dados do arquivo JSON externo
interface ExercicioExternal {
  id: string;
  name: string;
  target: string; // Ex: 'chest', 'biceps', 'quadriceps'
  bodyPart: string;
  equipment: string;
  gifUrl: string; // Link direto do GIF
}

// 2. Tipagem para o exercício dentro da ficha do aluno
interface ExercicioTreino {
  id: string;
  nome: string;
  target: string;
  series: string;
  gifUrl: string;
}

export const GerenciadorTreino: React.FC = () => {
  // Estado com a base completa vinda da URL
  const [todosExercicios, setTodosExercicios] = useState<ExercicioExternal[]>([]);
  
  // Estado com a lista de treinos do dia do usuário
  const [meuTreino, setMeuTreino] = useState<ExercicioTreino[]>([
    {
      id: '0001',
      nome: 'Supino Reto com Barra',
      target: 'chest',
      series: '4x10',
      gifUrl: 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Barbell_Bench_Press/0.jpg',
    },
    {
      id: '0002',
      nome: 'Rosca Direta',
      target: 'biceps',
      series: '3x12',
      gifUrl: 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Barbell_Curl/0.jpg',
    },
  ]);

  // Estado para controlar qual exercício estamos querendo trocar (abre o Modal)
  const [exercicioParaTrocar, setExercicioParaTrocar] = useState<ExercicioTreino | null>(null);
  const [carregando, setCarregando] = useState<boolean>(true);

  // 3. Busca da base pública de exercícios no carregamento (useEffect)
  useEffect(() => {
    const carregarBaseExercicios = async () => {
      try {
        setCarregando(true);
        // URL da base open-source
        const resposta = await fetch(
          'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/dist/exercises.json'
        );
        const dados: ExercicioExternal[] = await resposta.json();
        setTodosExercicios(dados);
      } catch (erro) {
        console.error('Erro ao buscar base de exercícios:', erro);
      } finally {
        setCarregando(false);
      }
    };

    carregarBaseExercicios();
  }, []);

  // 4. Função para substituir um exercício da ficha por um novo selecionado
  const confirmarTroca = (novoExercicio: ExercicioExternal) => {
    if (!exercicioParaTrocar) return;

    setMeuTreino((treinoAtual) =>
      treinoAtual.map((item) =>
        item.id === exercicioParaTrocar.id
          ? {
              ...item,
              nome: novoExercicio.name,
              gifUrl: novoExercicio.gifUrl,
              target: novoExercicio.target,
            }
          : item
      )
    );

    // Fecha o modal após a troca
    setExercicioParaTrocar(null);
  };

  // 5. Filtra da base global apenas os exercícios do MESMO grupo muscular do exercício atual
  const opcoesSubstitutos = exercicioParaTrocar
    ? todosExercicios.filter(
        (item) => item.target.toLowerCase() === exercicioParaTrocar.target.toLowerCase()
      )
    : [];

  return (
    <div className={styles.container}>
      <h2>🏋️ Meu Treino do Dia</h2>

      {/* Lista de Exercícios Atuais */}
      <div className={styles.listaTreino}>
        {meuTreino.map((item) => (
          <div key={item.id} className={styles.cardTreino}>
            <img src={item.gifUrl} alt={item.nome} className={styles.miniGif} />
            <div className={styles.info}>
              <strong>{item.nome}</strong>
              <span>{item.series} • Músculo: {item.target}</span>
            </div>
            <button 
              className={styles.btnTrocar}
              onClick={() => setExercicioParaTrocar(item)}
            >
              🔄 Trocar
            </button>
          </div>
        ))}
      </div>

      {/* MODAL DE TROCA DE EXERCÍCIO */}
      {exercicioParaTrocar && (
        <div className={styles.modalOverlay} onClick={() => setExercicioParaTrocar(null)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>Substituir: {exercicioParaTrocar.nome}</h3>
              <button onClick={() => setExercicioParaTrocar(null)}>✕</button>
            </div>

            <p className={styles.subtituloModal}>
              Opções para o mesmo grupo muscular (<strong>{exercicioParaTrocar.target}</strong>):
            </p>

            {carregando ? (
              <p>Carregando opções de substituição...</p>
            ) : (
              <div className={styles.listaOpcoes}>
                {opcoesSubstitutos.slice(0, 10).map((opcao) => (
                  <div key={opcao.id} className={styles.opcaoCard}>
                    {/* Miniatura do GIF */}
                    <img 
                      src={opcao.gifUrl} 
                      alt={opcao.name} 
                      className={styles.miniGif} 
                    />
                    <div className={styles.infoOpcao}>
                      <strong>{opcao.name}</strong>
                      <small>🎯 {opcao.equipment}</small>
                    </div>
                    <button 
                      className={styles.btnSelecionar}
                      onClick={() => confirmarTroca(opcao)}
                    >
                      Selecionar
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};