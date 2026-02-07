import { useState, useCallback, useRef, useEffect } from 'react';
import { TutorialEngine } from '@/engine/tutorialEngine';
import { useTutorialStore } from '@/store/tutorialStore';
import type { Move } from '@/types/chess';
import type {
  TutorialLesson,
  MoveValidationResult,
  FeedbackState,
  LessonResult,
  UseTutorialConfig,
  UseTutorialReturn
} from '@/types/tutorial';

/**
 * Hook for managing tutorial state and interactions
 * Provides a clean interface for components to interact with the tutorial system
 */
export function useTutorial(config: UseTutorialConfig = {}): UseTutorialReturn {
  const { autoLoad = true, persistProgress = true } = config;
  
  // Store state
  const {
    modules,
    completedLessons,
    lessonStats,
    markLessonComplete: storeMarkComplete
  } = useTutorialStore();

  // Local state
  const [currentLesson, setCurrentLesson] = useState<TutorialLesson | null>(null);
  const [sessionState, setSessionState] = useState<{
    attempts: number;
    hintsUsed: number;
    startTime: number;
    moveHistory: Move[];
    timeSpent: number;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [feedback, setFeedback] = useState<FeedbackState | null>(null);
  const [isComplete, setIsComplete] = useState(false);

  // Engine reference
  const engineRef = useRef<TutorialEngine | null>(null);
  const sessionRef = useRef<{
    attempts: number;
    hintsUsed: number;
    startTime: number;
    moveHistory: Move[];
  } | null>(null);

  /**
   * Load a lesson
   */
  const loadLesson = useCallback((lesson: TutorialLesson) => {
    setIsLoading(true);
    setError(null);
    setFeedback(null);
    setIsComplete(false);

    try {
      // Dispose previous engine
      if (engineRef.current) {
        engineRef.current.dispose();
      }

      // Create new engine
      engineRef.current = new TutorialEngine({
        lesson,
        onMoveValidation: (result) => {
          if (result.feedback) {
            setFeedback({
              type: result.isSolution ? 'success' : result.isAlternative ? 'info' : 'warning',
              message: result.feedback
            });
          }
        },
        onLessonComplete: (stats) => {
          setIsComplete(true);
          if (persistProgress) {
            storeMarkComplete(lesson.id, {
              attempts: stats.attempts,
              hintsUsed: stats.hintsUsed,
              timeSpent: stats.timeSpent,
              rating: stats.rating
            });
          }
        },
        onHintRequested: (hint, level) => {
          setFeedback({
            type: 'hint',
            message: `Dica ${level + 1}: ${hint}`
          });
        },
        onFeedback: (fb) => {
          setFeedback(fb);
        }
      });

      // Initialize session tracking
      const startTime = Date.now();
      sessionRef.current = {
        attempts: 0,
        hintsUsed: 0,
        startTime,
        moveHistory: []
      };
      setSessionState({
        attempts: 0,
        hintsUsed: 0,
        startTime,
        moveHistory: [],
        timeSpent: 0
      });

      setCurrentLesson(lesson);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to load lesson'));
    } finally {
      setIsLoading(false);
    }
  }, [persistProgress, storeMarkComplete]);

  /**
   * Validate a move
   */
  const validateMove = useCallback((move: Move): MoveValidationResult => {
    if (!engineRef.current) {
      return {
        valid: false,
        isSolution: false,
        isAlternative: false,
        error: 'ENGINE_NOT_INITIALIZED'
      };
    }

    // Track in session
    if (sessionRef.current) {
      sessionRef.current.attempts++;
      sessionRef.current.moveHistory.push(move);
      setSessionState(prev => prev ? {
        ...prev,
        attempts: sessionRef.current!.attempts,
        moveHistory: sessionRef.current!.moveHistory,
        timeSpent: Math.floor((Date.now() - sessionRef.current!.startTime) / 1000)
      } : null);
    }

    return engineRef.current.validateMove(move);
  }, []);

  /**
   * Request a hint
   */
  const requestHint = useCallback((): string | null => {
    if (!engineRef.current) return null;
    
    const hint = engineRef.current.getHint();
    
    if (hint && sessionRef.current) {
      sessionRef.current.hintsUsed++;
      setSessionState(prev => prev ? {
        ...prev,
        hintsUsed: sessionRef.current!.hintsUsed,
        timeSpent: Math.floor((Date.now() - sessionRef.current!.startTime) / 1000)
      } : null);
    }
    
    return hint;
  }, []);

  /**
   * Show the solution
   */
  const showSolution = useCallback(async (): Promise<void> => {
    if (!engineRef.current) return;
    
    setIsLoading(true);
    try {
      await engineRef.current.showSolution();
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to show solution'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Reset the current lesson
   */
  const resetLesson = useCallback((): void => {
    if (!engineRef.current || !currentLesson) return;
    
    engineRef.current.resetLesson();
    setIsComplete(false);
    setFeedback(null);
    
    // Reset session
    const startTime = Date.now();
    sessionRef.current = {
      attempts: 0,
      hintsUsed: 0,
      startTime,
      moveHistory: []
    };
    setSessionState({
      attempts: 0,
      hintsUsed: 0,
      startTime,
      moveHistory: [],
      timeSpent: 0
    });
  }, [currentLesson]);

  /**
   * Skip the current lesson
   */
  const skipLesson = useCallback((): void => {
    if (!currentLesson) return;
    
    // Mark as completed with minimal stats
    if (persistProgress) {
      storeMarkComplete(currentLesson.id, {
        attempts: 1,
        hintsUsed: 0,
        timeSpent: 0,
        rating: 'completed'
      });
    }
    
    setIsComplete(true);
  }, [currentLesson, persistProgress, storeMarkComplete]);

  /**
   * Clear current feedback
   */
  const clearFeedback = useCallback((): void => {
    setFeedback(null);
  }, []);

  /**
   * Get current session info
   */
  const getSession = useCallback(() => {
    if (!sessionRef.current || !currentLesson) return null;
    
    const timeSpent = Math.floor((Date.now() - sessionRef.current.startTime) / 1000);
    
    return {
      lesson: currentLesson,
      attempts: sessionRef.current.attempts,
      hintsUsed: sessionRef.current.hintsUsed,
      startTime: sessionRef.current.startTime,
      timeSpent,
      isComplete,
      moveHistory: sessionRef.current.moveHistory,
      currentHintLevel: 0
    };
  }, [currentLesson, isComplete]);

  /**
   * Get legal moves for a square
   */
  const getLegalMoves = useCallback((square: string): string[] => {
    if (!engineRef.current) return [];
    return engineRef.current.getLegalMoves(square);
  }, []);

  /**
   * Get current FEN position
   */
  const getCurrentFEN = useCallback((): string => {
    if (!engineRef.current) return '';
    return engineRef.current.getCurrentFEN();
  }, []);

  /**
   * Cleanup on unmount
   */
  useEffect(() => {
    return () => {
      if (engineRef.current) {
        engineRef.current.dispose();
        engineRef.current = null;
      }
    };
  }, []);

  /**
   * Auto-load lesson if specified
   */
  useEffect(() => {
    if (autoLoad && config.lessonId && !currentLesson) {
      // Find lesson across all modules
      for (const module of modules) {
        const lesson = module.lessons.find(l => l.id === config.lessonId);
        if (lesson) {
          loadLesson(lesson);
          break;
        }
      }
    }
  }, [autoLoad, config.lessonId, modules, currentLesson, loadLesson]);

  // Build progress object
  const progress = {
    currentModuleId: null,
    currentLessonId: currentLesson?.id || null,
    completedLessons,
    moduleProgress: modules.reduce((acc, module) => {
      const completed = module.lessons.filter(l => completedLessons.includes(l.id)).length;
      acc[module.id] = module.lessons.length > 0 
        ? Math.round((completed / module.lessons.length) * 100)
        : 0;
      return acc;
    }, {} as Record<string, number>),
    totalProgress: modules.reduce((sum, module) => {
      const completed = module.lessons.filter(l => completedLessons.includes(l.id)).length;
      return sum + completed;
    }, 0) / modules.reduce((sum, m) => sum + m.lessons.length, 0) * 100 || 0,
    stats: lessonStats,
    lastAccessed: new Date()
  };

  return {
    currentLesson,
    session: getSession(),
    progress,
    isLoading,
    error,
    validateMove,
    requestHint,
    showSolution,
    resetLesson,
    skipLesson,
    isComplete,
    feedback,
    clearFeedback,
    // Additional utilities
    loadLesson,
    getLegalMoves,
    getCurrentFEN
  } as UseTutorialReturn;
}

export default useTutorial;
