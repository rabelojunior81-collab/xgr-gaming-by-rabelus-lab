import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  GameMode,
  Theme,
  Difficulty,
  AIPersonality,
  AISpeed,
  PlayerProfile,
  TutorialModule,
  AnalysisResult,
  Move,
  GameRecord,
  PlayerStats,
  EmotionalProfile
} from '@/types/chess';
import { ChessEngine } from '@/engine/chessEngine';

interface GameState {
  // Game Engine (not persisted - will be recreated)
  engine: ChessEngine;
  fen: string;
  turn: 'w' | 'b';
  isGameOver: boolean;
  moves: Move[];
  
  // Game Settings (persisted)
  gameMode: GameMode;
  theme: Theme;
  difficulty: Difficulty;
  aiPersonality: AIPersonality;
  aiSpeed: AISpeed;
  playerColor: 'w' | 'b';
  
  // Players (persisted)
  whitePlayer: PlayerProfile;
  blackPlayer: PlayerProfile;
  
  // UI State (not persisted)
  selectedSquare: string | null;
  legalMoves: string[];
  isThinking: boolean;
  showHints: boolean;
  showAnalysis: boolean;
  currentView: 'menu' | 'game' | 'tutorial' | 'analysis' | 'settings';
  
  // Analysis (not persisted)
  analysisResults: Map<number, AnalysisResult>;
  currentEvaluation: number;
  
  // Emotional State (not persisted)
  emotionalProfile: EmotionalProfile;
  
  // Persisted Stats
  gameHistory: GameRecord[];
  playerStats: PlayerStats;
  
  // Tutorial (not persisted)
  tutorialModules: TutorialModule[];
  currentLesson: string | null;
  
  // Actions
  setGameMode: (mode: GameMode) => void;
  setTheme: (theme: Theme) => void;
  setDifficulty: (difficulty: Difficulty) => void;
  setAIPersonality: (personality: AIPersonality) => void;
  setAISpeed: (speed: AISpeed) => void;
  setPlayerColor: (color: 'w' | 'b') => void;
  selectSquare: (square: string | null) => void;
  makeMove: (from: string, to: string, promotion?: string) => boolean;
  undoMove: () => void;
  resetGame: () => void;
  setView: (view: GameState['currentView']) => void;
  toggleHints: () => void;
  toggleAnalysis: () => void;
  requestAIMove: () => Promise<void>;
  setCurrentEvaluation: (eval_: number) => void;
  setAnalysisResults: (results: Map<number, AnalysisResult>) => void;
  setEmotionalProfile: (profile: EmotionalProfile) => void;
  addGameToHistory: (game: GameRecord) => void;
  updatePlayerStats: (result: 'win' | 'loss' | 'draw') => void;
}

const defaultAIPersonality: AIPersonality = {
  aggressiveness: 50,
  technicalPrecision: 70,
  openingRepertoire: 'balanced',
  thinkingTime: 50,
  emotionalResilience: 60
};

const defaultPlayer: PlayerProfile = {
  name: 'Player 1',
  elo: 800,
  wins: 0,
  losses: 0,
  draws: 0,
  favoriteOpenings: [],
  strengths: [],
  weaknesses: []
};

const defaultPlayerStats: PlayerStats = {
  wins: 0,
  losses: 0,
  draws: 0,
  totalGames: 0
};

