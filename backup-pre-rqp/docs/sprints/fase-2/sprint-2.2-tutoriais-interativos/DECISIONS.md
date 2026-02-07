# Decisões de Implementação: Tutoriais Interativos

## ID
`CHESS-2.2-2.2.0`

## Data
2026-02-02

## Contexto

A Sprint 2.2 visava implementar um sistema de tutoriais interativos para o Chess XGR, integrado com a IA Neural-X existente. O sistema precisava ensinar xadrez de forma progressiva, com feedback visual imediato e acompanhamento de progresso.

## Decisões Tomadas

### 1. Arquitetura do Sistema de Tutoriais

**Decisão:** Implementar uma arquitetura em camadas com separação clara entre engine, estado e UI.

**Alternativas Consideradas:**
- Integrar diretamente no gameStore existente
- Criar sistema monolítico dentro do componente Tutorial

**Justificativa:**
- Desacoplamento facilita testes unitários
- Permite reuso do TutorialEngine em outros contextos
- Separação de responsabilidades segue princípios SOLID

**Implementação:**
```
src/
├── engine/tutorialEngine.ts    # Lógica de validação e progresso
├── store/tutorialStore.ts      # Estado persistente
├── hooks/useTutorial.ts        # Interface React
└── components/ui/              # Componentes visuais
```

### 2. Persistência de Progresso

**Decisão:** Usar Zustand com middleware de persistência para localStorage.

**Alternativas Consideradas:**
- Context API + localStorage manual
- IndexedDB para dados mais complexos
- Backend remoto (fora do escopo)

**Justificativa:**
- Zustand já é dependência do projeto
- Persistência automática simplifica implementação
- localStorage é suficiente para dados de progresso (pequenos)

**Detalhes:**
```typescript
persist(
  (set, get) => ({ ... }),
  {
    name: 'chess-xgr-tutorial-progress',
    partialize: (state) => ({
      completedLessons: state.completedLessons,
      lessonStats: state.lessonStats
    })
  }
)
```

### 3. Validação de Movimentos

**Decisão:** Validar movimentos em duas etapas: primeiro se é legal (chess.js), depois se é a solução.

**Alternativas Consideradas:**
- Apenas validar solução exata
- Permitir qualquer movimento legal

**Justificativa:**
- Feedback imediato sobre ilegalidade educa o jogador
- Aceitar alternativas válidas aumenta flexibilidade
- Separação permite mensagens específicas

**Implementação:**
```typescript
// Etapa 1: Validação legal
const legalMoves = this.game.moves({ verbose: true });
const isLegal = legalMoves.some(m => m.from === move.from && m.to === move.to);

// Etapa 2: Validação solução
const moveUCI = move.from + move.to + (move.promotion || '');
const isSolution = lesson.solution.some(sol => sol.startsWith(moveUCI));
```

### 4. Integração com IA Neural-X

**Decisão:** Usar Stockfish Worker existente para demonstrações, sem modificar a IA principal.

**Alternativas Consideradas:**
- Criar motor de demonstração separado
- Integrar profundamente com EmotionalState

**Justificativa:**
- Reutilização de código existente
- Demonstrações não precisam de personalidade emocional
- Simplifica manutenção

### 5. Estrutura de Dados de Lições

**Decisão:** Adicionar campos `solution`, `explanation` e `difficulty` às lições existentes.

**Alternativas Consideradas:**
- Criar novo formato de dados
- Manter compatibilidade exata com versão anterior

**Justificativa:**
- Migração gradual permite reuso de conteúdo
- Campos adicionais enriquecem a experiência
- TypeScript garante type safety

### 6. Feedback Visual

**Decisão:** Implementar sistema de feedback com 5 tipos: success, error, hint, warning, info.

**Alternativas Consideradas:**
- Apenas toast notifications
- Feedback apenas no console

**Justificativa:**
- Diferentes tipos permitem comunicação rica
- Integração com AnimatePresence para transições suaves
- Auto-dismiss com progress bar melhora UX

### 7. Sistema de Dicas Progressivas

**Decisão:** Permitir até 3 níveis de dicas por lição, com contagem de uso.

**Alternativas Consideradas:**
- Dica única por lição
- Dicas ilimitadas

**Justificativa:**
- Progressão gradual não revela solução imediatamente
- Contagem permite scoring/rating
- Incentiva tentativa antes de pedir ajuda

## Trade-offs

### Performance vs. Funcionalidade
- **Escolha:** Carregar Stockfish mesmo em tutoriais simples
- **Impacto:** +50ms no carregamento inicial
- **Benefício:** Consistência com modo de jogo principal

### Complexidade vs. Manutenibilidade
- **Escolha:** Engine separado do Store
- **Impacto:** Mais arquivos para manter
- **Benefício:** Testes isolados e reuso

## Lições Aprendidas

1. **TypeScript Strict Mode:** A migração de tipos existentes para novos revelou inconsistências. Importante manter types atualizados.

2. **Persistência:** O uso de `partialize` no Zustand foi essencial para não salvar estados transitórios.

3. **Integração:** Manter compatibilidade com componentes 3D existentes exigiu props adicionais, não modificação.

## Métricas

- **Cobertura de Testes:** 95 testes existentes passando
- **Build:** Sucesso (0 erros)
- **Bundle Size:** +~15KB (tutorial types + engine)
- **Performance:** <100ms para carregar lição

## Próximos Passos

1. Implementar testes unitários específicos para TutorialEngine
2. Adicionar mais lições aos módulos existentes
3. Integrar tabuleiro 3D interativo nas lições
4. Implementar sistema de conquistas/achievements

## Referências

- [SPEC.md](./SPEC.md)
- [IMPLEMENTATION.md](./IMPLEMENTATION.md)
- [TEST_PLAN.md](./TEST_PLAN.md)
