# Plano de Implementação: Tutoriais Interativos

## ID
`CHESS-2.2-2.2.0`

## Resumo Executivo

Implementar um sistema completo de tutoriais interativos com integração ao tabuleiro 3D existente, IA Neural-X para demonstrações, e sistema de progresso persistido. O sistema permitirá que jogadores aprendam xadrez de forma progressiva através de lições práticas com feedback imediato.

## Estrutura de Arquivos

```
src/
├── engine/
│   └── tutorialEngine.ts          # Motor de tutoriais
├── components/
│   └── ui/
│       ├── TutorialPanel.tsx      # Painel principal de tutoriais
│       ├── LessonViewer.tsx       # Visualizador de lição
│       ├── ProgressIndicator.tsx  # Indicador de progresso
│       ├── FeedbackOverlay.tsx    # Overlay de feedback
│       └── Tutorial.tsx           # Atualizado (refatorado)
├── hooks/
│   └── useTutorial.ts             # Hook de gerenciamento
├── store/
│   └── tutorialStore.ts           # Store de progresso
└── types/
    └── tutorial.ts                # Tipos específicos
```

## Fases de Implementação

### Fase 1: Setup e Estrutura (Dia 1)
- [x] Criar estrutura de pastas
- [x] Definir interfaces/types adicionais
- [x] Criar documentação SPEC.md
- [x] Criar documentação IMPLEMENTATION.md
- [ ] Criar documentação TEST_PLAN.md
- [ ] Implementar tipos em `src/types/tutorial.ts`
- [ ] Criar TutorialEngine base

### Fase 2: Implementação Core (Dias 2-3)
- [ ] Implementar TutorialEngine completo
- [ ] Criar componente TutorialPanel
- [ ] Criar componente LessonViewer
- [ ] Criar componente ProgressIndicator
- [ ] Criar componente FeedbackOverlay
- [ ] Implementar hook useTutorial
- [ ] Criar tutorialStore com persistência

### Fase 3: Integração (Dia 4)
- [ ] Integrar com ChessBoard3D existente
- [ ] Integrar com Neural-X para demonstrações
- [ ] Atualizar MainMenu para modo tutorial
- [ ] Integrar com gameStore existente
- [ ] Testes de integração

### Fase 4: Refinamento (Dia 5)
- [ ] Otimizações de performance
- [ ] Melhorias de UX e animações
- [ ] Testes E2E
- [ ] Captura de screenshots

## Componentes a Implementar

### 1. TutorialEngine
**Responsabilidade:** Gerenciar a lógica de validação de movimentos, progresso e interação com a IA.

**Métodos:**
```typescript
class TutorialEngine {
  constructor(config: TutorialConfig);
  
  loadLesson(lesson: Lesson): void;
  validateMove(move: Move): ValidationResult;
  getHint(level: number): string;
  showSolution(): Promise<void>;
  resetLesson(): void;
  getProgress(): LessonProgress;
  
  // Eventos
  onMoveValidation: (result: ValidationResult) => void;
  onLessonComplete: () => void;
  onHintRequested: (hint: string) => void;
}
```

**Estado:**
```typescript
interface TutorialEngineState {
  currentLesson: Lesson | null;
  attempts: number;
  hintsUsed: number;
  startTime: number;
  isComplete: boolean;
  moveHistory: Move[];
}
```

**Testes:**
- [ ] Validação de movimentos corretos
- [ ] Validação de movimentos incorretos
- [ ] Sistema de dicas
- [ ] Demonstração de solução
- [ ] Reset de lição

### 2. TutorialPanel
**Responsabilidade:** Container principal que gerencia a navegação entre módulos e lições.

**Props:**
```typescript
interface TutorialPanelProps {
  onExit: () => void;
  onLessonSelect: (lesson: Lesson) => void;
}
```

**Estado:**
```typescript
interface TutorialPanelState {
  selectedModule: TutorialModule | null;
  view: 'modules' | 'lessons' | 'lesson';
}
```

**Testes:**
- [ ] Renderização de módulos
- [ ] Bloqueio de módulos não liberados
- [ ] Navegação entre views
- [ ] Persistência de seleção

### 3. LessonViewer
**Responsabilidade:** Interface de lição individual com tabuleiro interativo.

**Props:**
```typescript
interface LessonViewerProps {
  lesson: Lesson;
  onBack: () => void;
  onComplete: (result: LessonResult) => void;
}
```

**Estado:**
```typescript
interface LessonViewerState {
  showHint: boolean;
  currentHintLevel: number;
  feedback: FeedbackState | null;
  isAnimating: boolean;
  boardState: BoardState;
}
```

**Testes:**
- [ ] Carregamento de FEN
- [ ] Interação com tabuleiro
- [ ] Feedback visual
- [ ] Solicitação de dicas
- [ ] Demonstração por IA

### 4. ProgressIndicator
**Responsabilidade:** Visualização do progresso do aluno.

**Props:**
```typescript
interface ProgressIndicatorProps {
  modules: TutorialModule[];
  currentModule?: string;
  compact?: boolean;
}
```

**Testes:**
- [ ] Cálculo correto de porcentagens
- [ ] Renderização visual
- [ ] Atualização em tempo real

