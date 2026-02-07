import { motion } from 'framer-motion';
import { BookOpen, Users, Brain, BarChart3, Settings, Crown, Target } from 'lucide-react';
import { useGameStore } from '@/store/gameStore';
import type { GameMode } from '@/types/chess';

interface MenuCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  mode: GameMode | 'analysis' | 'settings';
  color: string;
  delay: number;
}

function MenuCard({ title, description, icon, mode, color, delay }: MenuCardProps) {
  const { setGameMode, setView } = useGameStore();
  
  const handleClick = () => {
    if (mode === 'analysis' || mode === 'settings' || mode === 'tutorial') {
      setView(mode as any);
    } else {
      setGameMode(mode as GameMode);
      setView('game');
    }
  };
  
  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      whileHover={{ scale: 1.03, y: -5 }}
      whileTap={{ scale: 0.98 }}
      onClick={handleClick}
      className={`relative overflow-hidden rounded-2xl p-6 text-left transition-all ${color}`}
    >
      <div className="relative z-10">
        <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
          {icon}
        </div>
        <h3 className="mb-1 text-xl font-bold text-white">{title}</h3>
        <p className="text-sm text-white/80">{description}</p>
      </div>
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
    </motion.button>
  );
}

export function MainMenu() {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12 text-center"
      >
        <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-indigo-500/20 px-4 py-2 text-indigo-300">
          <Crown className="h-4 w-4" />
          <span className="text-sm font-medium">Rabelus Lab Presents</span>
        </div>
        <h1 className="mb-2 text-5xl font-bold text-white">
          <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Chess XGR
          </span>
        </h1>
        <p className="text-lg text-slate-400">Do zero à maestria probabilística</p>
      </motion.div>
      
      {/* Menu Grid */}
      <div className="mx-auto grid max-w-5xl gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <MenuCard
          title="Tutorial XGR"
          description="Aprenda com nosso currículo progressivo de xadrez"
          icon={<BookOpen className="h-6 w-6 text-white" />}
          mode="tutorial"
          color="bg-gradient-to-br from-blue-600 to-blue-800"
          delay={0.1}
        />
        
        <MenuCard
          title="Praticar vs IA"
          description="Jogue contra nossa IA Neural-X adaptativa"
          icon={<Brain className="h-6 w-6 text-white" />}
          mode="practice"
          color="bg-gradient-to-br from-purple-600 to-purple-800"
          delay={0.2}
        />
        
        <MenuCard
          title="Hot-Seat 2P"
          description="Jogue com um amigo no mesmo dispositivo"
          icon={<Users className="h-6 w-6 text-white" />}
          mode="hotseat"
          color="bg-gradient-to-br from-emerald-600 to-emerald-800"
          delay={0.3}
        />
        
        <MenuCard
          title="Análise"
          description="Analise partidas com gráficos e sugestões"
          icon={<BarChart3 className="h-6 w-6 text-white" />}
          mode="analysis"
          color="bg-gradient-to-br from-orange-600 to-orange-800"
          delay={0.4}
        />
        
        <MenuCard
          title="Desafios"
          description="Resolva puzzles e desafios táticos"
          icon={<Target className="h-6 w-6 text-white" />}
          mode="practice"
          color="bg-gradient-to-br from-rose-600 to-rose-800"
          delay={0.5}
        />
        
        <MenuCard
          title="Configurações"
          description="Personalize temas, IA e preferências"
          icon={<Settings className="h-6 w-6 text-white" />}
          mode="settings"
          color="bg-gradient-to-br from-slate-600 to-slate-800"
          delay={0.6}
        />
      </div>
      
      {/* Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="mt-auto pt-12 text-center"
      >
        <p className="text-sm text-slate-500">
          © 2025 Rabelus Lab. Powered by Neural-X AI Engine
        </p>
      </motion.div>
    </div>
  );
}
