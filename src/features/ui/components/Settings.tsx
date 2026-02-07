import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Sliders, Palette, Brain, Clock } from 'lucide-react';
import { useGameStore } from '@game/store/gameStore';
import { useState } from 'react';
import type { Theme, Difficulty, AIPersonality, AISpeed } from '@shared/types/chess';

export function Settings() {
  const {
    setView,
    theme,
    setTheme,
    difficulty,
    setDifficulty,
    aiPersonality,
    setAIPersonality,
    aiSpeed,
    setAISpeed
  } = useGameStore();
  
  const [activeTab, setActiveTab] = useState<'general' | 'ai'>('general');
  
  const themes: { id: Theme; name: string; description: string }[] = [
    { id: 'classic', name: 'Clássico', description: 'Madeira e mármore tradicional' },
    { id: 'cyberpunk', name: 'Cyberpunk', description: 'Neon e circuitos futuristas' },
    { id: 'minimalist', name: 'Minimalista', description: 'Design limpo e moderno' }
  ];
  
  const difficulties: { id: Difficulty; name: string; description: string }[] = [
    { id: 'beginner', name: 'Iniciante', description: '400-600 Elo - Aprendendo as regras' },
    { id: 'club', name: 'Clube', description: '1200-1400 Elo - Jogador intermediário' },
    { id: 'master', name: 'Mestre', description: '2000-2200 Elo - Precisão alta' },
    { id: 'custom', name: 'Personalizado', description: 'Ajuste os fatores da IA' }
  ];

  const aiSpeeds: { id: AISpeed; name: string; description: string; icon: string }[] = [
    { id: 'fast', name: 'Rápido', description: 'Delay mínimo (0.2-1s)', icon: '⚡' },
    { id: 'normal', name: 'Normal', description: 'Balanceado (0.5-3s)', icon: '⏱️' },
    { id: 'slow', name: 'Lento', description: 'Mais realista (0.8-5s)', icon: '🧠' }
  ];

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
        <h1 className="text-3xl font-bold text-white">Configurações</h1>
      </div>
      
      {/* Tabs */}
      <div className="mb-6 flex gap-2">
        <button
          onClick={() => setActiveTab('general')}
          className={`flex items-center gap-2 rounded-lg px-4 py-2 ${
            activeTab === 'general' 
              ? 'bg-indigo-600 text-white' 
              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
          }`}
        >
          <Palette className="h-4 w-4" />
          Geral
        </button>
        <button
          onClick={() => setActiveTab('ai')}
          className={`flex items-center gap-2 rounded-lg px-4 py-2 ${
            activeTab === 'ai' 
              ? 'bg-indigo-600 text-white' 
              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
          }`}
        >
          <Brain className="h-4 w-4" />
          IA Neural-X
        </button>
      </div>
      
      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex-1"
      >
        {activeTab === 'general' ? (
          <div className="space-y-6">
            {/* Theme Selection */}
            <div className="rounded-xl bg-slate-800/50 p-6">
              <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-white">
                <Palette className="h-5 w-5 text-indigo-400" />
                Tema Visual
              </h2>
              <div className="grid gap-4 sm:grid-cols-3">
                {themes.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setTheme(t.id)}
                    className={`rounded-xl border-2 p-4 text-left transition-all ${
                      theme === t.id
                        ? 'border-indigo-500 bg-indigo-500/20'
                        : 'border-slate-700 bg-slate-800 hover:border-slate-600'
                    }`}
                  >
                    <h3 className="font-medium text-white">{t.name}</h3>
                    <p className="text-sm text-slate-400">{t.description}</p>
                  </button>
                ))}
              </div>
            </div>
            
            {/* Difficulty Selection */}
            <div className="rounded-xl bg-slate-800/50 p-6">
              <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-white">
                <Sliders className="h-5 w-5 text-indigo-400" />
                Nível de Dificuldade
              </h2>
              <div className="space-y-3">
                {difficulties.map((d) => (
                  <button
                    key={d.id}
                    onClick={() => setDifficulty(d.id)}
                    className={`flex w-full items-center justify-between rounded-xl border-2 p-4 text-left transition-all ${
                      difficulty === d.id
                        ? 'border-indigo-500 bg-indigo-500/20'
                        : 'border-slate-700 bg-slate-800 hover:border-slate-600'
                    }`}
                  >
                    <div>
                      <h3 className="font-medium text-white">{d.name}</h3>
                      <p className="text-sm text-slate-400">{d.description}</p>
                    </div>
                    {difficulty === d.id && (
                      <ChevronRight className="h-5 w-5 text-indigo-400" />
                    )}
                  </button>
                ))}
              </div>
            </div>
            
            {/* AI Speed Selection */}
            <div className="rounded-xl bg-slate-800/50 p-6">
              <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-white">
                <Clock className="h-5 w-5 text-indigo-400" />
                Velocidade da IA
              </h2>
              <p className="mb-4 text-sm text-slate-400">
                Controle o tempo de reflexão do Drakon. Posições mais complexas naturalmente levam mais tempo.
              </p>
              <div className="grid gap-3 sm:grid-cols-3">
                {aiSpeeds.map((speed) => (
                  <button
                    key={speed.id}
                    onClick={() => setAISpeed(speed.id)}
                    className={`flex flex-col items-center gap-2 rounded-xl border-2 p-4 text-center transition-all ${
                      aiSpeed === speed.id
                        ? 'border-indigo-500 bg-indigo-500/20'
                        : 'border-slate-700 bg-slate-800 hover:border-slate-600'
                    }`}
                  >
                    <span className="text-2xl">{speed.icon}</span>
                    <div>
                      <h3 className="font-medium text-white">{speed.name}</h3>
                      <p className="text-xs text-slate-400">{speed.description}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <AIPersonalitySettings 
            personality={aiPersonality}
            onChange={setAIPersonality}
          />
        )}
      </motion.div>
    </div>
  );
}

