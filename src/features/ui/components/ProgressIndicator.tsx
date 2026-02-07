import { motion } from 'framer-motion';
import { CheckCircle, Lock, Circle, Trophy } from 'lucide-react';
import type { ProgressIndicatorProps } from '@shared/types/tutorial';
import { useTutorialStore } from '@tutorial/store/tutorialStore';

/**
 * ProgressIndicator - Shows tutorial progress across modules
 * Can be displayed in compact or full mode
 */
export function ProgressIndicator({ 
  modules, 
  currentModuleId, 
  compact = false,
  showPercentages = true 
}: ProgressIndicatorProps) {
  const { getModuleProgress, getTotalProgress, completedLessons } = useTutorialStore();

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <div className="flex-1 h-2 bg-slate-700 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${getTotalProgress()}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"
          />
        </div>
        <span className="text-sm text-slate-400 whitespace-nowrap">
          {Math.round(getTotalProgress())}%
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Total Progress */}
      <div className="bg-slate-800/50 rounded-xl p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-slate-300">Progresso Total</h3>
          <div className="flex items-center gap-2">
            <Trophy className="h-4 w-4 text-amber-400" />
            <span className="text-lg font-bold text-white">
              {Math.round(getTotalProgress())}%
            </span>
          </div>
        </div>
        <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${getTotalProgress()}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"
          />
        </div>
        <p className="mt-2 text-xs text-slate-500">
          {completedLessons.length} de {modules.reduce((sum, m) => sum + m.lessons.length, 0)} lições completadas
        </p>
      </div>

      {/* Module Progress */}
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-slate-400 mb-3">Módulos</h3>
        {modules.map((module, index) => {
          const progress = getModuleProgress(module.id);
          const isCurrent = module.id === currentModuleId;
          const isLocked = module.locked;
          const isCompleted = module.completed;

          return (
            <motion.div
              key={module.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`
                relative p-3 rounded-lg transition-all
                ${isCurrent ? 'bg-indigo-500/20 ring-1 ring-indigo-500/50' : 'bg-slate-800/30'}
                ${isLocked ? 'opacity-60' : ''}
              `}
            >
              <div className="flex items-center gap-3">
                {/* Status Icon */}
                <div className={`
                  flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center
                  ${isCompleted ? 'bg-emerald-500/20' : 
                    isLocked ? 'bg-slate-700' : 
                    isCurrent ? 'bg-indigo-500/30' : 'bg-slate-700'}
                `}>
                  {isCompleted ? (
                    <CheckCircle className="h-4 w-4 text-emerald-400" />
                  ) : isLocked ? (
                    <Lock className="h-4 w-4 text-slate-500" />
                  ) : (
                    <Circle className={`h-4 w-4 ${isCurrent ? 'text-indigo-400' : 'text-slate-500'}`} />
                  )}
                </div>

                {/* Module Info */}
                <div className="flex-1 min-w-0">
                  <h4 className={`
                    text-sm font-medium truncate
                    ${isCurrent ? 'text-indigo-300' : 'text-slate-300'}
                  `}>
                    {module.title}
                  </h4>
                  <p className="text-xs text-slate-500">
                    Elo: {module.eloRange[0]}-{module.eloRange[1]}
                  </p>
                </div>

                {/* Progress */}
                {showPercentages && !isLocked && (
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-1.5 bg-slate-700 rounded-full overflow-hidden">
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
                    <span className="text-xs text-slate-400 w-8 text-right">
                      {progress}%
                    </span>
                  </div>
                )}
              </div>

              {/* Lesson count */}
              <div className="mt-2 flex items-center gap-1 pl-11">
                <span className="text-xs text-slate-500">
                  {module.lessons.filter(l => completedLessons.includes(l.id)).length} / {module.lessons.length} lições
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

export default ProgressIndicator;
