# SPEC: Sub-Sprint 2.3.2 - Rotação de Câmera Hot-Seat

## Metadados
- **ID:** 2.3.2
- **Versão:** v1.5.2-fase2.sprint3.2
- **Data:** 2026-02-07
- **Complexidade:** Média
- **Estimativa:** 4-5 horas
- **Sprint:** 2.3 - Melhorias 3D e UX
- **Fase:** 2 - Core Features

## 1. Visão Geral

### Objetivo
Implementar sistema de **rotação de câmera** para o modo Hot-Seat (dois jogadores no mesmo dispositivo), permitindo que a câmera gire 180° entre os turnos dos jogadores, proporcionando uma experiência imersiva de "duelo".

### Contexto
No modo Hot-Seat, dois jogadores alternam turnos no mesmo dispositivo. A rotação de câmera:
- Ajuda cada jogador a visualizar o tabuleiro da sua perspectiva
- Cria uma experiência cinematográfica e imersiva
- Facilita a jogabilidade em tablets/dispositivos compartilhados

## 2. Requisitos Funcionais

### RF-001: Modos de Visualização Hot-Seat
**Descrição:** Implementar 3 modos de visualização para multiplayer local

**Critérios de Aceitação:**
- [ ] **Modo Mesa (Tabletop):** Visão de cima fixa (90°), ideal para tablets lado a lado
- [ ] **Modo Duelo (Duel):** Câmera roda 180° entre lances com transição suave de 1.5s
- [ ] **Modo Fixo (Fixed):** Câmera permanece estática (modo atual)

**Estimativa:** 1.5 horas

### RF-002: Transição Suave de Câmera
**Descrição:** Animação fluida entre posições de câmera

**Critérios de Aceitação:**
- [ ] Duração da transição: 1.0 - 1.5 segundos
- [ ] Curva de easing: `ease-in-out` ou `cubic-bezier(0.4, 0, 0.2, 1)`
- [ ] Sem "pulos" ou trepidações durante a transição
- [ ] FPS mantido ≥ 60 durante a animação
- [ ] Opção de desabilitar animação (instantâneo) para acessibilidade

**Estimativa:** 1.5 horas

### RF-003: Controle de Turnos
**Descrição:** Sincronização automática entre turnos e posição de câmera

**Critérios de Aceitação:**
- [ ] Câmera roda automaticamente após cada lance válido
- [ ] Indicador visual de qual jogador está ativo (branco/preto)
- [ ] Botão manual para rotacionar câmera (caso automático falhe)
- [ ] Prevenção de interação durante animação de rotação
- [ ] Som opcional ao finalizar rotação

**Estimativa:** 1 hora

### RF-004: Persistência de Preferências
**Descrição:** Salvar modo de câmera escolhido pelo usuário

**Critérios de Aceitação:**
- [ ] Modo selecionado persistido no gameStore
- [ ] Restaurar modo ao reiniciar partida
- [ ] Default: Modo Mesa para tablets, Modo Duelo para desktop

**Estimativa:** 0.5 horas

## 3. Requisitos Técnicos

### RT-001: Arquitetura
```
CameraSystem
├── CameraController
│   ├── rotateToWhite() → posição 0°
│   ├── rotateToBlack() → posição 180°
│   ├── transitionTo(position, duration)
│   └── setMode(mode: 'tabletop' | 'duel' | 'fixed')
├── TurnManager
│   ├── onTurnEnd(callback)
│   └── getCurrentPlayer()
└── GameSettings
    └── cameraMode: CameraMode
```

### RT-002: Posições de Câmera

| Modo | Posição Brancas | Posição Pretas | Ângulo |
|------|----------------|----------------|--------|
| **Tabletop** | (0, 15, 0) | (0, 15, 0) | 90° fixo |
| **Duel** | (0, 8, 12) | (0, 8, -12) | Alterna 0° ↔ 180° |
| **Fixed** | (0, 8, 12) | (0, 8, 12) | 0° fixo |

**Orientação:**
- Brancas: Olhando para +Z (peões avançam para frente)
- Pretas: Olhando para -Z (peões avançam para frente)

### RT-003: Animação
- **Biblioteca:** `@react-three/fiber` useFrame + interpolation
- **Curva:** Cubic bezier suave
- **Duração:** Configurável (1.0s - 2.0s)
- **Interrupção:** Permitir cancelar animação em andamento

### RT-004: Performance
- **Target FPS:** 60fps durante transição
- **Memória:** Sem leaks de animação
- **Mobile:** Otimizado para touch e baixa latência

## 4. Interface/API

### Tipos TypeScript
```typescript
type CameraMode = 'tabletop' | 'duel' | 'fixed';

interface CameraPosition {
  position: [number, number, number];
  target: [number, number, number];
  fov?: number;
}

interface CameraTransition {
  from: CameraPosition;
  to: CameraPosition;
  duration: number;
  easing: 'linear' | 'ease-in' | 'ease-out' | 'ease-in-out';
}

interface CameraControllerProps {
  mode: CameraMode;
  currentPlayer: 'white' | 'black';
  onTransitionStart?: () => void;
  onTransitionEnd?: () => void;
  transitionDuration?: number;
}
```

### Estados do GameStore
```typescript
interface GameState {
  cameraMode: CameraMode;
  isCameraTransitioning: boolean;
  setCameraMode: (mode: CameraMode) => void;
}
```

## 5. Riscos

| Risco | Probabilidade | Impacto | Mitigação |
|-------|--------------|---------|-----------|
| **R1: Motion sickness** | Média | Alto | Opção de desabilitar animação, transições mais rápidas |
| **R2: Performance em mobile** | Baixa | Médio | Testar em devices reais, otimizar cálculos |
| **R3: UX confusa** | Média | Médio | Indicadores claros, botão de ajuda/tutorial |

## 6. Critérios de Conclusão

- [ ] 3 modos de câmera implementados (Tabletop, Duel, Fixed)
- [ ] Transição suave com easing configurável
- [ ] Rotação automática sincronizada com turnos
- [ ] FPS ≥ 60 durante transições
- [ ] Persistência de preferências
- [ ] Testes unitários para lógica de câmera
- [ ] Testes E2E para transições
- [ ] Documentação atualizada
- [ ] Validação bilateral aprovada

## 7. Definição de Pronto

1. ✅ Código implementado e testado
2. ✅ Testes unitários passando (>80% cobertura)
3. ✅ Testes visuais em 3 modos diferentes
4. ✅ Performance validada (60fps)
5. ✅ Documentação técnica completa
6. ✅ Validação bilateral aprovada
7. ✅ Versão atualizada: v1.5.2-fase2.sprint3.2

---

**Fase RQP:** FASE 2 - SPEC (Especificação)  
**Próximo Passo:** FASE 3 - IMPLEMENTATION  
**Data de Início:** 2026-02-07
