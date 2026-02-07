# 🏗️ PROPOSTA DE ORGANIZAÇÃO RQP - Chess GDD 3D

> **Diagnóstico:** Caos Estrutural Identificado  
> **Solução:** Aplicação Completa do RQP Core v2.0.0  
> **Data:** 2026-02-06

---

## 🔴 PARTE 1: ONDE ESTAMOS (O CAOS)

### 📸 Fotografia do Caos Atual

```
chess-gdd-3d/                    ← RAIZ - ZONA DE GUERRA
│
├── .roo/                        # ??? - Pasta misteriosa
├── .rqp/                        # ✅ RQP criado (mas isolado)
│   ├── souls/
│   ├── protocols/
│   └── state/
│
├── coverage/                    # 🧪 Test coverage (deve estar em .rqp/)
├── dist/                        # 📦 Build (OK, mas desatualizado)
├── docs/                        # 📚 DOCUMENTAÇÃO ESPALHADA
│   ├── sprints/                 #   → Muito profundo
│   │   ├── fase-2/              #   → 4 níveis de profundidade!
│   │   │   ├── sprint-2.1-ia-neural-x/
│   │   │   ├── sprint-2.2-tutoriais-interativos/
│   │   │   └── sprint-2.3-melhorias-3d-ux/
│   ├── AUDITORIA_MVP_v1.0.md    #   → Documento solto
│   ├── DEV_METHODOLOGY_v1.1.0.md #   → Outro documento solto
│   ├── GDD_OFICIAL_v1.0.md      #   → E outro...
│   └── ... (mais 8 arquivos soltos)
│
├── e2e/                         # 🎭 Testes E2E (deve estar em tests/)
├── node_modules/                # 📦 Dependências
├── playwright-report/           # 📊 Reports (deve estar em .rqp/reports/)
├── public/                      # 🌐 Assets públicos (OK)
├── rqp-core-installer/          # ❌ RQP v1.0 (quebrado - DELETAR)
├── rqp-v2/                      # ⚠️  RQP v2.0 (funcional - MOVER)
├── src/                         # 💻 CÓDIGO FONTE (BAGUNÇADO)
│   ├── __tests__/               #   → Testes misturados com código!
│   ├── components/              #   → Sem organização por feature
│   │   ├── 3d/                  #   → Componentes 3D soltos
│   │   └── ui/                  #   → UI misturada
│   ├── data/                    #   → Dados soltos
│   ├── engine/                  #   → Engines soltos
│   ├── hooks/                   #   → Hooks soltos
│   ├── store/                   #   → Stores soltos
│   ├── types/                   #   → Types soltos
│   └── utils/                   #   → Utils soltos
│
├── test-results/                # 🧪 Resultados (deve estar em .rqp/)
├── test-output.txt              # 📝 Log solto na raiz!
├── .version                     # 📄 Arquivo de version solto!
├── index.html                   # 📄 OK
├── MANIFEST.md                  # 📄 Manifesto do RQP v1 (deletar)
├── package.json                 # 📄 OK
├── package-lock.json            # 📄 OK
├── playwright.config.ts         # ⚙️  Config E2E (mover para tests/)
├── RESTART.md                   # 📄 Documento de restart (mover para docs/)
├── tsconfig.json                # ⚙️  OK
├── vite.config.ts               # ⚙️  OK
└── vitest.config.ts             # ⚙️  Config testes (mover para tests/)
```

### 🚨 Problemas Identificados

| # | Problema | Severidade | Impacto |
|---|----------|------------|---------|
| 1 | **2 versões do RQP** (v1 quebrada + v2 funcional) | 🔴 Crítico | Confusão total |
| 2 | **Testes misturados com código** (__tests__/ dentro de src/) | 🔴 Crítico | Difícil manutenção |
| 3 | **Documentação espalhada** (docs/ + raiz + sprints/) | 🔴 Crítico | Informação perdida |
| 4 | **Arquivos de build/teste na raiz** | 🟡 Alto | Poluição visual |
| 5 | **Sem organização por feature** no src/ | 🟡 Alto | Código spaghetti |
| 6 | **Níveis excessivos de profundidade** em docs/ | 🟡 Alto | Navegação difícil |
| 7 | **Pasta .roo misteriosa** | 🟡 Alto | Ninguém sabe o que é |

