# TEST PLAN: Sub-Sprint 2.3.1 - Procedural Mesh

## Estratégia de Testes

### Pirâmide de Testes
```
    /\
   /  \
  / E2E \      (Visual/UX - 10%)
 /─────────\
/Integration\   (LOD, Transições - 20%)
/─────────────\
/  Unit Tests   \ (Geração - 70%)
/─────────────────\
```

## Ferramentas
- **Unitários:** Vitest + Three.js test utils
- **Visuais:** Playwright screenshots
- **Performance:** FPS counter + memory profiler

---

## Casos de Teste

### Unitários

#### TU-001: Geração de Peão
**Objetivo:** Validar geometria do peão
**Entrada:** `{ style: 'classic', lod: 0 }`
**Saída Esperada:** 
- BufferGeometry válida
- vertexCount > 100
- boundingBox definido
**Status:** ⬜

#### TU-002: Geração de Cavalo
**Objetivo:** Validar geometria do cavalo (mais complexa)
**Entrada:** `{ style: 'modern', lod: 0 }`
**Saída Esperada:**
- BufferGeometry válida
- vertexCount > 200
- Silhueta reconhecível
**Status:** ⬜

#### TU-003: Geração Completa
**Objetivo:** Gerar todas as 6 peças
**Entrada:** Todas as combinações de estilo × peça
**Saída Esperada:**
- 18 geometrias válidas (6 peças × 3 estilos)
- Tempo < 100ms cada
**Status:** ⬜

#### TU-004: LOD Levels
**Objetivo:** Validar redução de polígonos
**Entrada:** Uma peça com lod: 0, 1, 2
**Saída Esperada:**
- lod0.vertexCount > lod1.vertexCount > lod2.vertexCount
- Proporção aproximada: 100% : 50% : 20%
**Status:** ⬜

#### TU-005: Cache de Geometria
**Objetivo:** Validar caching
**Entrada:** Gerar mesma peça 2x
**Saída Esperada:**
- Segunda chamada usa cache
- Tempo < 10ms (vs 50-100ms primeira vez)
**Status:** ⬜

### Testes de Integração

#### TI-001: Transição de Estilo
**Objetivo:** Validar morph entre estilos
**Entrada:** Transição 'classic' → 'futuristic' em 1s
**Saída Esperada:**
- Animação suave (sem saltos)
- Geometria final correta
**Status:** ⬜

#### TI-002: LOD em Cena
**Objetivo:** Validar LOD com múltiplas peças
**Entrada:** 32 peças em cena, câmera movendo
**Saída Esperada:**
- LOD atualiza corretamente para cada peça
- FPS mantém ≥ 60
**Status:** ⬜

### Testes Visuais (E2E)

#### TV-001: Renderização Classic
**Objetivo:** Screenshot estilo clássico
**Passos:**
1. Iniciar jogo
2. Aplicar estilo 'classic'
3. Capturar screenshot
**Resultado Esperado:** Peças visíveis, estilo Staunton reconhecível
**Status:** ⬜

#### TV-002: Renderização Modern
**Objetivo:** Screenshot estilo moderno
**Passos:**
1. Aplicar estilo 'modern'
2. Capturar screenshot
**Resultado Esperado:** Design minimalista, formas geométricas limpas
**Status:** ⬜

#### TV-003: Renderização Futuristic
**Objetivo:** Screenshot estilo futurista
**Passos:**
1. Aplicar estilo 'futuristic'
2. Capturar screenshot
**Resultado Esperado:** Design sci-fi, bordas afiadas, tecnológico
**Status:** ⬜

#### TV-004: Transição Visível
**Objetivo:** Capturar animação de transição
**Passos:**
1. Iniciar transição classic → modern
2. Capturar frames a cada 200ms
3. Validar suavidade
**Resultado Esperado:** Interpolação visualmente suave
**Status:** ⬜

### Testes de Performance

#### TP-001: FPS com 32 Peças
**Objetivo:** Validar performance
**Entrada:** Partida completa, 32 peças em cena
**Saída Esperada:** FPS ≥ 60 consistentemente
**Status:** ⬜

#### TP-002: Memória
**Objetivo:** Validar uso de memória
**Entrada:** Gerar todas as geometrias (18 variantes)
**Saída Esperada:** Uso de memória < 50MB
**Status:** ⬜

#### TP-003: Tempo de Inicialização
**Objetivo:** Validar cold start
**Entrada:** Primeiro acesso ao sistema
**Saída Esperada:** Tempo < 3 segundos
**Status:** ⬜

---

## Checklist de Regressão

- [ ] ⬜ ChessBoard3D funciona normalmente
- [ ] ⬜ Movimentação de peças intacta
- [ ] ⬜ Sistema de temas não quebrado
- [ ] ⬜ Testes E2E anteriores passando

---

## Métricas

| Métrica | Meta | Status |
|---------|------|--------|
| Cobertura | >80% | ⬜ 0% |
| Testes Unitários | 8+ | ⬜ 0 |
| Testes E2E | 4+ | ⬜ 0 |
| FPS | ≥60 | ⬜ N/A |

---

**Fase RQP:** FASE 4 - VALIDATION (Testes)  
**Data:** 2026-02-07
