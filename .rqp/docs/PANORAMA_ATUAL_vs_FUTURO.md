# 🗺️ PANORAMA: Onde Estamos → Onde Vamos

> **Projeto:** Chess GDD 3D  
> **Data:** 2026-02-06  
> **Fase RQP:** SG-003 Architect  
> **Agente:** ORCH-000

---

## 🔴 ONDE ESTAMOS (CAOS)

### Estrutura Atual

```
chess-gdd-3d/                    ← 23 ITENS NA RAIZ! (caos)
├── 📁 .roo/                     ← ❓ Mistério
├── 📁 .rqp/                     ← ✅ ÚNICO ORGANIZADO
├── 📁 coverage/                 ← 🧪 Deveria estar em .rqp/
├── 📁 dist/
├── 📁 docs/                     ← 📚 5 NÍVEIS DE PROFUNDIDADE!
│   └── 📁 sprints/fase-2/...   ←    sprint-2.1/.../sub-sprint-2.1.1/
├── 📁 e2e/                      ← 🎭 Deveria estar em tests/
├── 📁 node_modules/
├── 📁 playwright-report/        ← 📊 Deveria estar em .rqp/
├── 📁 public/
├── 📁 rqp-core-installer/       ← ❌ RQP v1 QUEBRADO
├── 📁 rqp-v2/                   ← ⚠️  RQP v2 funcional
├── 📁 src/                      ← 💻 TESTES NO MEIO DO CÓDIGO!
│   ├── 📁 __tests__/           ←    ❌ ERRADO!
│   ├── 📁 components/          ←    Técnico (sem feature)
│   ├── 📁 engine/              ←    Solto
│   ├── 📁 store/               ←    Solto
│   └── ...
├── 📁 test-results/             ← 🧪 Deveria estar em .rqp/
├── 📄 .version                  ← ❌ Inútil
├── 📄 index.html
├── 📄 MANIFEST.md               ← ❌ Do RQP v1
├── 📄 package-lock.json
├── 📄 package.json
├── 📄 playwright.config.ts      ← ⚠️  Deveria estar em tests/
├── 📄 RESTART.md                ← ⚠️  Deveria estar em docs/
├── 📄 test-output.txt           ← ❌ Lixo
├── 📄 tsconfig.json
├── 📄 vite.config.ts
└── 📄 vitest.config.ts          ← ⚠️  Deveria estar em tests/
```

### Problemas

1. **🔴 2 versões do RQP** (v1 quebrado + v2 funcional)
2. **🔴 Testes misturados** com código fonte
3. **🔴 Documentação** com 5 níveis de profundidade
4. **🟡 23 itens na raiz** (ideal: 8)
5. **🟡 Arquivos órfãos** (logs, manifests, etc)

---

## 🟢 ONDE VAMOS (ORDEM RQP)

### Estrutura Alvo

```
chess-gdd-3d/                    ← 8 ITENS NA RAIZ (limpo)
│
├── 📁 .rqp/                     ← 🧠 CÉREBRO (governança)
│   ├── 📁 souls/               #    Identidades
│   ├── 📁 protocols/           #    Protocolos
│   ├── 📁 state/               #    Estado
│   ├── 📁 docs/                #    Docs RQP
│   └── 📁 reports/             #    Relatórios
│
├── 📁 docs/                     # 📚 DOCS DO PROJETO
│   ├── 📄 README.md
│   ├── 📄 GDD.md               #    (consolidado)
│   ├── 📄 ARCHITECTURE.md      #    (consolidado)
│   ├── 📁 sprints/             #    FLAT (2 níveis)
│   └── 📁 assets/
│
├── 📁 src/                      # 💻 CÓDIGO POR FEATURE
│   ├── 📁 features/            # 🎯
│   │   ├── 📁 game/            #    TUDO do jogo
│   │   ├── 📁 tutorial/        #    TUDO do tutorial
│   │   ├── 📁 ai/              #    TUDO da IA
│   │   └── 📁 ui/              #    UI compartilhada
│   └── 📁 shared/              # 🔄 Só o compartilhado
│
├── 📁 tests/                    # 🧪 TESTES SEPARADOS!
│   ├── 📁 unit/
│   ├── 📁 integration/
│   ├── 📁 e2e/
│   ├── 📄 vitest.config.ts
│   └── 📄 playwright.config.ts
│
├── 📁 public/                   # 🌐 Assets
├── 📁 scripts/                  # 🔧 Scripts
├── 📄 package.json
├── 📄 tsconfig.json
├── 📄 vite.config.ts
├── 📄 tailwind.config.ts
├── 📄 index.html
├── 📄 .gitignore
└── 📄 README.md
```

