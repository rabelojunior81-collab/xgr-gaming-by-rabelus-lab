import type { GameTheme } from '@shared/types/chess';

export const themes: Record<string, GameTheme> = {
  classic: {
    id: 'classic',
    name: 'Clássico',
    boardLight: '#E8D5B5',
    boardDark: '#B58962',
    pieceStyle: 'classic',
    ambientLight: 0.8,
    accentColor: '#8B4513'
  },
  cyberpunk: {
    id: 'cyberpunk',
    name: 'Cyberpunk',
    boardLight: '#1a1a2e',
    boardDark: '#16213e',
    pieceStyle: 'futuristic',
    ambientLight: 0.6,
    accentColor: '#00fff5'
  },
  minimalist: {
    id: 'minimalist',
    name: 'Minimalista',
    boardLight: '#f5f5f5',
    boardDark: '#2d2d2d',
    pieceStyle: 'neon',
    ambientLight: 0.9,
    accentColor: '#6366f1'
  }
};

export const getTheme = (id: string): GameTheme => themes[id] || themes.classic;
