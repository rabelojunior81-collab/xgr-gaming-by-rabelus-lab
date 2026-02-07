import { motion } from 'framer-motion';
import { ChevronLeft, TrendingUp, AlertTriangle, Target, Brain } from 'lucide-react';
import { useGameStore } from '@game/store/gameStore';
import { useEffect, useState, useMemo } from 'react';
import type { AnalysisResult, MoveClassification } from '@shared/types/chess';

// Classification thresholds (in centipawns)
const CLASSIFICATION_THRESHOLDS = {
  brilliant: -0.1,  // Positive surprise
  great: 0.1,
  best: 0.2,
  excellent: 0.5,
  good: 1.0,
  inaccuracy: 3.0,   // 0.3-0.5 pawn loss
  mistake: 20.0,     // 0.5-2.0 pawn loss
  blunder: Infinity  // >2.0 pawn loss
};

function classifyMove(
  playedEval: number, 
  bestEval: number, 
  isBestMove: boolean
): MoveClassification['type'] {
  const loss = bestEval - playedEval; // Positive means worse for the player
  
  if (isBestMove) return 'best';
  if (loss < 0) return 'brilliant'; // Played better than engine's best (rare)
  if (loss <= CLASSIFICATION_THRESHOLDS.great * 100) return 'great';
  if (loss <= CLASSIFICATION_THRESHOLDS.excellent * 100) return 'excellent';
  if (loss <= CLASSIFICATION_THRESHOLDS.good * 100) return 'good';
  if (loss <= CLASSIFICATION_THRESHOLDS.inaccuracy * 100) return 'inaccuracy';
  if (loss <= CLASSIFICATION_THRESHOLDS.mistake * 100) return 'mistake';
  return 'blunder';
}

function calculateAccuracy(classifications: MoveClassification['type'][]): number {
  if (classifications.length === 0) return 0;
  
  const weights: Record<MoveClassification['type'], number> = {
    brilliant: 1.0,
    great: 1.0,
    best: 1.0,
    excellent: 0.95,
    good: 0.9,
    inaccuracy: 0.7,
    mistake: 0.4,
    blunder: 0.0
  };
  
  const totalWeight = classifications.reduce((sum, c) => sum + weights[c], 0);
  return (totalWeight / classifications.length) * 100;
}

