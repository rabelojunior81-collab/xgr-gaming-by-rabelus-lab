export type PieceType = 'p' | 'n' | 'b' | 'r' | 'q' | 'k';
export type PieceColor = 'w' | 'b';

export interface Piece {
  type: PieceType;
  color: PieceColor;
}

export interface Square {
  file: string;
  rank: number;
  index: number;
}

export interface Move {
  from: string;
  to: string;
  promotion?: PieceType;
  san?: string;
  lan?: string;
}

export interface GameState {
  fen: string;
  turn: PieceColor;
  isCheck: boolean;
  isCheckmate: boolean;
  isDraw: boolean;
  isStalemate: boolean;
  isThreefoldRepetition: boolean;
  isInsufficientMaterial: boolean;
  halfmoveClock: number;
  fullmoveNumber: number;
}

export interface Evaluation {
  type: 'cp' | 'mate';
  value: number;
}

export interface AnalysisResult {
  bestMove: string;
  evaluation: Evaluation;
  depth: number;
  pv: string[];
  winRate?: number;
}

export type Difficulty = 'beginner' | 'club' | 'master' | 'custom';

export interface AIPersonality {
  aggressiveness: number;
  technicalPrecision: number;
  openingRepertoire: string;
  thinkingTime: number;
  emotionalResilience: number;
}

export type Theme = 'classic' | 'cyberpunk' | 'minimalist';

export interface GameTheme {
  id: Theme;
  name: string;
  boardLight: string;
  boardDark: string;
  pieceStyle: 'classic' | 'futuristic' | 'neon';
  ambientLight: number;
  accentColor: string;
}

export type GameMode = 'tutorial' | 'practice' | 'hotseat' | 'analysis';

export interface PlayerProfile {
  name: string;
  elo: number;
  wins: number;
  losses: number;
  draws: number;
  favoriteOpenings: string[];
  strengths: string[];
  weaknesses: string[];
}

export interface TutorialModule {
  id: string;
  title: string;
  description: string;
  eloRange: [number, number];
  lessons: Lesson[];
  completed: boolean;
}

export interface Lesson {
  id: string;
  title: string;
  content: string;
  fen: string;
  objective: string;
  hints: string[];
  completed: boolean;
}

export interface ReplayMove {
  move: Move;
  evaluation: number;
  bestMove: string;
  isBlunder: boolean;
  isMistake: boolean;
  isInaccuracy: boolean;
}

export interface HeatmapData {
  square: string;
  control: number;
  color: PieceColor | null;
}

export interface GameRecord {
  id: string;
  date: string;
  white: string;
  black: string;
  result: '1-0' | '0-1' | '1/2-1/2';
  moves: string[];
  pgn: string;
  whiteAccuracy?: number;
  blackAccuracy?: number;
}

export interface PlayerStats {
  wins: number;
  losses: number;
  draws: number;
  totalGames: number;
}

export interface MoveClassification {
  type: 'brilliant' | 'great' | 'best' | 'excellent' | 'good' | 'inaccuracy' | 'mistake' | 'blunder';
  move: Move;
  playedEval: number;
  bestEval: number;
  winRateLoss: number;
}

// =====================================================
// TYPES FOR OPENING BOOK (Sub-Sprint 2.1.1)
// =====================================================

/**
 * Dados de uma abertura no catálogo ECO
 */
export interface OpeningData {
  eco: string;
  name: string;
  category: 'open' | 'semi-open' | 'closed' | 'indian' | 'modern';
  moves: string[]; // UCI format: e2e4, e7e5, etc.
  weight: number; // 1-10, probabilidade base
}

/**
 * Movimento disponível no livro de aberturas
 */
export interface BookMove {
  move: string; // UCI format
  weight: number;
  openingName: string;
}

/**
 * Categorias de aberturas por estilo de jogo
 */
export type OpeningCategory = 'aggressive' | 'solid' | 'positional' | 'tactical';

/**
 * Resultado de consulta ao livro de aberturas
 */
export interface BookLookupResult {
  moves: BookMove[];
  inBook: boolean;
  openingName?: string;
  ecoCode?: string;
}

/**
 * Configuração do OpeningBook
 */
export interface OpeningBookConfig {
  maxDepth: number;
  usePersonalityWeights: boolean;
  fallbackToEngine: boolean;
  cacheSize: number;
}

/**
 * Estatísticas do OpeningBook
 */
export interface OpeningBookStats {
  lookups: number;
  cacheHits: number;
  bookHits: number;
  hitRate: number;
}

// =====================================================
// TYPES FOR EMOTIONAL STATE (Sub-Sprint 2.1.3)
// =====================================================

/**
 * Estados emocionais da IA Neural-X
 */
export type EmotionalState =
  | 'confident'      // vantagem significativa
  | 'optimistic'     // vantagem leve
  | 'neutral'        // equilibrado
  | 'concerned'      // desvantagem leve
  | 'desperate';     // desvantagem significativa

/**
 * Perfil emocional da IA
 */
export interface EmotionalProfile {
  state: EmotionalState;
  riskTolerance: number;    // 0-1 (0=conservador, 1=arriscado)
  aggressionLevel: number;  // 0-1 (fator multiplicador)
  message?: string;         // mensagem opcional da IA
}

/**
 * Avaliação da situação do jogo
 */
export interface SituationAssessment {
  materialScore: number;    // eval em centipawns
  positionalScore: number;  // 0-100 (análise posicional)
  overallAdvantage: number; // eval em centipawns (negativo = IA perdendo)
  gamePhase: 'opening' | 'middlegame' | 'endgame';
}

/**
 * Thresholds configuráveis para estados emocionais
 */
export interface EmotionalThresholds {
  desperate: number;   // abaixo = desesperado
  concerned: number;   // abaixo = preocupado
  neutral: number;     // abaixo = neutro
  optimistic: number;  // abaixo = otimista
  confident: number;   // acima = confiante
}

// =====================================================
// TYPES FOR TIME MANAGEMENT (Sub-Sprint 2.1.2)
// =====================================================

/**
 * Velocidade da IA para gestão de tempo
 */
export type AISpeed = 'fast' | 'normal' | 'slow';

/**
 * Configuração de tempo para a IA
 */
export interface TimeConfig {
  baseDelay: number;
  complexityFactor: number;
  maxDelay: number;
  randomVariation: number;
}

/**
 * Complexidade de uma posição de xadrez
 */
export interface PositionComplexity {
  score: number;
  factors: {
    pieceCount: number;
    materialBalance: number;
    tacticalOpportunities: number;
    gamePhase: 'opening' | 'middlegame' | 'endgame';
  };
}

/**
 * Progresso do pensamento da IA
 */
export interface ThinkingProgress {
  isThinking: boolean;
  progress: number;
  estimatedTime: number;
}
