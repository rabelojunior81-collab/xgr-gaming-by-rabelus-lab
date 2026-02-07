import { Chess } from 'chess.js';
import type {
  Move,
  AnalysisResult
} from '@/types/chess';
import type {
  TutorialLesson,
  LessonStats,
  MoveValidationResult,
  LessonSession,
  FeedbackState,
  LessonResult,
  TutorialEngineConfig
} from '@/types/tutorial';

/**
 * TutorialEngine - Core engine for interactive chess tutorials
 * Manages lesson state, move validation, and AI demonstrations
 */
export class TutorialEngine {
  private game: Chess;
  private session: LessonSession | null = null;
  private config: TutorialEngineConfig;
  private stockfish: Worker | null = null;
  private isStockfishReady = false;

  // Event callbacks
  private onMoveValidation?: (result: MoveValidationResult, move: Move) => void;
  private onLessonComplete?: (stats: LessonStats) => void;
  private onHintRequested?: (hint: string, level: number) => void;
  private onFeedback?: (feedback: FeedbackState) => void;

  constructor(config: TutorialEngineConfig) {
    this.game = new Chess();
    this.config = config;
    
    // Set up callbacks
    this.onMoveValidation = config.onMoveValidation;
    this.onLessonComplete = config.onLessonComplete;
    this.onHintRequested = config.onHintRequested;
    this.onFeedback = config.onFeedback;

    // Initialize lesson if provided
    if (config.lesson) {
      this.loadLesson(config.lesson);
    }

    // Initialize Stockfish for demonstrations
    this.initStockfish();
  }

  /**
   * Initialize Stockfish worker for AI demonstrations
   */
  private async initStockfish(): Promise<void> {
    if (typeof window === 'undefined') return;

    try {
      this.stockfish = new Worker('/stockfish.js', { type: 'classic' });
      
      this.stockfish.onmessage = (e: MessageEvent) => {
        if (e.data === 'readyok') {
          this.isStockfishReady = true;
        }
      };

      this.stockfish.postMessage('uci');
      this.stockfish.postMessage('isready');
    } catch (error) {
      console.warn('Stockfish initialization failed:', error);
      this.isStockfishReady = false;
    }
  }

  /**
   * Load a lesson and reset the session
   */
  public loadLesson(lesson: TutorialLesson): void {
    this.session = {
      lesson,
      attempts: 0,
      hintsUsed: 0,
      startTime: Date.now(),
      timeSpent: 0,
      isComplete: false,
      moveHistory: [],
      currentHintLevel: 0
    };

    // Load the FEN position
    try {
      this.game.load(lesson.fen);
    } catch (error) {
      console.error('Invalid FEN:', lesson.fen);
      this.game.reset();
    }

    this.emitFeedback({
      type: 'info',
      message: lesson.objective,
      autoDismiss: 5000
    });
  }

  /**
   * Get current FEN position
   */
  public getCurrentFEN(): string {
    return this.game.fen();
  }

  /**
   * Get current lesson
   */
  public getCurrentLesson(): TutorialLesson | null {
    return this.session?.lesson || null;
  }

  /**
   * Get current session state
   */
  public getSession(): LessonSession | null {
    return this.session;
  }

