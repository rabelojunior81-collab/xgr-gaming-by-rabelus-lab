# DECISIONS: Sub-Sprint 2.1.2 - Gestão de Tempo

## ADR-001: Estratégia de Delay Artificial
**Status:** Accepted
**Data:** 2026-02-02
**Contexto:** Necessidade de simular tempo de reflexão humano
**Decisão:** Implementar delay proporcional à complexidade da posição
**Alternativas consideradas:**
- Delay fixo (rejeitado: não realista)
- Sem delay (rejeitado: UX ruim)
- Delay aleatório puro (rejeitado: ignora complexidade)
**Consequências:** IA mais natural, melhor imersão

## ADR-002: Cálculo de Complexidade Posicional
**Status:** Accepted
**Contexto:** Como medir quão complexa é uma posição
**Decisão:** Fórmula ponderada: peças(30%) + material(20%) + táticas(30%) + fase(20%)
**Alternativas consideradas:**
- Apenas contagem de peças (rejeitado: simplista)
- Análise Stockfish para cada posição (rejeitado: lento)
**Consequências:** Balanceamento performance vs precisão

## ADR-003: UX do Indicador de Pensamento
**Status:** Accepted
**Contexto:** Feedback visual durante o delay
**Decisão:** Spinner + barra de progresso + mensagem personalizada
**Alternativas consideradas:**
- Apenas cursor de espera (rejeitado: pouco informativo)
- Bloquear interface (rejeitado: UX ruim)
**Consequências:** Usuário entende que IA está "pensando"

## ADR-004: Configuração de Velocidade
**Status:** Accepted
**Contexto:** Diferentes usuários preferem velocidades diferentes
**Decisão:** 3 presets: Fast/Normal/Slow com valores fixos
**Alternativas consideradas:**
- Slider contínuo (rejeitado: overkill)
- Por personalidade apenas (rejeitado: pouco controle)
**Consequências:** Simplicidade com flexibilidade suficiente

## Lições Aprendidas
- Fator de aleatoriedade importante para não parecer robótico
- Persistência da configuração melhora UX significativamente
- Delay mínimo de 500ms necessário mesmo em posições simples
