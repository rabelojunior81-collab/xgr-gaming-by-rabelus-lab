import { Chess } from 'chess.js';
import { OpeningBook } from './openingBook';
import { TimeManager, type AISpeed } from './timeManager';
import { EmotionalStateManager } from './emotionalState';
import type {
  Move,
  GameState,
  AnalysisResult,
  Evaluation,
  AIPersonality,
  Difficulty,
  PieceType,
  EmotionalProfile
} from '@/types/chess';

// Stockfish WASM file path - copied to public folder
const STOCKFISH_PATH = '/stockfish.js';

export class ChessEngine {
  private game: Chess;
  private stockfish: Worker | null = null;
  private isStockfishReady: boolean = false;
  private analysisCallback: ((result: AnalysisResult) => void) | null = null;
  private initError: Error | null = null;
  private isInitializing: boolean = false;
  private openingBook: OpeningBook;
  private timeManager: TimeManager;
  private emotionalStateManager: EmotionalStateManager | null = null;
  private currentPersonality: AIPersonality | null = null;

  /** Callback para progresso do pensamento (0-100%) */
  public onThinkingProgress?: (progress: number) => void;
  
  /** Callback para mudança de estado emocional */
  public onEmotionalStateChange?: (profile: EmotionalProfile) => void;

  constructor() {
    this.game = new Chess();
    this.openingBook = new OpeningBook();
    this.timeManager = new TimeManager();
    this.initStockfish();
  }

  /**
   * Define a velocidade da IA para gestão de tempo
   * @param speed - Velocidade desejada ('fast', 'normal', 'slow')
   */
  public setAISpeed(speed: AISpeed): void {
    this.timeManager.setSpeed(speed);
  }

  /**
   * Obtém a velocidade atual da IA
   */
  public getAISpeed(): AISpeed {
    const config = this.timeManager.getConfig();
    // Determinar a velocidade baseada na configuração
    if (config.baseDelay <= 200) return 'fast';
    if (config.baseDelay >= 800) return 'slow';
    return 'normal';
  }