### 📊 Estatísticas do Caos

```
Arquivos na raiz:          14 (deveriam ser ~5)
Pastas na raiz:            12 (deveriam ser ~7)
Níveis de profundidade docs/:  5 (máximo recomendado: 3)
Testes misturados com código: 100% (deveria ser 0%)
Documentos soltos em docs/:    12 (deveriam estar organizados)
```

---

## 🟢 PARTE 2: ONDE DEVEMOS CHEGAR (A ORDEM RQP)

### 🏛️ Estrutura Alvo - RQP Compliant

```
chess-gdd-3d/                    ← RAIZ - ZONA LIMPA
│
├── 📁 .rqp/                     # 🧠 CÉREBRO DO PROJETO (RQP)
│   ├── 📁 souls/                # Identidades persistentes
│   │   ├── 📄 project.soul.json
│   │   ├── 📄 stakeholder.soul.json
│   │   └── 📁 agents/
│   │       ├── 📄 ORCH-000.soul.json
│   │       ├── 📄 DISC-001.soul.json
│   │       ├── 📄 SPEC-001.soul.json
│   │       ├── 📄 IMPL-001.soul.json
│   │       └── 📄 ...
│   ├── 📁 protocols/            # Protocolos RQP
│   │   ├── 📄 handoff.yaml
│   │   ├── 📄 validation.yaml
│   │   └── 📄 security.yaml
│   ├── 📁 state/                # Estado do projeto
│   │   └── 📄 current-session.json
│   ├── 📁 docs/                 # Documentação RQP
│   │   ├── 📄 SPEC.md           # Especificação atual
│   │   ├── 📄 DECISIONS.md      # ADRs
│   │   ├── 📄 RETROSPECTIVE.md  # Lições aprendidas
│   │   └── 📁 gates/            # Checklists de gates
│   │       ├── 📄 SG-001-discovery.md
│   │       ├── 📄 SG-002-specification.md
│   │       └── 📄 ...
│   └── 📁 reports/              # Relatórios
│       ├── 📁 test-coverage/
│       ├── 📁 e2e-results/
│       └── 📄 last-build.json
│
├── 📁 docs/                     # 📚 DOCUMENTAÇÃO DO PROJETO (limpa)
│   ├── 📄 README.md             # Entrada principal
│   ├── 📄 GDD.md                # Game Design Document
│   ├── 📄 ARCHITECTURE.md       # Decisões arquiteturais
│   ├── 📁 sprints/              # Histórico de sprints (flat)
│   │   ├── 📄 sprint-2.1-ia-neural-x.md
│   │   ├── 📄 sprint-2.2-tutoriais.md
│   │   └── 📄 sprint-2.3-melhorias-3d.md
│   └── 📁 assets/               # Screenshots, diagramas
│       └── 📁 screenshots/
│
├── 📁 src/                      # 💻 CÓDIGO FONTE (organizado por feature)
│   ├── 📄 main.tsx              # Entry point
│   ├── 📄 App.tsx               # App root
│   ├── 📄 index.css             # Estilos globais
│   │
│   ├── 📁 features/             # 🎯 ORGANIZAÇÃO POR FEATURE
│   │   ├── 📁 game/             # Feature: Jogo principal
│   │   │   ├── 📁 components/
│   │   │   │   ├── 📄 ChessBoard3D.tsx
│   │   │   │   └── 📄 ChessPiece3D.tsx
│   │   │   ├── 📁 engine/
│   │   │   │   ├── 📄 chessEngine.ts
│   │   │   │   └── 📄 timeManager.ts
│   │   │   ├── 📁 store/
│   │   │   │   └── 📄 gameStore.ts
│   │   │   └── 📁 types/
│   │   │       └── 📄 game.types.ts
│   │   │
│   │   ├── 📁 tutorial/         # Feature: Tutorial
│   │   │   ├── 📁 components/
│   │   │   │   ├── 📄 TutorialPanel.tsx
│   │   │   │   └── 📄 LessonViewer.tsx
│   │   │   ├── 📁 engine/
│   │   │   │   └── 📄 tutorialEngine.ts
│   │   │   ├── 📁 data/
│   │   │   │   └── 📄 tutorials.ts
│   │   │   └── 📁 store/
│   │   │       └── 📄 tutorialStore.ts
│   │   │
│   │   ├── 📁 ai/               # Feature: IA Neural-X
│   │   │   ├── 📁 components/
│   │   │   │   └── 📄 EmotionalIndicator.tsx
│   │   │   ├── 📁 engine/
│   │   │   │   ├── 📄 emotionalState.ts
│   │   │   │   └── 📄 openingBook.ts
│   │   │   └── 📁 data/
│   │   │       └── 📄 openings.ts
│   │   │
│   │   └── 📁 ui/               # Feature: Componentes UI compartilhados
│   │       └── 📁 components/
│   │           ├── 📄 MainMenu.tsx
│   │           ├── 📄 GameControls.tsx
│   │           └── 📄 Settings.tsx
│   │
│   └── 📁 shared/               # 🔄 CÓDIGO COMPARTILHADO
│       ├── 📁 components/       # UI primitives
│       ├── 📁 hooks/            # Hooks genéricos
│       ├── 📁 utils/            # Utilitários
│       └── 📁 types/            # Types globais
│
├── 📁 tests/                    # 🧪 TESTES (separados do código)
│   ├── 📁 unit/                 # Testes unitários
│   ├── 📁 integration/          # Testes de integração
│   ├── 📁 e2e/                  # Testes E2E
│   ├── 📄 setup.ts              # Setup dos testes
│   ├── 📄 vitest.config.ts      # Config Vitest
│   └── 📄 playwright.config.ts  # Config Playwright
│
├── 📁 public/                   # 🌐 ASSETS PÚBLICOS
│   └── 📄 stockfish.js
│
├── 📁 scripts/                  # 🔧 SCRIPTS DE BUILD/DEPLOY
│   └── 📄 build-single-file.ts
│
├── 📄 package.json              # 📦 Configuração npm
├── 📄 tsconfig.json             # ⚙️  TypeScript
├── 📄 vite.config.ts            # ⚙️  Vite
├── 📄 tailwind.config.ts        # ⚙️  Tailwind
├── 📄 index.html                # 📄 Entry HTML
├── 📄 .gitignore                # 📄 Git ignore
└── 📄 README.md                 # 📄 README principal
```

