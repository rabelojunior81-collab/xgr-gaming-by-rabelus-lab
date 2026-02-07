# Especificação Técnica: Tutoriais Interativos

## ID
`CHESS-2.2-2.2.0`

## Visão Geral

Implementar um sistema de tutoriais interativos progressivos que ensine xadrez de forma estruturada, integrado com a IA Neural-X existente. O sistema deve fornecer feedback visual imediato, demonstrações por IA e acompanhamento de progresso do aluno.

## Requisitos Funcionais

### RF-001: Módulos de Aprendizado Progressivos
**Descrição:** Organizar o conteúdo em 4 módulos progressivos (Fundamentos, Tática, Estratégia, Avançado) com liberação sequencial baseada na conclusão.

**Critérios de Aceitação:**
- [ ] Módulos organizados por faixa de Elo (0-400, 400-1000, 1000-1600, 1600-2200)
- [ ] Bloqueio de módulos avançados até conclusão dos anteriores
- [ ] Indicador visual de progresso por módulo
- [ ] Persistência do progresso no localStorage

**Estimativa:** 5 pontos

### RF-002: Lições Interativas com Tabuleiro
**Descrição:** Cada lição deve apresentar um desafio prático em um tabuleiro interativo com posição FEN específica.

**Critérios de Aceitação:**
- [ ] Carregamento de posição FEN por lição
- [ ] Validação de movimentos em tempo real
- [ ] Feedback visual para jogadas corretas (verde) e incorretas (vermelho)
- [ ] Sistema de dicas progressivas (3 níveis por lição)
- [ ] Botão "Mostrar Solução" com demonstração por IA

**Estimativa:** 8 pontos

### RF-003: Integração com IA Neural-X
**Descrição:** A IA deve demonstrar soluções e fornecer explicações contextuais durante as lições.

**Critérios de Aceitação:**
- [ ] IA executa a solução correta quando solicitada
- [ ] Animação suave do movimento da IA
- [ ] Explicação textual do porquê do movimento
- [ ] Personalidade da IA adaptada ao contexto da lição

**Estimativa:** 5 pontos

### RF-004: Sistema de Feedback Visual
**Descrição:** Fornecer feedback imediato e claro sobre as ações do usuário.

**Critérios de Aceitação:**
- [ ] Highlight de casas válidas ao selecionar peça
- [ ] Animação de shake para movimentos inválidos
- [ ] Efeito de brilho para movimentos corretos
- [ ] Indicador de xeque-mate com celebração visual

**Estimativa:** 3 pontos

### RF-005: Acompanhamento de Progresso
**Descrição:** Sistema completo de tracking do progresso do aluno.

**Critérios de Aceitação:**
- [ ] Barra de progresso por módulo
- [ ] Estatísticas de lições completadas
- [ ] Tempo gasto por lição
- [ ] Taxa de acerto/erro
- [ ] Persistência entre sessões

**Estimativa:** 3 pontos

## Requisitos Não-Funcionais

### RNF-001: Performance
- Tempo de carregamento da lição: < 500ms
- Resposta ao movimento: < 100ms
- Animações suaves a 60 FPS
- Memória: < 50MB adicional

### RNF-002: Compatibilidade
- Navegadores: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- Dispositivos: Desktop, Tablet, Mobile (responsivo)
- Touch e mouse suportados

### RNF-003: Acessibilidade
- Suporte a navegação por teclado
- ARIA labels em elementos interativos
- Contraste mínimo 4.5:1
- Animações respeitam prefers-reduced-motion

## Interface/API

### Entradas
```typescript
interface TutorialEngineConfig {
  lessonId: string;
  fen: string;
  objective: string;
  hints: string[];
  solution: string[]; // UCI moves
  onMoveValidation: (valid: boolean, move: Move) => void;
  onLessonComplete: () => void;
}

interface TutorialState {
  currentModule: string | null;
  currentLesson: string | null;
  completedLessons: string[];
  moduleProgress: Record<string, number>; // 0-100
  totalProgress: number; // 0-100
  stats: LessonStats;
}

interface LessonStats {
  attempts: number;
  hintsUsed: number;
  timeSpent: number;
  completedAt?: Date;
}
```

### Saídas
```typescript
interface TutorialFeedback {
  type: 'success' | 'error' | 'hint' | 'info';
  message: string;
  move?: Move;
  highlightSquares?: string[];
}

interface LessonResult {
  lessonId: string;
  completed: boolean;
  attempts: number;
  hintsUsed: number;
  timeSpent: number;
  rating: 'perfect' | 'good' | 'completed';
}
```

### Eventos
- `tutorial:lessonStart` - Início de uma lição
- `tutorial:moveAttempt` - Tentativa de movimento
- `tutorial:lessonComplete` - Lição finalizada
- `tutorial:hintRequested` - Dica solicitada
- `tutorial:solutionShown` - Solução revelada

## Dependências

- [x] Sistema de IA Neural-X (Sprint 2.1)
- [x] Componente ChessBoard3D existente
- [x] Sistema de estado Zustand
- [x] Framer Motion para animações
- [x] chess.js para lógica de movimentos

## Diagramas

### Fluxo de Dados
```
[User Action] -> [TutorialEngine] -> [ChessEngine]
                     |
                     v
              [Feedback System] -> [UI Update]
                     |
                     v
              [Progress Store] -> [localStorage]
```

### Arquitetura de Componentes
```
TutorialPanel (Container)
    ├── ModuleList
    │     └── ModuleCard[]
    ├── LessonViewer
    │     ├── LessonHeader
    │     ├── InteractiveBoard
    │     │     └── ChessBoard3D
    │     ├── FeedbackOverlay
    │     └── LessonControls
    └── ProgressIndicator
          └── ModuleProgress[]
```

## Riscos

| Risco | Probabilidade | Impacto | Mitigação |
|-------|--------------|---------|-----------|
| Complexidade de integração com IA | Média | Alto | Usar abstrações existentes do ChessEngine |
| Performance em dispositivos móveis | Média | Médio | Otimizar renderização 3D, usar LOD |
| Persistência de dados corrompida | Baixa | Alto | Validação de schema, backup automático |
| UX confusa para iniciantes | Média | Alto | Testes com usuários, iteração de design |

## Critérios de Conclusão

- [ ] Todos os requisitos funcionais implementados
- [ ] Testes unitários com cobertura > 80%
- [ ] Testes de integração passando
- [ ] Testes E2E validando fluxo completo
- [ ] Revisão de código aprovada
- [ ] Documentação atualizada
- [ ] Screenshots de validação visual

## Notas Técnicas

- Reutilizar ChessBoard3D existente com props adicionais para modo tutorial
- Implementar TutorialEngine como classe separada para desacoplamento
- Usar Zustand para estado global de progresso
- Animações devem usar Framer Motion para consistência
- Feedback visual deve ser imediato (< 100ms)

## Histórico de Alterações

| Versão | Data | Autor | Alterações |
|--------|------|-------|------------|
| 1.0 | 2026-02-02 | Rabelus Lab | Criação inicial da especificação |
