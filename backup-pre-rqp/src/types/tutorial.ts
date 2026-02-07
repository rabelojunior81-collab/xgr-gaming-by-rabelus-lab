import type { Move } from './chess';

/**
 * Types for Interactive Tutorial System
 * Sprint 2.2: Tutoriais Interativos
 */

/** Represents a lesson with interactive board */
export interface TutorialLesson {
  id: string;
  title: string;
  description: string;
  content: string;
  fen: string;
  objective: string;
  hints: string[];
  solution: string[]; // UCI format moves
  explanation?: string; // Explanation of the solution
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  completed: boolean;
  nextLesson?: string;
  prevLesson?: string;
}

/** Represents a module containing multiple lessons */
export interface TutorialModule {
  id: string;
  title: string;
  description: string;
  eloRange: [number, number];
  lessons: TutorialLesson[];
  completed: boolean;
  locked: boolean;
  icon?: string;
}

/** Statistics for a completed lesson */
export interface LessonStats {
  lessonId: string;
  attempts: number;
  hintsUsed: number;
  timeSpent: number; // in seconds
  completedAt: Date;
  rating: 'perfect' | 'good' | 'completed';
}

/** Progress tracking for the entire tutorial system */
export interface TutorialProgress {
  currentModuleId: string | null;
  currentLessonId: string | null;
  completedLessons: string[];
  moduleProgress: Record<string, number>; // percentage 0-100
  totalProgress: number; // percentage 0-100
  stats: Record<string, LessonStats>;
  lastAccessed: Date;
}

/** Result of validating a move in tutorial mode */
export interface MoveValidationResult {
  valid: boolean;
  isSolution: boolean;
  isAlternative: boolean;
  error?: string;
  feedback?: string;
  hint?: string;
}

/** State of the current lesson session */
export interface LessonSession {
  lesson: TutorialLesson;
  attempts: number;
  hintsUsed: number;
  startTime: number;
  timeSpent: number; // in seconds
  isComplete: boolean;
  moveHistory: Move[];
  currentHintLevel: number;
}

/** Feedback types for visual indicators */
export type FeedbackType = 'success' | 'error' | 'hint' | 'info' | 'warning';

/** Feedback state for UI components */
export interface FeedbackState {
  type: FeedbackType;
  message: string;
  highlightSquares?: string[];
  autoDismiss?: number; // milliseconds
}

/** Configuration for TutorialEngine */
export interface TutorialEngineConfig {
  lesson: TutorialLesson;
  onMoveValidation?: (result: MoveValidationResult, move: Move) => void;
  onLessonComplete?: (stats: LessonStats) => void;
  onHintRequested?: (hint: string, level: number) => void;
  onFeedback?: (feedback: FeedbackState) => void;
}

/** Result of completing a lesson */
export interface LessonResult {
  lessonId: string;
  completed: boolean;
  attempts: number;
  hintsUsed: number;
  timeSpent: number;
  rating: 'perfect' | 'good' | 'completed';
  moveHistory: Move[];
}

/** Props for TutorialPanel component */
export interface TutorialPanelProps {
  onExit: () => void;
  onLessonSelect: (lesson: TutorialLesson) => void;
  initialModuleId?: string;
}

/** Props for LessonViewer component */
export interface LessonViewerProps {
  lesson: TutorialLesson;
  onBack: () => void;
  onComplete: (result: LessonResult) => void;
  onNext?: () => void;
  onPrevious?: () => void;
}

/** Props for ProgressIndicator component */
export interface ProgressIndicatorProps {
  modules: TutorialModule[];
  currentModuleId?: string;
  compact?: boolean;
  showPercentages?: boolean;
}

/** Props for FeedbackOverlay component */
export interface FeedbackOverlayProps {
  feedback: FeedbackState;
  onDismiss?: () => void;
}

/** Configuration for useTutorial hook */
export interface UseTutorialConfig {
  lessonId?: string;
  autoLoad?: boolean;
  persistProgress?: boolean;
}

/** Return type for useTutorial hook */
export interface UseTutorialReturn {
  currentLesson: TutorialLesson | null;
  session: LessonSession | null;
  progress: TutorialProgress;
  isLoading: boolean;
  error: Error | null;
  validateMove: (move: Move) => MoveValidationResult;
  requestHint: () => string | null;
  showSolution: () => Promise<void>;
  resetLesson: () => void;
  skipLesson: () => void;
  isComplete: boolean;
  feedback: FeedbackState | null;
  clearFeedback: () => void;
  // Additional utilities
  loadLesson: (lesson: TutorialLesson) => void;
  getLegalMoves: (square: string) => string[];
  getCurrentFEN: () => string;
}

/** Extended lesson session with computed timeSpent */
export interface LessonSessionWithStats extends LessonSession {
  timeSpent: number;
}

/** Tutorial view states */
export type TutorialView = 'modules' | 'lessons' | 'lesson' | 'completed';

/** Navigation state for tutorial */
export interface TutorialNavigation {
  view: TutorialView;
  selectedModule: TutorialModule | null;
  selectedLesson: TutorialLesson | null;
  canGoBack: boolean;
  canGoNext: boolean;
}

/** Extended lesson data with UI metadata */
export interface LessonMetadata {
  estimatedTime: number; // minutes
  difficultyLabel: string;
  prerequisites: string[];
  tags: string[];
  reward?: string;
}

/** Achievement/Badge for tutorial completion */
export interface TutorialAchievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: Date;
  condition: {
    type: 'complete_lesson' | 'complete_module' | 'perfect_score' | 'no_hints';
    target: string;
  };
}
