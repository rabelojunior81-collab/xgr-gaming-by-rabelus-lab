import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft,
  Lightbulb,
  RotateCcw,
  FastForward,
  CheckCircle,
  ChevronRight,
  BookOpen
} from 'lucide-react';
import { useTutorial } from '@shared/hooks/useTutorial';
import { FeedbackOverlay } from '@ui/components/FeedbackOverlay';
import { ChessBoard3D } from '@game/components/ChessBoard3D';
import type { LessonViewerProps } from '@shared/types/tutorial';

/**
 * LessonViewer - Interactive lesson component with board and instructions
 */
export function LessonViewer({ 
  lesson, 
  onBack, 
  onComplete, 
  onNext,
  onPrevious 
}: LessonViewerProps) {
  const {
    loadLesson,
    validateMove,
    requestHint,
    showSolution,
    resetLesson,
    isComplete,
    feedback,
    clearFeedback,
    getCurrentFEN,
    session
  } = useTutorial({ autoLoad: false });

  const [isLoading, setIsLoading] = useState(true);
  const [showingSolution, setShowingSolution] = useState(false);
  const [selectedSquare, setSelectedSquare] = useState<string | null>(null);

  // Load lesson on mount
  useEffect(() => {
    loadLesson(lesson);
    setIsLoading(false);
  }, [lesson, loadLesson]);

  // Handle square click from board
  const handleSquareClick = useCallback((square: string) => {
    if (isComplete || showingSolution) return;
    
    if (selectedSquare) {
      // If a square is already selected, try to make a move
      if (selectedSquare !== square) {
        validateMove({ from: selectedSquare, to: square });
      }
      setSelectedSquare(null);
    } else {
      // Select the square
      setSelectedSquare(square);
    }
  }, [selectedSquare, validateMove, isComplete, showingSolution]);

  // Handle hint request
  const handleHint = useCallback(() => {
    requestHint();
  }, [requestHint]);

  // Handle solution demonstration
  const handleShowSolution = useCallback(async () => {
    setShowingSolution(true);
    await showSolution();
    setShowingSolution(false);
  }, [showSolution]);

  // Handle reset
  const handleReset = useCallback(() => {
    setShowingSolution(false);
    resetLesson();
  }, [resetLesson]);

  // Handle completion
  useEffect(() => {
    if (isComplete && session) {
      onComplete({
        lessonId: lesson.id,
        completed: true,
        attempts: session.attempts,
        hintsUsed: session.hintsUsed,
        timeSpent: session.timeSpent || 0,
        rating: 'completed',
        moveHistory: session.moveHistory
      });
    }
  }, [isComplete, session, lesson.id, onComplete]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto mb-4" />
          <p className="text-slate-400">Carregando lição...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4 lg:p-8">
      {/* Feedback Overlay */}
      <AnimatePresence>
        {feedback && (
          <FeedbackOverlay 
            feedback={feedback} 
            onDismiss={clearFeedback}
          />
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 rounded-lg bg-slate-800 px-4 py-2 text-white hover:bg-slate-700 transition-colors"
          >
            <ChevronLeft className="h-5 w-5" />
            <span className="hidden sm:inline">Voltar</span>
          </button>
          
          <div>
            <h1 className="text-xl lg:text-2xl font-bold text-white">{lesson.title}</h1>
            <p className="text-sm text-slate-400">{lesson.objective}</p>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center gap-2">
          {onPrevious && (
            <button
              onClick={onPrevious}
              className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
              title="Lição anterior"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
          )}
          {onNext && (
            <button
              onClick={onNext}
              className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
              title="Próxima lição"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="grid gap-6 lg:grid-cols-[1fr_320px] xl:grid-cols-[1fr_380px]">
        {/* Left: Interactive Board */}
        <div className="space-y-4">
          <div className="rounded-xl bg-slate-800/50 p-4">
            {/* 3D Chess Board */}
            <div
              className="w-full max-h-[calc(100vh-250px)] aspect-square rounded-lg bg-slate-700 relative overflow-hidden"
              data-testid="chess-board"
            >
              <ChessBoard3D
                externalFen={getCurrentFEN() || lesson.fen}
                externalSelectedSquare={selectedSquare}
                onSquareClick={handleSquareClick}
                cameraPosition={[0, 10, 5]}
              />

              {/* Completion overlay */}
              {isComplete && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute inset-0 bg-emerald-500/20 backdrop-blur-sm flex items-center justify-center z-10"
                >
                  <div className="text-center">
                    <CheckCircle className="h-16 w-16 text-emerald-400 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-white mb-2">Lição Completada!</h3>
                    {session && (
                      <div className="text-slate-200 space-y-1">
                        <p>Tentativas: {session.attempts}</p>
                        <p>Dicas usadas: {session.hintsUsed}</p>
                        <p>Tempo: {Math.floor((session.timeSpent || 0) / 60)}m {(session.timeSpent || 0) % 60}s</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </div>
          </div>

          {/* Controls */}
          <div className="flex gap-3">
            <button
              onClick={handleHint}
              disabled={isComplete || showingSolution}
              className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-amber-500/20 px-4 py-3 text-amber-400 hover:bg-amber-500/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Lightbulb className="h-5 w-5" />
              <span className="hidden sm:inline">Dica</span>
              {session && (
                <span className="text-xs bg-amber-500/30 px-2 py-0.5 rounded-full">
                  {session.hintsUsed}
                </span>
              )}
            </button>
            
            <button
              onClick={handleReset}
              disabled={showingSolution}
              className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-slate-700 px-4 py-3 text-slate-300 hover:bg-slate-600 transition-colors disabled:opacity-50"
            >
              <RotateCcw className="h-5 w-5" />
              <span className="hidden sm:inline">Reiniciar</span>
            </button>
            
            <button
              onClick={handleShowSolution}
              disabled={isComplete || showingSolution}
              className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-indigo-500/20 px-4 py-3 text-indigo-400 hover:bg-indigo-500/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FastForward className="h-5 w-5" />
              <span className="hidden sm:inline">Solução</span>
            </button>
          </div>
        </div>

        {/* Right: Lesson Content */}
        <div className="space-y-4">
          {/* Content Card */}
          <div className="rounded-xl bg-slate-800/50 p-6">
            <div className="flex items-center gap-2 mb-4">
              <BookOpen className="h-5 w-5 text-indigo-400" />
              <h2 className="text-lg font-semibold text-white">Conteúdo</h2>
            </div>
            <p className="text-slate-300 leading-relaxed">
              {lesson.content}
            </p>
          </div>

          {/* Objective Card */}
          <div className="rounded-xl bg-indigo-900/20 border border-indigo-500/30 p-6">
            <h2 className="text-lg font-semibold text-indigo-300 mb-2">Objetivo</h2>
            <p className="text-indigo-200">{lesson.objective}</p>
          </div>

          {/* Stats */}
          {session && (
            <div className="rounded-xl bg-slate-800/30 p-4">
              <h3 className="text-sm font-medium text-slate-400 mb-3">Progresso</h3>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-white">{session.attempts}</p>
                  <p className="text-xs text-slate-500">Tentativas</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{session.hintsUsed}</p>
                  <p className="text-xs text-slate-500">Dicas</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">
                    {Math.floor((session.timeSpent || 0) / 60)}:{((session.timeSpent || 0) % 60).toString().padStart(2, '0')}
                  </p>
                  <p className="text-xs text-slate-500">Tempo</p>
                </div>
              </div>
            </div>
          )}

          {/* Next/Continue Button */}
          {isComplete && onNext && (
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={onNext}
              className="w-full flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-6 py-4 text-white font-semibold hover:bg-emerald-700 transition-colors"
            >
              <span>Próxima Lição</span>
              <ChevronRight className="h-5 w-5" />
            </motion.button>
          )}
        </div>
      </div>
    </div>
  );
}

export default LessonViewer;
