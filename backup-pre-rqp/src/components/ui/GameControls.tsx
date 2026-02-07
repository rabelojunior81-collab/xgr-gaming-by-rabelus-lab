import { motion, AnimatePresence } from 'framer-motion';
import {
  RotateCcw,
  Lightbulb,
  BarChart3,
  ChevronLeft,
  Brain,
  Trophy
} from 'lucide-react';
import { useGameStore } from '@/store/gameStore';
import { EmotionalIndicator } from './EmotionalIndicator';
import { useState } from 'react';

export function GameControls() {
  const {
    undoMove,
    resetGame,
    showHints,
    toggleHints,
    showAnalysis,
    toggleAnalysis,
    isThinking,
    turn,
    isGameOver,
    setView,
    whitePlayer,
    blackPlayer,
    difficulty,
    aiPersonality,
    emotionalProfile
  } = useGameStore();
  
  const [showConfirmReset, setShowConfirmReset] = useState(false);
  
  const difficultyLabels: Record<string, string> = {
    beginner: 'Iniciante',
    club: 'Clube',
    master: 'Mestre',
    custom: 'Custom'
  };

  return (
    <div className="flex h-full flex-col bg-slate-900/95 p-4 text-white">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <button 
          onClick={() => setView('menu')}
          className="flex items-center gap-2 rounded-lg bg-slate-800 px-3 py-2 text-sm hover:bg-slate-700"
        >
          <ChevronLeft className="h-4 w-4" />
          Menu
        </button>
        <div className="flex items-center gap-2 text-sm text-slate-400">
          <Brain className="h-4 w-4" />
          {difficultyLabels[difficulty] || 'Clube'}
        </div>
      </div>
      
      {/* Players Info */}
      <div className="mb-6 space-y-3">
        {/* Black Player */}
        <motion.div 
          animate={{ 
            backgroundColor: turn === 'b' ? 'rgba(99, 102, 241, 0.2)' : 'rgba(30, 41, 59, 0.8)',
            borderColor: turn === 'b' ? 'rgba(99, 102, 241, 0.5)' : 'transparent'
          }}
          className="flex items-center gap-3 rounded-xl border-2 bg-slate-800/80 p-3"
        >
          <div className="h-10 w-10 rounded-full bg-slate-700 flex items-center justify-center">
            <span className="text-lg">♚</span>
          </div>
          <div className="flex-1">
            <p className="font-medium">{blackPlayer.name}</p>
            <p className="text-xs text-slate-400">Elo: {blackPlayer.elo}</p>
          </div>
          {isThinking && turn === 'b' && (
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              className="h-5 w-5 border-2 border-indigo-500 border-t-transparent rounded-full"
            />
          )}
        </motion.div>
        
        {/* White Player */}
        <motion.div 
          animate={{ 
            backgroundColor: turn === 'w' ? 'rgba(99, 102, 241, 0.2)' : 'rgba(30, 41, 59, 0.8)',
            borderColor: turn === 'w' ? 'rgba(99, 102, 241, 0.5)' : 'transparent'
          }}
          className="flex items-center gap-3 rounded-xl border-2 bg-slate-800/80 p-3"
        >
          <div className="h-10 w-10 rounded-full bg-slate-200 flex items-center justify-center">
            <span className="text-lg text-slate-900">♔</span>
          </div>
          <div className="flex-1">
            <p className="font-medium text-white">{whitePlayer.name}</p>
            <p className="text-xs text-slate-400">Elo: {whitePlayer.elo}</p>
          </div>
          {isThinking && turn === 'w' && (
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              className="h-5 w-5 border-2 border-indigo-500 border-t-transparent rounded-full"
            />
          )}
        </motion.div>
      </div>
      
      {/* Emotional State Indicator */}
      <div className="mb-4">
        <EmotionalIndicator
          profile={emotionalProfile}
          personality={aiPersonality}
          compact={true}
        />
      </div>

      {/* Game Status */}
      {isGameOver && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-4 rounded-xl bg-gradient-to-r from-amber-500/20 to-orange-500/20 p-4 text-center"
        >
          <Trophy className="mx-auto mb-2 h-8 w-8 text-amber-400" />
          <p className="font-bold text-amber-300">Fim de Jogo!</p>
          <p className="text-sm text-amber-200/70">
            {turn === 'w' ? 'Pretas venceram' : 'Brancas venceram'}
          </p>
        </motion.div>
      )}
      
      {/* Control Buttons */}
      <div className="mb-6 grid grid-cols-2 gap-2">
        <button
          onClick={() => setShowConfirmReset(true)}
          className="flex items-center justify-center gap-2 rounded-lg bg-slate-800 p-3 text-sm hover:bg-slate-700"
        >
          <RotateCcw className="h-4 w-4" />
          Reiniciar
        </button>
        
        <button
          onClick={undoMove}
          className="flex items-center justify-center gap-2 rounded-lg bg-slate-800 p-3 text-sm hover:bg-slate-700"
        >
          <ChevronLeft className="h-4 w-4" />
          Desfazer
        </button>
        
        <button
          onClick={toggleHints}
          className={`flex items-center justify-center gap-2 rounded-lg p-3 text-sm transition-colors ${
            showHints ? 'bg-amber-500/20 text-amber-400' : 'bg-slate-800 hover:bg-slate-700'
          }`}
        >
          <Lightbulb className="h-4 w-4" />
          Dicas
        </button>
        
        <button
          onClick={toggleAnalysis}
          className={`flex items-center justify-center gap-2 rounded-lg p-3 text-sm transition-colors ${
            showAnalysis ? 'bg-indigo-500/20 text-indigo-400' : 'bg-slate-800 hover:bg-slate-700'
          }`}
        >
          <BarChart3 className="h-4 w-4" />
          Análise
        </button>
      </div>
      
      {/* Move History */}
      <div className="flex-1 overflow-hidden rounded-xl bg-slate-800/50">
        <div className="border-b border-slate-700 p-3">
          <h3 className="text-sm font-medium text-slate-300">Histórico de Lances</h3>
        </div>
        <div className="h-48 overflow-y-auto p-2">
          <MoveHistory />
        </div>
      </div>
      
      {/* Confirm Reset Modal */}
      <AnimatePresence>
        {showConfirmReset && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center bg-black/50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="rounded-xl bg-slate-800 p-6 text-center"
            >
              <p className="mb-4 text-lg font-medium">Reiniciar partida?</p>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    resetGame();
                    setShowConfirmReset(false);
                  }}
                  className="rounded-lg bg-red-500 px-4 py-2 text-sm font-medium hover:bg-red-600"
                >
                  Sim
                </button>
                <button
                  onClick={() => setShowConfirmReset(false)}
                  className="rounded-lg bg-slate-700 px-4 py-2 text-sm font-medium hover:bg-slate-600"
                >
                  Não
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function MoveHistory() {
  const { moves } = useGameStore();
  
  const pairs: { white?: string; black?: string; num: number }[] = [];
  for (let i = 0; i < moves.length; i += 2) {
    pairs.push({
      num: Math.floor(i / 2) + 1,
      white: moves[i]?.san,
      black: moves[i + 1]?.san
    });
  }
  
  return (
    <div className="space-y-1">
      {pairs.map((pair) => (
        <div key={pair.num} className="flex gap-2 text-sm">
          <span className="w-8 text-slate-500">{pair.num}.</span>
          <span className="flex-1 text-slate-300">{pair.white}</span>
          <span className="flex-1 text-slate-400">{pair.black}</span>
        </div>
      ))}
    </div>
  );
}
