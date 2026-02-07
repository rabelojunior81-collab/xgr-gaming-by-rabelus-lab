import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';
import { useGameStore } from '@/store/gameStore';
import { useEffect, useState, useRef, useCallback } from 'react';
import type { AnalysisResult } from '@/types/chess';

export function AnalysisPanel() {
  const { 
    fen, 
    showAnalysis, 
    engine,
    setCurrentEvaluation,
    currentEvaluation
  } = useGameStore();
  
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  const performAnalysis = useCallback(async () => {
    if (!showAnalysis) return;
    
    // Cancel any pending analysis
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();
    
    setIsAnalyzing(true);
    
    try {
      engine.loadFen(fen);
      const result = await engine.analyzePosition(15);
      
      // Only update if not aborted
      if (!abortControllerRef.current.signal.aborted) {
        setAnalysis(result);
        if (result.evaluation) {
          setCurrentEvaluation(result.evaluation.value);
        }
      }
    } catch (error) {
      if (error instanceof Error && error.name !== 'AbortError') {
        console.error('Analysis error:', error);
      }
    } finally {
      if (!abortControllerRef.current?.signal.aborted) {
        setIsAnalyzing(false);
      }
    }
  }, [fen, showAnalysis, engine, setCurrentEvaluation]);

  useEffect(() => {
    if (!showAnalysis) return;
    
    // Clear previous debounce timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    
    // Debounce analysis by 500ms
    debounceTimerRef.current = setTimeout(() => {
      performAnalysis();
    }, 500);
    
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fen, showAnalysis, performAnalysis]);
  
  if (!showAnalysis) return null;
  
  const evalDisplay = analysis?.evaluation 
    ? analysis.evaluation.type === 'mate' 
      ? `M${analysis.evaluation.value}`
      : `${analysis.evaluation.value > 0 ? '+' : ''}${(analysis.evaluation.value / 100).toFixed(2)}`
    : '0.00';
  
  const winRate = analysis?.winRate ?? currentEvaluation ? 
    50 + 50 * (2 / (1 + Math.exp(-0.00368208 * currentEvaluation)) - 1) : 50;
  
  const isWhiteAdvantage = winRate > 55;
  const isBlackAdvantage = winRate < 45;
  
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="absolute right-4 top-4 w-72 rounded-xl bg-slate-900/95 p-4 text-white shadow-xl backdrop-blur-sm"
    >
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-semibold text-slate-300">Análise em Tempo Real</h3>
        {isAnalyzing && (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className="h-4 w-4 border-2 border-indigo-500 border-t-transparent rounded-full"
          />
        )}
      </div>
      
      {/* Evaluation Bar */}
      <div className="mb-4">
        <div className="flex justify-between text-sm mb-1">
          <span className="text-slate-400">Vantagem</span>
          <span className={`font-bold ${
            isWhiteAdvantage ? 'text-emerald-400' : 
            isBlackAdvantage ? 'text-rose-400' : 'text-slate-300'
          }`}>
            {evalDisplay}
          </span>
        </div>
        <div className="h-4 rounded-full bg-slate-800 overflow-hidden relative">
          <motion.div 
            className="absolute inset-0 bg-gradient-to-r from-rose-500 via-slate-500 to-emerald-500"
            initial={false}
            animate={{ 
              backgroundPosition: `${winRate}% 0%`
            }}
            style={{
              backgroundSize: '200% 100%'
            }}
          />
          <div 
            className="absolute top-0 bottom-0 w-1 bg-white/50 transition-all duration-300"
            style={{ left: `${winRate}%` }}
          />
        </div>
        <div className="mt-1 flex justify-between text-xs text-slate-500">
          <span>0%</span>
          <span>50%</span>
          <span>100%</span>
        </div>
      </div>
      
      {/* Win Probability */}
      <div className="mb-4 rounded-lg bg-slate-800/50 p-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-400">Prob. Brancas</span>
          <span className="font-medium text-emerald-400">{winRate.toFixed(1)}%</span>
        </div>
        <div className="flex items-center justify-between text-sm mt-1">
          <span className="text-slate-400">Prob. Pretas</span>
          <span className="font-medium text-rose-400">{(100 - winRate).toFixed(1)}%</span>
        </div>
      </div>
      
      {/* Best Move */}
      {analysis?.bestMove && (
        <div className="rounded-lg bg-indigo-500/20 p-3">
          <div className="flex items-center gap-2 text-sm text-indigo-300 mb-1">
            <CheckCircle className="h-4 w-4" />
            <span>Melhor lance</span>
          </div>
          <p className="text-lg font-bold text-white">
            {analysis.bestMove}
          </p>
          {analysis.pv.slice(1, 4).length > 0 && (
            <p className="mt-1 text-xs text-indigo-200/70">
              Continuação: {analysis.pv.slice(1, 4).join(' ')}
            </p>
          )}
        </div>
      )}
      
      {/* Analysis Depth */}
      <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
        <span>Profundidade</span>
        <span>{analysis?.depth || 0}/20</span>
      </div>
      
      {/* Engine Status */}
      <div className="mt-2 flex items-center justify-between text-xs">
        <span className="text-slate-500">Engine</span>
        <span className={engine.isEngineReady() ? 'text-emerald-400' : 'text-amber-400'}>
          {engine.isEngineReady() ? 'Stockfish' : 'Fallback'}
        </span>
      </div>
    </motion.div>
  );
}
