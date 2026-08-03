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
  tipo: 'Superiores' | 'Inferiores';
  focoMuscular: string;
  exercicios: Exercise[];
}

export type FocoTreino = 'Superiores' | 'Inferiores' | 'Equilibrado';

const EXER_SUPERIORES_A: Exercise[] = [
  { id: 'ex-1', nome: 'Supino Reto com Barra', series: 4, repeticoes: '10 repetições', grupoMuscular: 'Peitoral' },
  { id: 'ex-2', nome: 'Supino Inclinado com Halteres', series: 3, repeticoes: '12 repetições', grupoMuscular: 'Peitoral Superior' },
  { id: 'ex-3', nome: 'Desenvolvimento com Halteres', series: 4, repeticoes: '10 repetições', grupoMuscular: 'Ombros (Deltoides)' },
  { id: 'ex-4', nome: 'Elevação Lateral', series: 3, repeticoes: '15 repetições', grupoMuscular: 'Ombros Lateral' },
  { id: 'ex-5', nome: 'Tríceps Corda na Polia', series: 4, repeticoes: '12 repetições', grupoMuscular: 'Tríceps' },
  { id: 'ex-6', nome: 'Tríceps Testa com Halter', series: 3, repeticoes: '10 repetições', grupoMuscular: 'Tríceps' },
];

const EXER_SUPERIORES_B: Exercise[] = [
  { id: 'ex-7', nome: 'Puxada Alta pela Frente', series: 4, repeticoes: '10 repetições', grupoMuscular: 'Costas (Dorsal)' },
  { id: 'ex-8', nome: 'Remada Curvada com Barra', series: 4, repeticoes: '10 repetições', grupoMuscular: 'Costas' },
  { id: 'ex-9', nome: 'Remada Baixa no Cabo', series: 3, repeticoes: '12 repetições', grupoMuscular: 'Costas Média' },
  { id: 'ex-10', nome: 'Rosca Direta com Barra W', series: 4, repeticoes: '10 repetições', grupoMuscular: 'Bíceps' },
  { id: 'ex-11', nome: 'Rosca Alternada com Halteres', series: 3, repeticoes: '12 repetições', grupoMuscular: 'Bíceps' },
  { id: 'ex-12', nome: 'Encolhimento de Ombros', series: 3, repeticoes: '15 repetições', grupoMuscular: 'Trapézio' },
];

const EXER_SUPERIORES_C: Exercise[] = [
  { id: 'ex-13', nome: 'Desenvolvimento Arnold', series: 3, repeticoes: '10 repetições', grupoMuscular: 'Ombros' },
  { id: 'ex-14', nome: 'Elevação Frontal na Polia', series: 3, repeticoes: '12 repetições', grupoMuscular: 'Ombros Anterior' },
  { id: 'ex-15', nome: 'Crossover na Polia', series: 4, repeticoes: '12 repetições', grupoMuscular: 'Peitoral Inferior' },
  { id: 'ex-16', nome: 'Crucifixo Inclinado', series: 3, repeticoes: '12 repetições', grupoMuscular: 'Peitoral' },
  { id: 'ex-17', nome: 'Rosca Martelo', series: 4, repeticoes: '12 repetições', grupoMuscular: 'Antebraço / Bíceps' },
  { id: 'ex-18', nome: 'Tríceps Pulley (Barra Reta)', series: 4, repeticoes: '12 repetições', grupoMuscular: 'Tríceps' },
];

const EXER_INFERIORES_A: Exercise[] = [
  { id: 'ex-19', nome: 'Agachamento Livre com Barra', series: 4, repeticoes: '10 repetições', grupoMuscular: 'Quadríceps & Glúteos' },
  { id: 'ex-20', nome: 'Leg Press 45°', series: 4, repeticoes: '12 repetições', grupoMuscular: 'Quadríceps' },
  { id: 'ex-21', nome: 'Cadeira Extensora', series: 3, repeticoes: '15 repetições', grupoMuscular: 'Quadríceps' },
  { id: 'ex-22', nome: 'Afundo com Halteres', series: 3, repeticoes: '10 cada perna', grupoMuscular: 'Quadríceps & Glúteos' },
  { id: 'ex-23', nome: 'Gêmeos Sentado', series: 4, repeticoes: '20 repetições', grupoMuscular: 'Panturrilhas' },
];

