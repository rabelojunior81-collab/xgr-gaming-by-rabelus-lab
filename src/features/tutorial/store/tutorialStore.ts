import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { TutorialModule, TutorialLesson, LessonStats } from '@shared/types/tutorial';
import { tutorialModules } from '@tutorial/data/tutorials';

interface TutorialStore {
  // State
  modules: TutorialModule[];
  currentModuleId: string | null;
  currentLessonId: string | null;
  completedLessons: string[];
  lessonStats: Record<string, LessonStats>;
  
  // Actions
  initializeModules: () => void;
  setCurrentModule: (id: string) => void;
  setCurrentLesson: (id: string) => void;
  markLessonComplete: (lessonId: string, stats: Omit<LessonStats, 'lessonId' | 'completedAt'>) => void;
  getModuleProgress: (moduleId: string) => number;
  getTotalProgress: () => number;
  isLessonAvailable: (lessonId: string) => boolean;
  isModuleAvailable: (moduleId: string) => boolean;
  getNextLesson: (currentLessonId: string) => TutorialLesson | null;
  getPrevLesson: (currentLessonId: string) => TutorialLesson | null;
  resetProgress: () => void;
  getLessonStats: (lessonId: string) => LessonStats | null;
  getCompletedCount: () => number;
  getTotalLessons: () => number;
}

/**
 * Convert legacy tutorial data to new format
 */
function convertToNewFormat(modules: typeof tutorialModules): TutorialModule[] {
  return modules.map((module, index) => ({
    ...module,
    locked: index > 0, // First module unlocked, others locked
    lessons: module.lessons.map(lesson => ({
      ...lesson,
      description: lesson.content.substring(0, 100) + '...',
      difficulty: index === 0 ? 'beginner' : index === 1 ? 'intermediate' : 'advanced',
      nextLesson: undefined,
      prevLesson: undefined
    }))
  }));
}

