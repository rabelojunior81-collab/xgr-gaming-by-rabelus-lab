# DECISIONS: Sub-Sprint 2.3.2 - Rotação de Câmera Hot-Seat

## ADR-001: Biblioteca de Animação

**Data:** 2026-02-07  
**Status:** Aceito

### Contexto
Qual abordagem usar para animar a câmera?

### Opções Consideradas

#### Opção A: React Spring
**Prós:**
- Física realista
- Animações naturais
- Bom ecossistema React

**Contras:**
- Bundle size adicional (~15KB)
- Curva de aprendizado
- Overkill para necessidade simples

#### Opção B: Framer Motion
**Prós:**
- Integração React excelente
- API declarativa
- Animações suaves

**Contras:**
- Não otimizado para Three.js/R3F
- Pode conflitar com loop de renderização

#### Opção C: Interpolação Manual com useFrame (Escolhida)
**Prós:**
- Controle total sobre a animação
- Integração nativa com R3F
- Sem dependências adicionais
- Performance máxima

**Contras:**
- Mais código para manter
- Requer entendimento de animação

### Decisão
Escolhemos **Opção C: Interpolação Manual com useFrame**

### Justificativa
1. **Performance:** Controle direto do loop de renderização do Three.js
2. **Controle:** Podemos implementar easing customizado e otimizado
3. **Sem dependências:** Mantém bundle size baixo
4. **Integração:** Funciona perfeitamente com React Three Fiber

### Implementação
```typescript
useFrame((state, delta) => {
  if (isTransitioning) {
    progress += delta / duration;
    const eased = easeInOutCubic(progress);
    camera.position.lerpVectors(startPos, endPos, eased);
    
    if (progress >= 1) {
      isTransitioning = false;
    }
  }
});
```

---

## ADR-002: Disparo da Transição

**Data:** 2026-02-07  
**Status:** Aceito

### Contexto
Quando disparar a rotação de câmera?

### Opções Consideradas

#### Opção A: Após confirmação do lance
**Prós:**
- Usuário vê resultado antes de girar
- Menos desorientador

**Contras:**
- Pausa estranha na experiência
- Não é "cinematográfico"

#### Opção B: Imediatamente após soltar peça (Escolhida)
**Prós:**
- Fluxo contínuo e imersivo
- Experiência de duelo
- Mais natural

**Contras:**
- Pode ser rápido demais para alguns usuários
- Requer animação suave

### Decisão
Escolhemos **Opção B: Imediatamente após soltar peça**

### Justificativa
A experiência de "duelo" re fluidez. A rotação imediata cria um ritmo de jogo mais dinâmico e profissional, similar a filmes de xadrez.

### Mitigação
- Duração de 1.5s (não muito rápido)
- Opção de desabilitar animação para acessibilidade

---

## ADR-003: Persistência de Estado

**Data:** 2026-02-07  
**Status:** Aceito

### Contexto
Onde persistir o modo de câmera selecionado?

### Decisão
Persistir no **gameStore (Zustand)** com persist middleware

### Justificativa
1. **Consistência:** Mesmo padrão usado para outros estados do jogo
2. **Reatividade:** Componentes atualizam automaticamente
3. **Persistência:** Salva no localStorage automaticamente
4. **Simplicidade:** Não requer nova infraestrutura

### Implementação
```typescript
interface GameState {
  cameraMode: CameraMode;
  setCameraMode: (mode: CameraMode) => void;
}

export const useGameStore = create<GameState>()(
  persist(
    (set) => ({
      cameraMode: 'duel',
      setCameraMode: (mode) => set({ cameraMode: mode }),
    }),
    { name: 'chess-game-storage' }
  )
);
```

---

## Registro de Decisões Futuras

| ID | Descrição | Status |
|----|-----------|--------|
| TBD-001 | Adicionar transições de câmera cinematográficas (zoom in em xeque)? | Pendente |
| TBD-002 | Implementar gravação de replay com movimentação de câmera? | Pendente |
| TBD-003 | Criar preset de câmera customizado pelo usuário? | Pendente |

---

**Fase RQP:** FASE 2 - SPEC (Decisões)  
**Data:** 2026-02-07
