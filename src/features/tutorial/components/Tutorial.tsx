import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, BookOpen, CheckCircle, Lock, Play, Lightbulb } from 'lucide-react';
import { useGameStore } from '@game/store/gameStore';
import { tutorialModules } from '@tutorial/data/tutorials';
import { useState } from 'react';
import type { TutorialModule, Lesson } from '@shared/types/chess';

export function Tutorial() {
  const { setView } = useGameStore();
  const [selectedModule, setSelectedModule] = useState<TutorialModule | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  
  if (selectedLesson) {
    return (
      <LessonView 
        lesson={selectedLesson}
        onBack={() => setSelectedLesson(null)}
      />
    );
  }
  
  if (selectedModule) {
    return (
      <ModuleView 
        module={selectedModule}
        onBack={() => setSelectedModule(null)}
        onSelectLesson={setSelectedLesson}
      />
    );
  }
  
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8">
      {/* Header */}
      <div className="mb-8 flex items-center gap-4">
        <button
          onClick={() => setView('menu')}
          className="flex items-center gap-2 rounded-lg bg-slate-800 px-4 py-2 text-white hover:bg-slate-700"
        >
          <ChevronLeft className="h-5 w-5" />
          Voltar
        </button>
        <h1 className="text-3xl font-bold text-white">XGR Tutor</h1>
      </div>
      
      {/* Modules Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {tutorialModules.map((module, index) => (
          <motion.div
            key={module.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => setSelectedModule(module)}
            className="group cursor-pointer rounded-2xl bg-slate-800/50 p-6 transition-all hover:bg-slate-800"
          >
            <div className="mb-4 flex items-center justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/20">
                <BookOpen className="h-6 w-6 text-indigo-400" />
              </div>
              {module.completed ? (
                <CheckCircle className="h-6 w-6 text-emerald-400" />
              ) : index > 0 && !tutorialModules[index - 1].completed ? (
                <Lock className="h-6 w-6 text-slate-600" />
              ) : null}
            </div>
            
            <h3 className="mb-2 text-xl font-semibold text-white group-hover:text-indigo-400">
              {module.title}
            </h3>
            <p className="mb-4 text-slate-400">{module.description}</p>
            
            <div className="flex items-center gap-4 text-sm">
              <span className="text-slate-500">
                Elo: {module.eloRange[0]}-{module.eloRange[1]}
              </span>
              <span className="text-slate-500">
                {module.lessons.length} lições
              </span>
            </div>
            
            <div className="mt-4 h-2 rounded-full bg-slate-700">
              <div 
                className="h-full rounded-full bg-indigo-500 transition-all"
                style={{
                  width: `${(module.lessons.filter(l => l.completed).length / module.lessons.length) * 100}%`
                }}
              />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function ModuleView({ 
  module, 
  onBack,
  onSelectLesson 
}: { 
  module: TutorialModule;
  onBack: () => void;
  onSelectLesson: (lesson: Lesson) => void;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8">
      <div className="mb-8 flex items-center gap-4">
        <button
          onClick={onBack}
          className="flex items-center gap-2 rounded-lg bg-slate-800 px-4 py-2 text-white hover:bg-slate-700"
        >
          <ChevronLeft className="h-5 w-5" />
          Voltar
        </button>
        <div>
          <h1 className="text-3xl font-bold text-white">{module.title}</h1>
          <p className="text-slate-400">{module.description}</p>
        </div>
      </div>
      
      <div className="grid gap-4">
        {module.lessons.map((lesson, index) => (
          <motion.div
            key={lesson.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => onSelectLesson(lesson)}
            className="flex cursor-pointer items-center gap-4 rounded-xl bg-slate-800/50 p-4 transition-all hover:bg-slate-800"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-500/20">
              {lesson.completed ? (
                <CheckCircle className="h-5 w-5 text-emerald-400" />
              ) : (
                <span className="text-indigo-400">{index + 1}</span>
              )}
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-white">{lesson.title}</h3>
              <p className="text-sm text-slate-400">{lesson.objective}</p>
            </div>
            <Play className="h-5 w-5 text-slate-600" />
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function LessonView({ lesson, onBack }: { lesson: Lesson; onBack: () => void }) {
  const [showHint, setShowHint] = useState(false);
  const [currentHint, setCurrentHint] = useState(0);
  
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8">
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 rounded-lg bg-slate-800 px-4 py-2 text-white hover:bg-slate-700"
          >
            <ChevronLeft className="h-5 w-5" />
            Voltar
          </button>
          <h1 className="text-2xl font-bold text-white">{lesson.title}</h1>
        </div>
        <button
          onClick={() => {
            setShowHint(true);
            if (currentHint < lesson.hints.length - 1) {
              setCurrentHint(currentHint + 1);
            }
          }}
          className="flex items-center gap-2 rounded-lg bg-amber-500/20 px-4 py-2 text-amber-400 hover:bg-amber-500/30"
        >
          <Lightbulb className="h-4 w-4" />
          Dica
        </button>
      </div>
      
      <div className="grid flex-1 gap-6 lg:grid-cols-2">
        {/* Left: Lesson Content */}
        <div className="space-y-6">
          <div className="rounded-xl bg-slate-800/50 p-6">
            <h2 className="mb-4 text-lg font-semibold text-white">Conteúdo</h2>
            <p className="text-slate-300 leading-relaxed">{lesson.content}</p>
          </div>
          
          <div className="rounded-xl bg-indigo-900/20 p-6">
            <h2 className="mb-2 text-lg font-semibold text-indigo-300">Objetivo</h2>
            <p className="text-indigo-200">{lesson.objective}</p>
          </div>
          
          <AnimatePresence>
            {showHint && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="rounded-xl bg-amber-900/20 p-6"
              >
                <h2 className="mb-2 flex items-center gap-2 text-lg font-semibold text-amber-400">
                  <Lightbulb className="h-5 w-5" />
                  Dica {currentHint + 1}/{lesson.hints.length}
                </h2>
                <p className="text-amber-200">{lesson.hints[currentHint]}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        {/* Right: Interactive Board */}
        <div className="rounded-xl bg-slate-800/50 p-6">
          <h2 className="mb-4 text-lg font-semibold text-white">Tabuleiro Interativo</h2>
          <div className="aspect-square rounded-lg bg-slate-700 flex items-center justify-center">
            <p className="text-slate-400">FEN: {lesson.fen}</p>
          </div>
          <div className="mt-4 flex gap-3">
            <button className="flex-1 rounded-lg bg-indigo-600 py-3 font-medium text-white hover:bg-indigo-700">
              Verificar
            </button>
            <button className="flex-1 rounded-lg bg-slate-700 py-3 font-medium text-white hover:bg-slate-600">
              Reiniciar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