### 📋 Benefícios da Nova Estrutura

| Aspecto | Antes | Depois | Ganho |
|---------|-------|--------|-------|
| **Arquivos raiz** | 14 | 8 | -43% |
| **Profundidade docs** | 5 níveis | 2 níveis | -60% |
| **Organização código** | Técnica | Por feature | +Clareza |
| **Testes** | Misturados | Separados | +Manutenibilidade |
| **Documentação** | Espalhada | Centralizada | +Findability |
| **Estado projeto** | Invisível | Em `.rqp/` | +Governança |

---

## 🛤️ PARTE 3: COMO CHEGAR LÁ (ROADMAP DE TRANSIÇÃO)

### Fase 1: Preparação (30 min)

```bash
# 1. Backup do estado atual
git add .
git commit -m "backup: estado antes da reorganização RQP"

# 2. Criar branch de transição
git checkout -b rqp/organizacao-estrutural
```

### Fase 2: Limpeza Radical (1h)

```bash
# 1. Remover RQP v1.0 (quebrado)
rm -rf rqp-core-installer/

# 2. Mover RQP v2.0 para .rqp/tools/ ou manter separado
# Opção: Manter rqp-v2/ como subtree ou mover para tools/

# 3. Remover arquivos órfãos
rm -f test-output.txt
rm -f MANIFEST.md
rm -f .version
rm -rf .roo/  # se não for necessário

# 4. Consolidar documentação
mkdir -p docs/archive/
mv RESTART.md docs/archive/RESTART_2026-02-04.md
```

