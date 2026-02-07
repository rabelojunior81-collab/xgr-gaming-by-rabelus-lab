import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Clock } from 'lucide-react';
import type { AIPersonality } from '@/types/chess';

/**
 * Props do componente ThinkingIndicator
 */
interface ThinkingIndicatorProps {
  /** Se a IA está pensando */
  isThinking: boolean;
  /** Progresso do pensamento (0-100) */
  progress?: number;
  /** Tempo estimado restante em ms */
  estimatedTime?: number;
  /** Personalidade da IA para mensagens personalizadas */
  personality?: AIPersonality;
  /** Nome da IA (opcional) */
  aiName?: string;
}

/**
 * Retorna uma mensagem personalizada baseada na personalidade
 */
function getThinkingMessage(personality?: AIPersonality, aiName: string = 'Drakon'): string {
  if (!personality) {
    return `${aiName} está pensando...`;
  }

  const aggressiveness = personality.aggressiveness;
  const precision = personality.technicalPrecision;

  if (aggressiveness > 70) {
    return `${aiName} está calculando ataques...`;
  } else if (aggressiveness < 30) {
    return `${aiName} está avaliando a posição...`;
  } else if (precision > 80) {
    return `${aiName} está analisando profundamente...`;
  } else if (precision < 40) {
    return `${aiName} está pensando...`;
  }

  return `${aiName} está calculando...`;
}

/**
 * Componente de indicador visual de "IA pensando"
 * 
 * Exibe um spinner animado, barra de progresso e mensagem personalizada
 * durante o tempo de reflexão da IA.
 * 
 * @example
 * ```tsx
 * <ThinkingIndicator 
 *   isThinking={isThinking} 
 *   progress={thinkingProgress}
 *   personality={aiPersonality}
 * />
 * ```
 */
export function ThinkingIndicator({
  isThinking,
  progress = 0,
  estimatedTime,
  personality,
  aiName = 'Drakon'
}: ThinkingIndicatorProps) {
  const message = getThinkingMessage(personality, aiName);
  const formattedTime = estimatedTime 
    ? `${(estimatedTime / 1000).toFixed(1)}s`
    : null;

  return (
    <AnimatePresence>
      {isThinking && (
        <motion.div
          initial={{ opacity: 0, y: -10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.95 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="flex flex-col gap-2 rounded-xl bg-gradient-to-br from-indigo-900/90 to-purple-900/90 p-4 shadow-lg backdrop-blur-sm"
        >
          {/* Cabeçalho com ícone e mensagem */}
          <div className="flex items-center gap-3">
            {/* Spinner animado com pulsação */}
            <motion.div
              animate={{ 
                rotate: 360,
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                rotate: { duration: 2, repeat: Infinity, ease: 'linear' },
                scale: { duration: 1.5, repeat: Infinity, ease: 'easeInOut' }
              }}
              className="relative flex h-10 w-10 items-center justify-center"
            >
              {/* Círculo externo */}
              <div className="absolute inset-0 rounded-full border-2 border-indigo-400/30" />
              
              {/* Círculo de progresso */}
              <svg className="absolute inset-0 h-full w-full -rotate-90">
                <circle
                  cx="20"
                  cy="20"
                  r="18"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeDasharray={`${2 * Math.PI * 18}`}
                  strokeDashoffset={`${2 * Math.PI * 18 * (1 - progress / 100)}`}
                  className="text-indigo-400 transition-all duration-100"
                  strokeLinecap="round"
                />
              </svg>
              
              {/* Ícone central */}
              <Brain className="h-5 w-5 text-indigo-300" />
            </motion.div>

            {/* Texto e tempo */}
            <div className="flex-1">
              <p className="font-medium text-white">{message}</p>
              <div className="flex items-center gap-2 text-sm text-indigo-300">
                {formattedTime && (
                  <>
                    <Clock className="h-3 w-3" />
                    <span>~{formattedTime}</span>
                  </>
                )}
                <span className="text-indigo-400/70">• {progress}%</span>
              </div>
            </div>
          </div>

          {/* Barra de progresso */}
          <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-slate-700/50">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.1, ease: 'linear' }}
              className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500"
            />
            
            {/* Efeito de brilho na barra */}
            <motion.div
              animate={{ x: ['-100%', '200%'] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
              className="absolute inset-0 w-1/3 bg-gradient-to-r from-transparent via-white/20 to-transparent"
            />
          </div>

          {/* Pontinhos animados indicando atividade */}
          <div className="flex justify-center gap-1 pt-1">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                animate={{ 
                  opacity: [0.3, 1, 0.3],
                  scale: [0.8, 1, 0.8]
                }}
                transition={{ 
                  duration: 1.2, 
                  repeat: Infinity, 
                  delay: i * 0.2,
                  ease: 'easeInOut'
                }}
                className="h-1.5 w-1.5 rounded-full bg-indigo-400"
              />
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/**
 * Versão compacta do indicador para uso em espaços limitados
 */
export function ThinkingIndicatorCompact({
  isThinking,
  progress = 0,
  aiName = 'Drakon'
}: Omit<ThinkingIndicatorProps, 'estimatedTime' | 'personality'>) {
  return (
    <AnimatePresence>
      {isThinking && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="flex items-center gap-2 rounded-full bg-indigo-900/80 px-3 py-1.5"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className="h-4 w-4 border-2 border-indigo-400 border-t-transparent rounded-full"
          />
          <span className="text-sm text-indigo-200">{aiName}...</span>
          <span className="text-xs text-indigo-400">{progress}%</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default ThinkingIndicator;
