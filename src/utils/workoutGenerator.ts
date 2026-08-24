export interface Exercise {
  id?: string;
  nome: string;
  series: number;
  repeticoes: string;
  grupoMuscular: string;
}

export interface WorkoutDay {
  diaSemana: string;
  titulo: string;
  tipo: 'Superiores' | 'Inferiores' | 'Geral';
  focoMuscular: string;
  exercicios: Exercise[];
}

export type FocoTreino = 'Superiores' | 'Inferiores' | 'Equilibrado' | string;

export type EstiloTreino = 
  | 'musculacao' 
  | 'powerlifting' 
  | 'luta' 
  | 'cardio' 
  | 'yoga' 
  | 'danca' 
  | 'ginastica';

// Exercícios de Musculação
const EXER_MUSCULACAO_A: Exercise[] = [
  { id: 'ex-1', nome: 'Supino Reto com Barra', series: 4, repeticoes: '10 repetições', grupoMuscular: 'Peitoral' },
  { id: 'ex-2', nome: 'Supino Inclinado com Halteres', series: 3, repeticoes: '12 repetições', grupoMuscular: 'Peitoral Superior' },
  { id: 'ex-3', nome: 'Desenvolvimento com Halteres', series: 4, repeticoes: '10 repetições', grupoMuscular: 'Ombros' },
  { id: 'ex-4', nome: 'Elevação Lateral', series: 3, repeticoes: '15 repetições', grupoMuscular: 'Ombros' },
  { id: 'ex-5', nome: 'Tríceps Corda na Polia', series: 4, repeticoes: '12 repetições', grupoMuscular: 'Tríceps' },
];

const EXER_MUSCULACAO_B: Exercise[] = [
  { id: 'ex-6', nome: 'Agachamento Livre com Barra', series: 4, repeticoes: '10 repetições', grupoMuscular: 'Quadríceps' },
  { id: 'ex-7', nome: 'Leg Press 45', series: 4, repeticoes: '12 repetições', grupoMuscular: 'Quadríceps' },
  { id: 'ex-8', nome: 'Cadeira Extensora', series: 3, repeticoes: '15 repetições', grupoMuscular: 'Quadríceps' },
  { id: 'ex-9', nome: 'Stiff com Halteres', series: 4, repeticoes: '10 repetições', grupoMuscular: 'Posterior' },
  { id: 'ex-10', nome: 'Gêmeos Sentado', series: 4, repeticoes: '20 repetições', grupoMuscular: 'Panturrilhas' },
];

// Exercícios de Powerlifting
const EXER_POWERLIFTING_A: Exercise[] = [
  { id: 'ex-11', nome: 'Agachamento Livre Pesado', series: 5, repeticoes: '5 repetições', grupoMuscular: 'Membros Inferiores' },
  { id: 'ex-12', nome: 'Supino Reto de Competição', series: 5, repeticoes: '5 repetições', grupoMuscular: 'Peitoral e Tríceps' },
  { id: 'ex-13', nome: 'Remada Pendlay', series: 4, repeticoes: '6 repetições', grupoMuscular: 'Dorsais' },
];

const EXER_POWERLIFTING_B: Exercise[] = [
  { id: 'ex-14', nome: 'Levantamento Terra Convencional', series: 5, repeticoes: '3 repetições', grupoMuscular: 'Cadeia Posterior' },
  { id: 'ex-15', nome: 'Desenvolvimento Militar em Pé', series: 4, repeticoes: '6 repetições', grupoMuscular: 'Ombros' },
  { id: 'ex-16', nome: 'Agachamento Pausado', series: 3, repeticoes: '5 repetições', grupoMuscular: 'Quadríceps' },
];

// Exercícios de Luta (Preparação Física / Artes Marciais)
const EXER_LUTA_A: Exercise[] = [
  { id: 'ex-17', nome: 'Sprawl com Salto Explosivo', series: 4, repeticoes: '15 repetições', grupoMuscular: 'Cardiorrespiratório' },
  { id: 'ex-18', nome: 'Punching Bag (Saco de Pancadas)', series: 5, repeticoes: '3 minutos', grupoMuscular: 'Superiores e Core' },
  { id: 'ex-19', nome: 'Rotação de Tronco com Anilha', series: 4, repeticoes: '20 repetições', grupoMuscular: 'Abdômen e Oblíquos' },
];

