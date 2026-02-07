# Plano de Testes: Tutoriais Interativos

## ID
`CHESS-2.2-2.2.0`

## Objetivo

Definir a estratégia e casos de teste para garantir a qualidade do sistema de tutoriais interativos, incluindo validação de movimentos, feedback visual, integração com IA e persistência de progresso.

## Estratégia de Testes

### Pirâmide de Testes
```
    /\
   /  \
  / E2E\      (15%)
 /--------\
/ Integration\ (25%)
/--------------\
/    Unit Tests   \ (60%)
/--------------------\
```

### Níveis de Teste

#### 1. Testes Unitários
- **Ferramenta:** Vitest
- **Cobertura Mínima:** 80%
- **Localização:** `src/__tests__/unit/tutorial/`
- **Execução:** `npm run test:unit`

#### 2. Testes de Integração
- **Ferramenta:** Vitest + React Testing Library
- **Cobertura Mínima:** 60%
- **Localização:** `src/__tests__/integration/tutorial/`
- **Execução:** `npm run test:integration`

#### 3. Testes E2E
- **Ferramenta:** Playwright
- **Navegadores:** Chromium, Firefox, WebKit
- **Localização:** `e2e/specs/tutorial-flow.spec.ts`
- **Execução:** `npm run test:e2e`

## Casos de Teste

### Testes Unitários

#### TU-001: TutorialEngine - Carregamento de Lição
```typescript
describe("TutorialEngine", () => {
  it("should load lesson with correct FEN position", () => {
    // Arrange
    const engine = new TutorialEngine();
    const lesson = {
      id: 'test-lesson',
      fen: '8/8/8/8/8/8/4P3/8 w - - 0 1',
      solution: ['e2e4']
    };
    
    // Act
    engine.loadLesson(lesson);
    
    // Assert
    expect(engine.getCurrentFEN()).toBe(lesson.fen);
    expect(engine.getCurrentLesson()).toEqual(lesson);
  });
});
```
**Status:** ⏳ Pendente

#### TU-002: TutorialEngine - Validação de Movimento Correto
```typescript
it("should validate correct move", () => {
  const engine = new TutorialEngine();
  engine.loadLesson({
    id: 'pawn-move',
    fen: '8/8/8/8/8/8/4P3/8 w - - 0 1',
    solution: ['e2e4']
  });
  
  const result = engine.validateMove({ from: 'e2', to: 'e4' });
  
  expect(result.valid).toBe(true);
  expect(result.isSolution).toBe(true);
});
```
**Status:** ⏳ Pendente

#### TU-003: TutorialEngine - Validação de Movimento Incorreto
```typescript
it("should validate incorrect move", () => {
  const engine = new TutorialEngine();
  engine.loadLesson({
    id: 'pawn-move',
    fen: '8/8/8/8/8/8/4P3/8 w - - 0 1',
    solution: ['e2e4']
  });
  
  const result = engine.validateMove({ from: 'e2', to: 'e5' });
  
  expect(result.valid).toBe(false);
  expect(result.error).toBe('INVALID_MOVE');
});
```
**Status:** ⏳ Pendente

#### TU-004: TutorialEngine - Sistema de Dicas
```typescript
it("should provide hints progressively", () => {
  const engine = new TutorialEngine();
  engine.loadLesson({
    id: 'test',
    hints: ['Dica 1', 'Dica 2', 'Dica 3']
  });
  
  expect(engine.getHint(0)).toBe('Dica 1');
  expect(engine.getHint(1)).toBe('Dica 2');
  expect(engine.getHint(2)).toBe('Dica 3');
  expect(engine.getHint(3)).toBeNull();
});
```
**Status:** ⏳ Pendente

#### TU-005: TutorialEngine - Contagem de Tentativas
```typescript
it("should track attempt count", () => {
  const engine = new TutorialEngine();
  engine.loadLesson({ id: 'test', solution: ['e2e4'] });
  
  engine.validateMove({ from: 'e2', to: 'e3' }); // Wrong
  engine.validateMove({ from: 'e2', to: 'e5' }); // Wrong
  engine.validateMove({ from: 'e2', to: 'e4' }); // Correct
  
  expect(engine.getStats().attempts).toBe(3);
});
```
**Status:** ⏳ Pendente

