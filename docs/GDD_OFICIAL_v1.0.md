# 📋 GAME DESIGN DOCUMENT OFICIAL
## **Chess - XGR Gaming by Rabelus Lab**
### Versão 1.0 | Data: 01/02/2026

---

## 📌 META-INFORMAÇÕES

| Campo | Valor |
|-------|-------|
| **Nome do Projeto** | Chess - XGR Gaming |
| **Desenvolvedor** | Rabelus Lab |
| **Tagline** | *"Do zero à maestria probabilística"* |
| **Plataforma Alvo** | Web (Primary) / Mobile / Desktop (Cross-platform) |
| **Stack Atual** | React + TypeScript + Three.js/R3F + Vite |
| **Documento Criado** | 01/02/2026 |
| **Última Atualização** | 01/02/2026 |

---

## 1. 🎯 CONCEITO CORE & IDENTIDADE VISUAL

### 1.1 Visão do Produto
Um simulador de xadrez educacional 3D com IA adaptativa e multiplayer local, projetado para guiar jogadores do zero absoluto até níveis avançados de compreensão estratégica e probabilística.

### 1.2 Estética 3D
- **Tabuleiro holográfico** flutuante com peças de design futurista-clássico (Staunton modernizado)
- **Ambientes imersivos mutáveis:**
  - **Clássico:** Madeira/Mármore tradicional
  - **Cyberpunk:** Neon/Circuitos com partículas flutuantes
  - **Minimalista:** Plasma com design limpo
- **Câmera dinâmica** com rotação 360° e modos espectador cinematográficos

### 1.3 Paleta de Cores por Tema

| Tema | Casas Claras | Casas Escuras | Cor de Destaque |
|------|--------------|---------------|-----------------|
| Clássico | `#E8D5B5` | `#B58962` | `#8B4513` |
| Cyberpunk | `#1a1a2e` | `#16213e` | `#00fff5` |
| Minimalista | `#f5f5f5` | `#2d2d2d` | `#6366f1` |

---

## 2. 📚 SISTEMA EDUCACIONAL: "XGR TUTOR"

### 2.1 Curriculum Progressivo (Árvore de Skills)

```
MÓDULO 1: FUNDAMENTOS (Elo 0-400)
├── 🏁 Movimentação das peças
├── ♔ Xeque e Xeque-mate básicos
└── 💎 Valor material relativo

MÓDULO 2: TÁTICA (Elo 400-1000)
├── ⚔️ Padrões: Garfos, Skewers, Pins
├── 👑 Finais elementares (Rei e Peão vs Rei)
└── 🧮 Cálculo de variantes (2-3 lances)

MÓDULO 3: ESTRATÉGIA (Elo 1000-1600)
├── 🎯 Controle de centro e espaço
├── 🏗️ Estrutura de peões
└── 🚀 Desenvolvimento e tempos

MÓDULO 4: ANALYTICS (Elo 1600-2200+)
├── 📊 Probabilidade de vantagem (+- %)
├── 🎯 Análise de precisão (comparativo Stockfish)
└── 🧠 Reconhecimento de padrões complexos
```

### 2.2 Funcionalidades do Tutor (Planejadas)
- **Overlay Educacional:** Destaque de quadrados chave com correntes de influência
- **Biblioteca de Partidas Históricas:** Replay imersivo de clássicos com narração
- **Modo "Por Que?":** Explicação em linguagem natural do raciocínio da IA
- **Treinador Probabilístico:** Mostra delta de win-rate para alternativas

---

## 3. 🤖 MOTOR DE IA ADAPTATIVO: "NEURAL-X"

### 3.1 Arquitetura do Sistema
Sistema híbrido combinando Stockfish como base + Camada de Personalidade Neural

### 3.2 Perfis Pré-definidos

| Perfil | Força (Elo) | Características |
|--------|-------------|-----------------|
| **Iniciante** | 400-600 | Ignora en passant, cai em mates básicos, valorização rígida |
| **Clube** | 1200-1400 | Aberturas básicas, tática consistente, erros posicionais |
| **Mestre** | 2000-2200 | Precisão alta, preparação teórica, calcula 15+ lances |
| **Custom** | Variável | Usuário ajusta os 5 Fatores abaixo |

### 3.3 Os 5 Fatores de Personalização (Sliders 0-100)

1. **Agressividade (0-100)**
   - 0 = Jogo puramente posicional
   - 100 = Tático extremo, sacrifica material por iniciativa

2. **Precisão Técnica (0-100)**
   - Controla probabilidade de erro via "ruído" na avaliação
   - 100 = Precisão de engine, 0 = Erros frequentes

3. **Repertório de Abertura**
   - Equilibrado, Aberto (1.e4), Fechado (1.d4), Índias, Siciliana, Francesa

4. **Tempo de Reflexão (0-100)**
   - Simulação de pensamento humano
   - IA "hesita" em posições complexas mesmo com cálculo instantâneo

5. **Resiliência Emocional (0-100)**
   - 0 = Desmorona após erro grave
   - 100 = Mantém precisão sob pressão

### 3.4 Alinhamento Adaptativo (Futuro)
- **Análise de Weakness:** Detecta pontos fracos do usuário
- **Curve Fitting:** Ajusta para manter taxa de vitória 45-55%

---

## 4. 🎮 MULTIPLAYER LOCAL: "HOT-SEAT 3D"

### 4.1 Modos de Visualização
- **Modo Mesa (Tabletop):** Visão de cima, ideal para tablets lado a lado
- **Modo Duelo:** Câmera roda 180° entre lances (transição suave 1.5s)
- **Blind Mode:** Peças adversárias sombreadas fora do turno (fair play)