const EXER_INFERIORES_B: Exercise[] = [
  { id: 'ex-24', nome: 'Stiff com Halteres ou Barra', series: 4, repeticoes: '10 repetições', grupoMuscular: 'Posterior de Coxa' },
  { id: 'ex-25', nome: 'Mesa Flexora', series: 4, repeticoes: '12 repetições', grupoMuscular: 'Posterior de Coxa' },
  { id: 'ex-26', nome: 'Elevação Pélvica com Barra', series: 4, repeticoes: '10 repetições', grupoMuscular: 'Glúteos' },
  { id: 'ex-27', nome: 'Cadeira Abdutora', series: 3, repeticoes: '15 repetições', grupoMuscular: 'Glúteo Médio' },
  { id: 'ex-28', nome: 'Panturrilha em Pé na Máquina', series: 4, repeticoes: '15 repetições', grupoMuscular: 'Panturrilhas' },
];

const EXER_INFERIORES_C: Exercise[] = [
  { id: 'ex-29', nome: 'Agachamento Búlgaro', series: 3, repeticoes: '10 cada perna', grupoMuscular: 'Quadríceps & Glúteos' },
  { id: 'ex-30', nome: 'Cadeira Extensora', series: 3, repeticoes: '12 repetições', grupoMuscular: 'Quadríceps' },
  { id: 'ex-31', nome: 'Cadeira Flexora', series: 3, repeticoes: '12 repetições', grupoMuscular: 'Posterior de Coxa' },
  { id: 'ex-32', nome: 'Passada com Halteres', series: 3, repeticoes: '12 passos', grupoMuscular: 'Pernas Completo' },
  { id: 'ex-33', nome: 'Gêmeos no Leg Press', series: 4, repeticoes: '15 repetições', grupoMuscular: 'Panturrilhas' },
];

