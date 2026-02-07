# Plano de Testes: Sub-Sprint 2.1.1 - Livro de Aberturas

## ID
`CHESS-2.1-2.1.1-TEST`

## Objetivo

Validar a implementação do Fator 3 da IA Neural-X (Livro de Aberturas) através de testes manuais bilaterais com jogadores humanos, garantindo:
- Comportamento consistente com a personalidade da IA
- Performance adequada (< 10ms por lookup)
- Fallback correto quando fora do livro
- Experiência de usuário satisfatória

## Estratégia de Testes

### Pirâmide de Testes

```
        /\
       /  \
      / E2E \      (Testes de UI - Fase 2)
     /--------\
    / Integration\ (Testes de Integração - Automatizados)
   /--------------\
  /    Unit Tests   \ (Testes Unitários - 97% cobertura ✅)
 /--------------------\
```

### Níveis de Teste

| Nível | Ferramenta | Status | Cobertura |
|-------|-----------|--------|-----------|
| Unit | Vitest | ✅ Passando | 97% |
| Integration | Vitest | ✅ Passando | 85% |
| E2E | Playwright | ⏳ Fase 2 | - |
| Manual | Humanos | ⏳ Fase 2 | - |

## Roteiro de Testes Manuais

### MT-001: Abertura Siciliana com IA Agressiva (Drakon)

**Objetivo:** Verificar se IA agressiva joga Siciliana consistentemente

**Pré-condições:**
- Sistema compilado e rodando
- Personalidade "Drakon" selecionada (Aggressiveness: 90)

**Passos:**
1. Iniciar nova partida
2. Jogar **1. e4** (brancas)
3. Observar resposta da IA (pretas)
4. Anotar movimento jogado
5. Reiniciar partida e repetir 10 vezes

**Resultado Esperado:**
- IA deve jogar **1...c5** (Siciliana) em pelo menos 70% das partidas
- Outras respostas aceitáveis: e5, e6, c6

**Critérios de Aceitação:**
- [ ] Siciliana jogada ≥ 70% das vezes
- [ ] Tempo de resposta < 1s
- [ ] Sem erros no console

---

### MT-002: Abertura Francesa com IA Sólida (Fortress)

**Objetivo:** Verificar se IA sólida prefere estruturas estáveis

**Pré-condições:**
- Personalidade "Fortress" selecionada (Aggressiveness: 20)

**Passos:**
1. Iniciar nova partida
2. Jogar **1. e4** (brancas)
3. Observar resposta da IA
4. Anotar movimento jogado
5. Reiniciar partida e repetir 10 vezes

**Resultado Esperado:**
- IA deve preferir **e6** (Francesa) ou **c6** (Caro-Kann)
- Raramente deve jogar c5 (Siciliana)

**Critérios de Aceitação:**
- [ ] Francesa/Caro-Kann ≥ 60% das vezes
- [ ] Siciliana ≤ 20% das vezes

---

### MT-003: Abertura Inglesa com IA Posicional (Strategos)

**Objetivo:** Verificar preferência por estruturas posicionais

**Pré-condições:**
- Personalidade "Strategos" selecionada
- Jogador com peças pretas

**Passos:**
1. Iniciar nova partida
2. Deixar IA jogar com brancas
3. Anotar primeiro movimento
4. Reiniciar e repetir 10 vezes

**Resultado Esperado:**
- IA deve jogar **1. c4** (Inglesa) ou **1. Nf3** (Réti) frequentemente
- Evitar 1. e4 em favor de estruturas fechadas

**Critérios de Aceitação:**
- [ ] c4 ou Nf3 ≥ 50% das vezes
- [ ] Variedade nas respostas

---

### MT-004: Transição Livro → Cálculo

**Objetivo:** Verificar fallback quando posição sai do livro

**Pré-condições:**
- Qualquer personalidade
- Console aberto para logs

**Passos:**
1. Iniciar partida
2. Jogar sequência incomum: **1. e4 e5 2. Qh5?!**
3. Observar resposta da IA
4. Verificar console por mensagens

**Resultado Esperado:**
- IA responde dentro de 2-3 segundos
- Console mostra: "[ChessEngine] Fallback para Stockfish"
- Movimento é taticamente correto (Nc6 ou g6)

**Critérios de Aceitação:**
- [ ] Sem travamentos
- [ ] Mensagem de fallback no console
- [ ] Movimento taticamente válido

---

### MT-005: Variedade de Aberturas

**Objetivo:** Verificar que IA não repete sempre a mesma abertura

**Pré-condições:**
- Personalidade "Tactical" (variedade média)
- Jogador com peças brancas

**Passos:**
1. Iniciar 20 partidas
2. Em cada uma, jogar **1. e4**
3. Registrar resposta da IA

**Resultado Esperado:**
- Pelo menos 3 aberturas diferentes vistas
- Distribuição não deve ser 100% para uma única abertura

