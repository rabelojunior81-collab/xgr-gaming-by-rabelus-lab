# TEST PLAN: Sub-Sprint 2.1.2 - Gestão de Tempo

## Metadados
- **Versão:** v1.3.2-fase2.sprint1.2
- **Data:** 2026-02-02
- **Status:** Phase 1 Complete

## Testes Manuais (MT)

### MT-001: Tempo de Reflexão em Posição Simples
**Objetivo:** Verificar delay mínimo em posições simples

**Pré-condições:**
- Jogo em modo "practice"
- Velocidade: "normal"
- Posição inicial (abertura)

**Passos:**
1. Iniciar nova partida
2. Jogar 1.e4
3. Observar tempo de resposta da IA

**Resultado Esperado:**
- Delay entre 500ms e 1500ms
- Indicador visual aparece
- Progresso vai de 0% a 100%

**Status:** ⬜ Não Testado

---

### MT-002: Tempo de Reflexão em Posição Complexa
**Objetivo:** Verificar delay aumentado em posições complexas

**Pré-condições:**
- Jogo em modo "practice"
- Velocidade: "normal"
- Posição de meio-jogo com muitas peças

**Passos:**
1. Jogar até meio-jogo (pelo menos 10 movimentos)
2. Criar posição complicada
3. Observar tempo de resposta

**Resultado Esperado:**
- Delay significativamente maior que em posição simples
- Indicador mostra progresso mais lentamente
- Tempo proporcional à complexidade

**Status:** ⬜ Não Testado

---

### MT-003: Indicador Visual Aparece/Desaparece
**Objetivo:** Verificar comportamento do ThinkingIndicator

**Pré-condições:**
- Partida contra IA iniciada

**Passos:**
1. Fazer um movimento
2. Observar indicador durante turno da IA
3. Aguardar movimento da IA

**Resultado Esperado:**
- Indicador aparece imediatamente após movimento do jogador
- Spinner animado é visível
- Barra de progresso preenche
- Indicador desaparece quando IA joga

**Status:** ⬜ Não Testado

---

### MT-004: Configuração de Velocidade Funciona
**Objetivo:** Verificar que mudança de velocidade afeta o delay

**Pré-condições:**
- Menu de Configurações acessível

**Passos:**
1. Abrir Configurações
2. Mudar para "Rápido"
3. Jogar uma partida
4. Mudar para "Lento"
5. Jogar outra partida

**Resultado Esperado:**
- Modo Rápido: Delay muito curto (0.2-1s)
- Modo Lento: Delay perceptível (0.8-5s)
- Configuração persiste após recarregar

**Status:** ⬜ Não Testado

---

### MT-005: Personalidade Afeta Tempo
**Objetivo:** Verificar que personalidade influencia delay

**Pré-condições:**
- Dificuldade: "Personalizado"

**Passos:**
1. Configurar IA Agressiva (agressividade > 70)
2. Jogar alguns movimentos, medir tempo
3. Configurar IA Sólida (agressividade < 30)
4. Jogar mesmos movimentos, medir tempo

**Resultado Esperado:**
- IA Agressiva: Menor tempo de reflexão
- IA Sólida: Maior tempo de reflexão
- Diferença perceptível (20-30%)

**Status:** ⬜ Não Testado

---

### MT-006: Delay Máximo Respeitado
**Objetivo:** Verificar que delay nunca excede o máximo configurado

**Pré-condições:**
- Velocidade: "slow" (maxDelay: 5000ms)
- Posição muito complexa

**Passos:**
1. Configurar velocidade "Lenta"
2. Jogar até posição complexa (meio-jogo tático)
3. Medir tempo máximo de espera

**Resultado Esperado:**
- Delay nunca excede 5 segundos
- IA sempre joga dentro do limite

**Status:** ⬜ Não Testado

---

## Testes Automatizados

### Unidade: TimeManager
**Arquivo:** `src/__tests__/unit/timeManager.test.ts`

