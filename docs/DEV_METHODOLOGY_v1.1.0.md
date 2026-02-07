# 🎯 Iterative Bilateral Validation Development (IBVD)
## Metodologia de Desenvolvimento do Chess GDD 3D

**Versão:** 1.1.0
**Data:** 2026-02-03
**Status:** ✅ Aprovado para Fase 2

> 📋 **Changelog v1.1.0**
> - Adicionada Seção 11: Protocolo de Correção de Bugs e Hotfixes
> - Adicionada Seção 12: Lições Aprendidas (Log de Incidentes)
> - Incidente 001 documentado: Bug #003 - Layout Responsivo do Tabuleiro

---

## 📋 Sumário

1. [Visão Geral da Metodologia](#1-visão-geral-da-metodologia)
2. [Estrutura de Versionamento Semântico](#2-estrutura-de-versionamento-semântico)
3. [Estrutura de Branches](#3-estrutura-de-branches)
4. [Decomposição da Fase 2](#4-decomposição-da-fase-2)
5. [Framework de Testes Automatizados](#5-framework-de-testes-automatizados)
6. [Protocolo de Validação Bilateral](#6-protocolo-de-validação-bilateral)
7. [Documentação Obrigatória por Sub-Sprint](#7-documentação-obrigatória-por-sub-sprint)
8. [Critérios de Aceitação](#8-critérios-de-aceitação)
9. [Ferramentas e Stack](#9-ferramentas-e-stack)
10. [Template de Sub-Sprint](#10-template-de-sub-sprint)
11. [Protocolo de Correção de Bugs e Hotfixes](#11-protocolo-de-correção-de-bugs-e-hotfixes)
12. [Lições Aprendidas](#12-lições-aprendidas)

---

## 1. Visão Geral da Metodologia

### 🎯 Nome: Iterative Bilateral Validation Development (IBVD)

### 📌 Objetivo
Garantir **precisão cirúrgica** e **contexto suficiente** em cada implementação através de um processo rigoroso de validação contínua.

### 🏗️ Base Metodológica

| Componente | Descrição |
|------------|-----------|
| **Versionamento Semântico** | Controle granular de versões com identificadores de fase e sprint |
| **Git Flow** | Estrutura de branches organizada e previsível |
| **TDD** | Test-Driven Development para qualidade desde o início |
| **Validação Bilateral** | Aprovação tanto técnica quanto do stakeholder em cada entrega |

### 💡 Princípios Fundamentais

1. **Iteração Controlada**: Cada sub-sprint tem escopo bem definido e mensurável
2. **Validação Dupla**: Nada vai para produção sem aprovação técnica E do stakeholder
3. **Documentação Viva**: Cada decisão é registrada e versionada
4. **Qualidade Embutida**: Testes automatizados são obrigatórios, não opcionais

---

## 2. Estrutura de Versionamento Semântico

### 🏷️ Formato Completo

```
MAJOR.MINOR.PATCH-FASE.SPRINT
```

### 📋 Componentes

| Componente | Significado | Quando Incrementar |
|------------|-------------|-------------------|
| **MAJOR** | Mudanças arquiteturais | Novas fases do projeto |
| **MINOR** | Funcionalidades | Início de novos sprints |
| **PATCH** | Correções | Sub-sprints e hotfixes |
| **FASE** | Identificador da fase | fase1, fase2, fase3... |
| **SPRINT** | Identificador do sprint | sprint1, sprint2... |

### 📝 Exemplos

```
1.2.3-fase2.sprint1      # Versão inicial da Fase 2, Sprint 1
1.2.4-fase2.sprint1      # Hotfix no Sprint 1
1.3.0-fase2.sprint2      # Novo sprint (MINOR incrementado)
2.0.0-fase3.sprint1      # Nova fase (MAJOR incrementado)
```

### 🔄 Fluxo de Versionamento

```
Sub-sprint iniciada    → PATCH + 1
Sub-sprint concluída   → TAG com versão
Novo sprint iniciado   → MINOR + 1, PATCH = 0
Nova fase iniciada     → MAJOR + 1, MINOR = 0, PATCH = 0
Hotfix emergencial     → PATCH + 1 (qualquer contexto)
```

---

## 3. Estrutura de Branches

### 🌳 Hierarquia de Branches

```
main (stable)
  ↑
  │    ←── merge apenas após aprovação bilateral completa
  │
develop (integration)
  ↑
  │    ←── merge após validação técnica + stakeholder
  │
├─ fase/2/sprint-1/ia-neural-x
├─ fase/2/sprint-1/tutoriais-interativos
├─ fase/2/sprint-2/pecas-3d
└─ fase/2/sprint-3/ux-melhorias
```

### 📂 Convenção de Nomenclatura

| Tipo | Padrão | Exemplo |
|------|--------|---------|
| **Feature Branch** | `fase/{n}/sprint-{m}/{feature-name}` | `fase/2/sprint-1/ia-neural-x` |
| **Hotfix** | `hotfix/{versao}-{descricao}` | `hotfix/1.2.4-fase2-correcao-tempo` |
| **Release** | `release/{versao}` | `release/1.3.0-fase2` |

### 🔄 Fluxo de Merge

```
1. Feature Branch → develop (após validação bilateral)
2. develop → main (após acumular sprints ou release)
3. Hotfix → main + develop (simultâneo)
```

---

## 4. Decomposição da Fase 2

### 🎯 Fase 2: Core Features
**Versão Base:** `v1.3.0-fase2`

---

### 🚀 SPRINT 2.1 - IA Neural-X Completa
**Versão:** `v1.3.0-fase2.sprint1`

| Sub-Sprint | Descrição | Versão | Status |
|------------|-----------|--------|--------|
| **2.1.1** | Implementar Fator 3 - Livro de Aberturas | `v1.3.1-fase2.sprint1.1` | ⬜ |
| **2.1.2** | Implementar Fator 4 - Gestão de Tempo | `v1.3.2-fase2.sprint1.2` | ⬜ |
| **2.1.3** | Implementar Fator 5 - Resiliência Emocional | `v1.3.3-fase2.sprint1.3` | ⬜ |
| **2.1.4** | Integração e Testes E2E da IA | `v1.3.4-fase2.sprint1.4` | ⬜ |

**Dependências:** Requer Fase 1 concluída (MVP v1.2.x)

---

### 📚 SPRINT 2.2 - Tutoriais Interativos
**Versão:** `v1.4.0-fase2.sprint2`

| Sub-Sprint | Descrição | Versão | Status |
|------------|-----------|--------|--------|
| **2.2.1** | Criar TutorialEngine com validação | `v1.4.1-fase2.sprint2.1` | ⬜ |
| **2.2.2** | Implementar sistema de objetivos | `v1.4.2-fase2.sprint2.2` | ⬜ |
| **2.2.3** | Criar módulos tutoriais iniciais | `v1.4.3-fase2.sprint2.3` | ⬜ |
| **2.2.4** | Testes de integração tutoriais | `v1.4.4-fase2.sprint2.4` | ⬜ |

**Dependências:** Requer SPRINT 2.1 concluída

---

### 🎨 SPRINT 2.3 - Melhorias 3D e UX
**Versão:** `v1.5.0-fase2.sprint3`

| Sub-Sprint | Descrição | Versão | Status |
|------------|-----------|--------|--------|
| **2.3.1** | Procedural mesh avançado para peças | `v1.5.1-fase2.sprint3.1` | ⬜ |
| **2.3.2** | Rotação de câmera hot-seat | `v1.5.2-fase2.sprint3.2` | ⬜ |
| **2.3.3** | Salvamento automático partidas | `v1.5.3-fase2.sprint3.3` | ⬜ |
| **2.3.4** | Testes visuais e de UX | `v1.5.4-fase2.sprint3.4` | ⬜ |

**Dependências:** Requer SPRINT 2.2 concluída

---

### 📊 Mapa de Dependências

```
Fase 1 (MVP) ─────────────────────────────┐
                                          ▼
                              SPRINT 2.1 (IA Neural-X)
                                          │
                                          ▼
                              SPRINT 2.2 (Tutoriais)
                                          │
                                          ▼
                              SPRINT 2.3 (3D/UX)
                                          │
                                          ▼
                                   Fase 3 (Multiplayer)
```

---

## 5. Framework de Testes Automatizados

### 🧪 Visão Geral

```
┌─────────────────────────────────────────────────────────┐
│                   PIRÂMIDE DE TESTES                     │
├─────────────────────────────────────────────────────────┤
│  🎭 E2E (Playwright)    │ Fluxos completos de usuário  │
│  ─────────────────────────────────────────────────────  │
│  🔗 Integração          │ Stores, Engines, Componentes │
│  ─────────────────────────────────────────────────────  │
│  ⚙️ Unitários (Vitest)  │ Funções, utils, lógica pura  │
└─────────────────────────────────────────────────────────┘
```

### 5.1 Testes Unitários (Vitest)

| Configuração | Valor |
|--------------|-------|
| **Local** | `src/__tests__/unit/` |
| **Cobertura mínima** | 80% |
| **Execução** | `npm run test:unit` |
| **Watch mode** | `npm run test:unit:watch` |

**Foco:**
- Funções utilitárias puras
- Lógica de negócio isolada
- Cálculos de engine
- Transformações de dados

**Exemplo:**
```typescript
// src/__tests__/unit/chessEngine.test.ts
import { describe, it, expect } from 'vitest';
import { evaluatePosition } from '../../engine/chessEngine';

describe('ChessEngine', () => {
  it('should evaluate starting position as balanced', () => {
    const score = evaluatePosition('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');
    expect(score).toBe(0);
  });
});
```

### 5.2 Testes de Integração (Vitest + Testing Library)

| Configuração | Valor |
|--------------|-------|
| **Local** | `src/__tests__/integration/` |
| **Foco** | Stores, Engines, Componentes compostos |
| **Execução** | `npm run test:integration` |

**Foco:**
- Interação entre múltiplos módulos
- Comportamento de stores Zustand
- Componentes React com estado
- Fluxo de dados entre camadas

**Exemplo:**
```typescript
// src/__tests__/integration/gameStore.test.ts
import { describe, it, expect } from 'vitest';
import { useGameStore } from '../../store/gameStore';

describe('GameStore Integration', () => {
  it('should update game state through complete flow', () => {
    const { makeMove, getState } = useGameStore;
    makeMove('e2e4');
    expect(getState().moves).toContain('e2e4');
  });
});
```

### 5.3 Testes E2E (Playwright)

| Configuração | Valor |
|--------------|-------|
| **Local** | `e2e/` |
| **Execução** | `npm run test:e2e` |
| **UI mode** | `npm run test:e2e:ui` |
| **Browsers** | Chromium, Firefox, WebKit |

**Cenários:**
- Fluxo completo de partida
- Navegação entre menus
- Interação com peças 3D
- Salvamento e carregamento

**Estrutura:**
```
e2e/
├── specs/
│   ├── gameplay.spec.ts
│   ├── tutorial.spec.ts
│   └── settings.spec.ts
├── fixtures/
│   └── test-data.ts
└── utils/
    └── test-helpers.ts
```

### 5.4 Testes Visuais (Opcional)

| Ferramenta | Uso |
|------------|-----|
| **Loki** | Regressão visual local |
| **Chromatic** | Regressão visual em CI/CD |

---

## 6. Protocolo de Validação Bilateral

### 🔄 Diagrama de Estados

```
┌─────────────────┐
│   FASE 1: IMP   │
│ IMPLEMENTAÇÃO   │
│    INTERNA      │
└────────┬────────┘
         │
         ▼
┌─────────────────┐     REPROVADO     ┌─────────────────┐
│   FASE 2: APRES │◄──────────────────│   FASE 3: FEED  │
│  APRESENTAÇÃO   │                   │    FEEDBACK     │
│   STAKEHOLDER   │──────────────────►│   E ITERAÇÃO    │
└─────────────────┘     APROVADO      └─────────────────┘
         │
         ▼
┌─────────────────┐
│  FASE 4: FINAL  │
│   FINALIZAÇÃO   │
└─────────────────┘
```

### 📋 Fase 1: Implementação Interna

**Responsável:** Equipe de Desenvolvimento

```
┌─────────────────────────────────────────────────────────┐
│  ✅ Codificação da sub-sprint                           │
│  ✅ Testes automatizados (unit + integration)          │
│  ✅ Documentação técnica da implementação              │
│  ✅ Build e verificação de tipos                       │
└─────────────────────────────────────────────────────────┘
```

**Checklist de Saída:**
- [ ] Código implementado seguindo SPEC.md
- [ ] Testes unitários passando (>80% cobertura)
- [ ] Testes de integração passando
- [ ] Build sem erros (`npm run build`)
- [ ] TypeScript strict mode sem erros
- [ ] Linting sem warnings
- [ ] IMPLEMENTATION.md atualizado
- [ ] DECISIONS.md atualizado com ADRs

---

### 📋 Fase 2: Apresentação ao Stakeholder

**Responsável:** Equipe de Desenvolvimento

```
┌─────────────────────────────────────────────────────────┐
│  ✅ Roteiro de testes manuais detalhado                │
│  ✅ Checklist de verificação funcional                 │
│  ✅ Screenshots/vídeos demonstrativos                  │
│  ✅ Documento de decisões técnicas tomadas             │
└─────────────────────────────────────────────────────────┘
```

**Entregáveis:**
1. **TEST_PLAN.md** completo com passo-a-passo
2. **Checklist funcional** em formato executável
3. **Screenshots** das principais funcionalidades
4. **Vídeo curto** (se aplicável) demonstrando fluxo
5. **DECISIONS.md** explicando trade-offs

---

### 📋 Fase 3: Feedback e Iteração

**Responsável:** Stakeholder + Equipe de Desenvolvimento

```
┌─────────────────────────────────────────────────────────┐
│  1. Stakeholder executa testes manuais                 │
│  2. Feedback estruturado (Aprovação/Reprovação)        │
│                                                         │
│  SE REPROVADO:                                          │
│  └── Ajustes necessários → Retorna à Fase 1            │
│                                                         │
│  SE APROVADO:                                           │
│  └── Prossegue para Fase 4                             │
└─────────────────────────────────────────────────────────┘
```

**Critérios de Reprovação:**
- ❌ Funcionalidade não atende ao especificado
- ❌ Bug crítico identificado
- ❌ Performance abaixo do aceitável
- ❌ UX confusa ou não intuitiva

**Processo de Retorno:**
1. Stakeholder documenta problemas no TEST_PLAN.md
2. Priorização dos ajustes (Must/Should/Could)
3. Estimativa de esforço para correções
4. Retorno à Fase 1 para implementação

---

### 📋 Fase 4: Finalização

**Responsável:** Equipe de Desenvolvimento

```
┌─────────────────────────────────────────────────────────┐
│  ✅ Merge para develop                                  │
│  ✅ Sincronização de versões em documentação           │
│  ✅ Atualização de badges/labels/tags                  │
│  ✅ Tag git com versão semântica                       │
│  ✅ Merge para main (após acumular sprints)            │
└─────────────────────────────────────────────────────────┘
```

**Comandos Git:**
```bash
# Criar tag
git tag -a v1.3.1-fase2.sprint1.1 -m "Sub-sprint 2.1.1: Fator 3 - Livro de Aberturas"

# Push da tag
git push origin v1.3.1-fase2.sprint1.1

# Merge para develop
git checkout develop
git merge fase/2/sprint-1/ia-neural-x

# Merge para main (após acumular sprints)
git checkout main
git merge develop
```

---

## 7. Documentação Obrigatória por Sub-Sprint

### 📁 Estrutura de Documentos

Para cada sub-sprint, criar obrigatoriamente:

| Documento | Propósito | Responsável |
|-----------|-----------|-------------|
| **SPEC.md** | Especificação técnica detalhada | Tech Lead |
| **IMPLEMENTATION.md** | Registro de implementação | Developer |
| **TEST_PLAN.md** | Plano de testes manuais | QA/Stakeholder |
| **DECISIONS.md** | Registro de decisões técnicas (ADRs) | Arquiteto |

### 📄 Conteúdo de Cada Documento

#### SPEC.md
```markdown
# Especificação Técnica: [Nome da Sub-Sprint]

## Objetivo
Descrição clara do que será implementado

## Requisitos Funcionais
- RF1: ...
- RF2: ...

## Requisitos Técnicos
- Arquitetura
- Interfaces
- Dependências

## Critérios de Aceitação
- [ ] Critério 1
- [ ] Critério 2

## Estimativa
- Complexidade: Alta/Média/Baixa
- Duração: X dias
```

#### IMPLEMENTATION.md
```markdown
# Registro de Implementação: [Nome da Sub-Sprint]

## Resumo
O que foi implementado

## Decisões Técnicas
- Decisão 1: Justificativa
- Decisão 2: Justificativa

## Desafios Encontrados
- Desafio e solução

## Testes Realizados
- [x] Teste 1
- [x] Teste 2

## Screenshots
[Imagens da implementação]

## Versão
vX.Y.Z-faseN.sprintM.P
```

#### TEST_PLAN.md
```markdown
# Plano de Testes: [Nome da Sub-Sprint]

## Pré-condições
- Ambiente configurado
- Dados de teste preparados

## Casos de Teste

### CT01: [Nome do Caso]
**Objetivo:** O que está sendo testado
**Passos:**
1. Passo 1
2. Passo 2
**Resultado Esperado:** ...
**Resultado Obtido:** ... (preenchido pelo stakeholder)
**Status:** ⬜ Passou / ⬜ Falhou

## Checklist de Regressão
- [ ] Funcionalidade A não quebrada
- [ ] Funcionalidade B não quebrada
```

#### DECISIONS.md
```markdown
# Decisões Técnicas (ADRs)

## ADR-001: [Título da Decisão]
**Data:** YYYY-MM-DD
**Status:** Proposta/Aprovada/Deprecada

### Contexto
Por que a decisão era necessária

### Decisão
O que foi decidido

### Consequências
- Positivas: ...
- Negativas: ...
```

---

## 8. Critérios de Aceitação

### ✅ Checklist de Conclusão

| # | Critério | Verificação |
|---|----------|-------------|
| 1 | Todos os testes automatizados passando | `npm run test` |
| 2 | Cobertura de código ≥ 80% | `npm run test:coverage` |
| 3 | Build sem erros | `npm run build` |
| 4 | TypeScript strict mode sem erros | `npx tsc --noEmit` |
| 5 | Documentação completa | 4 arquivos criados |
| 6 | Aprovação bilateral do stakeholder | Assinatura no TEST_PLAN.md |
| 7 | Versionamento semântico aplicado | Tag git criada |
| 8 | Linting sem warnings | `npm run lint` |
| 9 | Formatação de código | `npm run format:check` |

### 📊 Níveis de Qualidade

```
┌─────────────────────────────────────────────────────────┐
│  NÍVEL 1: CRÍTICO (Bloqueante)                          │
│  ├── Testes falhando                                    │
│  ├── Build quebrado                                     │
│  └── TypeScript com erros                               │
├─────────────────────────────────────────────────────────┤
│  NÍVEL 2: ALTO (Deve ser resolvido)                     │
│  ├── Cobertura < 80%                                    │
│  ├── Documentação incompleta                            │
│  └── Sem aprovação stakeholder                          │
├─────────────────────────────────────────────────────────┤
│  NÍVEL 3: MÉDIO (Deve ser resolvido em breve)           │
│  ├── Warnings de lint                                   │
│  └── Problemas de formatação                            │
└─────────────────────────────────────────────────────────┘
```

---

## 9. Ferramentas e Stack

### 🛠️ Stack de Desenvolvimento

| Categoria | Ferramenta | Versão | Propósito |
|-----------|------------|--------|-----------|
| **Versionamento** | Git | - | Controle de código |
| **Workflow** | Git Flow | - | Estrutura de branches |
| **Testes Unit** | Vitest | ^1.x | Testes unitários |
| **Testes E2E** | Playwright | ^1.x | Testes end-to-end |
| **Componentes** | Testing Library | ^14.x | Testes React |
| **Type Check** | TypeScript | ^5.x | Type checking |
| **Hooks** | Husky | ^8.x | Git hooks |
| **Commits** | Commitlint | ^18.x | Convenção de commits |
| **Lint** | ESLint | ^8.x | Análise estática |
| **Format** | Prettier | ^3.x | Formatação |

### 📦 Scripts npm

```json
{
  "scripts": {
    "test:unit": "vitest run src/__tests__/unit",
    "test:unit:watch": "vitest src/__tests__/unit",
    "test:integration": "vitest run src/__tests__/integration",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "test:coverage": "vitest run --coverage",
    "lint": "eslint . --ext ts,tsx",
    "lint:fix": "eslint . --ext ts,tsx --fix",
    "format": "prettier --write .",
    "format:check": "prettier --check .",
    "type-check": "tsc --noEmit",
    "validate": "npm run lint && npm run type-check && npm run test:unit"
  }
}
```

### 🔧 Configuração de Hooks

**.husky/pre-commit**
```bash
#!/bin/sh
npm run lint
npm run type-check
npm run test:unit
```

**.husky/commit-msg**
```bash
#!/bin/sh
npx --no -- commitlint --edit ${1}
```

### 📝 Convenção de Commits

Formato: `tipo(escopo): descrição`

| Tipo | Uso | Exemplo |
|------|-----|---------|
| `feat` | Nova funcionalidade | `feat(ia): implementa fator 3 do Neural-X` |
| `fix` | Correção de bug | `fix(ui): corrige rotação de câmera` |
| `docs` | Documentação | `docs(spec): atualiza SPEC.md sprint 2.1` |
| `test` | Testes | `test(ia): adiciona testes para opening book` |
| `refactor` | Refatoração | `refactor(engine): otimiza avaliação de posição` |
| `chore` | Tarefas | `chore(deps): atualiza vitest` |

---

## 10. Template de Sub-Sprint

### 📁 Estrutura de Pastas

```
docs/sprints/
└── fase-2/
    ├── README.md              # Visão geral da Fase 2
    ├── sprint-2.1/
    │   ├── README.md          # Visão geral do Sprint 2.1
    │   ├── sub-sprint-2.1.1/
    │   │   ├── SPEC.md
    │   │   ├── IMPLEMENTATION.md
    │   │   ├── TEST_PLAN.md
    │   │   └── DECISIONS.md
    │   ├── sub-sprint-2.1.2/
    │   │   ├── SPEC.md
    │   │   ├── IMPLEMENTATION.md
    │   │   ├── TEST_PLAN.md
    │   │   └── DECISIONS.md
    │   └── ...
    ├── sprint-2.2/
    │   └── ...
    └── sprint-2.3/
        └── ...
```

### 📄 Template README.md de Sprint

```markdown
# Sprint 2.1 - IA Neural-X Completa

**Versão:** v1.3.0-fase2.sprint1  
**Duração:** 2 semanas  
**Objetivo:** Completar implementação da IA Neural-X com todos os 5 fatores

## Sub-Sprints

| # | Sub-Sprint | Versão | Status | Responsável |
|---|------------|--------|--------|-------------|
| 1 | Fator 3 - Livro de Aberturas | v1.3.1 | ⬜ | ... |
| 2 | Fator 4 - Gestão de Tempo | v1.3.2 | ⬜ | ... |
| 3 | Fator 5 - Resiliência Emocional | v1.3.3 | ⬜ | ... |
| 4 | Integração e Testes E2E | v1.3.4 | ⬜ | ... |

## Dependências
- Requer: Fase 1 (MVP) concluída

## Riscos
- R1: Performance do livro de aberturas
- R2: Complexidade do sistema emocional

## Entregáveis
- [ ] IA Neural-X funcional completa
- [ ] Documentação técnica
- [ ] Testes automatizados > 80%
```

### 🚀 Comando de Criação Rápida

```bash
# Script para criar estrutura de sub-sprint
./scripts/create-sub-sprint.sh 2.1.1 "Fator 3 - Livro de Aberturas"
```

**Script:**
```bash
#!/bin/bash
# scripts/create-sub-sprint.sh

SPRINT_ID=$1
DESCRIPTION=$2
FASE=$(echo $SPRINT_ID | cut -d. -f1)
SPRINT=$(echo $SPRINT_ID | cut -d. -f1,2 | tr '.' '-')
SUB=$(echo $SPRINT_ID | tr '.' '-')

mkdir -p docs/sprints/fase-$FASE/sprint-$SPRINT/sub-sprint-$SUB

cd docs/sprints/fase-$FASE/sprint-$SPRINT/sub-sprint-$SUB

cat > SPEC.md << EOF
# Especificação Técnica: $DESCRIPTION

## Objetivo
Implementar $DESCRIPTION no sistema Chess GDD 3D.

## Versão
v1.X.Y-fase$FASE.sprint$SPRINT.Z

## Requisitos
(Definir na fase de planejamento)

## Critérios de Aceitação
- [ ] Implementação completa
- [ ] Testes automatizados passando
- [ ] Documentação atualizada
EOF

cat > IMPLEMENTATION.md << EOF
# Registro de Implementação: $DESCRIPTION

## Status
⬜ Em planejamento

## Resumo
(Preencher durante implementação)
EOF

cat > TEST_PLAN.md << EOF
# Plano de Testes: $DESCRIPTION

## Casos de Teste
(Definir antes da implementação)

## Checklist de Regressão
- [ ] Funcionalidades anteriores intactas
EOF

cat > DECISIONS.md << EOF
# Decisões Técnicas: $DESCRIPTION

## ADRs
(Registrar decisões durante implementação)
EOF

echo "✅ Sub-sprint $SUB criada em docs/sprints/fase-$FASE/sprint-$SPRINT/"
```

---

## 11. Protocolo de Correção de Bugs e Hotfixes

### 🚨 Quando Usar Este Protocolo
- Bug crítico identificado durante testes
- Reprovação do stakeholder (Fase 3)
- Hotfix emergencial em produção
- Qualquer situação fora do planejamento original

### 🛑 PROIBIDO
- ❌ Aplicar correções sem análise de causa raiz
- ❌ Declarar "corrigido" sem testes visuais/automatizados
- ❌ Modificar código sem documentar no BUGFIX.md
- ❌ Ignorar o protocolo de validação bilateral

### 📋 Fases do Protocolo de Correção

#### FASE 0: Congelamento Imediato
```
1. PARAR todas as modificações atuais
2. Documentar estado atual no BUGFIX.md
3. Se correção anterior foi aplicada: AVALIAR reversão
4. NÃO prossiga sem plano documentado
```

#### FASE 1: Análise de Causa Raiz (Obrigatória)
```
1. Reproduzir bug consistentemente
2. Identificar diferenças entre "funciona" vs "não funciona"
3. Mapear hierarquia de containers/CSS
4. Documentar TODAS as hipóteses (mínimo 5-7)
5. NÃO pular para correção sem completar esta fase
```

#### FASE 2: Plano de Correção Documentado
```
1. Criar/planejar múltiplas abordagens (mínimo 2)
2. Avaliar risco de cada abordagem
3. Selecionar abordagem menos arriscada primeiro
4. Documentar plano completo antes de implementar
5. Definir critérios de sucesso claros
```

#### FASE 3: Implementação com Salvaguardas
```
1. Implementar UMA abordagem por vez
2. Testar visualmente IMEDIATAMENTE após cada mudança
3. Se piorar: REVERTER imediatamente
4. Documentar resultado no BUGFIX.md
5. NÃO acumular múltiplas mudanças sem teste
```

#### FASE 4: Validação Bilateral (Obrigatória)
```
1. Stakeholder valida visualmente
2. Testes automatizados passam
3. Regressão: funcionalidades anteriores intactas
4. Documentar aprovação no BUGFIX.md
5. Só então: merge para develop
```

### 📁 Template de BUGFIX.md

```markdown
## Bug #{n}: [Título]

**Data:** YYYY-MM-DD
**Status:** 🔄 Em Análise | 🔧 Em Correção | ✅ Corrigido | ⬜ Reprovado
**Severidade:** Crítica | Alta | Média | Baixa

### Descrição
[Descrição clara do bug]

### Tentativas de Correção

#### Tentativa 1: [Descrição] - ❌ FALHOU
**Data:** YYYY-MM-DD
**Abordagem:** [O que foi tentado]
**Resultado:** [Por que falhou]
**Lição:** [O que aprendemos]

#### Tentativa 2: [Descrição] - ✅ SUCESSO
**Data:** YYYY-MM-DD
**Abordagem:** [O que funcionou]
**Validação:** [Como foi validado]

### Checklist de Validação
- [ ] Causa raiz identificada
- [ ] Plano de correção documentado
- [ ] Correção implementada
- [ ] Testes visuais passaram
- [ ] Stakeholder aprovou
- [ ] Regressão verificada
```

### ⚠️ Checklist Anti-Padrões

| Anti-Padrão | Consequência | Prevenção |
|-------------|--------------|-----------|
| "Acho que resolveu" sem testar | Problema persiste | Teste visual obrigatório |
| Múltiplas correções de uma vez | Não saber o que funcionou | Uma mudança por vez |
| Não documentar tentativas | Repetir erros | BUGFIX.md atualizado em tempo real |
| Ignorar stakeholder | Entrega não atende necessidade | Validação bilateral obrigatória |

---

## 12. Lições Aprendidas (Log de Incidentes)

### Incidente 001: Bug #003 - Layout Responsivo do Tabuleiro
**Data:** 2026-02-03
**Sprint:** 2.2 - Tutoriais Interativos

**O que aconteceu:**
- Bug de layout foi reportado (tabuleiro cortado)
- Tentativa de correção sem análise profunda
- Correção aplicada declarada como "sucesso" sem testes visuais adequados
- Stakeholder rejeitou - problema persistia
- Segunda tentativa piorou o problema (tabuleiro ficou minúsculo)
- Terceira tentativa seguiu metodologia e funcionou

**Falhas de Processo:**
1. Pulou Fase 1 (Análise de Causa Raiz)
2. Não documentou tentativas no momento
3. Declarou sucesso sem validação bilateral
4. Acumulou mudanças sem testar entre elas

**Correções no Processo:**
1. Criado Protocolo de Correção de Bugs (Seção 11)
2. Checklist anti-padrões estabelecido
3. Template de BUGFIX.md obrigatório

**Lição Principal:**
"Em situações de pressão (bugs/reprovações), a tentação de 'corrigir rápido' é maior.
É EXATAMENTE nesses momentos que a metodologia deve ser seguida com mais rigor."

---

## 📎 Anexos

### 📊 Dashboard de Progresso

| Fase | Sprint | Progresso | Status |
|------|--------|-----------|--------|
| 2 | 2.1 | 0% | ⬜ Não Iniciado |
| 2 | 2.2 | 0% | ⬜ Não Iniciado |
| 2 | 2.3 | 0% | ⬜ Não Iniciado |

### 🔗 Links Úteis

- [GDD Oficial](./GDD_OFICIAL_v1.0.md)
- [Roadmap](./PRE_ROADMAP_ROO.md)
- [Auditoria MVP](./AUDITORIA_MVP_v1.0.md)

---

**Documento Versionado**
Última atualização: 2026-02-03
Versão atual: 1.1.0
Próxima revisão: Após próximo incidente ou revisão trimestral

---

*Este documento segue a metodologia IBVD - Iterative Bilateral Validation Development*