  /**
   * Validate a move in the tutorial context
   */
  public validateMove(move: Move): MoveValidationResult {
    if (!this.session || this.session.isComplete) {
      return {
        valid: false,
        isSolution: false,
        isAlternative: false,
        error: 'NO_ACTIVE_LESSON'
      };
    }

    this.session.attempts++;

    // First check if it's a legal chess move
    const legalMoves = this.game.moves({ verbose: true });
    const isLegal = legalMoves.some(
      m => m.from === move.from && m.to === move.to
    );

    if (!isLegal) {
      const result: MoveValidationResult = {
        valid: false,
        isSolution: false,
        isAlternative: false,
        error: 'ILLEGAL_MOVE',
        feedback: 'Este movimento não é válido segundo as regras do xadrez.'
      };
      
      this.emitFeedback({
        type: 'error',
        message: 'Movimento inválido!',
        highlightSquares: [move.from],
        autoDismiss: 2000
      });
      
      this.onMoveValidation?.(result, move);
      return result;
    }

    // Check if move matches the solution
    const moveUCI = move.from + move.to + (move.promotion || '');
    const isSolution = this.session.lesson.solution.some(sol => 
      sol.startsWith(moveUCI)
    );

    // Execute the move
    try {
      const moveResult = this.game.move({
        from: move.from,
        to: move.to,
        promotion: move.promotion
      });

      if (moveResult) {
        this.session.moveHistory.push(move);

        if (isSolution) {
          this.handleCorrectMove(move);
        } else {
          this.handleIncorrectMove(move);
        }

        const result: MoveValidationResult = {
          valid: true,
          isSolution,
          isAlternative: !isSolution && this.isAlternativeMove(move),
          feedback: isSolution 
            ? 'Excelente! Movimento correto.' 
            : 'Movimento válido, mas não é a solução esperada.'
        };

        this.onMoveValidation?.(result, move);
        return result;
      }
    } catch (error) {
      const result: MoveValidationResult = {
        valid: false,
        isSolution: false,
        isAlternative: false,
        error: 'MOVE_ERROR',
        feedback: 'Erro ao executar o movimento.'
      };
      
      this.onMoveValidation?.(result, move);
      return result;
    }

    return {
      valid: false,
      isSolution: false,
      isAlternative: false,
      error: 'UNKNOWN_ERROR'
    };
  }

  /**
   * Handle correct solution move
   */
  private handleCorrectMove(move: Move): void {
    if (!this.session) return;

    this.emitFeedback({
      type: 'success',
      message: '🎉 Correto! ' + (this.session.lesson.explanation || 'Muito bem!'),
      highlightSquares: [move.from, move.to],
      autoDismiss: 3000
    });

    // Check if this completes the lesson
    if (this.isLessonComplete()) {
      this.completeLesson();
    }
  }

  /**
   * Handle incorrect move (valid but not solution)
   */
  private handleIncorrectMove(move: Move): void {
    this.emitFeedback({
      type: 'warning',
      message: 'Movimento válido, mas não é a solução. Tente novamente!',
      highlightSquares: [move.from, move.to],
      autoDismiss: 2500
    });
  }

  /**
   * Check if move is an acceptable alternative
   */
  private isAlternativeMove(move: Move): boolean {
    // Could be extended to accept multiple valid solutions
    return false;
  }

  /**
   * Check if lesson is complete
   */
  private isLessonComplete(): boolean {
    if (!this.session) return false;
    
    // For now, any correct move completes the lesson
    // Could be extended to require a sequence of moves
    return true;
  }

  /**
   * Complete the current lesson
   */
  private completeLesson(): void {
    if (!this.session) return;

    this.session.isComplete = true;
    
    const timeSpent = Math.floor((Date.now() - this.session.startTime) / 1000);
    
    // Calculate rating
    let rating: LessonStats['rating'] = 'completed';
    if (this.session.attempts === 1 && this.session.hintsUsed === 0) {
      rating = 'perfect';
    } else if (this.session.attempts <= 2 && this.session.hintsUsed <= 1) {
      rating = 'good';
    }

    const stats: LessonStats = {
      lessonId: this.session.lesson.id,
      attempts: this.session.attempts,
      hintsUsed: this.session.hintsUsed,
      timeSpent,
      completedAt: new Date(),
      rating
    };

    this.emitFeedback({
      type: 'success',
      message: `🎊 Lição completada! Avaliação: ${this.getRatingLabel(rating)}`,
      autoDismiss: 5000
    });

    this.onLessonComplete?.(stats);
  }

