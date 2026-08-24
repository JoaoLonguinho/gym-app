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

// Biblioteca Ampla de Exercícios por Grupo Muscular
const ALL_EXERCISES_DATABASE: Exercise[] = [
  // Peitoral
  { id: 'ex-1', nome: 'Supino Reto com Barra', series: 4, repeticoes: '10 repetições', grupoMuscular: 'Peitoral' },
  { id: 'ex-2', nome: 'Supino Inclinado com Halteres', series: 3, repeticoes: '12 repetições', grupoMuscular: 'Peitoral' },
  { id: 'ex-2b', nome: 'Supino Declinado com Barra', series: 4, repeticoes: '10 repetições', grupoMuscular: 'Peitoral' },
  { id: 'ex-2c', nome: 'Crossover na Polia Alta', series: 4, repeticoes: '12 repetições', grupoMuscular: 'Peitoral' },
  { id: 'ex-2d', nome: 'Crucifixo Reto com Halteres', series: 3, repeticoes: '12 repetições', grupoMuscular: 'Peitoral' },
  { id: 'ex-2e', nome: 'Flexão de Braço Solo (Push-up)', series: 4, repeticoes: '15 repetições', grupoMuscular: 'Peitoral' },

  // Ombros
  { id: 'ex-3', nome: 'Desenvolvimento com Halteres', series: 4, repeticoes: '10 repetições', grupoMuscular: 'Ombros' },
  { id: 'ex-4', nome: 'Elevação Lateral', series: 3, repeticoes: '15 repetições', grupoMuscular: 'Ombros' },
  { id: 'ex-4b', nome: 'Desenvolvimento Arnold', series: 3, repeticoes: '10 repetições', grupoMuscular: 'Ombros' },
  { id: 'ex-4c', nome: 'Elevação Frontal na Polia', series: 3, repeticoes: '12 repetições', grupoMuscular: 'Ombros' },
  { id: 'ex-4d', nome: 'Crucifixo Inverso no Voador', series: 4, repeticoes: '12 repetições', grupoMuscular: 'Ombros' },

  // Tríceps
  { id: 'ex-5', nome: 'Tríceps Corda na Polia', series: 4, repeticoes: '12 repetições', grupoMuscular: 'Tríceps' },
  { id: 'ex-5b', nome: 'Tríceps Testa com Barra W', series: 3, repeticoes: '10 repetições', grupoMuscular: 'Tríceps' },
  { id: 'ex-5c', nome: 'Tríceps Pulley (Barra Reta)', series: 4, repeticoes: '12 repetições', grupoMuscular: 'Tríceps' },
  { id: 'ex-5d', nome: 'Tríceps Coice com Halter', series: 3, repeticoes: '12 repetições', grupoMuscular: 'Tríceps' },

  // Costas / Dorsal
  { id: 'ex-7b', nome: 'Puxada Alta pela Frente', series: 4, repeticoes: '10 repetições', grupoMuscular: 'Costas' },
  { id: 'ex-8b', nome: 'Remada Curvada com Barra', series: 4, repeticoes: '10 repetições', grupoMuscular: 'Costas' },
  { id: 'ex-9b', nome: 'Remada Baixa no Cabo', series: 3, repeticoes: '12 repetições', grupoMuscular: 'Costas' },
  { id: 'ex-9c', nome: 'Puxada Articulada Fechada', series: 4, repeticoes: '10 repetições', grupoMuscular: 'Costas' },
  { id: 'ex-9d', nome: 'Remada Unilateral com Halter (Serrote)', series: 3, repeticoes: '12 repetições', grupoMuscular: 'Costas' },

  // Bíceps
  { id: 'ex-10b', nome: 'Rosca Direta com Barra W', series: 4, repeticoes: '10 repetições', grupoMuscular: 'Bíceps' },
  { id: 'ex-11b', nome: 'Rosca Alternada com Halteres', series: 3, repeticoes: '12 repetições', grupoMuscular: 'Bíceps' },
  { id: 'ex-11c', nome: 'Rosca Martelo com Halteres', series: 4, repeticoes: '12 repetições', grupoMuscular: 'Bíceps' },
  { id: 'ex-11d', nome: 'Rosca Scott no Cabo', series: 3, repeticoes: '10 repetições', grupoMuscular: 'Bíceps' },

  // Quadríceps
  { id: 'ex-6', nome: 'Agachamento Livre com Barra', series: 4, repeticoes: '10 repetições', grupoMuscular: 'Quadríceps' },
  { id: 'ex-7', nome: 'Leg Press 45', series: 4, repeticoes: '12 repetições', grupoMuscular: 'Quadríceps' },
  { id: 'ex-8', nome: 'Cadeira Extensora', series: 3, repeticoes: '15 repetições', grupoMuscular: 'Quadríceps' },
  { id: 'ex-8b2', nome: 'Agachamento Búlgaro com Halteres', series: 3, repeticoes: '10 repetições', grupoMuscular: 'Quadríceps' },
  { id: 'ex-8c', nome: 'Passada com Halteres', series: 3, repeticoes: '12 passos', grupoMuscular: 'Quadríceps' },

  // Posterior
  { id: 'ex-9', nome: 'Stiff com Halteres', series: 4, repeticoes: '10 repetições', grupoMuscular: 'Posterior' },
  { id: 'ex-9b2', nome: 'Mesa Flexora', series: 4, repeticoes: '12 repetições', grupoMuscular: 'Posterior' },
  { id: 'ex-9c2', nome: 'Cadeira Flexora', series: 3, repeticoes: '12 repetições', grupoMuscular: 'Posterior' },
  { id: 'ex-9d2', nome: 'Levantamento Terra Romeno', series: 4, repeticoes: '10 repetições', grupoMuscular: 'Posterior' },

  // Panturrilhas
  { id: 'ex-10', nome: 'Gêmeos Sentado', series: 4, repeticoes: '20 repetições', grupoMuscular: 'Panturrilhas' },
  { id: 'ex-10b2', nome: 'Panturrilha em Pé na Máquina', series: 4, repeticoes: '15 repetições', grupoMuscular: 'Panturrilhas' },
  { id: 'ex-10c', nome: 'Gêmeos no Leg Press', series: 4, repeticoes: '15 repetições', grupoMuscular: 'Panturrilhas' },

  // Powerlifting
  { id: 'ex-11', nome: 'Agachamento Livre Pesado', series: 5, repeticoes: '5 repetições', grupoMuscular: 'Membros Inferiores' },
  { id: 'ex-12', nome: 'Supino Reto de Competição', series: 5, repeticoes: '5 repetições', grupoMuscular: 'Peitoral e Tríceps' },
  { id: 'ex-13', nome: 'Remada Pendlay', series: 4, repeticoes: '6 repetições', grupoMuscular: 'Dorsais' },
  { id: 'ex-14', nome: 'Levantamento Terra Convencional', series: 5, repeticoes: '3 repetições', grupoMuscular: 'Cadeia Posterior' },
  { id: 'ex-15', nome: 'Desenvolvimento Militar em Pé', series: 4, repeticoes: '6 repetições', grupoMuscular: 'Ombros' },
  { id: 'ex-16', nome: 'Agachamento Pausado', series: 3, repeticoes: '5 repetições', grupoMuscular: 'Quadríceps' },

  // Luta
  { id: 'ex-17', nome: 'Sprawl com Salto Explosivo', series: 4, repeticoes: '15 repetições', grupoMuscular: 'Cardiorrespiratório' },
  { id: 'ex-18', nome: 'Punching Bag (Saco de Pancadas)', series: 5, repeticoes: '3 minutos', grupoMuscular: 'Superiores e Core' },
  { id: 'ex-19', nome: 'Rotação de Tronco com Anilha', series: 4, repeticoes: '20 repetições', grupoMuscular: 'Abdômen e Oblíquos' },

  // Cárdio
  { id: 'ex-20', nome: 'Corrida Contínua em Zona de Queima', series: 1, repeticoes: '30 minutos', grupoMuscular: 'Resistência Aeróbica' },
  { id: 'ex-21', nome: 'Polichinelos Intervalados', series: 4, repeticoes: '45 segundos', grupoMuscular: 'Corpo Todo' },
  { id: 'ex-22', nome: 'Corda de Velocidade (Jump Rope)', series: 5, repeticoes: '2 minutos', grupoMuscular: 'Panturrilhas e Cardiorrespiratório' },

  // Yoga
  { id: 'ex-23', nome: 'Saudação ao Sol (Surya Namaskar)', series: 5, repeticoes: 'Sequência Completa', grupoMuscular: 'Flexibilidade e Mobilidade' },
  { id: 'ex-24', nome: 'Postura do Guerreiro II (Virabhadrasana II)', series: 3, repeticoes: '60 segundos cada lado', grupoMuscular: 'Equilíbrio e Pernas' },
  { id: 'ex-25', nome: 'Postura do Cão Olhando para Baixo (Adho Mukha)', series: 4, repeticoes: '45 segundos', grupoMuscular: 'Cadeia Posterior e Ombros' },

  // Dança
  { id: 'ex-26', nome: 'Aquecimento Rítmico e Coordenação', series: 1, repeticoes: '15 minutos', grupoMuscular: 'Mobilidade Rítmica' },
  { id: 'ex-27', nome: 'Sequência de Passos e Giros', series: 4, repeticoes: '3 minutos', grupoMuscular: 'Coordenação e Pernas' },
  { id: 'ex-28', nome: 'Alongamento Dinâmico de Quadril', series: 3, repeticoes: '10 repetições cada lado', grupoMuscular: 'Membros Inferiores' },

  // Ginástica
  { id: 'ex-29', nome: 'Parada de Mão na Parede (Handstand Hold)', series: 4, repeticoes: '30 segundos', grupoMuscular: 'Ombros e Core' },
  { id: 'ex-30', nome: 'Flexão em Pique (Pike Push-ups)', series: 4, repeticoes: '10 repetições', grupoMuscular: 'Ombros e Peitoral' },
  { id: 'ex-31', nome: 'L-Sit nas Paralelas ou Solo', series: 4, repeticoes: '20 segundos', grupoMuscular: 'Abdômen e Flexores de Quadril' },
];

