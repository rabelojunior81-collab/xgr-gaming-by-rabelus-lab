# DECISIONS: Sub-Sprint 2.3.1 - Procedural Mesh Avançado

## ADR-001: Procedural vs Importado

**Data:** 2026-02-07  
**Status:** Aceito

### Contexto
Precisamos decidir entre:
- **Opção A:** Continuar usando modelos 3D importados (GLTF/GLB)
- **Opção B:** Gerar geometria proceduralmente via código

### Opções Consideradas

#### Opção A: Modelos Importados
**Prós:**
- Qualidade visual superior (modelados por artistas)
- Menor tempo de implementação inicial
- Formatos padronizados (indústria)

**Contras:**
- Bundle size maior (arquivos binários)
- Pouca flexibilidade para customização
- Dependência de assets externos
- Dificuldade para transições de estilo

#### Opção B: Geometria Procedural
**Prós:**
- Bundle size menor (apenas código)
- Personalização infinita (parâmetros ajustáveis)
- Transições suaves entre estilos (morphing)
- Controle total sobre geometria
- LOD automático e otimizado

**Contras:**
- Maior tempo de implementação
- Risco de qualidade visual inferior
- Complexidade técnica maior

### Decisão
Escolhemos **Opção B: Geometria Procedural**

### Justificativa
1. **Alinhamento com visão do produto:** O GDD enfatiza temas dinâmicos e personalização
2. **Flexibilidade para futuro:** Permitirá sistema de "skins" e cosméticos (Fase 5)
3. **Performance:** LOD automático crucial para mobile (Meta do projeto)
4. **Bundle size:** Importante para web (menor tempo de carregamento)

### Consequências
**Positivas:**
- Sistema altamente flexível e extensível
- Base para monetização futura (skins)
- Melhor performance em dispositivos limitados

**Negativas:**
- Investimento inicial de tempo maior (6-8h vs 2-3h)
- Requer refinamento iterativo para alcançar qualidade visual desejada

---

## ADR-002: Biblioteca de Geração

**Data:** 2026-02-07  
**Status:** Aceito

### Contexto
Qual abordagem usar para gerar geometria?

### Decisão
Usar **Three.js BufferGeometry nativo** + funções matemáticas

### Justificativa
- Menor dependência externa
- Maior controle sobre o resultado
- Integração nativa com R3F
- Documentação abundante

### Alternativas Rejeitadas
- **Three-CSG:** Muito pesado para necessidade simples
- **ParametricGeometry:** Deprecado no Three.js moderno

---

## ADR-003: Estratégia de LOD

**Data:** 2026-02-07  
**Status:** Aceito

### Contexto
Como implementar níveis de detalhe?

### Decisão
**LOD manual com distância da câmera**

### Implementação
```typescript
const getLODLevel = (distance: number): number => {
  if (distance < 5) return 0; // High detail
  if (distance < 15) return 1; // Medium
  return 2; // Low
};
```

### Justificativa
- Mais controle que LOD automático do Three.js
- Permite otimizações específicas por peça
- Fácil de ajustar e fine-tunar

---

## Registro de Decisões Futuras

| ID | Descrição | Status |
|----|-----------|--------|
| TBD-001 | Adicionar suporte a texturas procedurais? | Pendente |
| TBD-002 | Implementar physics para peças derrubadas? | Pendente |
| TBD-003 | Criar editor visual de estilos? | Pendente |

---

**Fase RQP:** FASE 2 - SPEC (Decisões)  
**Data:** 2026-02-07