  /**
   * Get human-readable rating label
   */
  private getRatingLabel(rating: LessonStats['rating']): string {
    switch (rating) {
      case 'perfect': return '⭐⭐⭐ Perfeito!';
      case 'good': return '⭐⭐ Bom!';
      case 'completed': return '⭐ Completado';
      default: return 'Completado';
    }
  }

  /**
   * Get a hint for the current lesson
   */
  public getHint(level?: number): string | null {
    if (!this.session) return null;

    const hintLevel = level ?? this.session.currentHintLevel;
    
    if (hintLevel >= this.session.lesson.hints.length) {
      return null;
    }

    this.session.hintsUsed++;
    this.session.currentHintLevel = hintLevel + 1;

    const hint = this.session.lesson.hints[hintLevel];
    
    this.emitFeedback({
      type: 'hint',
      message: `💡 Dica ${hintLevel + 1}/${this.session.lesson.hints.length}: ${hint}`,
      autoDismiss: 8000
    });

    this.onHintRequested?.(hint, hintLevel);
    
    return hint;
  }

  /**
   * Show the solution using AI demonstration
   */
  public async showSolution(): Promise<void> {
    if (!this.session) return;

    this.emitFeedback({
      type: 'info',
      message: '🤖 A IA vai demonstrar a solução...',
      autoDismiss: 3000
    });

    // Reset to initial position
    this.game.load(this.session.lesson.fen);
    this.session.moveHistory = [];

    // Execute solution moves with delay
    for (const moveUCI of this.session.lesson.solution) {
      await this.delay(1000);
      
      const from = moveUCI.substring(0, 2);
      const to = moveUCI.substring(2, 4);
      const promotion = moveUCI.length > 4 ? moveUCI[4] : undefined;

      this.game.move({ from, to, promotion });
      
      this.emitFeedback({
        type: 'info',
        message: `IA jogou: ${from}-${to}`,
        highlightSquares: [from, to],
        autoDismiss: 1500
      });
    }

    // Show explanation
    if (this.session.lesson.explanation) {
      await this.delay(500);
      this.emitFeedback({
        type: 'info',
        message: `📖 ${this.session.lesson.explanation}`,
        autoDismiss: 10000
      });
    }

    // Mark as complete
    this.completeLesson();
  }

  /**
   * Reset the current lesson
   */
  public resetLesson(): void {
    if (!this.session) return;

    this.loadLesson(this.session.lesson);
    
    this.emitFeedback({
      type: 'info',
      message: 'Lição reiniciada. Tente novamente!',
      autoDismiss: 2000
    });
  }

  /**
   * Get lesson statistics
   */
  public getStats(): Omit<LessonStats, 'lessonId' | 'completedAt' | 'rating'> {
    if (!this.session) {
      return { attempts: 0, hintsUsed: 0, timeSpent: 0 };
    }

    return {
      attempts: this.session.attempts,
      hintsUsed: this.session.hintsUsed,
      timeSpent: Math.floor((Date.now() - this.session.startTime) / 1000)
    };
  }

  /**
   * Get legal moves for a square
   */
  public getLegalMoves(square: string): string[] {
    return this.game.moves({ 
      square: square as any, 
      verbose: true 
    }).map(m => m.to);
  }

  /**
   * Get game state
   */
  public getGameState() {
    return {
      fen: this.game.fen(),
      turn: this.game.turn(),
      isCheck: this.game.isCheck(),
      isCheckmate: this.game.isCheckmate(),
      isDraw: this.game.isDraw()
    };
  }

  /**
   * Check if lesson is complete
   */
  public isComplete(): boolean {
    return this.session?.isComplete || false;
  }

  /**
   * Emit feedback event
   */
  private emitFeedback(feedback: FeedbackState): void {
    this.onFeedback?.(feedback);
  }

  /**
   * Utility: delay function
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Cleanup resources
   */
  public dispose(): void {
    if (this.stockfish) {
      this.stockfish.terminate();
      this.stockfish = null;
    }
    this.session = null;
  }
}

export default TutorialEngine;
