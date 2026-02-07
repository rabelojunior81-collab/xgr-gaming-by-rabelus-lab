# TEST PLAN: Sub-Sprint 2.3.2 - Rotação de Câmera Hot-Seat

## Estratégia de Testes

### Pirâmide de Testes
```
    /\
   /  \
  / E2E \      (Fluxos UX - 20%)
 /─────────\
/Integration\   (Componentes - 30%)
/─────────────\
/  Unit Tests   \ (Lógica pura - 50%)
/─────────────────\
```

## Ferramentas
- **Unitários:** Vitest
- **Componentes:** React Testing Library + Three.js render
- **E2E:** Playwright (screenshots de transições)

---

## Casos de Teste

### Unitários

#### TU-001: Cálculo de Posição de Câmera
**Objetivo:** Validar cálculo de posição para cada modo
**Entrada:** `{ mode: 'duel', player: 'white' }`
**Saída Esperada:** `{ position: [0, 8, 12], target: [0, 0, 0] }`
**Status:** ⬜

#### TU-002: Easing Function
**Objetivo:** Validar curva de easing
**Entrada:** `progress: 0.5`
**Saída Esperada:** Valor entre 0 e 1 com curva ease-in-out
**Status:** ⬜

#### TU-003: Interpolação de Vetores
**Objetivo:** Validar lerp entre posições
**Entrada:** `start: [0, 0, 0], end: [0, 0, 10], t: 0.5`
**Saída Esperada:** `[0, 0, 5]`
**Status:** ⬜

### Testes de Integração

#### TI-001: Mudança de Modo
**Objetivo:** Validar mudança de modo de câmera
**Entrada:** Selecionar modo 'duel' no dropdown
**Saída Esperada:** Câmera atualiza para posição correta
**Status:** ⬜

#### TI-002: Sincronização com Turno
**Objetivo:** Validar rotação automática após lance
**Entrada:** Jogador branco faz lance
**Saída Esperada:** Câmera inicia animação para posição das pretas
**Status:** ⬜

### Testes Visuais (E2E)

#### TV-001: Transição Modo Duel
**Objetivo:** Capturar animação de transição
**Passos:**
1. Iniciar partida em modo Duel
2. Fazer primeiro lance
3. Capturar frames durante transição (30fps)
**Resultado Esperado:** Animação suave sem saltos
**Status:** ⬜

#### TV-002: Modo Tabletop
**Objetivo:** Validar visão de cima
**Passos:**
1. Selecionar modo Tabletop
2. Capturar screenshot
**Resultado Esperado:** Visão ortográfica de cima (90°)
**Status:** ⬜

#### TV-003: Performance
**Objetivo:** Validar FPS durante transição
**Passos:**
1. Iniciar transição
2. Medir FPS durante 2 segundos
**Resultado Esperado:** FPS ≥ 60 consistentemente
**Status:** ⬜

### Testes de Acessibilidade

#### TA-001: Desabilitar Animação
**Objetivo:** Validar modo instantâneo
**Entrada:** Desabilitar animações nas configurações
**Saída Esperada:** Câmera muda instantaneamente sem transição
**Status:** ⬜

---

## Checklist de Regressão

- [ ] ⬜ Tabuleiro 3D renderiza normalmente
- [ ] ⬜ Movimentação de peças intacta
- [ ] ⬜ Sistema de turnos não quebrado
- [ ] ⬜ Testes E2E anteriores passando

---

## Métricas

| Métrica | Meta | Status |
|---------|------|--------|
| Cobertura | >80% | ⬜ 0% |
| Testes Unitários | 6+ | ⬜ 0 |
| Testes E2E | 3+ | ⬜ 0 |
| FPS | ≥60 | ⬜ N/A |

---

**Fase RQP:** FASE 4 - VALIDATION (Testes)  
**Data:** 2026-02-07
