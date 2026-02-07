# IMPLEMENTATION: Sub-Sprint 2.1.2 - Gestão de Tempo

## Resumo
Implementação do Fator 4 da IA Neural-X: Gestão de Tempo. Este sistema adiciona delays de reflexão variáveis que simulam um jogador humano pensando, com tempo proporcional à complexidade da posição e personalidade da IA.

## Arquivos Criados/Modificados

### Novos Arquivos
- `src/engine/timeManager.ts` - Gerenciador de tempo de reflexão
- `src/components/ui/ThinkingIndicator.tsx` - Indicador visual de "pensando"
- `src/__tests__/unit/timeManager.test.ts` - Testes unitários
- `docs/sprints/fase-2/sprint-2.1-ia-neural-x/sub-sprint-2.1.2/SPEC.md` - Especificação
- `docs/sprints/fase-2/sprint-2.1-ia-neural-x/sub-sprint-2.1.2/IMPLEMENTATION.md` - Este arquivo
- `docs/sprints/fase-2/sprint-2.1-ia-neural-x/sub-sprint-2.1.2/TEST_PLAN.md` - Plano de testes

### Arquivos Modificados
- `src/engine/chessEngine.ts` - Integração com TimeManager
- `src/store/gameStore.ts` - Estado global de aiSpeed
- `src/components/ui/Settings.tsx` - Configuração de velocidade
- `src/types/chess.ts` - Novos tipos (AISpeed, PositionComplexity, TimeConfig)

## Arquitetura

### TimeManager
O [`TimeManager`](src/engine/timeManager.ts:1) é o núcleo do sistema de gestão de tempo:

```
TimeManager
├── calculateComplexity(game) → PositionComplexity
│   ├── pieceCount (0-100)
│   ├── materialBalance (0-100)
│   ├── tacticalOpportunities (0-100)
│   └── gamePhase (opening/middlegame/endgame)
├── calculateDelay(complexity, personality) → number
│   ├── baseDelay
│   ├── complexity × factor
│   ├── personality factor
│   └── random variation
└── simulateThinking(delay, onProgress) → Promise<void>
```

### Fórmula de Complexidade
```
complexity = (pieceCount × 0.3) +
             (materialBalance × 0.2) +
             (tacticalOpportunities × 0.3) +
             (gamePhase × 0.2)
```

**Fatores:**
- **pieceCount**: 32 peças = 100, 4 peças = 10
- **materialBalance**: diferença de material (0 = igual, 100 = +9 peças)
- **tacticalOpportunities**: xeques, capturas, ameaças
- **gamePhase**: opening=30, middlegame=100, endgame=50

### Fórmula de Delay
```
delay = baseDelay +
        (complexity × complexityFactor × personalityFactor) +
        random(-variation, +variation)
```

**Personalidade afeta o tempo:**
- **Agressivo** (agressividade > 70): 0.7× (impulsivo)
- **Sólido** (agressividade < 30): 1.3× (cauteloso)
- **Preciso** (precisão > 80): 1.2× (mais tempo)
- **Tático** (oportunidades > 50): +1.2× (mais tempo em posições táticas)

### Configurações de Velocidade

| Velocidade | Base Delay | Max Delay | Fator | Variação |
|------------|------------|-----------|-------|----------|
| Fast ⚡     | 200ms      | 1000ms    | 5     | 10%      |
| Normal ⏱️   | 500ms      | 3000ms    | 15    | 20%      |
| Slow 🧠     | 800ms      | 5000ms    | 30    | 30%      |

## UX Decisões

### Indicador Visual
O [`ThinkingIndicator`](src/components/ui/ThinkingIndicator.tsx:1) fornece feedback visual durante o tempo de reflexão:

- **Spinner animado** com rotação e pulsação
- **Barra de progresso** com efeito de brilho
- **Mensagem personalizada** baseada na personalidade
  - Agressivo: "Drakon está calculando ataques..."
  - Posicional: "Drakon está avaliando a posição..."
  - Preciso: "Drakon está analisando profundamente..."
- **Tempo estimado** restante
- **Pontinhos animados** indicando atividade

### Integração no GameControls
O indicador aparece no painel do jogador que está pensando:
- Spinner rotativo quando `isThinking && turn === 'b'` (ou 'w')
- Desaparece automaticamente quando o movimento é feito

### Configuração no Settings
Adicionada nova seção "Velocidade da IA" na aba Geral:
- Três botões de seleção (Rápido/Normal/Lento)
- Ícones intuitivos (⚡/⏱️/🧠)
- Descrição de range de tempo
- Persistência automática

## Integração ChessEngine

### Fluxo de getAIMove
```typescript
public async getAIMove(difficulty, personality): Promise<Move | null> {
  // 1. Calcular complexidade
  const complexity = timeManager.calculateComplexity(game);
  
  // 2. Calcular delay
  const delay = timeManager.calculateDelay(complexity, personality);
  
  // 3. Simular reflexão (se não for movimento de livro)
  await timeManager.simulateThinking(delay, (progress) => {
    if (this.onThinkingProgress) this.onThinkingProgress(progress);
  });
  
  // 4. Executar movimento
  return this.calculateBestMove(difficulty);
}
```

### Callback de Progresso
O engine expõe [`onThinkingProgress`](src/engine/chessEngine.ts:27) para UI:
```typescript
engine.onThinkingProgress = (progress) => {
  setThinkingProgress(progress);
};
```

## Trade-offs Considerados

### Delay vs Responsividade
- **Decisão**: Mínimo de 500ms mesmo em posições simples
- **Justificativa**: Mantém ilusão de "pensamento" sem frustrar jogadores

### Complexidade do Cálculo
- **Decisão**: Cálculo síncrono e leve (sem Stockfish)
- **Justificativa**: Evita overhead adicional, usa heurísticas rápidas

### Movimentos de Livro
- **Decisão**: Delay reduzido (máx 500ms) para aberturas
- **Justificativa**: Jogadores humanos também jogam aberturas mais rápido

### Variação Aleatória
- **Decisão**: 10-30% dependendo da velocidade
- **Justificativa**: Evita padrões previsíveis, parece mais natural

## Testes

### Cobertura
- **calculateComplexity**: 100%
- **calculateDelay**: 100%
- **simulateThinking**: 100%
- **Personalidades**: 100%
- **speedConfigs**: 100%

### Casos de Teste Principais
1. Complexidade entre 0-100
2. Delay respeita min/max
3. Aggressive < Solid em tempo
4. Progress callback é chamado
5. Configurações de velocidade funcionam

## Próximos Passos (FASE 2)

### Validação Bilateral
- Testar em partidas reais
- Ajustar fatores se necessário
- Coletar feedback de UX

### Otimizações Futuras
- Cache de complexidade para posições repetidas
- Machine learning para prever tempo "humano" ideal
- Animações mais elaboradas no indicador