function AIPersonalitySettings({ 
  personality, 
  onChange 
}: { 
  personality: AIPersonality;
  onChange: (p: AIPersonality) => void;
}) {
  const updatePersonality = (key: keyof AIPersonality, value: number | string) => {
    onChange({ ...personality, [key]: value });
  };
  
  const sliders: { key: keyof AIPersonality; label: string; description: string }[] = [
    { 
      key: 'aggressiveness', 
      label: 'Agressividade',
      description: 'Tendência a sacrificar material por iniciativa'
    },
    { 
      key: 'technicalPrecision', 
      label: 'Precisão Técnica',
      description: 'Probabilidade de cálculos precisos'
    },
    { 
      key: 'thinkingTime', 
      label: 'Tempo de Reflexão',
      description: 'Simulação de tempo de pensamento'
    },
    { 
      key: 'emotionalResilience', 
      label: 'Resiliência Emocional',
      description: 'Mantém precisão sob pressão'
    }
  ];
  
  const openings = [
    { value: 'balanced', label: 'Equilibrado' },
    { value: 'e4', label: 'Aberto (1.e4)' },
    { value: 'd4', label: 'Fechado (1.d4)' },
    { value: 'indian', label: 'Índias (1.Nf3)' },
    { value: 'sicilian', label: 'Siciliana' },
    { value: 'french', label: 'Francesa' }
  ];

  return (
    <div className="space-y-6">
      <div className="rounded-xl bg-slate-800/50 p-6">
        <h2 className="mb-4 text-xl font-semibold text-white">
          Personalidade da IA Neural-X
        </h2>
        <p className="mb-6 text-slate-400">
          Ajuste os 5 fatores para criar um oponente único com características humanas realistas.
        </p>
        
        {/* Sliders */}
        <div className="space-y-6">
          {sliders.map((slider) => (
            <div key={slider.key}>
              <div className="mb-2 flex items-center justify-between">
                <label className="font-medium text-white">{slider.label}</label>
                <span className="text-indigo-400">
                  {personality[slider.key] as number}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={personality[slider.key] as number}
                onChange={(e) => updatePersonality(slider.key, parseInt(e.target.value))}
                className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-slate-700 accent-indigo-500"
              />
              <p className="mt-1 text-xs text-slate-500">{slider.description}</p>
            </div>
          ))}
        </div>
        
        {/* Opening Repertoire */}
        <div className="mt-6">
          <label className="mb-2 block font-medium text-white">
            Repertório de Aberturas
          </label>
          <select
            value={personality.openingRepertoire}
            onChange={(e) => updatePersonality('openingRepertoire', e.target.value)}
            className="w-full rounded-lg border border-slate-600 bg-slate-700 px-4 py-2 text-white focus:border-indigo-500 focus:outline-none"
          >
            {openings.map((op) => (
              <option key={op.value} value={op.value}>{op.label}</option>
            ))}
          </select>
        </div>
      </div>
      
      {/* Preview Card */}
      <div className="rounded-xl bg-gradient-to-br from-indigo-900/50 to-purple-900/50 p-6">
        <h3 className="mb-2 font-semibold text-white">Perfil da IA</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-slate-400">Estilo:</span>
            <span className="text-white">
              {personality.aggressiveness > 70 ? 'Atacante' : 
               personality.aggressiveness < 30 ? 'Posicional' : 'Equilibrado'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Força Técnica:</span>
            <span className="text-white">
              {personality.technicalPrecision > 80 ? 'Mestre' :
               personality.technicalPrecision > 50 ? 'Clube' : 'Iniciante'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Abertura Favorita:</span>
            <span className="text-white">
              {openings.find(o => o.value === personality.openingRepertoire)?.label}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