export const useTutorialStore = create<TutorialStore>()(
  persist(
    (set, get) => ({
      // Initial state
      modules: convertToNewFormat(tutorialModules),
      currentModuleId: null,
      currentLessonId: null,
      completedLessons: [],
      lessonStats: {},

      /**
       * Initialize/reset modules from source data
       */
      initializeModules: () => {
        const { completedLessons } = get();
        const modules = convertToNewFormat(tutorialModules);
        
        // Update completion status from stored data
        modules.forEach(module => {
          module.lessons.forEach(lesson => {
            lesson.completed = completedLessons.includes(lesson.id);
          });
          module.completed = module.lessons.every(l => l.completed);
        });

        // Update locked status based on completion
        modules.forEach((module, index) => {
          if (index === 0) {
            module.locked = false;
          } else {
            module.locked = !modules[index - 1].completed;
          }
        });

        set({ modules });
      },

      /**
       * Set current module
       */
      setCurrentModule: (id) => {
        set({ currentModuleId: id, currentLessonId: null });
      },

      /**
       * Set current lesson
       */
      setCurrentLesson: (id) => {
        set({ currentLessonId: id });
      },

      /**
       * Mark a lesson as complete
       */
      markLessonComplete: (lessonId, stats) => {
        const { modules, completedLessons, lessonStats } = get();
        
        // Update completed lessons list
        const newCompletedLessons = completedLessons.includes(lessonId)
          ? completedLessons
          : [...completedLessons, lessonId];

        // Update lesson stats
        const newStats: LessonStats = {
          lessonId,
          ...stats,
          completedAt: new Date()
        };

        // Update modules
        const newModules = modules.map((module) => {
          const newLessons = module.lessons.map(lesson => {
            if (lesson.id === lessonId) {
              return { ...lesson, completed: true };
            }
            return lesson;
          });

          const moduleCompleted = newLessons.every(l => l.completed);
          
          return {
            ...module,
            lessons: newLessons,
            completed: moduleCompleted
          };
        });

        // Update locked status
        newModules.forEach((module, index) => {
          if (index === 0) {
            module.locked = false;
          } else {
            module.locked = !newModules[index - 1].completed;
          }
        });

        set({
          modules: newModules,
          completedLessons: newCompletedLessons,
          lessonStats: { ...lessonStats, [lessonId]: newStats }
        });
      },

      /**
       * Get progress percentage for a module
       */
      getModuleProgress: (moduleId) => {
        const { modules, completedLessons } = get();
        const module = modules.find(m => m.id === moduleId);
        
        if (!module || module.lessons.length === 0) return 0;
        
        const completedCount = module.lessons.filter(l => 
          completedLessons.includes(l.id)
        ).length;
        
        return Math.round((completedCount / module.lessons.length) * 100);
      },

      /**
       * Get total progress across all modules
       */
      getTotalProgress: () => {
        const { modules, completedLessons } = get();
        
        const totalLessons = modules.reduce((sum, m) => sum + m.lessons.length, 0);
        if (totalLessons === 0) return 0;
        
        return Math.round((completedLessons.length / totalLessons) * 100);
      },

      /**
       * Check if a lesson is available (not locked)
       */
      isLessonAvailable: (lessonId) => {
        const { modules, completedLessons } = get();
        
        for (const module of modules) {
          const lessonIndex = module.lessons.findIndex(l => l.id === lessonId);
          if (lessonIndex === -1) continue;
          
          // First lesson of first module is always available
          if (module.id === 'fundamentals' && lessonIndex === 0) return true;
          
          // Check if previous lesson is completed
          if (lessonIndex > 0) {
            const prevLesson = module.lessons[lessonIndex - 1];
            return completedLessons.includes(prevLesson.id);
          }
          
          // First lesson of other modules - check if previous module is completed
          const moduleIndex = modules.findIndex(m => m.id === module.id);
          if (moduleIndex > 0) {
            return modules[moduleIndex - 1].completed;
          }
        }
        
        return false;
      },

      /**
       * Check if a module is available
       */
      isModuleAvailable: (moduleId) => {
        const { modules } = get();
        const moduleIndex = modules.findIndex(m => m.id === moduleId);
        
        if (moduleIndex === -1) return false;
        if (moduleIndex === 0) return true;
        
        return modules[moduleIndex - 1].completed;
      },

      /**
       * Get next lesson
       */
      getNextLesson: (currentLessonId) => {
        const { modules } = get();
        
        for (const module of modules) {
          const lessonIndex = module.lessons.findIndex(l => l.id === currentLessonId);
          if (lessonIndex === -1) continue;
          
          // Next lesson in same module
          if (lessonIndex < module.lessons.length - 1) {
            return module.lessons[lessonIndex + 1];
          }
          
          // First lesson of next module
          const moduleIndex = modules.findIndex(m => m.id === module.id);
          if (moduleIndex < modules.length - 1) {
            const nextModule = modules[moduleIndex + 1];
            if (nextModule.lessons.length > 0) {
              return nextModule.lessons[0];
            }
          }
        }
        
        return null;
      },

      /**
       * Get previous lesson
       */
      getPrevLesson: (currentLessonId) => {
        const { modules } = get();
        
        for (const module of modules) {
          const lessonIndex = module.lessons.findIndex(l => l.id === currentLessonId);
          if (lessonIndex === -1) continue;
          
          // Previous lesson in same module
          if (lessonIndex > 0) {
            return module.lessons[lessonIndex - 1];
          }
          
          // Last lesson of previous module
          const moduleIndex = modules.findIndex(m => m.id === module.id);
          if (moduleIndex > 0) {
            const prevModule = modules[moduleIndex - 1];
            if (prevModule.lessons.length > 0) {
              return prevModule.lessons[prevModule.lessons.length - 1];
            }
          }
        }
        
        return null;
      },

      /**
       * Reset all progress
       */
      resetProgress: () => {
        const modules = convertToNewFormat(tutorialModules);
        set({
          modules,
          currentModuleId: null,
          currentLessonId: null,
          completedLessons: [],
          lessonStats: {}
        });
      },

      /**
       * Get stats for a specific lesson
       */
      getLessonStats: (lessonId) => {
        const { lessonStats } = get();
        return lessonStats[lessonId] || null;
      },

      /**
       * Get count of completed lessons
       */
      getCompletedCount: () => {
        return get().completedLessons.length;
      },

      /**
       * Get total number of lessons
       */
      getTotalLessons: () => {
        return get().modules.reduce((sum, m) => sum + m.lessons.length, 0);
      }
    }),
    {
      name: 'chess-xgr-tutorial-progress',
      version: 1,
      partialize: (state) => ({
        completedLessons: state.completedLessons,
        lessonStats: state.lessonStats
      })
    }
  )
);

export default useTutorialStore;