export function getAlternativeExercises(grupoMuscular: string, currentExerciseName: string): Exercise[] {
  const grupoClean = grupoMuscular.toLowerCase().trim();
  const nameClean = currentExerciseName.toLowerCase().trim();

  // Filtrar exercícios do mesmo grupo muscular que não sejam o exercício atual
  const matches = ALL_EXERCISES_DATABASE.filter((ex) => {
    const exGrupo = ex.grupoMuscular.toLowerCase().trim();
    const isSameGroup = exGrupo.includes(grupoClean) || grupoClean.includes(exGrupo);
    const isDifferentName = ex.nome.toLowerCase().trim() !== nameClean;
    return isSameGroup && isDifferentName;
  });

  if (matches.length > 0) return matches;

  // Fallback caso não haja filtro exato: retornar alternativas da lista geral
  return ALL_EXERCISES_DATABASE.filter((ex) => ex.nome.toLowerCase().trim() !== nameClean).slice(0, 5);
}

export function generateWorkoutRoutine(
  diasCount: number,
  diasSemana: string[],
  foco: string = 'Equilibrado',
  estilo: EstiloTreino = 'musculacao'
): WorkoutDay[] {
  const count = Math.min(Math.max(diasCount, 2), 6);
  const dias = diasSemana.slice(0, count);
  const result: WorkoutDay[] = [];

  let poolA = [ALL_EXERCISES_DATABASE[0], ALL_EXERCISES_DATABASE[1], ALL_EXERCISES_DATABASE[6], ALL_EXERCISES_DATABASE[7], ALL_EXERCISES_DATABASE[11]];
  let poolB = [ALL_EXERCISES_DATABASE[21], ALL_EXERCISES_DATABASE[22], ALL_EXERCISES_DATABASE[23], ALL_EXERCISES_DATABASE[26], ALL_EXERCISES_DATABASE[30]];

  if (estilo === 'powerlifting') {
    poolA = [ALL_EXERCISES_DATABASE[33], ALL_EXERCISES_DATABASE[34], ALL_EXERCISES_DATABASE[35]];
    poolB = [ALL_EXERCISES_DATABASE[36], ALL_EXERCISES_DATABASE[37], ALL_EXERCISES_DATABASE[38]];
  } else if (estilo === 'luta') {
    poolA = [ALL_EXERCISES_DATABASE[39], ALL_EXERCISES_DATABASE[40], ALL_EXERCISES_DATABASE[41]];
    poolB = poolA;
  } else if (estilo === 'cardio') {
    poolA = [ALL_EXERCISES_DATABASE[42], ALL_EXERCISES_DATABASE[43], ALL_EXERCISES_DATABASE[44]];
    poolB = poolA;
  } else if (estilo === 'yoga') {
    poolA = [ALL_EXERCISES_DATABASE[45], ALL_EXERCISES_DATABASE[46], ALL_EXERCISES_DATABASE[47]];
    poolB = poolA;
  } else if (estilo === 'danca') {
    poolA = [ALL_EXERCISES_DATABASE[48], ALL_EXERCISES_DATABASE[49], ALL_EXERCISES_DATABASE[50]];
    poolB = poolA;
  } else if (estilo === 'ginastica') {
    poolA = [ALL_EXERCISES_DATABASE[51], ALL_EXERCISES_DATABASE[52], ALL_EXERCISES_DATABASE[53]];
    poolB = poolA;
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
