# SPEC: Sub-Sprint 2.1.1 - Livro de Aberturas

## Metadados
- **Versão:** v1.3.1-fase2.sprint1.1
- **Data:** 2026-02-02
- **Complexidade:** Média
- **Estimativa:** 4-6 horas

## Objetivo
Implementar Fator 3 da IA Neural-X: Livro de Aberturas, permitindo que a IA use conhecimento teórico de aberturas de xadrez em vez de cálculo puro nos primeiros lances.

## Requisitos Funcionais

### RF-001: Banco de Dados de Aberturas (ECO)
**Descrição:** Implementar um banco de dados estruturado contendo as aberturas mais comuns do ECO (Encyclopedia of Chess Openings).

**Critérios de Aceitação:**
- [x] Catálogo ECO reduzido com 50-100 aberturas mais comuns
- [x] Estrutura de dados: FEN → lista de movimentos possíveis
- [x] Formato UCI para movimentos (e2e4, e7e5, etc.)
- [x] Incluir: Italiana, Siciliana, Francesa, Caro-Kann, Inglesa, Ruy Lopez, etc.

**Estimativa:** 2 pontos

### RF-002: Seleção Probabilística Baseada na Personalidade
**Descrição:** A IA deve selecionar aberturas de acordo com sua personalidade configurada.

**Critérios de Aceitação:**
- [x] Mapeamento de personalidades para categorias de aberturas
- [x] Aggressive (Drakon): Siciliana, King's Gambit, Scandinavian
- [x] Solid (Fortress): Caro-Kann, Slav, London System
- [x] Positional (Strategos): Inglesa, Catalã, Réti
- [x] Tactical (Tactical): Italiana, Ruy Lopez, Two Knights
- [x] Sistema de pesos para variações mais jogadas

**Estimativa:** 2 pontos

### RF-003: Fallback para Cálculo Stockfish
**Descrição:** Quando a posição sair do livro de aberturas, a IA deve fazer fallback para cálculo normal via Stockfish.

**Critérios de Aceitação:**
- [x] Detecção automática de saída do livro (`isInBook()`)
- [x] Transição suave para cálculo Stockfish
- [x] Sem latência perceptível ao usuário

**Estimativa:** 1 ponto

### RF-004: Suporte a Variantes Principais e Alternativas
**Descrição:** O sistema deve suportar tanto linhas principais quanto variações alternativas das aberturas.

**Critérios de Aceitação:**
- [x] Múltiplos movimentos possíveis para mesma posição FEN
- [x] Diferentes pesos para variações principais vs. alternativas
- [x] Profundidade configurável do livro (até 10-15 lances)

**Estimativa:** 1 ponto

## Requisitos Técnicos

### RNF-001: Performance
- Tempo de lookup: O(1) usando Map/FEN
- Latência máxima: < 10ms
- Consumo de memória: < 5MB para catálogo completo

### RNF-002: Estrutura de Dados
```typescript
interface OpeningData {
  eco: string;
  name: string;
  category: 'open' | 'semi-open' | 'closed' | 'indian' | 'modern';
  moves: string[]; // UCI format
  weight: number; // 1-10
}

interface BookMove {
  move: string;
  weight: number;
  openingName: string;
}
```

### RNF-003: Integração
- Integração transparente com `ChessEngine` existente
- Método `getBookMove()` para consulta ao livro
- Fallback automático para `getPersonalityMove()`

## Interface/API

### OpeningBook
```typescript
export class OpeningBook {
  constructor()
  lookup(fen: string): BookMove[] | null
  selectMove(fen: string, personality: AIPersonality): string | null
  isInBook(fen: string): boolean
  getBookDepth(): number
}
```

## Dependências

- [x] chess.js (já existente)
- [x] Tipos do projeto (src/types/chess.ts)
- [x] ChessEngine existente (src/engine/chessEngine.ts)

## Critérios de Aceitação Gerais

- [x] IA joga aberturas reconhecíveis (italiana, siciliana, etc.)
- [x] Personalidade afeta escolha (agressiva → siciliana, sólida → inglesa)
- [x] Testes unitários passando (>80% cobertura)
- [x] Performance: lookup < 10ms
- [x] Build sem erros TypeScript
- [x] Documentação completa

## Riscos

| Risco | Probabilidade | Impacto | Mitigação |
|-------|--------------|---------|-----------|
| Dados de aberturas incompletos | Média | Médio | Catálogo curado com 50+ aberturas essenciais |
| Performance do lookup | Baixa | Alto | Estrutura Map O(1), testes de benchmark |
| Conflito com lógica existente | Média | Médio | Testes de integração completos |

## Notas Técnicas

- O FEN é normalizado (remove contadores de meio-lances e número de jogadas) para lookup consistente
- O sistema usa pesos probabilísticos para seleção de variações
- Integração com Stockfish mantida como fallback

## Histórico de Alterações

| Versão | Data | Autor | Alterações |
|--------|------|-------|------------|
| v1.3.1 | 2026-02-02 | Roo | Criação da SPEC - Fase 1 |
