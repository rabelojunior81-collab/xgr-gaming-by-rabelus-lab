# DECISIONS: Sub-Sprint 2.1.1 - Livro de Aberturas

## ADR-001: Estrutura de Dados para Livro de Aberturas
**Status:** Accepted
**Data:** 2026-02-02
**Contexto:** Necessidade de lookup rápido de aberturas por FEN
**Decisão:** Usar Map<string, OpeningData[]> com FEN normalizado como chave
**Alternativas consideradas:** 
- Array linear (rejeitado: O(n))
- Trie (rejeitado: complexo para FEN)
**Consequências:** O(1) lookup, memória ~150KB para 143 aberturas

## ADR-002: Formato de Identificação de Aberturas
**Status:** Accepted
**Contexto:** Padrão para identificar aberturas unicamente
**Decisão:** Usar código ECO (Encyclopedia of Chess Openings)
**Alternativas consideradas:**
- Nome próprio (rejeitado: varia por idioma)
- Hash das posições (rejeitado: não human-readable)
**Consequências:** Compatibilidade com literatura de xadrez

## ADR-003: Seleção Probabilística vs Determinística
**Status:** Accepted
**Contexto:** Como escolher entre múltiplas opções válidas
**Decisão:** Seleção ponderada por pesos + variação aleatória
**Alternativas consideradas:**
- Sempre jogar linha principal (rejeitado: previsível)
- Aleatória pura (rejeitado: ignora qualidade)
**Consequências:** Variedade mantendo qualidade

## ADR-004: Mapeamento de Personalidades
**Status:** Accepted
**Contexto:** Como conectar personalidades IA a estilos de abertura
**Decisão:** Agrupar aberturas em 4 categorias (aggressive, solid, positional, tactical)
**Alternativas consideradas:**
- Sistema de tags múltiplas (rejeitado: complexo)
- Análise dinâmica (rejeitado: requer histórico)
**Consequências:** Simplicidade com cobertura suficiente

## ADR-005: Estratégia de Fallback
**Status:** Accepted
**Contexto:** Comportamento quando sair do livro de aberturas
**Decisão:** Fallback transparente para Stockfish
**Alternativas consideradas:**
- Continuar com cálculo próprio (rejeitado: inferior)
- Sinalizar ao usuário (rejeitado: UX ruim)
**Consequências:** Transição suave, usuário não percebe

## Lições Aprendidas
- Normalização de FEN é crítica (remove números de lances)
- Cache de lookups reduz ~60% do tempo em testes
- 143 aberturas cobrem ~90% das partidas até lance 8
