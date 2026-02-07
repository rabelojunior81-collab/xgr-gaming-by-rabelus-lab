import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, 
  BookOpen, 
  CheckCircle, 
  Lock, 
  Play, 
  Trophy,
  Target,
  Clock,
  Lightbulb
} from 'lucide-react';
import { useTutorialStore } from '@/store/tutorialStore';
import { ProgressIndicator } from './ProgressIndicator';
import { LessonViewer } from './LessonViewer';
import type { TutorialModule, TutorialLesson } from '@/types/tutorial';
import type { TutorialPanelProps } from '@/types/tutorial';

/**
 * TutorialPanel - Main tutorial container with module/lesson navigation
 */
export function TutorialPanel({ onExit, onLessonSelect, initialModuleId }: TutorialPanelProps) {
  const { 
    modules, 
    initializeModules,
    getModuleProgress,
    completedLessons,
    getNextLesson,
    getPrevLesson
  } = useTutorialStore();

  const [selectedModule, setSelectedModule] = useState<TutorialModule | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<TutorialLesson | null>(null);
  const [view, setView] = useState<'modules' | 'lessons' | 'lesson'>('modules');

  // Initialize modules on mount (only once)
  useEffect(() => {
    initializeModules();
  }, []);
  
  // Auto-select initial module if provided
  useEffect(() => {
    if (initialModuleId && modules.length > 0) {
      const module = modules.find(m => m.id === initialModuleId);
      if (module) {
        setSelectedModule(module);
        setView('lessons');
      }
    }
  }, [initialModuleId, modules]);

  // Handle module selection
  const handleModuleSelect = (module: TutorialModule) => {
    if (module.locked) return;
    setSelectedModule(module);
    setView('lessons');
  };

  // Handle lesson selection
  const handleLessonSelect = (lesson: TutorialLesson) => {
    setSelectedLesson(lesson);
    setView('lesson');
    onLessonSelect?.(lesson);
  };

  // Handle lesson completion
  const handleLessonComplete = (result: { lessonId: string; completed: boolean }) => {
    // Return to lessons view
    setView('lessons');
    setSelectedLesson(null);
  };

  // Handle back navigation
  const handleBack = () => {
    if (view === 'lesson') {
      setView('lessons');
      setSelectedLesson(null);
    } else if (view === 'lessons') {
      setView('modules');
      setSelectedModule(null);
    } else {
      onExit();
    }
  };

  // Handle next lesson
  const handleNextLesson = () => {
    if (!selectedLesson) return;
    
    const next = getNextLesson(selectedLesson.id);
    if (next) {
      handleLessonSelect(next);
    } else {
      // Return to lessons if no next
      setView('lessons');
      setSelectedLesson(null);
    }
  };

  // Handle previous lesson
  const handlePrevLesson = () => {
    if (!selectedLesson) return;
    
    const prev = getPrevLesson(selectedLesson.id);
    if (prev) {
      handleLessonSelect(prev);
    }
  };

  // Render module list view
  const renderModules = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">XGR Tutor</h2>
          <p className="text-slate-400">Escolha um módulo para começar</p>
        </div>
        <button
          onClick={onExit}
          className="flex items-center gap-2 rounded-lg bg-slate-800 px-4 py-2 text-white hover:bg-slate-700 transition-colors"
        >
          <ChevronLeft className="h-5 w-5" />
          Sair
        </button>
      </div>

      {/* Progress */}
      <ProgressIndicator modules={modules} compact={false} />

      {/* Module Grid */}
      <div className="grid gap-4 md:grid-cols-2">
        {modules.map((module, index) => {
          const progress = getModuleProgress(module.id);
          const isLocked = module.locked;
          const isCompleted = module.completed;

          return (
            <motion.div
              key={module.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => handleModuleSelect(module)}
              className={`
                relative p-6 rounded-2xl transition-all
                ${isLocked 
                  ? 'bg-slate-800/30 cursor-not-allowed opacity-60' 
                  : 'bg-slate-800/50 cursor-pointer hover:bg-slate-800 hover:scale-[1.02]'
                }
              `}
            >
              {/* Lock overlay */}
              {isLocked && (
                <div className="absolute inset-0 flex items-center justify-center bg-slate-900/50 rounded-2xl">
                  <Lock className="h-8 w-8 text-slate-600" />
                </div>
              )}

              <div className="flex items-start justify-between mb-4">
                <div className={`
                  flex h-12 w-12 items-center justify-center rounded-xl
                  ${isCompleted ? 'bg-emerald-500/20' : 'bg-indigo-500/20'}
                `}>
                  {isCompleted ? (
                    <Trophy className="h-6 w-6 text-emerald-400" />
                  ) : (
                    <BookOpen className="h-6 w-6 text-indigo-400" />
                  )}
                </div>
                
                {isCompleted && (
                  <CheckCircle className="h-6 w-6 text-emerald-400" />
                )}
              </div>

              <h3 className="text-xl font-semibold text-white mb-2">
                {module.title}
              </h3>
              <p className="text-slate-400 text-sm mb-4">
                {module.description}
              </p>

              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">
                  Elo: {module.eloRange[0]}-{module.eloRange[1]}
                </span>
                <span className="text-slate-500">
                  {module.lessons.length} lições
                </span>
              </div>

              {/* Progress bar */}
              <div className="mt-4 h-2 bg-slate-700 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className={`
                    h-full rounded-full
                    ${isCompleted ? 'bg-emerald-500' : 'bg-indigo-500'}
                  `}
                />
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );

  // Render lesson list view
  const renderLessons = () => {
    if (!selectedModule) return null;

    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 rounded-lg bg-slate-800 px-4 py-2 text-white hover:bg-slate-700 transition-colors"
          >
            <ChevronLeft className="h-5 w-5" />
            Voltar
          </button>
          <div>
            <h2 className="text-2xl font-bold text-white">{selectedModule.title}</h2>
            <p className="text-slate-400">{selectedModule.description}</p>
          </div>
        </div>

        {/* Module Progress */}
        <div className="bg-slate-800/30 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-400">Progresso do Módulo</span>
            <span className="text-sm font-medium text-white">
              {getModuleProgress(selectedModule.id)}%
            </span>
          </div>
          <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${getModuleProgress(selectedModule.id)}%` }}
              className="h-full bg-indigo-500 rounded-full"
            />
          </div>
        </div>

        {/* Lesson List */}
        <div className="space-y-3">
          {selectedModule.lessons.map((lesson, index) => {
            const isCompleted = completedLessons.includes(lesson.id);
            const isAvailable = index === 0 || completedLessons.includes(selectedModule.lessons[index - 1]?.id);

            return (
              <motion.div
                key={lesson.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => isAvailable && handleLessonSelect(lesson)}
                className={`
                  flex items-center gap-4 p-4 rounded-xl transition-all
                  ${isCompleted 
                    ? 'bg-emerald-500/10 border border-emerald-500/30' 
                    : isAvailable
                      ? 'bg-slate-800/50 hover:bg-slate-800 cursor-pointer'
                      : 'bg-slate-800/30 opacity-50 cursor-not-allowed'
                  }
                `}
              >
                <div className={`
                  flex h-10 w-10 items-center justify-center rounded-lg
                  ${isCompleted ? 'bg-emerald-500/20' : isAvailable ? 'bg-indigo-500/20' : 'bg-slate-700'}
                `}>
                  {isCompleted ? (
                    <CheckCircle className="h-5 w-5 text-emerald-400" />
                  ) : !isAvailable ? (
                    <Lock className="h-5 w-5 text-slate-500" />
                  ) : (
                    <span className="text-indigo-400 font-medium">{index + 1}</span>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className={`
                    font-medium truncate
                    ${isCompleted ? 'text-emerald-300' : 'text-white'}
                  `}>
                    {lesson.title}
                  </h3>
                  <p className="text-sm text-slate-400 truncate">
                    {lesson.objective}
                  </p>
                </div>

                {isAvailable && !isCompleted && (
                  <Play className="h-5 w-5 text-slate-500" />
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    );
  };

  // Render lesson view
  const renderLesson = () => {
    if (!selectedLesson) return null;

    return (
      <LessonViewer
        lesson={selectedLesson}
        onBack={handleBack}
        onComplete={handleLessonComplete}
        onNext={handleNextLesson}
        onPrevious={handlePrevLesson}
      />
    );
  };

  return (
    <div className="h-screen overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4 lg:p-8">
      <AnimatePresence mode="wait">
        {view === 'modules' && (
          <motion.div
            key="modules"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="h-full overflow-y-auto"
          >
            {renderModules()}
          </motion.div>
        )}
        
        {view === 'lessons' && (
          <motion.div
            key="lessons"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="h-full overflow-y-auto"
          >
            {renderLessons()}
          </motion.div>
        )}
        
        {view === 'lesson' && selectedLesson && (
          <motion.div
            key="lesson"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="h-full overflow-y-auto"
          >
            {renderLesson()}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default TutorialPanel;