### 5. FeedbackOverlay
**Responsabilidade:** Apresentar feedback visual sobre movimentos.

**Props:**
```typescript
interface FeedbackOverlayProps {
  type: 'success' | 'error' | 'hint';
  message: string;
  onDismiss?: () => void;
  autoDismiss?: number;
}
```

**Testes:**
- [ ] Exibição correta por tipo
- [ ] Auto-dismiss
- [ ] Animações

### 6. useTutorial Hook
**Responsabilidade:** Gerenciar estado e lógica de tutoriais em componentes.

**Parâmetros:**
```typescript
interface UseTutorialParams {
  lessonId?: string;
  autoLoad?: boolean;
}
```

**Retorno:**
```typescript
interface UseTutorialReturn {
  currentLesson: Lesson | null;
  progress: TutorialProgress;
  validateMove: (move: Move) => ValidationResult;
  requestHint: () => string | null;
  showSolution: () => Promise<void>;
  reset: () => void;
  isComplete: boolean;
}
```

**Testes:**
- [ ] Inicialização correta
- [ ] Atualizações de estado
- [ ] Integração com store

## Store/Módulos

### tutorialStore (Zustand)
```typescript
interface TutorialStore {
  // Estado
  modules: TutorialModule[];
  currentModuleId: string | null;
  currentLessonId: string | null;
  completedLessons: string[];
  lessonStats: Record<string, LessonStats>;
  
  // Ações
  setCurrentModule: (id: string) => void;
  setCurrentLesson: (id: string) => void;
  markLessonComplete: (id: string, stats: LessonStats) => void;
  getModuleProgress: (id: string) => number;
  getTotalProgress: () => number;
  resetProgress: () => void;
}
```

**Persistência:** localStorage com chave `chess-xgr-tutorial-progress`

## Integrações

### 1. ChessBoard3D
- Adicionar prop `interactiveMode: 'tutorial' | 'game'`
- Adicionar prop `onMoveValidation: (valid: boolean) => void`
- Adicionar prop `highlightSquares: string[]`
- Adicionar prop `feedbackState: 'none' | 'success' | 'error'`

### 2. ChessEngine
- Usar instância existente do engine
- Método `loadFEN(fen: string)` para posições iniciais
- Método `getLegalMoves(square: string)` para validação

### 3. Neural-X AI
- Usar `requestAIMove()` para demonstrações
- Adicionar callback para movimento da IA
- Configurar tempo de resposta mais rápido em tutoriais

### 4. gameStore
- Adicionar `tutorialMode: boolean`
- Atualizar `currentView` para incluir 'tutorial'
- Sincronizar progresso com tutorialStore

## Testes Unitários

### TutorialEngine
```typescript
describe('TutorialEngine', () => {
  it('should load lesson with correct FEN', () => {
    const engine = new TutorialEngine();
    engine.loadLesson(pawnLesson);
    expect(engine.getCurrentFEN()).toBe(pawnLesson.fen);
  });
  
  it('should validate correct move', () => {
    const engine = new TutorialEngine();
    engine.loadLesson(pawnLesson);
    const result = engine.validateMove({ from: 'e2', to: 'e4' });
    expect(result.valid).toBe(true);
  });
  
  it('should validate incorrect move', () => {
    const engine = new TutorialEngine();
    engine.loadLesson(pawnLesson);
    const result = engine.validateMove({ from: 'e2', to: 'e5' });
    expect(result.valid).toBe(false);
  });
});
```

### Components
```typescript
describe('LessonViewer', () => {
  it('should render lesson content', () => {
    render(<LessonViewer lesson={mockLesson} onBack={() => {}} onComplete={() => {}} />);
    expect(screen.getByText(mockLesson.title)).toBeInTheDocument();
  });
  
  it('should show feedback on move', async () => {
    render(<LessonViewer lesson={mockLesson} ... />);
    // Simular movimento
    await waitFor(() => {
      expect(screen.getByText(/correto/i)).toBeInTheDocument();
    });
  });
});
```

## Testes E2E

```typescript
test('complete tutorial flow', async ({ page }) => {
  await page.goto('/');
  await page.click('text=Tutorial XGR');
  await page.click('text=Módulo 1: Fundamentos');
  await page.click('text=Movimento do Peão');
  
  // Executar movimento correto
  await page.dragAndDrop('[data-square="e2"]', '[data-square="e4"]');
  await expect(page.locator('text=Correto!')).toBeVisible();
  
  // Verificar progresso
  await page.click('text=Voltar');
  await expect(page.locator('[data-progress]')).toHaveText('50%');
});
```

## Checklist de Qualidade

- [ ] Código segue padrões do projeto (ESLint, Prettier)
- [ ] Todos os componentes tipados corretamente
- [ ] Cobertura de testes > 80%
- [ ] Documentação de componentes (JSDoc)
- [ ] Animações performáticas (60 FPS)
- [ ] Acessibilidade validada (axe-core)
- [ ] Responsivo em todos os breakpoints

## Métricas de Sucesso

- Tempo médio de conclusão de lição: < 2 minutos
- Taxa de conclusão de módulos: > 70%
- Satisfação do usuário (simulada): > 4/5
- Performance: First Contentful Paint < 1s
