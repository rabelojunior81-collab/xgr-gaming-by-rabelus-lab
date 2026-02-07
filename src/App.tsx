import { useGameStore } from '@game/store/gameStore';
import { ChessBoard3D } from '@game/components/ChessBoard3D';
import { MainMenu } from '@ui/components/MainMenu';
import { GameControls } from '@ui/components/GameControls';
import { Settings } from '@ui/components/Settings';
import { TutorialPanel } from '@tutorial/components/TutorialPanel';
import { Analysis } from '@ai/components/Analysis';
import { AnalysisPanel } from '@ai/components/AnalysisPanel';
import { AnimatePresence, motion } from 'framer-motion';

function GameView() {
  return (
    <div className="flex h-screen bg-slate-950">
      {/* 3D Board Area */}
      <div className="relative flex-1" data-testid="game-board-area">
        <ChessBoard3D />
        <AnalysisPanel />
      </div>
      
      {/* Controls Panel */}
      <div className="w-80 border-l border-slate-800" data-testid="game-controls-area">
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