### 4.2 Controles
- **Touch/Mouse:** Drag-and-drop com ghost moves (pré-visualização)
- **Confirmar Lance:** Clique duplo ou botão de confirmação
- **Undo:** Apenas com consentimento do oponente (pop-up não-intrusivo)

### 4.3 Sessão Persistente (Planejado)
- Salvamento automático a cada lance
- Histórico de partidas locais com exportação PGN
- Estatísticas head-to-head entre perfis locais

---

## 5. 📈 SISTEMA DE REPLAY & ANÁLISE

### 5.1 Funcionalidades Core
- **Timeline 3D:** Barra scrubbable para navegação temporal
- **Sugestões Contextuais:** Setas luminosas mostrando jogadas da IA
- **Gráfico de Avaliação:** Visualização de vantagem ao longo do jogo
- **Blunders Highlight:** Marcadores visuais em quedas de avaliação

### 5.2 Métricas de Análise
- Avaliação centipawn (cp) e mate
- Probabilidade de vitória (Win Rate %)
- Precisão por jogador
- Classificação de lances (Excelente/Bom/Imprecisão/Erro/Blunder)

### 5.3 Heatmap de Controle (Futuro)
- Visualização de quem controlava quais casas ao longo do tempo

---

## 6. 🏗️ ARQUITETURA TÉCNICA

### 6.1 Stack Atual
```
┌─────────────────────────────────────────────────────────────┐
│                        FRONTEND                              │
├─────────────────────────────────────────────────────────────┤
│  React 19.2.3        │  Framework UI base                   │
│  TypeScript 5.9.3    │  Tipagem estática                    │
│  Vite 7.2.4          │  Bundler e dev server                │
│  TailwindCSS 4.1.17  │  Estilização utility-first           │
│  Framer Motion 12.29 │  Animações e transições              │
│  Zustand 5.0.11      │  Gerenciamento de estado             │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                        3D ENGINE                             │
├─────────────────────────────────────────────────────────────┤
│  Three.js 0.182      │  Biblioteca 3D base                  │
│  React Three Fiber   │  Integração React + Three.js         │
│  @react-three/drei   │  Helpers e componentes 3D            │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                      CHESS ENGINE                            │
├─────────────────────────────────────────────────────────────┤
│  chess.js 1.4.0      │  Lógica de xadrez e validação        │
│  Stockfish 17.1.0    │  Engine de análise (Web Worker)      │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                         OUTROS                               │
├─────────────────────────────────────────────────────────────┤
│  Lucide React        │  Ícones SVG                          │
│  Recharts 3.7.0      │  Gráficos (análise)                  │
│  clsx + tailwind-merge│ Utilitários CSS                     │
└─────────────────────────────────────────────────────────────┘
```

### 6.2 Estrutura de Pastas
```
chess-gdd-3d/
├── src/
│   ├── components/
│   │   ├── 3d/              # Componentes 3D (Tabuleiro, Peças)
│   │   └── ui/              # Interface do usuário
│   ├── data/                # Dados estáticos (temas, tutoriais)
│   ├── engine/              # Motor de xadrez
│   ├── store/               # Estado global (Zustand)
│   ├── types/               # Tipos TypeScript
│   └── utils/               # Utilitários
├── docs/                    # Documentação
└── public/                  # Assets estáticos
```

---

## 7. 💰 MONETIZAÇÃO E PROGRESSÃO (Futuro)

### 7.1 Modelo Freemium
- Jogo base gratuito
- Tutor avançado (módulos 3-4) via assinatura

### 7.2 Cosméticos 3D
- Skins de tabuleiro desbloqueáveis
- Peças temáticas via conquistas

### 7.3 Certificados XGR
- Badges digitais comprovando nível
- Integração com LinkedIn (futuro)

---

## 8. 🔄 FLUXO DE USUÁRIO

```
1. ONBOARDING
   └── Tutorial interativo 3D ensinando movimentos básicos

2. AVALIAÇÃO INICIAL
   └── Partida rápida contra IA para calibrar nível

3. ESCOLHA DO MODO
   ├── ESTUDAR: Biblioteca de jogos famosos com tutor
   ├── PRATICAR: Contra IA com fatores customizados
   └── DESAFIAR: Hot-seat com amigo

4. PÓS-PARTIDA
   └── Análise completa com gráficos e sugestões de estudo
```

---

## 9. 🌟 DIFERENCIAIS COMPETITIVOS

1. **IA como Coach, não apenas Oponente**
   - Explica o "porquê" das jogadas em linguagem humana

2. **Fatores Psicológicos**
   - Simulação de perfis humanos realistas vs. robô perfeito

3. **Experiência 3D Significativa**
   - Câmeras cinematográficas que auxiliam visualização tática

4. **Currículo Progressivo**
   - Do zero absoluto ao nível de grandmaster

---

## 📝 CHANGELOG

| Versão | Data | Descrição |
|--------|------|-----------|
| 1.0 | 01/02/2026 | Documento inicial baseado no GDD conceitual |

---

## 📎 REFERÊNCIAS

- GDD Conceitual Original: LLM Arena (Fevereiro/2026)
- Chess.js: https://github.com/jhlywa/chess.js
- Stockfish: https://stockfishchess.org/
- Three.js: https://threejs.org/
- React Three Fiber: https://r3f.docs.pmnd.rs/

---

*Este documento serve como "norte" oficial para o desenvolvimento do Chess XGR Gaming. Todas as decisões de implementação devem ser validadas contra este GDD.*
