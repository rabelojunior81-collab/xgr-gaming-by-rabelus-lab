# TEST PLAN: Sub-Sprint 2.1.4 - Integração e Testes E2E

## Objetivo

Validar a integração completa dos 5 fatores da IA Neural-X através de testes manuais e automatizados.

## Escopo

- Testes E2E com Playwright
- Validação visual no navegador
- Testes de todas as personalidades
- Validação de performance

## Ambiente de Teste

- **URL:** http://localhost:5173
- **Navegadores:** Chromium, Firefox, WebKit
- **Resolução:** 1280x720
- **Dados:** Partidas simuladas contra IA Neural-X

## Cenários de Teste

### CT-001: Fluxo Completo - Personalidade Aggressive (Drakon)

**Pré-condições:**
- Ambiente limpo (sem processos órfãos)
- Servidor rodando na porta 5173

**Passos:**
1. Acessar http://localhost:5173
2. Clicar em "Praticar vs IA"
3. Selecionar personalidade "Aggressive (Drakon)"
4. Iniciar partida
5. Jogar 1.e4 (clicar em peão e2 → e4)
6. Aguardar resposta da IA
7. Verificar histórico de lances
8. Jogar mais 4 lances

**Resultados Esperados:**
- ✅ IA responde em < 5 segundos
- ✅ Estado emocional visível no painel lateral
- ✅ Movimentos sugerem comportamento agressivo (Siciliana, táticas)
- ✅ EmotionalIndicator mostra emoji e barra de confiança

**Critérios de Sucesso:**
- Tempo médio de resposta entre 1-4 segundos
- Estado emocional atualizado durante a partida
- Pelo menos 3 lances registrados no histórico

---

### CT-002: Fluxo Completo - Personalidade Solid (Fortress)

**Passos:**
1-4. Igual ao CT-001, mas selecionar "Solid (Fortress)"
5. Jogar 1.e4
6. Aguardar resposta

**Resultados Esperados:**
- ✅ IA joga abertura sólida (Caro-Kann, Francesa)
- ✅ Movimentos conservadores no meio-jogo
- ✅ Estado emocional mais estável (menos variações)

---

### CT-003: Validação do Fator 3 - Livro de Aberturas

**Passos:**
1. Iniciar nova partida
2. Jogar lances de abertura padrão (1.e4, 2.Nf3, 3.Bb5)
3. Verificar console do navegador

**Resultados Esperados:**
- ✅ Console mostra "[ChessEngine] Usando movimento do livro"
- ✅ Delay de resposta < 1 segundo (movimentos de livro são mais rápidos)
- ✅ Movimentos teoricamente corretos

---

### CT-004: Validação do Fator 4 - Gestão de Tempo

**Passos:**
1. Iniciar partida
2. Jogar lance inicial
3. Medir tempo de resposta com cronômetro
4. Jogar lance em posição complexa (meio-jogo)
5. Medir tempo novamente

**Resultados Esperados:**
- ✅ Posição simples (abertura): 0.5-1.5 segundos
- ✅ Posição complexa (meio-jogo): 2-4 segundos
- ✅ Console mostra "[ChessEngine] Complexidade: X/100, Delay: Yms"

---

### CT-005: Validação do Fator 5 - Resiliência Emocional

**Passos:**
1. Iniciar partida
2. Observar EmotionalIndicator (deve estar "Neutro")
3. Jogar de forma a ganhar material (capturar peças)
4. Observar mudança no estado emocional

**Resultados Esperados:**
- ✅ Estado inicial: "Neutro 😐"
- ✅ Após ganhar vantagem: "Confident 😤" ou "Optimistic 😊"
- ✅ Barra de confiança aumenta
- ✅ Mensagem contextual aparece

---

### CT-006: Teste de Performance - Partida Completa (20 lances)

**Passos:**
1. Iniciar partida
2. Jogar 20 lances (10 turnos completos)
3. Medir tempo total
4. Verificar uso de memória (Chrome DevTools)

**Resultados Esperados:**
- ✅ Tempo total < 2 minutos
- ✅ Nenhum lag ou travamento
- ✅ Memória estável (< 200MB)
- ✅ Todos os lances registrados corretamente

---

### CT-007: Validação Visual - Screenshots

**Passos:**
1. Capturar screenshot do menu principal
2. Capturar screenshot do início da partida
3. Capturar screenshot após 5 lances
4. Capturar screenshot mostrando estado emocional alterado

**Critérios de Aceitação:**
- ✅ EmotionalIndicator visível em todas as screenshots do jogo
- ✅ Estado emocional legível
- ✅ Interface não quebrada

---

### CT-008: Testes E2E Automatizados

**Comando:**
```bash
npx playwright test e2e/specs/neural-x-integration.spec.ts --headed
```

**Resultados Esperados:**
- ✅ Todos os testes passam
- ✅ Screenshots geradas em `screenshots/`
- ✅ Relatório HTML disponível

---

## Checklist de Validação Bilateral

| Item | Status | Observações |
|------|--------|-------------|
| CT-001: Aggressive | ⬜ | |
| CT-002: Solid | ⬜ | |
| CT-003: Livro de Aberturas | ⬜ | |
| CT-004: Gestão de Tempo | ⬜ | |
| CT-005: Resiliência Emocional | ⬜ | |
| CT-006: Performance | ⬜ | |
| CT-007: Screenshots | ⬜ | |
| CT-008: Testes E2E | ⬜ | |

## Critérios de Aprovação

- ✅ 100% dos testes manuais passaram
- ✅ Todos os testes E2E automatizados passaram
- ✅ Screenshots capturadas e revisadas
- ✅ Performance dentro dos limites aceitáveis
- ✅ Nenhum erro crítico no console

## Próxima Fase

Após aprovação bilateral:
1. Criar RELEASE.md do Sprint 2.1
2. Atualizar versão para v1.3.4-fase2.sprint1.4
3. Preparar Sprint 2.2 (Tutoriais Interativos)
