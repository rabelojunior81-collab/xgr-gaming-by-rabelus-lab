import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertCircle, Lightbulb, Info } from 'lucide-react';
import { useEffect } from 'react';
import type { FeedbackOverlayProps } from '@shared/types/tutorial';

/**
 * FeedbackOverlay - Displays visual feedback for user actions
 * Shows success, error, hint, and info messages with animations
 */
export function FeedbackOverlay({ feedback, onDismiss }: FeedbackOverlayProps) {
  const { type, message, highlightSquares, autoDismiss } = feedback;

  // Auto-dismiss effect
  useEffect(() => {
    if (autoDismiss && onDismiss) {
      const timer = setTimeout(() => {
        onDismiss();
      }, autoDismiss);
      return () => clearTimeout(timer);
    }
  }, [autoDismiss, onDismiss]);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-6 w-6 text-emerald-400" />;
      case 'error':
        return <AlertCircle className="h-6 w-6 text-rose-400" />;
      case 'hint':
        return <Lightbulb className="h-6 w-6 text-amber-400" />;
      case 'warning':
        return <AlertCircle className="h-6 w-6 text-orange-400" />;
      case 'info':
      default:
        return <Info className="h-6 w-6 text-blue-400" />;
    }
  };

  const getColors = () => {
    switch (type) {
      case 'success':
        return 'bg-emerald-500/20 border-emerald-500/50 text-emerald-100';
      case 'error':
        return 'bg-rose-500/20 border-rose-500/50 text-rose-100';
      case 'hint':
        return 'bg-amber-500/20 border-amber-500/50 text-amber-100';
      case 'warning':
        return 'bg-orange-500/20 border-orange-500/50 text-orange-100';
      case 'info':
      default:
        return 'bg-blue-500/20 border-blue-500/50 text-blue-100';
    }
  };

  const getGlowColor = () => {
    switch (type) {
      case 'success':
        return 'shadow-emerald-500/30';
      case 'error':
        return 'shadow-rose-500/30';
      case 'hint':
        return 'shadow-amber-500/30';
      case 'warning':
        return 'shadow-orange-500/30';
      case 'info':
      default:
        return 'shadow-blue-500/30';
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -20, scale: 0.95 }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        className={`
          fixed top-24 left-1/2 -translate-x-1/2 z-50
          flex items-center gap-3 px-6 py-4 rounded-xl
          border backdrop-blur-md
          shadow-lg ${getGlowColor()}
          ${getColors()}
          max-w-md w-[90%]
        `}
      >
        <div className="flex-shrink-0">
          {getIcon()}
        </div>
        
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium leading-relaxed">
            {message}
          </p>
          
          {highlightSquares && highlightSquares.length > 0 && (
            <p className="mt-1 text-xs opacity-70">
              Casas: {highlightSquares.join(', ').toUpperCase()}
            </p>
          )}
        </div>

        {onDismiss && (
          <button
            onClick={onDismiss}
            className="flex-shrink-0 p-1 rounded-lg hover:bg-white/10 transition-colors"
            aria-label="Fechar"
          >
            <X className="h-4 w-4" />
          </button>
        )}

        {/* Progress bar for auto-dismiss */}
        {autoDismiss && (
          <motion.div
            initial={{ scaleX: 1 }}
            animate={{ scaleX: 0 }}
            transition={{ duration: autoDismiss / 1000, ease: 'linear' }}
            className="absolute bottom-0 left-0 right-0 h-1 bg-white/30 origin-left rounded-b-xl"
          />
        )}
      </motion.div>

      {/* Backdrop highlight for squares */}
      {highlightSquares && highlightSquares.length > 0 && (
        <div className="fixed inset-0 pointer-events-none z-40">
          {highlightSquares.map((square) => (
            <motion.div
              key={square}
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.3, 0] }}
              transition={{ 
                duration: 1.5, 
                repeat: Infinity,
                repeatType: 'reverse'
              }}
              className={`
                absolute w-16 h-16 rounded-lg
                ${type === 'success' ? 'bg-emerald-400' : 
                  type === 'error' ? 'bg-rose-400' : 
                  type === 'hint' ? 'bg-amber-400' : 'bg-blue-400'}
              `}
              style={{
                // Position will be calculated based on square
                left: `calc(${square.charCodeAt(0) - 97} * 12.5% + 50%)`,
                top: `calc(${8 - parseInt(square[1])} * 12.5% + 50%)`,
                transform: 'translate(-50%, -50%)'
              }}
            />
          ))}
        </div>
      )}
    </AnimatePresence>
  );
}

export default FeedbackOverlay;