// Create engine outside of store to avoid recreation
const globalEngine = new ChessEngine();

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      // Initial State
      engine: globalEngine,
      fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
      turn: 'w',
      isGameOver: false,
      moves: [],
      
      gameMode: 'practice',
      theme: 'classic',
      difficulty: 'club',
      aiPersonality: defaultAIPersonality,
      aiSpeed: 'normal',
      playerColor: 'w',
      
      whitePlayer: { ...defaultPlayer, name: 'White' },
      blackPlayer: { ...defaultPlayer, name: 'Black' },
      
      selectedSquare: null,
      legalMoves: [],
      isThinking: false,
      showHints: false,
      showAnalysis: false,
      currentView: 'menu',
      
      analysisResults: new Map(),
      currentEvaluation: 0,
      
      emotionalProfile: {
        state: 'neutral',
        riskTolerance: 0.5,
        aggressionLevel: 0.5,
        message: 'Preparado para a partida'
      },
      
      gameHistory: [],
      playerStats: { ...defaultPlayerStats },
      
      tutorialModules: [],
      currentLesson: null,
      
      // Actions
      setGameMode: (mode) => set({ gameMode: mode }),
      
      setTheme: (theme) => set({ theme }),
      
      setDifficulty: (difficulty) => set({ difficulty }),
      
      setAIPersonality: (personality) => set({ aiPersonality: personality }),
      
      setAISpeed: (speed) => {
        const { engine } = get();
        engine.setAISpeed(speed);
        set({ aiSpeed: speed });
      },
      
      setPlayerColor: (color) => set({ playerColor: color }),
      
      selectSquare: (square) => {
        const { engine } = get();
        if (!square) {
          set({ selectedSquare: null, legalMoves: [] });
          return;
        }
        
        const legalMoves = engine.getLegalMoves(square).map(m => m.to);
        set({ selectedSquare: square, legalMoves });
      },
      
      makeMove: (from, to, promotion) => {
        const { engine, gameMode, playerColor } = get();
        
        const success = engine.makeMove({
          from,
          to,
          promotion: promotion as any
        });
        
        if (success) {
          const state = engine.getGameState();
          set({
            fen: state.fen,
            turn: state.turn,
            isGameOver: state.isCheckmate || state.isDraw,
            moves: engine.getHistory(),
            selectedSquare: null,
            legalMoves: []
          });
          
          // Request AI move if playing against AI
          if (gameMode === 'practice' && state.turn !== playerColor && !state.isCheckmate && !state.isDraw) {
            setTimeout(() => get().requestAIMove(), 500);
          }
          
          return true;
        }
        return false;
      },
      
      undoMove: () => {
        const { engine, gameMode } = get();
        
        // Undo twice if playing against AI to undo both player and AI moves
        engine.undo();
        if (gameMode === 'practice') {
          engine.undo();
        }
        
        const state = engine.getGameState();
        set({
          fen: state.fen,
          turn: state.turn,
          isGameOver: false,
          moves: engine.getHistory()
        });
      },
      
      resetGame: () => {
        const { engine } = get();
        engine.reset();
        const state = engine.getGameState();
        set({
          fen: state.fen,
          turn: 'w',
          isGameOver: false,
          moves: [],
          selectedSquare: null,
          legalMoves: [],
          analysisResults: new Map()
        });
      },
      
      setView: (view) => set({ currentView: view }),
      
      toggleHints: () => set((state) => ({ showHints: !state.showHints })),
      
      toggleAnalysis: () => set((state) => ({ showAnalysis: !state.showAnalysis })),
      
      requestAIMove: async () => {
        const { engine, difficulty, aiPersonality } = get();
        set({ isThinking: true });
        
        try {
          const move = await engine.getAIMove(
            difficulty,
            difficulty === 'custom' ? aiPersonality : undefined
          );
          
          if (move) {
            engine.makeMove(move);
            const state = engine.getGameState();
            set({
              fen: state.fen,
              turn: state.turn,
              isGameOver: state.isCheckmate || state.isDraw,
              moves: engine.getHistory()
            });
          }
        } finally {
          set({ isThinking: false });
        }
      },
      
      setCurrentEvaluation: (eval_) => set({ currentEvaluation: eval_ }),
      
      setAnalysisResults: (results) => set({ analysisResults: results }),
      
      setEmotionalProfile: (profile) => set({ emotionalProfile: profile }),
      
      addGameToHistory: (game) => set((state) => ({
        gameHistory: [game, ...state.gameHistory].slice(0, 100) // Keep last 100 games
      })),
      
      updatePlayerStats: (result) => set((state) => {
        const newStats = { ...state.playerStats };
        newStats.totalGames += 1;
        
        if (result === 'win') {
          newStats.wins += 1;
        } else if (result === 'loss') {
          newStats.losses += 1;
        } else {
          newStats.draws += 1;
        }
        
        return { playerStats: newStats };
      })
    }),
    {
      name: 'chess-game-storage',
      partialize: (state) => ({
        theme: state.theme,
        difficulty: state.difficulty,
        aiPersonality: state.aiPersonality,
        aiSpeed: state.aiSpeed,
        playerColor: state.playerColor,
        whitePlayer: state.whitePlayer,
        blackPlayer: state.blackPlayer,
        gameHistory: state.gameHistory,
        playerStats: state.playerStats
      })
    }
  )
);
