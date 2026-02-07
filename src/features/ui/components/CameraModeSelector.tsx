import React from 'react';
import { useGameStore, CameraMode } from '@game/store/gameStore';
import { Camera, Users, Square, Monitor } from 'lucide-react';

const cameraModes: { value: CameraMode; label: string; icon: React.ReactNode; description: string }[] = [
  {
    value: 'tabletop',
    label: 'Mesa',
    icon: <Square className="w-5 h-5" />,
    description: 'Visão de cima fixa - ideal para tablets'
  },
  {
    value: 'duel',
    label: 'Duelo',
    icon: <Users className="w-5 h-5" />,
    description: 'Câmera alterna entre jogadores a cada lance'
  },
  {
    value: 'fixed',
    label: 'Fixa',
    icon: <Monitor className="w-5 h-5" />,
    description: 'Posição estática tradicional'
  }
];

export const CameraModeSelector: React.FC = () => {
  const { cameraMode, setCameraMode } = useGameStore();
  
  return (
    <div className="space-y-2" data-testid="camera-mode-selector">
      <div className="flex items-center gap-2 mb-3">
        <Camera className="w-4 h-4 text-gray-400" />
        <span className="text-sm font-medium text-gray-300">Modo de Câmera</span>
      </div>
      
      <div className="grid grid-cols-1 gap-2">
        {cameraModes.map((mode) => (
          <button
            key={mode.value}
            onClick={() => setCameraMode(mode.value)}
            className={`
              flex items-start gap-3 p-3 rounded-lg text-left transition-all
              ${cameraMode === mode.value 
                ? 'bg-blue-600 text-white ring-2 ring-blue-400' 
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }
            `}
          >
            <div className={`
              p-2 rounded-md
              ${cameraMode === mode.value ? 'bg-blue-500' : 'bg-gray-700'}
            `}>
              {mode.icon}
            </div>
            
            <div className="flex-1">
              <div className="font-medium text-sm">{mode.label}</div>
              <div className={`
                text-xs mt-0.5
                ${cameraMode === mode.value ? 'text-blue-100' : 'text-gray-400'}
              `}>
                {mode.description}
              </div>
            </div>
            
            {cameraMode === mode.value && (
              <div className="self-center">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
            )}
          </button>
        ))}
      </div>
      
      {cameraMode === 'duel' && (
        <div className="mt-3 p-2 bg-blue-900/30 border border-blue-800 rounded-lg">
          <p className="text-xs text-blue-200">
            💡 No modo Duelo, a câmera gira automaticamente a cada lance para 
            mostrar a perspectiva do jogador ativo.
          </p>
        </div>
      )}
    </div>
  );
};

export default CameraModeSelector;