export function Analysis() {
  const { setView, moves, engine, setAnalysisResults } = useGameStore();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentMove, setCurrentMove] = useState(0);
  const [localAnalysisData, setLocalAnalysisData] = useState<Map<number, AnalysisResult>>(new Map());

  useEffect(() => {
    const analyzeGame = async () => {
      if (moves.length === 0) return;
      
      setIsAnalyzing(true);
      const results = new Map<number, AnalysisResult>();
      
      // Analyze each position
      for (let i = 0; i <= moves.length; i++) {
        engine.reset();
        for (let j = 0; j < i; j++) {
          engine.makeMove(moves[j]);
        }
        
        try {
          const result = await engine.analyzePosition(12); // Reduced depth for speed
          results.set(i, result);
        } catch (error) {
          console.error(`Error analyzing position ${i}:`, error);
          results.set(i, {
            bestMove: '',
            evaluation: { type: 'cp', value: 0 },
            depth: 0,
            pv: [],
            winRate: 50
          });
        }
      }
      
      setLocalAnalysisData(results);
      setAnalysisResults(results);
      setIsAnalyzing(false);
    };
    
    analyzeGame();
  }, [moves, engine, setAnalysisResults]);

  // Calculate real statistics
  const { whiteAccuracy, blackAccuracy, errorCounts, bestMoves, evaluations } = useMemo(() => {
    const whiteClassifications: MoveClassification['type'][] = [];
    const blackClassifications: MoveClassification['type'][] = [];
    const bestMovesList: { move: number; san: string; evalChange: number }[] = [];
    const errors = { blunders: 0, mistakes: 0, inaccuracies: 0 };
    const evals: number[] = [];

    for (let i = 0; i < moves.length; i++) {
      const result = localAnalysisData.get(i + 1);
      const prevResult = localAnalysisData.get(i);
      
      if (result && prevResult) {
        const isWhiteMove = i % 2 === 0;
        
        // Calculate evaluation change (from perspective of the player who moved)
        const playedEval = result.evaluation.value;
        const prevEval = prevResult.evaluation.value;
        const evalChange = playedEval - prevEval;
        
        // Get best move evaluation from previous position
        // (This is an approximation - the best eval would require analyzing the best move)
        const bestEval = prevResult.evaluation.value; // Simplified
        
        const isBestMove = result.bestMove === `${moves[i].from}${moves[i].to}` ||
                          result.pv[0] === `${moves[i].from}${moves[i].to}`;
        
        const classification = classifyMove(playedEval, bestEval, isBestMove);
        
        if (isWhiteMove) {
          whiteClassifications.push(classification);
        } else {
          blackClassifications.push(classification);
        }
        
        // Count errors
        if (classification === 'blunder') errors.blunders++;
        else if (classification === 'mistake') errors.mistakes++;
        else if (classification === 'inaccuracy') errors.inaccuracies++;
        
        // Track best moves (great improvements)
        if (evalChange > 50 && (classification === 'great' || classification === 'brilliant')) {
          bestMovesList.push({
            move: i + 1,
            san: moves[i].san || '',
            evalChange: evalChange / 100
          });
        }
        
        evals.push(playedEval / 100);
      }
    }

    return {
      whiteAccuracy: calculateAccuracy(whiteClassifications),
      blackAccuracy: calculateAccuracy(blackClassifications),
      errorCounts: errors,
      bestMoves: bestMovesList.slice(0, 5), // Top 5 best moves
      evaluations: evals
    };
  }, [localAnalysisData, moves]);

  const avgEval = evaluations.length > 0 
    ? evaluations.reduce((a, b) => a + b, 0) / evaluations.length 
    : 0;

  const qualityColors: Record<string, string> = {
    brilliant: 'text-purple-400',
    great: 'text-cyan-400',
    best: 'text-emerald-400',
    excellent: 'text-emerald-300',
    good: 'text-emerald-200',
    inaccuracy: 'text-yellow-400',
    mistake: 'text-orange-400',
    blunder: 'text-rose-400'
  };

  const qualityLabels: Record<string, string> = {
    brilliant: 'Brilhante',
    great: 'Excelente',
    best: 'Melhor',
    excellent: 'Muito bom',
    good: 'Bom',
    inaccuracy: 'Imprecisão',
    mistake: 'Erro',
    blunder: 'Blunder'
  };

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
        <h1 className="text-3xl font-bold text-white">Análise de Partida</h1>
      </div>
      
      {isAnalyzing ? (
        <div className="flex flex-1 items-center justify-center">
          <div className="text-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              className="h-12 w-12 border-4 border-indigo-500 border-t-transparent rounded-full mx-auto mb-4"
            />
            <p className="text-slate-400">Analisando partida...</p>
            <p className="text-sm text-slate-500 mt-2">Isso pode levar alguns segundos</p>
          </div>
        </div>
      ) : moves.length === 0 ? (
        <div className="flex flex-1 items-center justify-center">
          <p className="text-slate-400">Nenhuma partida para analisar</p>
        </div>
      ) : (
        <div className="grid flex-1 gap-6 lg:grid-cols-3">
          {/* Stats Overview */}
          <div className="space-y-4">
            <div className="rounded-xl bg-slate-800/50 p-6">
              <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-white">
                <TrendingUp className="h-5 w-5 text-indigo-400" />
                Estatísticas
              </h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Avaliação Média</span>
                  <span className={`font-medium ${avgEval > 0 ? 'text-emerald-400' : avgEval < 0 ? 'text-rose-400' : 'text-slate-300'}`}>
                    {avgEval > 0 ? '+' : ''}{avgEval.toFixed(2)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Precisão Brancas</span>
                  <span className="font-medium text-emerald-400">{whiteAccuracy.toFixed(1)}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Precisão Pretas</span>
                  <span className="font-medium text-emerald-400">{blackAccuracy.toFixed(1)}%</span>
                </div>
              </div>
            </div>
            
            <div className="rounded-xl bg-slate-800/50 p-6">
              <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-white">
                <AlertTriangle className="h-5 w-5 text-amber-400" />
                Erros
              </h2>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-rose-400">Blunders</span>
                  <span className="rounded bg-rose-500/20 px-2 py-1 text-rose-300">{errorCounts.blunders}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-orange-400">Erros</span>
                  <span className="rounded bg-orange-500/20 px-2 py-1 text-orange-300">{errorCounts.mistakes}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-yellow-400">Imprecisões</span>
                  <span className="rounded bg-yellow-500/20 px-2 py-1 text-yellow-300">{errorCounts.inaccuracies}</span>
                </div>
              </div>
            </div>
            
            {bestMoves.length > 0 && (
              <div className="rounded-xl bg-slate-800/50 p-6">
                <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-white">
                  <Target className="h-5 w-5 text-emerald-400" />
                  Melhores Lances
                </h2>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {bestMoves.map((bm, idx) => (
                    <div key={idx} className="rounded-lg bg-slate-700/50 p-3">
                      <p className="text-sm text-slate-300">Lance {bm.move}. {bm.san}</p>
                      <p className="text-xs text-emerald-400">+{bm.evalChange.toFixed(2)} avaliação</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* Evaluation Graph */}
          <div className="lg:col-span-2 space-y-4">
            <div className="rounded-xl bg-slate-800/50 p-6">
              <h2 className="mb-4 text-xl font-semibold text-white">Gráfico de Avaliação</h2>
              <div className="h-48 rounded-lg bg-slate-700/50 flex items-end justify-center gap-1 p-4 overflow-hidden">
                {evaluations.length > 0 ? (
                  evaluations.map((eval_, i) => {
                    const height = Math.min(Math.abs(eval_) * 15 + 5, 45);
                    const isPositive = eval_ >= 0;
                    return (
                      <motion.div
                        key={i}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: `${height}%`, opacity: 1 }}
                        transition={{ delay: i * 0.02, duration: 0.3 }}
                        className={`w-3 rounded-sm cursor-pointer hover:opacity-80 transition-opacity ${
                          isPositive ? 'bg-emerald-500' : 'bg-rose-500'
                        } ${currentMove === i + 1 ? 'ring-2 ring-white' : ''}`}
                        onClick={() => setCurrentMove(i + 1)}
                        title={`Movimento ${i + 1}: ${eval_ > 0 ? '+' : ''}${eval_.toFixed(2)}`}
                      />
                    );
                  })
                ) : (
                  <p className="text-slate-500">Sem dados de avaliação</p>
                )}
              </div>
              <div className="mt-2 flex justify-between text-xs text-slate-500">
                <span>Início</span>
                <span>Meio-jogo</span>
                <span>Final</span>
              </div>
            </div>
            
            {/* Move Analysis */}
            <div className="rounded-xl bg-slate-800/50 p-6">
              <h2 className="mb-4 text-xl font-semibold text-white">Análise de Lances</h2>
              <div className="max-h-64 overflow-y-auto space-y-2">
                {moves.map((move, i) => {
                  const result = localAnalysisData.get(i + 1);
                  const prevResult = localAnalysisData.get(i);
                  
                  if (!result || !prevResult) {
                    return (
                      <div 
                        key={i}
                        className="flex items-center justify-between rounded-lg p-3 bg-slate-700/30"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-slate-500 w-8">{Math.floor(i / 2) + 1}.</span>
                          <span className="font-medium text-white">{move.san}</span>
                        </div>
                        <span className="text-slate-500">Analisando...</span>
                      </div>
                    );
                  }
                  
                  const playedEval = result.evaluation.value;
                  const prevEval = prevResult.evaluation.value;
                  const isBestMove = result.bestMove === `${move.from}${move.to}` ||
                                    result.pv[0] === `${move.from}${move.to}`;
                  
                  const classification = classifyMove(playedEval, prevEval, isBestMove);
                  const evalDiff = (playedEval - prevEval) / 100;
                  
                  return (
                    <div 
                      key={i}
                      className={`flex items-center justify-between rounded-lg p-3 transition-colors cursor-pointer hover:bg-slate-700/50 ${
                        currentMove === i + 1 ? 'bg-slate-700' : 'bg-slate-700/30'
                      }`}
                      onClick={() => setCurrentMove(i + 1)}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-slate-500 w-8">{Math.floor(i / 2) + 1}.</span>
                        <span className="font-medium text-white">{move.san}</span>
                        <span className={`text-xs ${qualityColors[classification]}`}>
                          {qualityLabels[classification]}
                        </span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className={`text-sm ${qualityColors[classification]}`}>
                          {result.evaluation.value > 0 ? '+' : ''}
                          {(result.evaluation.value / 100).toFixed(2)}
                        </span>
                        {Math.abs(evalDiff) > 0.5 && (
                          <span className={`text-xs ${evalDiff > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                            {evalDiff > 0 ? '+' : ''}{evalDiff.toFixed(1)}
                          </span>
                        )}
                        <Brain className="h-4 w-4 text-slate-500" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