export function generateWorkoutRoutine(
  diasCount: number,
  diasSemana: string[],
  foco: FocoTreino
): WorkoutDay[] {
  const count = Math.min(Math.max(diasCount, 2), 6);
  const dias = diasSemana.slice(0, count);
  const result: WorkoutDay[] = [];

  let templates: Array<{ titulo: string; tipo: 'Superiores' | 'Inferiores'; focoMuscular: string; exercicios: Exercise[] }> = [];

  if (count === 2) {
    templates = [
      { titulo: 'Treino A - Superiores (Corpo Todo)', tipo: 'Superiores', focoMuscular: 'Peito, Costas, Ombros e Braços', exercicios: EXER_SUPERIORES_A },
      { titulo: 'Treino B - Inferiores (Corpo Todo)', tipo: 'Inferiores', focoMuscular: 'Quadríceps, Posterior e Panturrilhas', exercicios: EXER_INFERIORES_A },
    ];
  } else if (count === 3) {
    if (foco === 'Inferiores') {
      templates = [
        { titulo: 'Treino A - Inferiores (Quadríceps & Panturrilhas)', tipo: 'Inferiores', focoMuscular: 'Foco em Quadríceps', exercicios: EXER_INFERIORES_A },
        { titulo: 'Treino B - Superiores Completo', tipo: 'Superiores', focoMuscular: 'Peito, Costas, Ombros e Braços', exercicios: EXER_SUPERIORES_A },
        { titulo: 'Treino C - Inferiores (Posterior & Glúteos)', tipo: 'Inferiores', focoMuscular: 'Foco em Posterior e Glúteos', exercicios: EXER_INFERIORES_B },
      ];
    } else {
      templates = [
        { titulo: 'Treino A - Superiores (Peito, Ombro e Tríceps)', tipo: 'Superiores', focoMuscular: 'Peito, Ombro e Tríceps', exercicios: EXER_SUPERIORES_A },
        { titulo: 'Treino B - Inferiores Completo', tipo: 'Inferiores', focoMuscular: 'Pernas Completo', exercicios: EXER_INFERIORES_A },
        { titulo: 'Treino C - Superiores (Costas, Bíceps e Trapézio)', tipo: 'Superiores', focoMuscular: 'Costas, Bíceps e Trapézio', exercicios: EXER_SUPERIORES_B },
      ];
    }
  } else if (count === 4) {
    templates = [
      { titulo: 'Treino A - Superiores (Peito, Ombro e Tríceps)', tipo: 'Superiores', focoMuscular: 'Empurrar (Peito/Ombro/Tríceps)', exercicios: EXER_SUPERIORES_A },
      { titulo: 'Treino B - Inferiores (Foco Quadríceps)', tipo: 'Inferiores', focoMuscular: 'Quadríceps e Panturrilhas', exercicios: EXER_INFERIORES_A },
      { titulo: 'Treino C - Superiores (Costas e Bíceps)', tipo: 'Superiores', focoMuscular: 'Puxar (Costas/Bíceps)', exercicios: EXER_SUPERIORES_B },
      { titulo: 'Treino D - Inferiores (Posterior e Glúteos)', tipo: 'Inferiores', focoMuscular: 'Posterior de Coxa e Glúteos', exercicios: EXER_INFERIORES_B },
    ];
  } else if (count === 5) {
    if (foco === 'Inferiores') {
      templates = [
        { titulo: 'Treino A - Inferiores (Foco Quadríceps)', tipo: 'Inferiores', focoMuscular: 'Quadríceps e Panturrilhas', exercicios: EXER_INFERIORES_A },
        { titulo: 'Treino B - Superiores (Peito, Ombro e Tríceps)', tipo: 'Superiores', focoMuscular: 'Peito/Ombro/Tríceps', exercicios: EXER_SUPERIORES_A },
        { titulo: 'Treino C - Inferiores (Posterior e Glúteos)', tipo: 'Inferiores', focoMuscular: 'Posterior e Glúteos', exercicios: EXER_INFERIORES_B },
        { titulo: 'Treino D - Superiores (Costas e Bíceps)', tipo: 'Superiores', focoMuscular: 'Costas e Bíceps', exercicios: EXER_SUPERIORES_B },
        { titulo: 'Treino E - Inferiores (Pernas Completo)', tipo: 'Inferiores', focoMuscular: 'Volume de Pernas e Glúteos', exercicios: EXER_INFERIORES_C },
      ];
    } else {
      templates = [
        { titulo: 'Treino A - Superiores (Peito e Tríceps)', tipo: 'Superiores', focoMuscular: 'Peito e Tríceps', exercicios: EXER_SUPERIORES_A },
        { titulo: 'Treino B - Inferiores (Foco Quadríceps)', tipo: 'Inferiores', focoMuscular: 'Quadríceps e Panturrilhas', exercicios: EXER_INFERIORES_A },
        { titulo: 'Treino C - Superiores (Costas e Bíceps)', tipo: 'Superiores', focoMuscular: 'Costas e Bíceps', exercicios: EXER_SUPERIORES_B },
        { titulo: 'Treino D - Inferiores (Posterior e Glúteos)', tipo: 'Inferiores', focoMuscular: 'Posterior e Glúteos', exercicios: EXER_INFERIORES_B },
        { titulo: 'Treino E - Superiores (Ombros e Foco Braços)', tipo: 'Superiores', focoMuscular: 'Ombros e Braços completo', exercicios: EXER_SUPERIORES_C },
      ];
    }
  } else if (count === 6) {
    templates = [
      { titulo: 'Treino A - Superiores (Peito e Tríceps)', tipo: 'Superiores', focoMuscular: 'Peito e Tríceps', exercicios: EXER_SUPERIORES_A },
      { titulo: 'Treino B - Inferiores (Foco Quadríceps)', tipo: 'Inferiores', focoMuscular: 'Quadríceps e Panturrilhas', exercicios: EXER_INFERIORES_A },
      { titulo: 'Treino C - Superiores (Costas e Bíceps)', tipo: 'Superiores', focoMuscular: 'Costas e Bíceps', exercicios: EXER_SUPERIORES_B },
      { titulo: 'Treino D - Inferiores (Posterior e Glúteos)', tipo: 'Inferiores', focoMuscular: 'Posterior de Coxa e Glúteos', exercicios: EXER_INFERIORES_B },
      { titulo: 'Treino E - Superiores (Ombros e Foco Braços)', tipo: 'Superiores', focoMuscular: 'Ombros e Braços completo', exercicios: EXER_SUPERIORES_C },
      { titulo: 'Treino F - Inferiores (Pernas Completo / Funcional)', tipo: 'Inferiores', focoMuscular: 'Volume e Definição de Pernas', exercicios: EXER_INFERIORES_C },
    ];
  }

  for (let i = 0; i < count; i++) {
    const diaNome = dias[i] || `Dia ${i + 1}`;
    const t = templates[i] || templates[0];
    result.push({
      diaSemana: diaNome,
      titulo: t.titulo,
      tipo: t.tipo,
      focoMuscular: t.focoMuscular,
      exercicios: t.exercicios,
    });
  }

  return result;
}