#### Suite: calculateComplexity
| Teste | Descrição | Status |
|-------|-----------|--------|
| TC-001 | Retorna score entre 0-100 | ✅ Pass |
| TC-002 | Possui todos os fatores | ✅ Pass |
| TC-003 | Detecta fase opening | ✅ Pass |
| TC-004 | Detecta fase middlegame | ✅ Pass |
| TC-005 | Detecta fase endgame | ✅ Pass |
| TC-006 | Detecta oportunidades táticas | ✅ Pass |

#### Suite: calculateDelay
| Teste | Descrição | Status |
|-------|-----------|--------|
| TC-007 | Delay >= baseDelay | ✅ Pass |
| TC-008 | Delay <= maxDelay | ✅ Pass |
| TC-009 | Respeita maxDelay em alta complexidade | ✅ Pass |
| TC-010 | Aplica fator agressivo (< 1.0) | ✅ Pass |
| TC-011 | Aplica fator sólido (> 1.0) | ✅ Pass |
| TC-012 | Adiciona variação aleatória | ✅ Pass |

#### Suite: simulateThinking
| Teste | Descrição | Status |
|-------|-----------|--------|
| TC-013 | Resolve após delay especificado | ✅ Pass |
| TC-014 | Callback com valores crescentes | ✅ Pass |
| TC-015 | Progresso entre 0-100 | ✅ Pass |

#### Suite: speedConfigs
| Teste | Descrição | Status |
|-------|-----------|--------|
| TC-016 | Tem todas as configurações | ✅ Pass |
| TC-017 | Fast tem delays mais curtos | ✅ Pass |
| TC-018 | Slow tem delays mais longos | ✅ Pass |
| TC-019 | Todas configs têm propriedades necessárias | ✅ Pass |

#### Suite: Configuração
| Teste | Descrição | Status |
|-------|-----------|--------|
| TC-020 | setSpeed aplica fast corretamente | ✅ Pass |
| TC-021 | setSpeed aplica slow corretamente | ✅ Pass |
| TC-022 | setConfig atualiza valores individuais | ✅ Pass |
| TC-023 | setConfig preserva valores existentes | ✅ Pass |

#### Suite: Factory Functions
| Teste | Descrição | Status |
|-------|-----------|--------|
| TC-024 | createTimeManager com config padrão | ✅ Pass |
| TC-025 | createTimeManager aceita config custom | ✅ Pass |
| TC-026 | createTimeManagerForSpeed cria instância correta | ✅ Pass |

#### Suite: Material Balance
| Teste | Descrição | Status |
|-------|-----------|--------|
| TC-027 | Retorna 0 para material igual | ✅ Pass |
| TC-028 | Detecta desbalanceamento | ✅ Pass |

### Cobertura Total
```
Lines: 95.23%
Functions: 100%
Branches: 88.24%
Statements: 94.87%
```

## Regressão

### Testes de Integração
- [ ] ChessEngine integra corretamente com TimeManager
- [ ] GameControls mostra indicador durante thinking
- [ ] Settings persiste e aplica configuração de velocidade
- [ ] Partida completa funciona sem erros

### Testes de Sistema
- [ ] Build completo sem erros TypeScript
- [ ] Todos os testes unitários passam
- [ ] Aplicação inicia corretamente
- [ ] Navegação entre telas funciona

## Checklist de Aprovação

- [ ] Todos os MT executados
- [ ] Cobertura de código ≥ 80%
- [ ] Sem erros TypeScript (strict mode)
- [ ] Build produzido com sucesso
- [ ] Code review aprovado
- [ ] Documentação atualizada

## Bugs Conhecidos

Nenhum bug conhecido nesta fase.

## Notas de Execução

### Executar Testes Unitários
```bash
npm run test:unit -- src/__tests__/unit/timeManager.test.ts
```

### Verificar Cobertura
```bash
npm run test:unit -- --coverage src/__tests__/unit/timeManager.test.ts
```

### Build de Produção
```bash
npm run build
```
