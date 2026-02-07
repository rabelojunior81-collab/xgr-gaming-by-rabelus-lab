import type { TutorialModule, TutorialLesson } from '@shared/types/tutorial';

/**
 * Tutorial content with solutions for interactive learning
 * Solutions are in UCI format (e.g., 'e2e4' for e2 to e4)
 */
export const tutorialLessons: TutorialLesson[] = [
  // Module 1: Fundamentals
  {
    id: 'pawn-movement',
    title: 'Movimento do Peão',
    description: 'Aprenda o movimento básico do peão',
    content: 'O peão move-se uma casa para frente (duas no primeiro movimento) e captura na diagonal. O peão é a base do xadrez - sem ele, não há estrutura.',
    fen: '8/8/8/8/8/8/4P3/8 w - - 0 1',
    objective: 'Mova o peão de e2 para e4',
    hints: ['Peões movem para frente, capturam na diagonal', 'No primeiro movimento, pode andar duas casas', 'Clique no peão e depois na casa e4'],
    solution: ['e2e4'],
    explanation: 'O peão avança duas casas no primeiro movimento, ocupando o centro.',
    difficulty: 'beginner',
    completed: false
  },
  {
    id: 'knight-movement',
    title: 'Movimento do Cavalo',
    description: 'Domine o movimento em L do cavalo',
    content: 'O cavalo move-se em "L": duas casas em uma direção e uma na perpendicular. É a única peça que pode pular sobre outras peças.',
    fen: '8/8/8/8/8/5p2/8/4N3 w - - 0 1',
    objective: 'Capture o peão em f7 com o cavalo',
    hints: ['Cavalo move em L: 2+1 casas', 'É a única peça que pode pular outras', 'De e1, o cavalo pode ir para f3, d3, c2 ou g2'],
    solution: ['e1f3', 'f3g5', 'g5f7'], // Multiple moves to show path
    explanation: 'O cavalo é ideal para ataques surpresa devido ao seu movimento único.',
    difficulty: 'beginner',
    completed: false
  },
  {
    id: 'checkmate-basic',
    title: 'Xeque-mate Básico',
    description: 'Dê xeque-mate com torres',
    content: 'Xeque-mate ocorre quando o rei está sob ataque e não pode escapar. Duas torres trabalhando juntas são muito poderosas.',
    fen: '4k3/8/8/8/8/8/3R4/3R4 w - - 0 1',
    objective: 'Dê xeque-mate em um lance',
    hints: ['Mate o rei na última fileira', 'Torres trabalham bem em fileiras abertas', 'A torre em d1 pode ir para d8'],
    solution: ['d1d8'],
    explanation: 'A torre d1 se move para d8, dando mate. O rei não pode capturar porque está protegida pela outra torre.',
    difficulty: 'beginner',
    completed: false
  },
  // Module 2: Tactics
  {
    id: 'fork-intro',
    title: 'O Garfo (Fork)',
    description: 'Ataque duas peças simultaneamente',
    content: 'Um garfo ocorre quando uma peça ataca duas ou mais peças inimigas simultaneamente. Cavalos são especialmente bons nisso.',
    fen: '8/8/8/3n4/8/2K1k3/8/8 b - - 0 1',
    objective: 'Use o cavalo para dar garfo nos dois reis',
    hints: ['Cavalos são excelentes para garfos', 'Procure casas que ataquem múltiplas peças', 'O cavalo pode atacar ambos os reis de c4'],
    solution: ['d5c4'],
    explanation: 'O cavalo em c4 ataca ambos os reis simultaneamente - um garco duplo!',
    difficulty: 'intermediate',
    completed: false
  },
  {
    id: 'pin-intro',
    title: 'O Prendedor (Pin)',
    description: 'Imobilize peças do oponente',
    content: 'Um pin prende uma peça que não pode se mover sem expor uma peça mais valiosa atrás dela.',
    fen: '4k3/8/8/8/8/2b5/4R3/4K3 b - - 0 1',
    objective: 'Use o bispo para prender a torre ao rei',
    hints: ['Bispo em h4 prende a torre ao rei', 'A peça de menor valor está no meio', 'A torre não pode se mover sem expor o rei'],
    solution: ['c3b4'],
    explanation: 'O bispo ataca a torre, que não pode se mover porque o rei está atrás.',
    difficulty: 'intermediate',
    completed: false
  },
  // Module 3: Strategy
  {
    id: 'center-control',
    title: 'Controle do Centro',
    description: 'Domine o centro do tabuleiro',
    content: 'O centro (e4, d4, e5, d5) é o coração do tabuleiro. Controle-o para ter mais espaço e mobilidade.',
    fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
    objective: 'Jogue 1.e4 para ocupar o centro',
    hints: ['Peões centrais controlam mais casas', 'Evite mover peões do flanco no início', 'e4 abre diagonais para dama e bispo'],
    solution: ['e2e4'],
    explanation: '1.e4 é um dos melhores lances iniciais, ocupando o centro e liberando peças.',
    difficulty: 'intermediate',
    completed: false
  },
  {
    id: 'development',
    title: 'Desenvolvimento Rápido',
    description: 'Traga suas peças para o jogo',
    content: 'Desenvolva suas peças menores (cavalo e bispo) rapidamente para trazer seu rei à segurança via roque.',
    fen: 'r1bqkb1r/pppp1ppp/2n2n2/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 4 4',
    objective: 'Complete o desenvolvimento e rocque',
    hints: ['Rocque protege o rei e conecta as torres', 'Não mova a mesma peça duas vezes no início', 'O roque curto move o rei para g1'],
    solution: ['e1g1'],
    explanation: 'O roque curto traz o rei para segurança e ativa a torre.',
    difficulty: 'intermediate',
    completed: false
  },
  // Module 4: Advanced
  {
    id: 'endgame-technique',
    title: 'Finais Técnicos',
    description: 'Mate com Rei e Torre vs Rei',
    content: 'Finais requerem precisão. Aprenda a converter vantagens materiais com técnica.',
    fen: '8/8/8/8/3k4/8/4K3/4R3 w - - 0 1',
    objective: 'Mate com Rei e Torre vs Rei',
    hints: ['Use a torre para limitar o rei inimigo', 'Empurre o rei para a borda', 'Reduza o espaço do rei gradualmente'],
    solution: ['e1e8'],
    explanation: 'A torre controla a oitava fileira, restringindo o rei inimigo.',
    difficulty: 'advanced',
    completed: false
  },
  {
    id: 'positional-play',
    title: 'Jogo Posicional',
    description: 'Entenda planos estratégicos',
    content: 'Entenda conceitos avançados como espaço, iniciativa e compensação posicional.',
    fen: 'r1bq1rk1/pp2bppp/2n1pn2/3p2B1/3P4/2NBPN2/PPQ2PPP/R4RK1 w - - 0 10',
    objective: 'Identifique o plano correto para as brancas',
    hints: ['Estrutura de peões determina o plano', 'Casas fracas são alvos permanentes', 'Considere avanços no flanco de rei'],
    solution: ['e3e4'],
    explanation: 'e4 desafia o centro e abre o jogo para as peças brancas.',
    difficulty: 'advanced',
    completed: false
  }
];

