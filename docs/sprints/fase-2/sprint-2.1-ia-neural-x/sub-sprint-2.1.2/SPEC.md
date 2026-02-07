# SPEC: Sub-Sprint 2.1.2 - Gestão de Tempo

## Metadados
- **Versão:** v1.3.2-fase2.sprint1.2
- **Data:** 2026-02-02
- **Complexidade:** Baixa
- **Estimativa:** 3-4 horas

## Objetivo
Implementar Fator 4 da IA Neural-X: Gestão de Tempo, adicionando delays de reflexão variáveis que simulam um jogador humano pensando. A IA deve levar mais tempo em posições complexas e menos tempo em posições óbvias.

## Requisitos Funcionais
1. Delay artificial antes da IA jogar (não instantâneo)
2. Tempo proporcional à complexidade da posição
3. Variação baseada na personalidade da IA
4. Indicador visual de "IA pensando"
5. Configuração de velocidade global (Rápido/Normal/Lento)

## Requisitos Técnicos
- Cálculo de complexidade baseado em:
  - Número de peças no tabuleiro
  - Material balanceado vs desbalanceado
  - Presença de ameaças/táticas
  - Fase do jogo (abertura/meio/final)
- Fórmula de tempo: base + (complexidade × fator) + aleatoriedade
- Máximo delay: 5 segundos (configurável)

## Arquitetura

### Componentes Principais
```
┌─────────────────────────────────────────────────────────────┐
│                     TimeManager                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ calculateComplexity(game) → PositionComplexity       │  │
│  │ calculateDelay(complexity, personality) → number     │  │
│  │ simulateThinking(delay, onProgress) → Promise<void>  │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    ChessEngine (modificado)                  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ getAIMove() → aguarda TimeManager                    │  │
│  │ onThinkingProgress → callback de progresso           │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                 ThinkingIndicator (UI)                       │
│  - Spinner animado                                           │
│  - Barra de progresso                                        │
│  - Texto "Drakon está pensando..."                          │
└─────────────────────────────────────────────────────────────┘
```

### Tipos de Dados

```typescript
// Configuração de tempo
interface TimeConfig {
  baseDelay: number;        // ms (ex: 500)
  complexityFactor: number; // ms por unidade de complexidade
  maxDelay: number;         // ms (ex: 5000)
  randomVariation: number;  // % (ex: 0.2 = 20%)
}

// Complexidade da posição
interface PositionComplexity {
  score: number; // 0-100
  factors: {
    pieceCount: number;           // mais peças = mais complexo
    materialBalance: number;      // 0=balanceado, 100=desbalanceado
    tacticalOpportunities: number; // ameaças presentes
    gamePhase: 'opening' | 'middlegame' | 'endgame';
  };
}

// Velocidade da IA
 type AISpeed = 'fast' | 'normal' | 'slow';
```

### Fórmula de Complexidade

```
Fatores individuais (0-100 cada):
- pieceCount: 32 peças = 100, 4 peças = 10
- materialBalance: diferença de material (0 = igual, 100 = +9 peças)
- tacticalOpportunities: checks, captures, threats detectados
- gamePhase: opening=30, middlegame=100, endgame=50

Fórmula ponderada:
complexity = (pieceCount × 0.3 + 
              materialBalance × 0.2 + 
              tacticalOpportunities × 0.3 + 
              gamePhase × 0.2)
```

### Fórmula de Delay

```
delay = baseDelay + 
        (complexity × complexityFactor × personalityFactor) + 
        random(-randomVariation, +randomVariation)

Onde personalityFactor varia por estilo:
- Aggressive (agressividade > 70): 0.7 (impulsivo)
- Solid (agressividade < 30): 1.3 (cauteloso)
- Positional: 1.0 (balanceado)
- Tactical (ameaças presentes): +0.2
```

### Configurações de Velocidade

```typescript
const speedConfigs: Record<AISpeed, TimeConfig> = {
  fast: { 
    baseDelay: 200, 
    complexityFactor: 5, 
    maxDelay: 1000, 
    randomVariation: 0.1 
  },
  normal: { 
    baseDelay: 500, 
    complexityFactor: 15, 
    maxDelay: 3000, 
    randomVariation: 0.2 
  },
  slow: { 
    baseDelay: 800, 
    complexityFactor: 30, 
    maxDelay: 5000, 
    randomVariation: 0.3 
  }
};
```

## Critérios de Aceitação
- [x] IA nunca joga instantaneamente (mínimo 500ms)
- [x] Posições complexas = mais tempo de reflexão
- [x] Indicador visual durante o "pensamento"
- [x] Configuração de velocidade funciona
- [x] Testes unitários passando (>80% cobertura)

## Dependências
- chess.js (para análise de posição)
- Framer Motion (animações do indicador)
- Zustand (estado global da velocidade)

## Notas de Implementação
1. O delay deve ser não-bloqueante (usar Promise/async)
2. Progresso do thinking deve ser atualizado em intervalos regulares
3. Personalidade da IA afeta o tempo de reflexão
4. Movimentos do livro de aberturas podem ter delay reduzido
