# Sprint 2.2: Tutoriais Interativos

## Versão
**v1.4.0-fase2.sprint2.0**

## Resumo

Sistema completo de tutoriais interativos para o Chess XGR, permitindo que jogadores aprendam xadrez de forma progressiva através de lições práticas com feedback imediato e integração com IA Neural-X.

## Funcionalidades Implementadas

### ✅ Módulos Progressivos
- 4 módulos organizados por nível (0-400, 400-1000, 1000-1600, 1600-2200 Elo)
- Bloqueio sequencial de módulos
- Indicador visual de progresso

### ✅ Lições Interativas
- 8 lições com posições FEN específicas
- Validação de movimentos em tempo real
- Feedback visual para jogadas corretas/incorretas
- Sistema de 3 dicas progressivas por lição

### ✅ Integração com IA
- Demonstração de soluções por IA
- Explicações contextuais
- Animações suaves

### ✅ Sistema de Progresso
- Persistência em localStorage
- Estatísticas por lição (tentativas, dicas, tempo)
- Rating (perfect/good/completed)
- Progresso total e por módulo

## Estrutura de Arquivos

```
src/
├── types/
│   └── tutorial.ts              # Tipos do sistema de tutoriais
├── engine/
│   └── tutorialEngine.ts        # Motor de validação e progresso
├── store/
│   └── tutorialStore.ts         # Estado persistente
├── hooks/
│   └── useTutorial.ts           # Hook React
├── components/ui/
│   ├── TutorialPanel.tsx        # Painel principal
│   ├── LessonViewer.tsx         # Visualizador de lição
│   ├── ProgressIndicator.tsx    # Indicador de progresso
│   └── FeedbackOverlay.tsx      # Overlay de feedback
└── data/
    └── tutorials.ts             # Dados das lições
```

## Como Usar

### Acessar Tutorial
1. No menu principal, clique em "Tutorial XGR"
2. Selecione um módulo disponível
3. Escolha uma lição para começar

### Durante uma Lição
- **Objetivo:** Leia o objetivo da lição
- **Movimento:** Execute o movimento solicitado
- **Dica:** Clique no botão "Dica" se precisar de ajuda
- **Solução:** Clique em "Mostrar Solução" para ver a IA demonstrar
- **Reiniciar:** Use "Reiniciar" para tentar novamente

### Progresso
- As lições completadas são marcadas automaticamente
- O progresso é salvo no navegador
- Módulos são desbloqueados ao completar anteriores

## API

### TutorialEngine

```typescript
const engine = new TutorialEngine({
  lesson: tutorialLesson,
  onMoveValidation: (result, move) => { },
  onLessonComplete: (stats) => { },
  onHintRequested: (hint, level) => { }
});

engine.validateMove({ from: 'e2', to: 'e4' });
engine.getHint();
engine.showSolution();
```

### useTutorial Hook

```typescript
const {
  currentLesson,
  validateMove,
  requestHint,
  showSolution,
  isComplete,
  feedback
} = useTutorial({ lessonId: 'pawn-movement' });
```

## Testes

```bash
# Testes unitários
npm run test:unit

# Build de produção
npm run build

# Servidor de desenvolvimento
npm run dev
```

## Screenshots

*[A serem adicionados após validação visual]*

## Documentação

- [Especificação Técnica](./SPEC.md)
- [Plano de Implementação](./IMPLEMENTATION.md)
- [Plano de Testes](./TEST_PLAN.md)
- [Decisões](./DECISIONS.md)

## Changelog

### v1.4.0-fase2.sprint2.0
- ✅ Sistema de tutoriais interativos
- ✅ TutorialEngine com validação
- ✅ TutorialPanel com navegação
- ✅ LessonViewer com feedback
- ✅ ProgressIndicator
- ✅ FeedbackOverlay
- ✅ useTutorial hook
- ✅ tutorialStore com persistência
- ✅ 8 lições em 4 módulos

## Créditos

**Equipe:** Rabelus Lab  
**Desenvolvimento:** Sprint 2.2 - Tutoriais Interativos  
**Metodologia:** IBVD (Iterative Bilateral Validation Development)

---

© 2026 Rabelus Lab. Todos os direitos reservados.