### Organização por Feature

```
src/features/game/              ← TUDO relacionado a jogo
├── 📁 components/              #   ChessBoard3D, ChessPiece3D
├── 📁 engine/                  #   chessEngine, timeManager
├── 📁 store/                   #   gameStore
├── 📁 hooks/                   #   useGame
└── 📁 types/                   #   game.types

src/features/tutorial/          ← TUDO relacionado a tutorial
├── 📁 components/              #   TutorialPanel, LessonViewer
├── 📁 engine/                  #   tutorialEngine
├── 📁 data/                    #   tutorials
└── 📁 store/                   #   tutorialStore

src/features/ai/                ← TUDO relacionado a IA
├── 📁 components/              #   EmotionalIndicator
├── 📁 engine/                  #   emotionalState, openingBook
└── 📁 data/                    #   openings
```

---

## 🛤️ COMO CHEGAR LÁ

### Passo 1: Backup (15 min)
```bash
git add .
git commit -m "backup: pre-rqp-reorganization"
git checkout -b rqp/reorganization
```

### Passo 2: Limpeza (30 min)
```bash
rm -rf rqp-core-installer/      # Deletar v1 quebrado
rm -f test-output.txt MANIFEST.md .version
rm -rf .roo/
```

### Passo 3: Reorganizar src/ (2h)
```bash
# Criar estrutura
mkdir -p src/features/{game,tutorial,ai,ui}
mkdir -p src/shared/{components,hooks,utils,types}
mkdir -p tests/{unit,integration,e2e}

# Mover por feature
mv src/components/3d/* src/features/game/components/
mv src/engine/chessEngine.ts src/features/game/engine/
mv src/store/gameStore.ts src/features/game/store/

mv src/components/ui/Tutorial* src/features/tutorial/components/
mv src/engine/tutorialEngine.ts src/features/tutorial/engine/

mv src/components/ui/Emotional* src/features/ai/components/
mv src/engine/emotionalState.ts src/features/ai/engine/

# Mover testes
mv src/__tests__/* tests/unit/
mv vitest.config.ts tests/
mv playwright.config.ts tests/
```

### Passo 4: Consolidar docs/ (45 min)
```bash
# Flatten sprints
mv docs/sprints/fase-2/sprint-2.1-ia-neural-x/README.md docs/sprints/sprint-2.1.md
mv docs/sprints/fase-2/sprint-2.2-tutoriais-interativos/README.md docs/sprints/sprint-2.2.md

# Consolidar
cat docs/GDD_OFICIAL_v1.0.md > docs/GDD.md
mv RESTART.md docs/
```

### Passo 5: RQP (30 min)
```bash
# Instalar RQP v2
cd rqp-v2 && npm link

# Atualizar
rqp soul update --type=project
rqp status
```

### Total: ~4 horas

---

## ✅ CHECKLIST DE SUCESSO

- [ ] `rqp status` funciona
- [ ] `src/` organizado por features
- [ ] `tests/` separados do código
- [ ] `docs/` com máximo 2 níveis
- [ ] Raiz com máximo 8 itens
- [ ] npm test passa
- [ ] npm run build funciona

---

**APROVAR reorganização?**
- [ ] SIM - Iniciar agora
- [ ] NÃO - Manter caos
- [ ] MODIFICAR

**Stakeholder:** Adilson  
**Agente:** ORCH-000