#### TU-006: TutorialStore - Persistência de Progresso
```typescript
describe("tutorialStore", () => {
  it("should persist completed lessons", () => {
    const store = useTutorialStore.getState();
    
    store.markLessonComplete('lesson-1', { attempts: 2, hintsUsed: 1 });
    
    expect(store.completedLessons).toContain('lesson-1');
    expect(store.lessonStats['lesson-1'].attempts).toBe(2);
  });
});
```
**Status:** ⏳ Pendente

#### TU-007: TutorialStore - Cálculo de Progresso
```typescript
it("should calculate module progress correctly", () => {
  const store = useTutorialStore.getState();
  const module = {
    id: 'module-1',
    lessons: [{ id: 'l1' }, { id: 'l2' }, { id: 'l3' }, { id: 'l4' }]
  };
  
  store.markLessonComplete('l1');
  store.markLessonComplete('l2');
  
  expect(store.getModuleProgress('module-1')).toBe(50);
});
```
**Status:** ⏳ Pendente

### Testes de Integração

#### TI-001: LessonViewer - Renderização Completa
```typescript
describe("LessonViewer Integration", () => {
  it("should render lesson with interactive board", async () => {
    // Setup
    render(
      <LessonViewer 
        lesson={mockLesson} 
        onBack={() => {}} 
        onComplete={() => {}} 
      />
    );
    
    // Assert
    expect(screen.getByText(mockLesson.title)).toBeInTheDocument();
    expect(screen.getByTestId('chess-board')).toBeInTheDocument();
    expect(screen.getByText(mockLesson.objective)).toBeInTheDocument();
  });
});
```
**Status:** ⏳ Pendente

#### TI-002: LessonViewer - Feedback Visual
```typescript
it("should show success feedback on correct move", async () => {
  const onComplete = vi.fn();
  render(<LessonViewer lesson={mockLesson} onBack={() => {}} onComplete={onComplete} />);
  
  // Act - simulate correct move
  const square = screen.getByTestId('square-e2');
  await userEvent.click(square);
  await userEvent.click(screen.getByTestId('square-e4'));
  
  // Assert
  await waitFor(() => {
    expect(screen.getByText(/correto/i)).toBeInTheDocument();
  });
});
```
**Status:** ⏳ Pendente

#### TI-003: TutorialPanel - Navegação de Módulos
```typescript
it("should navigate between modules and lessons", async () => {
  render(<TutorialPanel onExit={() => {}} onLessonSelect={() => {}} />);
  
  // Click on first module
  await userEvent.click(screen.getByText(/Módulo 1/));
  
  // Should show lessons
  expect(screen.getByText(/Movimento do Peão/)).toBeInTheDocument();
  
  // Click back
  await userEvent.click(screen.getByText(/Voltar/));
  
  // Should show modules again
  expect(screen.getByText(/Módulo 2/)).toBeInTheDocument();
});
```
**Status:** ⏳ Pendente

#### TI-004: useTutorial Hook - Ciclo de Vida
```typescript
it("should manage lesson lifecycle correctly", async () => {
  const { result } = renderHook(() => useTutorial({ lessonId: 'test' }));
  
  // Initial state
  expect(result.current.currentLesson).toBeDefined();
  expect(result.current.isComplete).toBe(false);
  
  // Validate correct move
  act(() => {
    result.current.validateMove({ from: 'e2', to: 'e4' });
  });
  
  await waitFor(() => {
    expect(result.current.isComplete).toBe(true);
  });
});
```
**Status:** ⏳ Pendente

### Testes E2E

#### TE-001: Fluxo Completo de Tutorial
```typescript
test("complete tutorial flow from menu to lesson completion", async ({ page }) => {
  // Navigate to app
  await page.goto("/");
  
  // Enter tutorial mode
  await page.click('text=Tutorial XGR');
  await expect(page).toHaveURL(/.*tutorial/);
  
  // Select first module
  await page.click('text=Módulo 1: Fundamentos');
  
  // Select first lesson
  await page.click('text=Movimento do Peão');
  
  // Verify lesson content
  await expect(page.locator('h1')).toContainText('Movimento do Peão');
  
  // Execute correct move
  await page.dragAndDrop('[data-square="e2"]', '[data-square="e4"]');
  
  // Verify success feedback
  await expect(page.locator('text=Correto!')).toBeVisible();
  
  // Verify completion
  await expect(page.locator('text=Lição Completada')).toBeVisible();
});
```
**Status:** ⏳ Pendente