**Critérios de Aceitação:**
- [ ] ≥ 3 aberturas diferentes observadas
- [ ] Nenhuma abertura com > 60% frequência

---

### MT-006: Performance de Lookup

**Objetivo:** Medir tempo de resposta do livro de aberturas

**Pré-condições:**
- Console aberto
- Modo de desenvolvimento

**Passos:**
1. Abrir DevTools → Performance
2. Iniciar gravação
3. Jogar 10 lances iniciais rapidamente
4. Parar gravação
5. Verificar timestamps

**Resultado Esperado:**
- Cada movimento da IA < 500ms
- A maioria < 100ms (está no livro)

**Critérios de Aceitação:**
- [ ] 90% dos movimentos < 500ms
- [ ] 70% dos movimentos < 100ms

---

### MT-007: Teste de Longa Duração

**Objetivo:** Verificar estabilidade em partidas longas

**Pré-condições:**
- Personalidade aleatória
- Tempo suficiente

**Passos:**
1. Jogar partida completa (~40 lances)
2. Monitorar console por erros
3. Anotar qualquer travamento

**Resultado Esperado:**
- Partida completa sem erros
- Cache funcionando corretamente
- Memória estável

**Critérios de Aceitação:**
- [ ] Partida completa sem erros
- [ ] Sem memory leaks aparentes

---

### MT-008: Teste de Personalidade Personalizada

**Objetivo:** Verificar comportamento com valores customizados

**Pré-condições:**
- Acesso à configuração de personalidade

**Passos:**
1. Criar personalidade: Aggressiveness=50, Precision=80
2. Jogar 5 partidas
3. Observar balanceamento entre agressão e precisão

**Resultado Esperado:**
- Mix de aberturas táticas e posicionais
- Nenhum extremo absoluto

**Critérios de Aceitação:**
- [ ] Comportamento balanceado
- [ ] Sem preferência extrema

---

## Casos de Teste Unitário (Automatizados)

### TU-001: Lookup de Posição Inicial
```typescript
it('deve encontrar movimentos para posição inicial', () => {
  const moves = openingBook.lookup(STARTING_FEN);
  expect(moves).not.toBeNull();
  expect(moves!.length).toBeGreaterThan(0);
});
```
**Status:** ✅ Passando

### TU-002: Seleção por Personalidade Agressiva
```typescript
it('deve aplicar pesos da personalidade agressiva', () => {
  const move = openingBook.selectMove(STARTING_FEN, aggressivePersonality);
  expect(move).not.toBeNull();
});
```
**Status:** ✅ Passando

### TU-003: Formato UCI dos Movimentos
```typescript
it('deve ter movimentos em formato UCI', () => {
  for (const opening of OPENINGS) {
    for (const move of opening.moves) {
      expect(move).toMatch(/^[a-h][1-8][a-h][1-8][qrbn]?$/);
    }
  }
});
```
**Status:** ✅ Passando

### TU-004: Categorias de Abertura
```typescript
it('deve retornar aberturas agressivas', () => {
  const aggressive = openingBook.getOpeningsByCategory('aggressive');
  expect(aggressive.length).toBeGreaterThan(0);
});
```
**Status:** ✅ Passando

## Execução dos Testes

### Testes Automatizados

```bash
# Executar todos os testes unitários
npm run test:unit

# Executar com cobertura
npm run test:coverage

# Verificar cobertura específica
npm run test:coverage -- --reporter=html
```

### Testes Manuais

1. Preparar ambiente de teste
2. Seguir roteiros acima
3. Registrar resultados na planilha de testes
4. Reportar bugs encontrados

## Registro de Defeitos

| ID | Descrição | Severidade | Status |
|----|-----------|------------|--------|
| - | - | - | - |

## Critérios de Conclusão da Fase 2

- [ ] Todos os testes manuais (MT-001 a MT-008) executados
- [ ] Mínimo 80% dos testes passando
- [ ] Nenhum bug crítico ou alto pendente
- [ ] Feedback positivo de pelo menos 2 jogadores testadores
- [ ] Documentação de lições aprendidas

## Calendário de Testes

| Dia | Atividade | Responsável |
|-----|-----------|-------------|
| 1 | Preparação do ambiente | QA |
| 2-3 | Execução MT-001 a MT-004 | Testers |
| 4-5 | Execução MT-005 a MT-008 | Testers |
| 6 | Consolidação de resultados | QA |
| 7 | Report e feedback | Time |

## Recursos Necessários

- 2-3 jogadores de xadrez (nível intermediário+)
- Ambiente de teste configurado
- Acesso ao console/ DevTools
- Planilha de registro de resultados

## Notas

- Testes devem ser realizados em diferentes navegadores
- Registrar comportamentos inesperados mesmo que não sejam bugs
- Coletar feedback qualitativo sobre a experiência de jogo

---

**Data:** 2026-02-02  
**Versão:** v1.3.1-fase2.sprint1.1  
**Próxima Revisão:** Após Fase 2
