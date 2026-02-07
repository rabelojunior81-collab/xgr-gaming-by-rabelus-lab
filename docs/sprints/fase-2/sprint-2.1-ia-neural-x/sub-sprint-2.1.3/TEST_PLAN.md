# TEST PLAN: Sub-Sprint 2.1.3 - Resiliência Emocional

## Testes Manuais (MT)

### MT-001: IA reage quando ganhando
**Objetivo:** Verificar que a IA fica mais conservadora quando tem vantagem

**Passos:**
1. Iniciar jogo contra IA em dificuldade "custom"
2. Configurar IA com posição de vantagem material (+3 peões ou mais)
3. Observar comportamento da IA

**Critérios de Aprovação:**
- [ ] IA escolhe movimentos mais sólidos
- [ ] Risk tolerance abaixo de 0.3
- [ ] Estado emocional é 'confident' ou 'optimistic'
- [ ] Mensagem reflete confiança

### MT-002: IA reage quando perdendo
**Objetivo:** Verificar que a IA fica mais arriscada quando em desvantagem

**Passos:**
1. Iniciar jogo contra IA
2. Configurar IA com posição de desvantagem material (-3 peões ou mais)
3. Observar comportamento da IA

**Critérios de Aprovação:**
- [ ] IA busca movimentos táticos complicados
- [ ] Risk tolerance acima de 0.7
- [ ] Estado emocional é 'desperate' ou 'concerned'
- [ ] Mensagem reflete preocupação/desespero

### MT-003: Personalidade afeta reações
**Objetivo:** Verificar que personalidade modifica thresholds emocionais

**Passos:**
1. Testar IA com personalidade "Aggressive" em desvantagem
2. Testar IA com personalidade "Solid" em vantagem
3. Comparar estados emocionais

**Critérios de Aprovação:**
- [ ] Aggressive: permanece 'concerned' onde outras seriam 'desperate'
- [ ] Solid: permanece 'optimistic' onde outras seriam 'confident'
- [ ] Diferença de ~20% nos thresholds confirmada

### MT-004: Estados emocionais visíveis na UI
**Objetivo:** Verificar que EmotionalIndicator mostra estado correto

**Passos:**
1. Iniciar jogo com EmotionalIndicator ativo
2. Forçar mudanças de estado (vantagem/desvantagem)
3. Observar UI

**Critérios de Aprovação:**
- [ ] Ícone muda corretamente (😤😊😐😰😱)
- [ ] Barra de confiança reflete estado
- [ ] Mensagem é contextual e apropriada
- [ ] Cores mudam baseado no estado

### MT-005: Transições suaves entre estados
**Objetivo:** Verificar que transições de estado são graduais

**Passos:**
1. Iniciar jogo e observar estado emocional
2. Fazer movimentos que alterem evaluation gradualmente
3. Observar mudanças de estado

**Critérios de Aprovação:**
- [ ] Estados não mudam abruptamente
- [ ] Hysteresis previne oscilações rápidas
- [ ] Transições seguem ordem lógica

## Testes Automatizados

### Unit Tests (`src/__tests__/unit/emotionalState.test.ts`)

#### EST-001: Estados corretos para evaluations
```typescript
test('deve retornar desperate para evaluation < -300', () => {
  const profile = manager.updateEmotionalState({ overallAdvantage: -350 });
  expect(profile.state).toBe('desperate');
});
```

#### EST-002: Personalidade afeta thresholds
```typescript
test('aggressive personality tem thresholds mais tolerantes', () => {
  const aggressive = new EmotionalStateManager(aggressivePersonality);
  const solid = new EmotionalStateManager(solidPersonality);
  // Aggressive não fica desperate onde Solid ficaria
});
```

#### EST-003: Risk tolerance varia por estado
```typescript
test('desperate tem risk tolerance > 0.8', () => {
  const profile = manager.updateEmotionalState({ overallAdvantage: -400 });
  expect(profile.riskTolerance).toBeGreaterThan(0.8);
});
```

#### EST-004: Mensagens retornadas corretamente
```typescript
test('mensagens são contextualizadas por estado', () => {
  const message = manager.getEmotionalMessage();
  expect(message).toBeTruthy();
});
```

#### EST-005: Transições suaves
```typescript
test('não há oscilação rápida entre estados', () => {
  // Verificar hysteresis
});
```

### Integration Tests

#### INT-001: Integração com ChessEngine
```typescript
test('ChessEngine usa emotional state na seleção de movimentos', async () => {
  const engine = new ChessEngine();
  engine.setPersonality(aggressivePersonality);
  const move = await engine.getAIMove('custom');
  // Verificar que move reflete estado emocional
});
```

## Métricas de Cobertura

- **Objetivo**: >80% cobertura de código
- **Arquivos críticos**:
  - `emotionalState.ts`: 100%
  - Modificações em `chessEngine.ts`: >80%
  - `EmotionalIndicator.tsx`: >70%

## Regressão

Verificar que novos componentes não quebram:
- [ ] Movimentos de livro de aberturas
- [ ] Sistema de gestão de tempo
- [ ] Análise de posição
- [ ] Dificuldades existentes (beginner, club, master)

## Sign-off

| Papel | Nome | Data | Status |
|-------|------|------|--------|
| Dev | - | - | [ ] |
| QA | - | - | [ ] |
| Tech Lead | - | - | [ ] |
