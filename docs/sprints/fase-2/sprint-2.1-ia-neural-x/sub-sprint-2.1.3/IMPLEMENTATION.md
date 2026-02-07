# IMPLEMENTATION: Sub-Sprint 2.1.3 - Resiliência Emocional

## Visão Geral
Este documento detalha a implementação do sistema de Resiliência Emocional (Fator 5 da IA Neural-X), que permite à IA reagir emocionalmente às situações do jogo.

## Arquitetura

### 1. EmotionalStateManager (`src/engine/emotionalState.ts`)
O núcleo do sistema, responsável por:
- Avaliar a situação atual do jogo (material + posicional)
- Determinar o estado emocional baseado em thresholds
- Calcular tolerância ao risco baseada no estado + personalidade
- Fornecer mensagens emocionais contextuais

### 2. Estados Emocionais
```
desperate  → concerned → neutral → optimistic → confident
(-300)      (-100)       (100)      (300)        (500+)
   ↑           ↑           ↑          ↑            ↑
Perdendo   Desvantagem  Equilibrado Vantagem   Vantagem
 grave      leve                     leve       significativa
```

### 3. Fórmulas de Thresholds

#### Thresholds Base (centipawns)
```typescript
const baseThresholds = {
  desperate: -300,  // -3 peões
  concerned: -100,  // -1 peão
  neutral: 100,     // ±1 peão
  optimistic: 300,  // +3 peões
  confident: 500    // +5 peões
};
```

#### Ajustes por Personalidade
- **Aggressive**: thresholds 20% mais tolerantes (não desespera fácil)
- **Solid**: thresholds 20% mais conservadores (não fica confiante cedo)
- **Positional/Tactical**: thresholds normais

### 4. Risk Tolerance por Estado

| Estado | Risk Tolerance | Comportamento |
|--------|---------------|---------------|
| desperate | 0.8-1.0 | Tenta tudo, movimentos táticos arriscados |
| concerned | 0.5-0.7 | Mais agressivo, busca complicações |
| neutral | 0.3-0.5 | Comportamento normal balanceado |
| optimistic | 0.1-0.3 | Conservador, protege vantagem |
| confident | 0.0-0.2 | Muito conservador, simplifica posição |

### 5. Integração com ChessEngine

```typescript
// Fluxo de seleção de movimento
1. Obter avaliação da posição (Stockfish)
2. Avaliar situação emocional
3. Calcular risk tolerance
4. Selecionar movimento considerando risco
5. Aplicar ajustes finais baseados em personalidade
```

### 6. Mensagens Emocionais

O sistema inclui mensagens contextuais que refletem o estado emocional da IA:

#### Aggressive
- **desperate**: ["Ainda não acabou!", "Vou virar isso!", "Hora do tudo ou nada!"]
- **confident**: ["Vitória é certa!", "Ninguém me para!", "Checkmate em breve!"]

#### Solid
- **concerned**: ["Preciso focar...", "Posição difícil", "Vou me defender bem"]
- **confident**: ["Posição sólida", "Vantagem mantida", "Controle total"]

#### Positional
- **desperate**: ["Situação crítica", "Preciso achar um plano"]
- **neutral**: ["Posição equilibrada", "Jogando por vantagem pequena"]

#### Tactical
- **desperate**: ["Buscando tática!", "Onde está a defesa?"]
- **confident**: ["Táticas a favor!", "Vantagem decisiva"]

## Decisões de UX

### EmotionalIndicator Component
- **Ícones**: Representam visualmente o estado (😤😊😐😰😱)
- **Barra de Confiança**: Mostra nível de 0-100%
- **Mensagem**: Texto contextual da IA
- **Cores**: Mudam baseado no estado (verde→amarelo→vermelho)

### Design Decisions
1. **Transições suaves**: Estados mudam gradualmente, não abruptamente
2. **Personalização**: Mensagens variam por personalidade
3. **Opcional**: UI pode ser desativada sem afetar gameplay
4. **Performance**: Cálculos são eficientes, sem impacto no tempo de resposta

## Arquivos Modificados/Criados

### Novos Arquivos
- `src/engine/emotionalState.ts` - Core do sistema emocional
- `src/components/ui/EmotionalIndicator.tsx` - Componente de UI
- `src/__tests__/unit/emotionalState.test.ts` - Testes unitários

### Arquivos Modificados
- `src/types/chess.ts` - Adicionar tipos de estado emocional
- `src/engine/chessEngine.ts` - Integrar EmotionalStateManager

## Testes

### Cobertura
- Estados emocionais para diferentes evaluations
- Efeito da personalidade nos thresholds
- Variação de risk tolerance
- Mensagens contextuais
- Transições de estado
- Integração completa

### Comandos
```bash
npm run test:unit -- emotionalState
cd coverage && open index.html  # Ver cobertura
```

## Próximos Passos
- FASE 2: Validação bilateral
- FASE 3: Integração com sistema de dificuldade
- FASE 4: Documentação final e merge
