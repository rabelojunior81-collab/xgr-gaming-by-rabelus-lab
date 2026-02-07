# 📊 Relatório de Pesquisa EXA: Tecnologias Atualizadas para Chess XGR Gaming

**Data da pesquisa:** Fevereiro 2026  
**Fonte:** EXA AI Search  
**Propósito:** Atualizar informações deprecadas do PRE_ROADMAP_ROO.md

---

## 🚨 CORREÇÕES CRÍTICAS IDENTIFICADAS

| Sugestão Anterior | Status | Correção |
|-------------------|--------|----------|
| `gemini-1.5-flash` | ❌ **DEPRECADO** | Usar `gemini-2.0-flash` ou `gemini-2.5-flash` |
| `zustand-persist` (terceiros) | ❌ **DESATUALIZADO (2021)** | Usar `persist` middleware oficial do Zustand |
| `@mliebelt/pgn-parser` | ⚠️ **Ainda ativo, mas** | `@jackstenglein/pgn-parser` é fork mais recente |
| `stockfish.wasm` | ⚠️ **Verificar** | `stockfish` npm v17.1.0 é o pacote atualizado |

---

## 1. 🎯 Stockfish WASM React Integration 2024-2025

### ✅ Versão/Abordagem Recomendada ATUAL

**Pacote npm recomendado:** [`stockfish`](https://www.npmjs.com/package/stockfish) v17.1.0 (atualizado há 6 meses)

**Implementação recomendada:**
- Usar **Stockfish.js** por Nathan Rugg - implementação WASM oficial usada pelo Chess.com
- Atualizado para Stockfish 17.1 (versão mais recente do engine)

### 📦 Opções de Engine Disponíveis

| Variante | Tamanho | Threads | Recomendação |
|----------|---------|---------|--------------|
| Multi-threaded (completo) | ~75MB | Sim | **Recomendado** - requer CORS headers |
| Single-threaded | ~75MB | Não | Para browsers sem CORS |
| Lite multi-threaded | ~7MB | Sim | Mobile com CORS |
| Lite single-threaded | ~7MB | Não | Mobile sem CORS |
| ASM-JS | ~10MB | N/A | Último recurso (muito lento) |

### 🔗 Links/Fontes Relevantes
- NPM: https://www.npmjs.com/package/stockfish
- GitHub Lichess: https://github.com/lichess-org/stockfish-web
- Artigo WASM + React 2025: https://makersden.io/blog/webassembly-and-react-when-to-use-wasm-in-2025

### 📝 Notas sobre Mudanças
- React 19 introduziu hook nativo `useWasm` para integração simplificada
- Arquivos WASM grandes são divididos em partes para melhor caching
- Nomes de arquivos podem ter hash anexado
- Compatível com Node.js moderno e browsers (Chrome/Edge/Firefox/Safari)

---

## 2. 🤖 Google Gemini API Latest Version 2025

### ✅ Versão/Abordagem Recomendada ATUAL

**Modelo recomendado para substituir `gemini-1.5-flash`:**
- **Gemini 2.0 Flash** - GA (Generally Available) - Fevereiro 2025
- **Gemini 2.5 Flash** - GA - Versão mais recente com thinking capabilities
- **Gemini 3 Flash Preview** - Dezembro 2025 - Mais recente (preview)

**Pacote npm:** `@google/genai` (SDK atualizado)

### 📊 Comparação de Modelos Gemini (2025)

| Modelo | Status | Context Window | Output Tokens | Preço |
|--------|--------|----------------|---------------|-------|
| Gemini 1.5 Flash | ❌ **DEPRECADO** | 1M | 8,192 | - |
| Gemini 2.0 Flash | ✅ GA | 1M | 8,192 | Reduzido |
| Gemini 2.0 Flash-Lite | ✅ GA | 1M | 8,192 | Mais barato |
| Gemini 2.5 Flash | ✅ GA | 1M | 65,535 | Standard |
| Gemini 2.5 Pro | ✅ GA | 1M | 65,535 | Premium |
| Gemini 3 Flash Preview | 🧪 Preview | 1M | 65,536 | Preview |
| Gemini 3 Pro Preview | 🧪 Preview | 1M | 65,536 | Preview |

### 🔗 Links/Fontes Relevantes
- Documentação Oficial: https://ai.google.dev/gemini-api/docs/models
- Changelog: https://ai.google.dev/gemini-api/docs/changelog
- Blog Gemini 2.0: https://developers.googleblog.com/en/gemini-2-family-expands/
- Vertex AI: https://cloud.google.com/vertex-ai/generative-ai/docs/gemini-v2

### 📝 Notas sobre Mudanças
- **Gemini 1.5 Flash foi descontinuado** - migrar para 2.0 Flash ou superior
- Preços simplificados: removida distinção entre short/long context
- Gemini 2.0+ oferece melhor performance com custo similar ou menor
- Novas capacidades: native tool use, multimodal generation, 1M token context
- API versions: `v1` (stable) vs `v1beta` (experimental)

---

## 3. 🎨 React Three Fiber Best Practices 2024-2025

### ✅ Abordagem Recomendada ATUAL

**Performance Optimization Prioritária:**
1. **WebGPU Renderer** - Novo padrão para 2025 (com fallback WebGL 2)
2. **InstancedMesh** - Para objetos repetidos (peças de xadrez)
3. **BatchedMesh** - Para geometrias variadas
4. **On-demand rendering** - `frameloop="demand"` para economia de bateria

### 📊 Técnicas de Otimização

| Técnica | Benefício | Implementação |
|---------|-----------|---------------|
| Draco compression | Reduz tamanho de geometria | `useGLTF(url, true)` |
| KTX2 textures | Compressão de texturas | UASTC para qualidade, ETC1S para tamanho |
| LOD (Level of Detail) | Reduz polígonos distantes | Componente `<Detailed />` do Drei |
| Texture Atlas | Reduz draw calls | Combinar texturas em uma |
| Object Pooling | Reutiliza objetos | Evita garbage collection |
| Frustum Culling | Não renderiza fora da tela | Automático no Three.js |

### 🧠 Memory Management

**Regras críticas:**
- Sempre chamar `.dispose()` em geometrias, materiais, texturas
- Usar `useMemo` para geometrias e materiais compartilhados
- Limpar render targets quando não usados
- Usar `ImageBitmap` com cuidado (requer dispose especial)

### 🔗 Links/Fontes Relevantes
- Documentação R3F: https://r3f.docs.pmnd.rs/advanced/pitfalls
- Performance Scaling: https://r3f.docs.pmnd.rs/advanced/scaling-performance
- 100 Three.js Tips 2026: https://www.utsubo.com/blog/threejs-best-practices-100-tips
- Codrops 2025: https://tympanus.net/codrops/2025/02/11/building-efficient-three-js-scenes/

### 📝 Notas sobre Mudanças
- **React 19** introduziu melhorias de performance automáticas
- **WebGPU** agora é recomendado para novos projetos (2-10x performance em cenários específicos)
- **TSL (Three Shader Language)** - Nova linguagem de shaders
- Drei continua sendo essencial para componentes utilitários
- Evitar `setState` em `useFrame` - usar mutação direta com refs

---

## 4. 💾 Zustand Persist Middleware 2024-2025

### ✅ Abordagem Recomendada ATUAL

**Persist middleware oficial do Zustand** é a escolha recomendada (não usar `zustand-persist` de terceiros que está desatualizado - última versão 2021).

**Para IndexedDB:** Usar `zustand-indexeddb` (pacote oficial da org zustandjs) ou `idb-keyval` com storage customizado.

### 📊 Opções de Persistência

| Solução | Storage | Status | Caso de Uso |
|---------|---------|--------|-------------|
| `persist` (oficial) | localStorage/sessionStorage | ✅ Ativo | Dados pequenos, serializáveis |
| `zustand-indexeddb` | IndexedDB | ✅ Ativo (2025) | Dados grandes, não-serializáveis |
| `idb-keyval` + custom | IndexedDB | ✅ Funciona | Controle total do storage |
| `zustand-persist` | Qualquer | ❌ Desatualizado (2021) | **Evitar** |
| `persist-and-sync` | localStorage | ✅ Ativo | Sync entre tabs |

### 💡 Padrão Recomendado (TypeScript)

```typescript
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

interface GameStore {
  // state...
}

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      // store implementation
    }),
    {
      name: 'chess-game-storage',
      storage: createJSONStorage(() => localStorage), // ou sessionStorage
      partialize: (state) => ({ 
        // selecionar apenas campos necessários
      }),
    }
  )
)
```

### 🔗 Links/Fontes Relevantes
- Documentação Persist: https://docs.pmnd.rs/zustand/integrations/persisting-store-data
- zustand-indexeddb: https://github.com/zustandjs/zustand-indexeddb
- Discussão IndexedDB: https://github.com/pmndrs/zustand/discussions/2475

### 📝 Notas sobre Mudanças
- **Async storage** tem custo adicional - usar com cuidado
- `partialize` permite selecionar campos específicos para persistir
- `createJSONStorage` helper facilita criação de storages customizados
- Para IndexedDB, usar `idb-keyval` é mais simples que API nativa
- **Atenção:** Storages async podem causar hydration issues no React

---

## 5. ♟️ JavaScript/TypeScript PGN Parser Chess 2024-2025

### ✅ Parser Recomendado ATUAL

**Opção 1 (Recomendada):** [`@jackstenglein/pgn-parser`](https://www.npmjs.com/package/@jackstenglein/pgn-parser) v2.0.8
- Fork ativo e mantido do @mliebelt/pgn-parser
- TypeScript nativo
- Última atualização: Dezembro 2024

**Opção 2:** [`@mliebelt/pgn-parser`](https://www.npmjs.com/package/@mliebelt/pgn-parser) v1.4.16
- Original e estabelecido
- TypeScript nativo
- Última atualização: Maio 2025 (ainda ativo)

**Opção 3:** [`pgn-parser`](https://www.npmjs.com/package/pgn-parser) v2.2.1
- Alternativa mais simples
- TypeScript via @types
- Última atualização: Março 2025

### 📊 Comparação de Parsers

| Pacote | Versão | TypeScript | Downloads/Semana | Status |
|--------|--------|------------|------------------|--------|
| @jackstenglein/pgn-parser | 2.0.8 | ✅ Nativo | Baixo | 🆕 Ativo |
| @mliebelt/pgn-parser | 1.4.16 | ✅ Nativo | Moderado | ✅ Ativo |
| pgn-parser | 2.2.1 | @types | 267 | ✅ Ativo |
| @mliebelt/pgn-reader | 1.2.28 | ✅ Nativo | 84 | ✅ Backend para viewer |

### 💡 Uso Recomendado

```typescript
import { parse } from '@jackstenglein/pgn-parser'

// Parse completo
const game = parse('[White "Me"] [Black "Magnus"] 1. f4 e5 2. g4 Qh4#', { 
  startRule: "game" 
})

// Retorna estrutura:
// {
//   tags: { White: "Me", Black: "Magnus" },
//   moves: [{ turn: "w", moveNumber: 1, ... }, ...]
// }
```

### 🔗 Links/Fontes Relevantes
- @jackstenglein/pgn-parser: https://www.npmjs.com/package/@jackstenglein/pgn-parser
- @mliebelt/pgn-parser: https://www.npmjs.com/package/@mliebelt/pgn-parser
- pgn-parser: https://www.npmjs.com/package/pgn-parser
- PGN Reader: https://www.npmjs.com/package/@mliebelt/pgn-reader

### 📝 Notas sobre Mudanças
- `@jackstenglein/pgn-parser` é fork mais recente e ativo
- `@mliebelt/pgn-parser` continua sendo mantido (atualizado em Maio 2025)
- Ambos suportam: tags, moves, variações (RAVs), comentários, NAGs
- UMD build disponível para uso no browser
- CLI disponível para parsing de arquivos PGN

---

## 📋 Resumo Executivo para Implementação

| Tecnologia | Implementação Recomendada | Prioridade |
|------------|---------------------------|------------|
| Stockfish WASM | `stockfish` npm v17.1.0 | 🔴 Alta |
| Gemini API | `gemini-2.0-flash` ou `gemini-2.5-flash` | 🔴 Alta |
| React Three Fiber | WebGPU + InstancedMesh + on-demand rendering | 🟡 Média |
| Zustand Persist | Middleware oficial + localStorage/IndexedDB | 🟢 Baixa |
| PGN Parser | `@jackstenglein/pgn-parser` v2.0.8 | 🟡 Média |

---

## 🎯 AÇÕES CORRETIVAS IMEDIATAS

1. **Atualizar PRE_ROADMAP_ROO.md:**
   - Substituir `gemini-1.5-flash` → `gemini-2.0-flash`
   - Substituir `zustand-persist` → `persist` (middleware oficial)
   - Verificar versão do pacote `stockfish`

2. **Instalação de dependências corretas:**
   ```bash
   npm install stockfish @google/genai
   npm install @jackstenglein/pgn-parser
   # persist já vem com zustand (não precisa instalar separadamente)
   ```

3. **Verificação de compatibilidade:**
   - Confirmar que projeto está usando React 19
   - Verificar se Three.js suporta WebGPU no target do projeto

---

*Relatório gerado via EXA AI Search - Fevereiro 2026*  
*Integrado aos documentos do projeto Chess XGR Gaming*