#### TE-002: Sistema de Dicas
```typescript
test("hint system progression", async ({ page }) => {
  await page.goto("/tutorial");
  await page.click('text=Módulo 1: Fundamentos');
  await page.click('text=Movimento do Peão');
  
  // Request hint
  await page.click('text=Dica');
  await expect(page.locator('[data-hint]')).toContainText('Dica 1');
  
  // Request another hint
  await page.click('text=Dica');
  await expect(page.locator('[data-hint]')).toContainText('Dica 2');
  
  // Verify hint counter
  await expect(page.locator('[data-hint-count]')).toContainText('2/3');
});
```
**Status:** ⏳ Pendente

#### TE-003: Persistência de Progresso
```typescript
test("progress persistence across sessions", async ({ page, context }) => {
  // Complete a lesson
  await page.goto("/tutorial");
  await page.click('text=Módulo 1: Fundamentos');
  await page.click('text=Movimento do Peão');
  await page.dragAndDrop('[data-square="e2"]', '[data-square="e4"]');
  
  // Close and reopen browser
  await context.close();
  const newContext = await browser.newContext();
  const newPage = await newContext.newPage();
  
  // Verify progress persisted
  await newPage.goto("/tutorial");
  await expect(newPage.locator('[data-progress="module-1"]')).toContainText('33%');
});
```
**Status:** ⏳ Pendente

#### TE-004: Demonstração por IA
```typescript
test("AI demonstration of solution", async ({ page }) => {
  await page.goto("/tutorial");
  await page.click('text=Módulo 1: Fundamentos');
  await page.click('text=Movimento do Peão');
  
  // Request solution
  await page.click('text=Mostrar Solução');
  
  // Wait for AI move animation
  await page.waitForTimeout(1000);
  
  // Verify AI made the move
  await expect(page.locator('[data-square="e4"] .piece')).toBeVisible();
  
  // Verify explanation
  await expect(page.locator('text=Explicação')).toBeVisible();
});
```
**Status:** ⏳ Pendente

#### TE-005: Responsividade
```typescript
test("tutorial works on mobile viewport", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 667 });
  await page.goto("/tutorial");
  
  // Should show mobile layout
  await page.click('text=Módulo 1: Fundamentos');
  
  // Board should be visible and interactive
  await page.click('text=Movimento do Peão');
  await expect(page.locator('[data-testid="chess-board"]')).toBeVisible();
  
  // Should be able to make move
  await page.click('[data-square="e2"]');
  await page.click('[data-square="e4"]');
  
  await expect(page.locator('text=Correto!')).toBeVisible();
});
```
**Status:** ⏳ Pendente

## Critérios de Aceitação

### Cobertura Mínima
- [ ] Unit tests: 80%+ coverage
- [ ] Integration tests: 60%+ coverage
- [ ] E2E tests: Todos os fluxos principais

### Performance
- [ ] Tempo de carregamento da lição: < 500ms
- [ ] Resposta ao movimento: < 100ms
- [ ] Animações: 60 FPS consistente

### Qualidade
- [ ] Todos os testes passando
- [ ] Sem warnings no console
- [ ] Acessibilidade validada (axe-core)

## Execução dos Testes

### Comandos
```bash
# Unit tests
npm run test:unit

# Unit tests with coverage
npm run test:unit:coverage

# Integration tests
npm run test:integration

# E2E tests
npm run test:e2e

# All tests
npm run test:all
```

### CI/CD
- Testes unitários executam em cada PR
- Testes E2E executam em merges para main
- Cobertura reportada no PR

## Bug Tracking

| ID | Descrição | Severidade | Status |
|----|-----------|------------|--------|
| BUG-001 | - | - | ⏳ |

## Histórico de Execução

| Data | Versão | Resultado | Observações |
|------|--------|-----------|-------------|
| - | - | - | - |