### Fase 3: Reorganização do src/ (2h)

```bash
# 1. Criar estrutura por feature
mkdir -p src/features/{game,tutorial,ai,ui}
mkdir -p src/shared/{components,hooks,utils,types}

# 2. Mover arquivos (exemplos)
mv src/components/3d/* src/features/game/components/
mv src/components/ui/Tutorial* src/features/tutorial/components/
mv src/components/ui/Emotional* src/features/ai/components/
mv src/engine/chessEngine.ts src/features/game/engine/
mv src/engine/tutorialEngine.ts src/features/tutorial/engine/
mv src/engine/emotionalState.ts src/features/ai/engine/
mv src/__tests__/* tests/unit/

# 3. Atualizar imports (automático via IDE)
# VSCode: Ctrl+Shift+H → replace all imports
```

### Fase 4: Reorganização de docs/ (1h)

```bash
# 1. Flatten sprints/
mkdir -p docs/sprints-flat/
for dir in docs/sprints/fase-2/*/; do
  name=$(basename "$dir")
  cp "$dir/README.md" "docs/sprints-flat/${name}.md"
done

# 2. Consolidar documentos soltos
cat docs/DEV_METHODOLOGY_v1.1.0.md docs/GDD_OFICIAL_v1.0.md > docs/ARCHITECTURE.md

# 3. Mover para .rqp/docs/
mkdir -p .rqp/docs/gates/
cp docs/RQP_* .rqp/docs/ 2>/dev/null || true
```

### Fase 5: Configuração RQP (30 min)

```bash
# 1. Atualizar estado RQP
rqp soul update --type=project
rqp soul update --type=stakeholder

# 2. Gerar documentação inicial
rqp docs generate --type=spec
rqp docs generate --type=decisions

# 3. Verificar status
rqp status
rqp validate --check=all
```

### Fase 6: Validação (30 min)

```bash
# 1. Testes passando
npm test

# 2. Build funcionando
npm run build

# 3. Estrutura validada
# - Verificar se não há arquivos órfãos
# - Verificar se imports estão corretos
# - Verificar se RQP está funcionando
```

### Fase 7: Commit Final (15 min)

```bash
git add .
git commit -m "rqp: reorganização estrutural completa

- Aplicação do RQP Core v2.0.0
- Organização por features
- Documentação centralizada
- Testes separados do código
- Estrutura .rqp/ implementada"

git checkout main
git merge rqp/organizacao-estrutural
```

---

## 📊 Timeline Total Estimada

| Fase | Duração | Acumulado |
|------|---------|-----------|
| Preparação | 30 min | 30 min |
| Limpeza | 1h | 1h30 |
| Reorg src/ | 2h | 3h30 |
| Reorg docs/ | 1h | 4h30 |
| Config RQP | 30 min | 5h |
| Validação | 30 min | 5h30 |
| **TOTAL** | **~5-6h** | **1 sessão** |

---

## ✅ Checklist de Sucesso

Ao final, devemos ter:

- [ ] Apenas 1 versão do RQP (v2.0.0)
- [ ] `rqp status` funcionando
- [ ] Estrutura `.rqp/` completa
- [ ] `src/` organizado por features
- [ ] `tests/` separados do código
- [ ] `docs/` com máximo 2 níveis de profundidade
- [ ] Máximo 8 arquivos na raiz
- [ ] Todos os testes passando
- [ ] Build funcionando
- [ ] Documentação RQP gerada

---

## 🎯 Próximo Passo Imediato

**APROVAR** esta proposta para iniciar a transição.

Comando de validação atual:
```bash
rqp status
# Deve mostrar: Fase Discovery, Agente ORCH-000, Gates 0/6
```

---

**Stakeholder:** Adilson  
**Agente:** ORCH-000 (Orchestrator)  
**Gate:** SG-003 - Architect Gate  
**Status:** Aguardando aprovação para implementação
