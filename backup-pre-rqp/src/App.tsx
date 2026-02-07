import { useGameStore } from '@/store/gameStore';
import { ChessBoard3D } from '@/components/3d/ChessBoard3D';
import { MainMenu } from '@/components/ui/MainMenu';
import { GameControls } from '@/components/ui/GameControls';
import { Settings } from '@/components/ui/Settings';
import { TutorialPanel } from '@/components/ui/TutorialPanel';
import { Analysis } from '@/components/ui/Analysis';
import { AnalysisPanel } from '@/components/ui/AnalysisPanel';
import { AnimatePresence, motion } from 'framer-motion';

function GameView() {
  return (
    <div className="flex h-screen bg-slate-950">
      {/* 3D Board Area */}
      <div className="relative flex-1">
        <ChessBoard3D />
        <AnalysisPanel />
      </div>
      
      {/* Controls Panel */}
      <div className="w-80 border-l border-slate-800">
        <GameControls />
      </div>
    </div>
  );
}

export function App() {
  const { currentView } = useGameStore();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={currentView}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="h-screen w-full overflow-hidden"
      >
        {currentView === 'menu' && <MainMenu />}
        {currentView === 'game' && <GameView />}
        {currentView === 'settings' && <Settings />}
        {currentView === 'tutorial' && (
          <TutorialPanel
            onExit={() => useGameStore.getState().setView('menu')}
            onLessonSelect={(lesson) => console.log('Lesson selected:', lesson.title)}
          />
        )}
        {currentView === 'analysis' && <Analysis />}
      </motion.div>
    </AnimatePresence>
  );
}
