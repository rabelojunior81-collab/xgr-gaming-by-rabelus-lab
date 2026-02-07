/**
 * EmotionalIndicator Component
 * 
 * Componente de UI para exibir o estado emocional da IA Neural-X.
 * Mostra ícone, barra de confiança e mensagem contextual.
 */

import React from 'react';
import type { EmotionalProfile, AIPersonality } from '@shared/types/chess';

interface EmotionalIndicatorProps {
  profile: EmotionalProfile;
  personality: AIPersonality;
  showMessage?: boolean;
  compact?: boolean;
}

/**
 * Mapeia estado emocional para ícone correspondente
 */
const getEmotionalIcon = (state: EmotionalProfile['state']): string => {
  const icons: Record<EmotionalProfile['state'], string> = {
    confident: '😤',   // Determined/confident
    optimistic: '😊',  // Happy/optimistic
    neutral: '😐',     // Neutral
    concerned: '😰',   // Worried
    desperate: '😱'    // Panicked
  };
  return icons[state];
};

/**
 * Mapeia estado emocional para cor de fundo
 */
const getEmotionalColor = (state: EmotionalProfile['state']): string => {
  const colors: Record<EmotionalProfile['state'], string> = {
    confident: 'bg-emerald-500',
    optimistic: 'bg-green-400',
    neutral: 'bg-gray-400',
    concerned: 'bg-orange-400',
    desperate: 'bg-red-500'
  };
  return colors[state];
};

/**
 * Mapeia estado emocional para cor de texto
 */
const getEmotionalTextColor = (state: EmotionalProfile['state']): string => {
  const colors: Record<EmotionalProfile['state'], string> = {
    confident: 'text-emerald-400',
    optimistic: 'text-green-400',
    neutral: 'text-gray-400',
    concerned: 'text-orange-400',
    desperate: 'text-red-400'
  };
  return colors[state];
};

/**
 * Calcula porcentagem de confiança baseada no estado emocional
 */
const getConfidencePercentage = (state: EmotionalProfile['state']): number => {
  const percentages: Record<EmotionalProfile['state'], number> = {
    confident: 95,
    optimistic: 75,
    neutral: 50,
    concerned: 30,
    desperate: 10
  };
  return percentages[state];
};

/**
 * Traduz estado emocional para português
 */
const getEmotionalLabel = (state: EmotionalProfile['state']): string => {
  const labels: Record<EmotionalProfile['state'], string> = {
    confident: 'Confiante',
    optimistic: 'Otimista',
    neutral: 'Neutro',
    concerned: 'Preocupado',
    desperate: 'Desesperado'
  };
  return labels[state];
};

/**
 * Componente EmotionalIndicator
 * 
 * Exibe o estado emocional atual da IA com ícone visual,
 * barra de progresso e mensagem contextual opcional.
 */
export const EmotionalIndicator: React.FC<EmotionalIndicatorProps> = ({
  profile,
  personality,
  showMessage = true,
  compact = false
}) => {
  const icon = getEmotionalIcon(profile.state);
  const color = getEmotionalColor(profile.state);
  const textColor = getEmotionalTextColor(profile.state);
  const confidence = getConfidencePercentage(profile.state);
  const label = getEmotionalLabel(profile.state);

  if (compact) {
    return (
      <div
        className="flex items-center gap-2 p-2 bg-gray-800 rounded-lg"
        data-testid="emotional-indicator"
        data-opening-repertoire={personality.openingRepertoire}
      >
        <span className="text-2xl" role="img" aria-label={`Estado: ${label}`}>
          {icon}
        </span>
        <div className="flex flex-col">
          <span className={`text-sm font-medium ${textColor}`}>
            {label}
          </span>
          <div className="w-20 h-1.5 bg-gray-700 rounded-full overflow-hidden">
            <div
              className={`h-full ${color} transition-all duration-500`}
              style={{ width: `${confidence}%` }}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="flex flex-col gap-3 p-4 bg-gray-800 rounded-lg border border-gray-700"
      data-testid="emotional-indicator"
      data-opening-repertoire={personality.openingRepertoire}
    >
      {/* Header com ícone e label */}
      <div className="flex items-center gap-3">
        <span className="text-4xl" role="img" aria-label={`Estado: ${label}`}>
          {icon}
        </span>
        <div className="flex flex-col flex-1">
          <span className="text-sm text-gray-400">Estado da IA</span>
          <span className={`text-lg font-semibold ${textColor}`}>
            {label}
          </span>
        </div>
      </div>

      {/* Barra de confiança */}
      <div className="space-y-1">
        <div className="flex justify-between text-xs text-gray-400">
          <span>Confiança</span>
          <span>{confidence}%</span>
        </div>
        <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
          <div
            className={`h-full ${color} transition-all duration-500 ease-out`}
            style={{ width: `${confidence}%` }}
          />
        </div>
      </div>

      {/* Métricas adicionais */}
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="flex justify-between">
          <span className="text-gray-400">Tolerância ao risco:</span>
          <span className={textColor}>
            {Math.round(profile.riskTolerance * 100)}%
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Agressividade:</span>
          <span className={textColor}>
            {Math.round(profile.aggressionLevel * 100)}%
          </span>
        </div>
      </div>

      {/* Mensagem contextual */}
      {showMessage && profile.message && (
        <div className="mt-2 p-2 bg-gray-700/50 rounded border-l-2 border-gray-500">
          <p className={`text-sm italic ${textColor}`}>
            "{profile.message}"
          </p>
        </div>
      )}
    </div>
  );
};

export default EmotionalIndicator;
