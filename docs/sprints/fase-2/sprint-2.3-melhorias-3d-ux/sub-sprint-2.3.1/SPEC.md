# SPEC: Sub-Sprint 2.3.1 - Procedural Mesh Avançado para Peças

## Metadados
- **ID:** 2.3.1
- **Versão:** v1.5.1-fase2.sprint3.1
- **Data:** 2026-02-07
- **Complexidade:** Alta
- **Estimativa:** 6-8 horas
- **Sprint:** 2.3 - Melhorias 3D e UX
- **Fase:** 2 - Core Features

## 1. Visão Geral

### Objetivo
Implementar **procedural mesh generation** para as peças de xadrez 3D, permitindo:
- Geometria parametrizável em tempo real
- Níveis de detalhe adaptativos (LOD)
- Estilos visuais dinâmicos (Clássico, Moderno, Futurista)
- Melhor performance com geometria otimizada

### Contexto
Atualmente as peças usam geometria estática importada. O objetivo é criar geometria procedural que permita:
- Personalização visual das peças
- Transições suaves entre estilos
- Menor bundle size (sem assets 3D externos)
- Maior controle artístico

## 2. Requisitos Funcionais

### RF-001: Sistema de Geração Procedural
**Descrição:** Criar sistema que gere geometria de peças via código

**Critérios de Aceitação:**
- [ ] Gerar geometria para todas as 6 peças (Peão, Cavalo, Bispo, Torre, Dama, Rei)
- [ ] Parametrizar: altura, largura, detalhes ornamentais
- [ ] Suportar 3 estilos: Clássico (Staunton), Moderno (Minimalista), Futurista (Sci-fi)
- [ ] Tempo de geração < 100ms por peça
- [ ] Cache de geometria gerada

**Estimativa:** 4 horas

### RF-002: Níveis de Detalhe (LOD)
**Descrição:** Implementar sistema LOD para otimização de performance

**Critérios de Aceitação:**
- [ ] 3 níveis de detalhe: Alto (próximo), Médio (intermediário), Baixo (distante)
- [ ] Transição automática baseada na distância da câmera
- [ ] Distâncias configuráveis: LOD0 < 5m, LOD1 < 15m, LOD2 > 15m
- [ ] Redução de polígonos: 100% → 50% → 20%
- [ ] Sem "popping" visual nas transições

**Estimativa:** 2 horas

### RF-003: Transições de Estilo
**Descrição:** Permitir troca de estilo visual em tempo real

**Critérios de Aceitação:**
- [ ] Transição suave entre estilos (morphing)
- [ ] Duração da transição: 1-2 segundos
- [ ] Manter posição e estado da peça durante transição
- [ ] Preview do estilo no menu de configurações

**Estimativa:** 2 horas

### RF-004: Integração com Sistema de Temas
**Descrição:** Integrar com temas existentes (Clássico, Cyberpunk, Minimalista)

**Critérios de Aceitação:**
- [ ] Cada tema usar estilo de peça apropriado
- [ ] Sincronização de cores entre tabuleiro e peças
- [ ] Persistência de preferência do usuário

**Estimativa:** 1 hora

## 3. Requisitos Técnicos

### RT-001: Arquitetura
```
ProceduralPieceSystem
├── PieceGeometryGenerator
│   ├── generatePawn(style, params)
│   ├── generateKnight(style, params)
│   ├── generateBishop(style, params)
│   ├── generateRook(style, params)
│   ├── generateQueen(style, params)
│   └── generateKing(style, params)
├── LODManager
│   ├── getLODLevel(distance)
│   └── updateLODs(cameraPosition)
└── StyleTransition
    ├── morphGeometry(from, to, duration)
    └── cacheIntermediateStates()
```

### RT-002: Dependências
- Three.js (já instalado)
- React Three Fiber (já instalado)
- BufferGeometryUtils (novo)

### RT-003: Performance
- **Target FPS:** 60fps com 32 peças em cena
- **Memória:** < 50MB para geometria completa
- **Tempo de carga inicial:** < 3 segundos

## 4. Interface/API

### Tipos TypeScript
```typescript
interface PieceStyle {
  name: 'classic' | 'modern' | 'futuristic';
  baseRadius: number;
  height: number;
  ornamentDetails: number; // 0-1
  smoothness: number; // 0-1
}

interface LODConfig {
  distances: [number, number, number]; // [lod0, lod1, lod2]
  reductionFactors: [number, number, number]; // [1.0, 0.5, 0.2]
}

interface ProceduralPieceProps {
  piece: PieceType;
  color: 'white' | 'black';
  style: PieceStyle;
  lodConfig: LODConfig;
  position: Vector3;
}
```

## 5. Riscos

| Risco | Probabilidade | Impacto | Mitigação |
|-------|--------------|---------|-----------|
| R1: Performance em mobile | Média | Alto | Implementar LOD agressivo, testar em devices reais |
| R2: Qualidade visual inferior | Média | Médio | Criar presets refinados, permitir ajustes manuais |
| R3: Complexidade excessiva | Alta | Médio | Começar com peças simples, iterar gradualmente |

## 6. Critérios de Conclusão

- [ ] Todas as 6 peças gerando geometria procedural
- [ ] Sistema LOD funcionando com transições suaves
- [ ] 3 estilos visuais implementados
- [ ] Testes unitários para geração de geometria
- [ ] Performance ≥ 60fps em desktop
- [ ] Cobertura de testes > 80%
- [ ] Documentação de API completa

## 7. Definição de Pronto

1. ✅ Código implementado e testado
2. ✅ Testes unitários passando (>80% cobertura)
3. ✅ Testes visuais em 3 estilos diferentes
4. ✅ Performance validada (60fps)
5. ✅ Documentação técnica completa
6. ✅ Validação bilateral aprovada
7. ✅ Versão atualizada: v1.5.1-fase2.sprint3.1

---

**Fase RQP:** FASE 2 - SPEC (Especificação)  
**Próximo Passo:** FASE 3 - IMPLEMENTATION  
**Data de Início:** 2026-02-07