// Exercícios de Cárdio
const EXER_CARDIO_A: Exercise[] = [
  { id: 'ex-20', nome: 'Corrida Contínua em Zona de Queima', series: 1, repeticoes: '30 minutos', grupoMuscular: 'Resistência Aeróbica' },
  { id: 'ex-21', nome: 'Polichinelos Intervalados', series: 4, repeticoes: '45 segundos', grupoMuscular: 'Corpo Todo' },
  { id: 'ex-22', nome: 'Corda de Velocidade (Jump Rope)', series: 5, repeticoes: '2 minutos', grupoMuscular: 'Panturrilhas e Cardiorrespiratório' },
];

// Exercícios de Yoga
const EXER_YOGA_A: Exercise[] = [
  { id: 'ex-23', nome: 'Saudação ao Sol (Surya Namaskar)', series: 5, repeticoes: 'Sequência Completa', grupoMuscular: 'Flexibilidade e Mobilidade' },
  { id: 'ex-24', nome: 'Postura do Guerreiro II (Virabhadrasana II)', series: 3, repeticoes: '60 segundos cada lado', grupoMuscular: 'Equilíbrio e Pernas' },
  { id: 'ex-25', nome: 'Postura do Cão Olhando para Baixo (Adho Mukha)', series: 4, repeticoes: '45 segundos', grupoMuscular: 'Cadeia Posterior e Ombros' },
];

// Exercícios de Dança
const EXER_DANCA_A: Exercise[] = [
  { id: 'ex-26', nome: 'Aquecimento Rítmico e Coordenação', series: 1, repeticoes: '15 minutos', grupoMuscular: 'Mobilidade Rítmica' },
  { id: 'ex-27', nome: 'Sequência de Passos e Giros', series: 4, repeticoes: '3 minutos', grupoMuscular: 'Coordenação e Pernas' },
  { id: 'ex-28', nome: 'Alongamento Dinâmico de Quadril', series: 3, repeticoes: '10 repetições cada lado', grupoMuscular: 'Membros Inferiores' },
];

// Exercícios de Ginástica
const EXER_GINASTICA_A: Exercise[] = [
  { id: 'ex-29', nome: 'Parada de Mão na Parede (Handstand Hold)', series: 4, repeticoes: '30 segundos', grupoMuscular: 'Ombros e Core' },
  { id: 'ex-30', nome: 'Flexão em Pique (Pike Push-ups)', series: 4, repeticoes: '10 repetições', grupoMuscular: 'Ombros e Peitoral' },
  { id: 'ex-31', nome: 'L-Sit nas Paralelas ou Solo', series: 4, repeticoes: '20 segundos', grupoMuscular: 'Abdômen e Flexores de Quadril' },
];

export function generateWorkoutRoutine(
  diasCount: number,
  diasSemana: string[],
  foco: string = 'Equilibrado',
  estilo: EstiloTreino = 'musculacao'
): WorkoutDay[] {
  const count = Math.min(Math.max(diasCount, 2), 6);
  const dias = diasSemana.slice(0, count);
  const result: WorkoutDay[] = [];

  let poolA = EXER_MUSCULACAO_A;
  let poolB = EXER_MUSCULACAO_B;

  if (estilo === 'powerlifting') {
    poolA = EXER_POWERLIFTING_A;
    poolB = EXER_POWERLIFTING_B;
  } else if (estilo === 'luta') {
    poolA = EXER_LUTA_A;
    poolB = EXER_LUTA_A;
  } else if (estilo === 'cardio') {
    poolA = EXER_CARDIO_A;
    poolB = EXER_CARDIO_A;
  } else if (estilo === 'yoga') {
    poolA = EXER_YOGA_A;
    poolB = EXER_YOGA_A;
  } else if (estilo === 'danca') {
    poolA = EXER_DANCA_A;
    poolB = EXER_DANCA_A;
  } else if (estilo === 'ginastica') {
    poolA = EXER_GINASTICA_A;
    poolB = EXER_GINASTICA_A;
  }

  for (let i = 0; i < count; i++) {
    const diaNome = dias[i] || `Dia ${i + 1}`;
    const isEven = i % 2 === 0;
    const exerciciosSel = isEven ? poolA : poolB;
    const tipo = isEven ? 'Superiores' : 'Inferiores';

    result.push({
      diaSemana: diaNome,
      titulo: `Treino ${String.fromCharCode(65 + i)} - ${estilo.toUpperCase()}`,
      tipo: estilo === 'musculacao' || estilo === 'powerlifting' ? tipo : 'Geral',
      focoMuscular: foco,
      exercicios: exerciciosSel,
    });
  }

  return result;
}