  private async initStockfish() {
    if (this.isInitializing || typeof window === 'undefined') return;
    
    this.isInitializing = true;
    
    try {
      // Try to create a Worker with the stockfish file
      // Using lite single-threaded version for better compatibility
      this.stockfish = new Worker(STOCKFISH_PATH, { type: 'classic' });
      
      this.stockfish.onmessage = (e: MessageEvent) => {
        this.handleStockfishMessage(e.data);
      };
      
      this.stockfish.onerror = (e: ErrorEvent) => {
        console.error('Stockfish Worker error:', e);
        this.initError = new Error(`Stockfish Worker error: ${e.message}`);
        this.isStockfishReady = false;
      };
      
      // Initialize UCI protocol
      this.stockfish.postMessage('uci');
      
      // Wait for initialization with timeout
      await Promise.race([
        this.waitForReady(),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Stockfish initialization timeout')), 5000)
        )
      ]);
      
      console.log('Stockfish engine initialized successfully');
    } catch (e) {
      console.warn('Stockfish initialization failed, using fallback engine:', e);
      this.initError = e instanceof Error ? e : new Error('Unknown Stockfish error');
      this.isStockfishReady = false;
      this.stockfish = null;
    } finally {
      this.isInitializing = false;
    }
  }

  private waitForReady(): Promise<void> {
    return new Promise((resolve) => {
      const checkReady = () => {
        if (this.isStockfishReady) {
          resolve();
        } else {
          setTimeout(checkReady, 100);
        }
      };
      checkReady();
    });
  }

  private handleStockfishMessage(message: string) {
    if (typeof message !== 'string') return;
    
    if (message === 'readyok') {
      this.isStockfishReady = true;
    }

    if (message.includes('uciok')) {
      this.stockfish?.postMessage('setoption name Hash value 16');
      this.stockfish?.postMessage('setoption name Threads value 1');
      this.stockfish?.postMessage('isready');
    }

    if (message.startsWith('info') && message.includes('score')) {
      const analysis = this.parseAnalysis(message);
      if (analysis && this.analysisCallback) {
        this.analysisCallback(analysis);
      }
    }
  }

  private parseAnalysis(message: string): AnalysisResult | null {
    const scoreMatch = message.match(/score (cp|mate) (-?\d+)/);
    const depthMatch = message.match(/depth (\d+)/);
    const pvMatch = message.match(/pv ([a-h][1-8][a-h][1-8][qrbn]?.*)/);

    if (!scoreMatch) return null;

    const evaluation: Evaluation = {
      type: scoreMatch[1] as 'cp' | 'mate',
      value: parseInt(scoreMatch[2])
    };

    const pv = pvMatch ? pvMatch[1].trim().split(' ') : [];
    const bestMove = pv[0] || '';

    return {
      bestMove,
      evaluation,
      depth: depthMatch ? parseInt(depthMatch[1]) : 0,
      pv,
      winRate: this.calculateWinRate(evaluation)
    };
  }

  private calculateWinRate(evaluation: Evaluation): number {
    if (evaluation.type === 'mate') {
      return evaluation.value > 0 ? 100 : 0;
    }
    const cp = evaluation.value;
    // Win rate formula based on centipawns
    return 50 + 50 * (2 / (1 + Math.exp(-0.00368208 * cp)) - 1);
  }

  public isEngineReady(): boolean {
    return this.isStockfishReady;
  }

  public getEngineError(): Error | null {
    return this.initError;
  }

  public getGameState(): GameState {
    return {
      fen: this.game.fen(),
      turn: this.game.turn() as 'w' | 'b',
      isCheck: this.game.isCheck(),
      isCheckmate: this.game.isCheckmate(),
      isDraw: this.game.isDraw(),
      isStalemate: this.game.isStalemate(),
      isThreefoldRepetition: this.game.isThreefoldRepetition(),
      isInsufficientMaterial: this.game.isInsufficientMaterial(),
      halfmoveClock: parseInt(this.game.fen().split(' ')[4]),
      fullmoveNumber: parseInt(this.game.fen().split(' ')[5])
    };
  }

  public makeMove(move: Move | string): boolean {
    try {
      if (typeof move === 'string') {
        this.game.move(move);
      } else {
        this.game.move({
          from: move.from,
          to: move.to,
          promotion: move.promotion
        });
      }
      return true;
    } catch (e) {
      return false;
    }
  }

  public undo(): boolean {
    const result = this.game.undo();
    return result !== null;
  }

  public getLegalMoves(square?: string): Move[] {
    const moves = this.game.moves({ square: square as any, verbose: true });
    return moves.map((m: any) => ({
      from: m.from,
      to: m.to,
      promotion: m.promotion,
      san: m.san,
      lan: m.lan
    }));
  }

  public getPiece(square: string) {
    return this.game.get(square as any);
  }

  public loadFen(fen: string): boolean {
    try {
      this.game.load(fen);
      return true;
    } catch (e) {
      return false;
    }
  }

  public reset(): void {
    this.game.reset();
    this.emotionalStateManager?.reset();
  }

  /**
   * Define a personalidade da IA (ativa o EmotionalStateManager)
   */
  public setPersonality(personality: AIPersonality): void {
    this.currentPersonality = personality;
    this.emotionalStateManager = new EmotionalStateManager(personality);
  }

  /**
   * Retorna o perfil emocional atual da IA
   */
  public getCurrentEmotionalProfile(): EmotionalProfile | null {
    if (!this.emotionalStateManager) return null;
    return this.emotionalStateManager.getCurrentProfile();
  }

  public async getAIMove(
    difficulty: Difficulty,
    personality?: AIPersonality
  ): Promise<Move | null> {
    const legalMoves = this.game.moves({ verbose: true });
    if (legalMoves.length === 0) return null;

    // Configurar personalidade se fornecida
    if (personality && (!this.currentPersonality ||
        JSON.stringify(this.currentPersonality) !== JSON.stringify(personality))) {
      this.setPersonality(personality);
    }

    // FASE 1: Calcular complexidade e delay de reflexão
    const complexity = this.timeManager.calculateComplexity(this.game);
    const delay = this.timeManager.calculateDelay(complexity, personality);

    console.log(`[ChessEngine] Complexidade: ${complexity.score}/100, Delay: ${delay}ms`);

    // FASE 2: Simular tempo de reflexão (exceto para movimentos de livro)
    const bookMove = this.getBookMove(personality);
    
    if (!bookMove) {
      // Aguardar o tempo de reflexão calculado
      await this.timeManager.simulateThinking(delay, (progress) => {
        if (this.onThinkingProgress) {
          this.onThinkingProgress(progress);
        }
      });
    } else {
      console.log('[ChessEngine] Usando movimento do livro:', bookMove.san);
      // Delay reduzido para movimentos de abertura (mais natural)
      const openingDelay = Math.min(delay, 500);
      await this.timeManager.simulateThinking(openingDelay, (progress) => {
        if (this.onThinkingProgress) {
          this.onThinkingProgress(progress);
        }
      });
      return bookMove;
    }

    // FASE 3: Atualizar estado emocional (se personalidade configurada)
    let riskTolerance = 0.5; // valor padrão
    if (this.emotionalStateManager) {
      // Obter avaliação atual da posição
      const positionEval = await this.getQuickEvaluation();
      const assessment = this.emotionalStateManager.assessSituation(positionEval);
      const profile = this.emotionalStateManager.updateEmotionalState(assessment);
      
      riskTolerance = profile.riskTolerance;
      console.log(`[ChessEngine] Estado emocional: ${profile.state}, Risk: ${riskTolerance.toFixed(2)}`);
      
      // Notificar mudança de estado
      if (this.onEmotionalStateChange) {
        this.onEmotionalStateChange(profile);
      }
    }

    // FASE 4: Selecionar movimento baseado na dificuldade e estado emocional
    if (difficulty === 'beginner') {
      return this.getBeginnerMove(legalMoves);
    } else if (difficulty === 'club') {
      return this.getClubMove(legalMoves);
    } else if (difficulty === 'master' && this.stockfish && this.isStockfishReady) {
      return this.getStockfishMoveWithEmotion(15, riskTolerance);
    } else if (difficulty === 'custom' && personality) {
      const move = await this.getPersonalityMoveWithEmotion(legalMoves, personality, riskTolerance);
      return move;
    }

    return this.getStockfishMove(10);
  }

  /**
   * Obtém movimento do livro de aberturas (Fator 3 Neural-X)
   *
   * @param personality - Personalidade da IA para seleção ponderada
   * @returns Movimento do livro ou null se fora do livro
   */
  public getBookMove(personality?: AIPersonality): Move | null {
    const currentFen = this.game.fen();
    
    if (!this.openingBook.isInBook(currentFen)) {
      return null;
    }

    const bookMoveUci = this.openingBook.selectMove(currentFen, personality);
    if (!bookMoveUci) {
      return null;
    }

    // Converte UCI para formato Move
    const from = bookMoveUci.substring(0, 2);
    const to = bookMoveUci.substring(2, 4);
    const promotion = bookMoveUci.length > 4 ? bookMoveUci[4] as PieceType : undefined;

    // Verifica se é legal
    try {
      const moveResult = this.game.move({ from, to, promotion });
      if (moveResult) {
        this.game.undo(); // Desfaz para manter estado
        return {
          from,
          to,
          promotion,
          san: moveResult.san,
          lan: moveResult.lan
        };
      }
    } catch (e) {
      // Movimento inválido - ignora
    }

    return null;
  }

  /**
   * Verifica se a posição atual está no livro de aberturas
   */
  public isInOpeningBook(): boolean {
    return this.openingBook.isInBook(this.game.fen());
  }

  /**
   * Retorna estatísticas do livro de aberturas
   */
  public getOpeningBookStats() {
    return this.openingBook.getStats();
  }

  /**
   * Retorna informações sobre a abertura atual
   */
  public getCurrentOpeningInfo() {
    return this.openingBook.getOpeningInfo(this.game.fen());
  }

  private getBeginnerMove(moves: any[]): Move {
    const captures = moves.filter(m => m.captured);
    if (captures.length > 0 && Math.random() > 0.3) {
      return this.selectRandom(captures);
    }
    return this.selectRandom(moves);
  }

  private getClubMove(moves: any[]): Move {
    const captures = moves.filter(m => m.captured);
    const checks = moves.filter(m => m.san.includes('+'));
    
    if (checks.length > 0 && Math.random() > 0.5) {
      return this.selectRandom(checks);
    }
    if (captures.length > 0 && Math.random() > 0.4) {
      const bestCapture = captures.reduce((best, current) => {
        const currentValue = this.getPieceValue(current.captured);
        const bestValue = this.getPieceValue(best.captured);
        return currentValue > bestValue ? current : best;
      });
      return bestCapture;
    }
    return this.selectRandom(moves);
  }

  private async getStockfishMove(depth: number): Promise<Move | null> {
    if (!this.stockfish || !this.isStockfishReady) {
      return this.getClubMove(this.game.moves({ verbose: true }));
    }

    return new Promise((resolve) => {
      const timeout = setTimeout(() => {
        resolve(this.getClubMove(this.game.moves({ verbose: true })));
      }, 3000);

      this.analysisCallback = (result) => {
        if (result.depth >= depth && result.bestMove) {
          clearTimeout(timeout);
          this.stockfish?.postMessage('stop');
          const move = result.bestMove;
          resolve({
            from: move.substring(0, 2),
            to: move.substring(2, 4),
            promotion: move.length > 4 ? move[4] as any : undefined
          });
        }
      };

      this.stockfish?.postMessage(`position fen ${this.game.fen()}`);
      this.stockfish?.postMessage(`go depth ${depth}`);
    });
  }

  private async getPersonalityMove(moves: any[], personality: AIPersonality): Promise<Move | null> {
    const aggressive = personality.aggressiveness / 100;
    const precision = personality.technicalPrecision / 100;

    const captures = moves.filter(m => m.captured);
    const attacks = moves.filter(m => m.san.includes('x') || m.san.includes('+'));
    
    const random = Math.random();
    
    if (aggressive > 0.7 && attacks.length > 0 && random < aggressive) {
      return this.selectRandom(attacks);
    }
    
    if (aggressive > 0.5 && captures.length > 0 && random < aggressive * 0.8) {
      return this.selectRandom(captures);
    }

    if (precision > 0.8 && this.stockfish && this.isStockfishReady) {
      return this.getStockfishMove(10);
    }

    return this.selectRandom(moves);
  }

  private selectRandom<T>(array: T[]): T {
    return array[Math.floor(Math.random() * array.length)];
  }

  private getPieceValue(type: string): number {
    const values: Record<string, number> = {
      p: 1, n: 3, b: 3, r: 5, q: 9, k: 0
    };
    return values[type.toLowerCase()] || 0;
  }

  public async analyzePosition(
    depth: number = 18,
    callback?: (result: AnalysisResult) => void
  ): Promise<AnalysisResult> {
    if (!this.stockfish || !this.isStockfishReady) {
      console.warn('Stockfish not ready, returning fallback analysis');
      return {
        bestMove: '',
        evaluation: { type: 'cp', value: 0 },
        depth: 0,
        pv: [],
        winRate: 50
      };
    }

    return new Promise((resolve) => {
      let bestResult: AnalysisResult | null = null;
      
      const timeout = setTimeout(() => {
        if (bestResult) {
          resolve(bestResult);
        } else {
          resolve({
            bestMove: '',
            evaluation: { type: 'cp', value: 0 },
            depth: 0,
            pv: [],
            winRate: 50
          });
        }
      }, 5000);

      this.analysisCallback = (result) => {
        bestResult = result;
        if (callback) callback(result);
        if (result.depth >= depth) {
          clearTimeout(timeout);
          this.stockfish?.postMessage('stop');
          resolve(result);
        }
      };

      this.stockfish?.postMessage(`position fen ${this.game.fen()}`);
      this.stockfish?.postMessage(`go depth ${depth}`);
    });
  }

  public getHistory(): Move[] {
    return this.game.history({ verbose: true }).map(m => ({
      from: m.from,
      to: m.to,
      promotion: m.promotion,
      san: m.san,
      lan: m.lan
    }));
  }

  public isGameOver(): boolean {
    return this.game.isGameOver();
  }

  public getPGN(): string {
    return this.game.pgn();
  }

  public loadPGN(pgn: string): boolean {
    try {
      this.game.loadPgn(pgn);
      return true;
    } catch (e) {
      return false;
    }
  }

  /**
   * Obtém avaliação rápida da posição atual (para estado emocional)
   * Retorna centipawns do ponto de vista do jogador ativo
   */
  private async getQuickEvaluation(): Promise<number> {
    // Se Stockfish disponível, usar avaliação rápida
    if (this.stockfish && this.isStockfishReady) {
      try {
        const result = await this.analyzePosition(8);
        if (result.evaluation.type === 'cp') {
          // Converter para perspectiva da IA (negras)
          return this.game.turn() === 'b' ? result.evaluation.value : -result.evaluation.value;
        }
        return result.evaluation.value > 0 ? 1000 : -1000; // Mate
      } catch (e) {
        // Fallback para avaliação material
        return this.getMaterialEvaluation();
      }
    }
    
    // Fallback para avaliação material
    return this.getMaterialEvaluation();
  }

  /**
   * Avaliação material simplificada (fallback)
   */
  private getMaterialEvaluation(): number {
    const board = this.game.board();
    let whiteScore = 0;
    let blackScore = 0;
    
    const pieceValues: Record<string, number> = {
      p: 100, n: 320, b: 330, r: 500, q: 900, k: 0
    };
    
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const piece = board[row][col];
        if (piece) {
          const value = pieceValues[piece.type] || 0;
          if (piece.color === 'w') {
            whiteScore += value;
          } else {
            blackScore += value;
          }
        }
      }
    }
    
    // Retornar do ponto de vista das negras (IA)
    return blackScore - whiteScore;
  }

  /**
   * Obtém movimento do Stockfish considerando estado emocional (risk tolerance)
   */
  private async getStockfishMoveWithEmotion(depth: number, riskTolerance: number): Promise<Move | null> {
    if (!this.stockfish || !this.isStockfishReady) {
      return this.getClubMove(this.game.moves({ verbose: true }));
    }

    return new Promise((resolve) => {
      const timeout = setTimeout(() => {
        resolve(this.getClubMove(this.game.moves({ verbose: true })));
      }, 5000);

      const candidates: Array<{ move: string; eval: number; depth: number }> = [];

      this.analysisCallback = (result) => {
        // Coletar candidatos (PV = principal variation)
        if (result.bestMove && result.depth >= depth - 3) {
          const evalValue = result.evaluation.type === 'cp'
            ? result.evaluation.value
            : (result.evaluation.value > 0 ? 10000 : -10000);
          
          candidates.push({
            move: result.bestMove,
            eval: evalValue,
            depth: result.depth
          });
        }

        if (result.depth >= depth && result.bestMove) {
          clearTimeout(timeout);
          this.stockfish?.postMessage('stop');
          
          // Selecionar movimento baseado no risk tolerance
          const selectedMove = this.selectMoveBasedOnRisk(candidates, riskTolerance);
          
          resolve({
            from: selectedMove.substring(0, 2),
            to: selectedMove.substring(2, 4),
            promotion: selectedMove.length > 4 ? selectedMove[4] as any : undefined
          });
        }
      };

      this.stockfish?.postMessage(`position fen ${this.game.fen()}`);
      this.stockfish?.postMessage(`go depth ${depth} multipv 3`);
    });
  }

  /**
   * Seleciona movimento baseado no risk tolerance
   * - Alto risk tolerance: prefere movimentos com variação (táticos)
   * - Baixo risk tolerance: prefere movimentos sólidos
   */
  private selectMoveBasedOnRisk(
    candidates: Array<{ move: string; eval: number }>,
    riskTolerance: number
  ): string {
    if (candidates.length === 0) return '';
    
    // Ordenar por avaliação
    candidates.sort((a, b) => b.eval - a.eval);
    
    // Risk tolerance alto: pode escolher movimentos menos ótimos mas mais táticos
    if (riskTolerance > 0.7 && candidates.length > 1) {
      // 30% chance de escolher o segundo melhor se risk tolerance alto
      if (Math.random() < 0.3 && candidates[1]) {
        return candidates[1].move;
      }
    }
    
    // Risk tolerance médio: pequena variação
    if (riskTolerance > 0.4 && candidates.length > 2) {
      const index = Math.floor(Math.random() * Math.min(2, candidates.length));
      return candidates[index].move;
    }
    
    // Risk tolerance baixo: sempre o melhor movimento
    return candidates[0].move;
  }

  /**
   * Obtém movimento baseado em personalidade considerando estado emocional
   */
  private async getPersonalityMoveWithEmotion(
    moves: any[],
    personality: AIPersonality,
    riskTolerance: number
  ): Promise<Move | null> {
    const aggressive = personality.aggressiveness / 100;
    const precision = personality.technicalPrecision / 100;

    const captures = moves.filter(m => m.captured);
    const attacks = moves.filter(m => m.san.includes('x') || m.san.includes('+'));
    const checks = moves.filter(m => m.san.includes('+'));
    
    const random = Math.random();
    
    // Risk tolerance alto aumenta chance de ataques/capturas
    const attackThreshold = aggressive * (0.5 + riskTolerance * 0.5);
    
    if (aggressive > 0.6 && attacks.length > 0 && random < attackThreshold) {
      // Risk tolerance alto: pode escolher capturas menos óbvias
      if (riskTolerance > 0.6 && attacks.length > 1) {
        return this.selectRandom(attacks.slice(0, 2));
      }
      return this.selectRandom(attacks);
    }
    
    if (aggressive > 0.4 && captures.length > 0 && random < attackThreshold * 0.8) {
      // Risk tolerance afeta seleção de capturas
      if (riskTolerance > 0.5) {
        // Mais arriscado: qualquer captura
        return this.selectRandom(captures);
      } else {
        // Conservador: melhor captura
        const bestCapture = captures.reduce((best, current) => {
          const currentValue = this.getPieceValue(current.captured);
          const bestValue = this.getPieceValue(best.captured);
          return currentValue > bestValue ? current : best;
        });
        return bestCapture;
      }
    }

    // Xeques em posições desesperadas (risk tolerance alto)
    if (riskTolerance > 0.7 && checks.length > 0) {
      return this.selectRandom(checks);
    }

    if (precision > 0.8 && this.stockfish && this.isStockfishReady) {
      return this.getStockfishMoveWithEmotion(10, riskTolerance);
    }

    return this.selectRandom(moves);
  }

  public destroy(): void {
    if (this.stockfish) {
      try {
        this.stockfish.postMessage('quit');
        this.stockfish.terminate();
      } catch (e) {
        console.warn('Error destroying Stockfish:', e);
      }
      this.stockfish = null;
    }
  }
}

export const createEngine = () => new ChessEngine();