/**
 * Tutorial modules organized by difficulty level
 */
export const tutorialModules: TutorialModule[] = [
  {
    id: 'fundamentals',
    title: 'Módulo 1: Fundamentos',
    description: 'Aprenda os movimentos básicos das peças e conceitos fundamentais',
    eloRange: [0, 400],
    lessons: tutorialLessons.filter(l => ['pawn-movement', 'knight-movement', 'checkmate-basic'].includes(l.id)),
    completed: false,
    locked: false
  },
  {
    id: 'tactics',
    title: 'Módulo 2: Tática',
    description: 'Garfo, skewer, pins e padrões táticos fundamentais',
    eloRange: [400, 1000],
    lessons: tutorialLessons.filter(l => ['fork-intro', 'pin-intro'].includes(l.id)),
    completed: false,
    locked: true
  },
  {
    id: 'strategy',
    title: 'Módulo 3: Estratégia',
    description: 'Controle do centro, estrutura de peões e desenvolvimento',
    eloRange: [1000, 1600],
    lessons: tutorialLessons.filter(l => ['center-control', 'development'].includes(l.id)),
    completed: false,
    locked: true
  },
  {
    id: 'advanced',
    title: 'Módulo 4: Avançado',
    description: 'Análise de precisão, finais e conceitos profundos',
    eloRange: [1600, 2200],
    lessons: tutorialLessons.filter(l => ['endgame-technique', 'positional-play'].includes(l.id)),
    completed: false,
    locked: true
  }
];

export default tutorialModules;
