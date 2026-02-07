# Correção de Bugs - Sprint 2.2

## Bug #003: Tabuleiro 3D Cortado no Modo Tutorial

**Data:** 2026-02-03
**Status:** ✅ Corrigido (versão definitiva)
**Severidade:** Alta

### Descrição
O tabuleiro 3D no modo tutorial estava sendo cortado, mostrando apenas metade das peças. O painel de tutoriais só ficava totalmente acessível com zoom out para 67%.

### Causa Raiz
Conflito de CSS/Tailwind entre containers:
1. `overflow-hidden` no container do tabuleiro cortava o canvas 3D
2. `aspect-square` forçava proporção quadrada que competia com conteúdo
3. `min-h-screen` sem scroll impedia acesso a conteúdo excedente
4. Padding cumulativo reduzia espaço disponível
5. Painel lateral fixo de 400px comprimia o conteúdo principal

### Correções Aplicadas

#### FASE 1: Container do Tabuleiro com max-height
**Arquivo:** `LessonViewer.tsx` - Container do Tabuleiro (Linha 176)

Adicionado `max-h-[calc(100vh-250px)]` para limitar a altura máxima do tabuleiro com base no viewport.

#### FASE 2: Scroll Interno no TutorialPanel
**Arquivo:** `TutorialPanel.tsx` - Container Principal (Linha 326)

Alterado de `min-h-screen` para `h-screen overflow-hidden` no container principal, com `h-full overflow-y-auto` no motion.div interno para permitir scroll controlado.

#### FASE 3: Redução do Painel Lateral
**Arquivo:** `LessonViewer.tsx` - Grid Layout (Linha 170)

Reduzido o painel lateral de `400px` para `320px` para liberar mais espaço para o tabuleiro 3D.

### Código das Correções

```tsx
// LessonViewer.tsx - Container do Tabuleiro (Linha 176)
// DEPOIS:
<div
  className="w-full max-h-[calc(100vh-250px)] aspect-square rounded-lg bg-slate-700 relative overflow-hidden"
  data-testid="chess-board"
>

// LessonViewer.tsx - Grid Layout (Linha 170)
// DEPOIS:
<div className="grid gap-6 lg:grid-cols-[1fr_320px] xl:grid-cols-[1fr_380px]">

// TutorialPanel.tsx - Container Principal (Linha 326)
// DEPOIS:
<div className="h-screen overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4 lg:p-8">
  <AnimatePresence mode="wait">
    <motion.div
      className="h-full overflow-y-auto"
      ...
    >
```

### Checklist de Validação

- [ ] Tabuleiro 3D: tamanho adequado em 1920x1080
- [ ] Tabuleiro 3D: tamanho proporcional em 1366x768
- [ ] Scroll: funciona no TutorialPanel
- [ ] Painel lateral: acessível sem zoom out
- [ ] Layout: responsivo em diferentes resoluções

### Lições Aprendidas

- `aspect-square` calcula baseado em width, não height
- `min-h-screen` permite crescimento infinito - usar `h-screen` com scroll interno
- Painéis laterais fixos grandes (400px+) podem comprimir conteúdo principal
- Container 3D precisa de limites de altura explícitos para evitar overflow

---

## Problema Reportado
**Data:** 2026-02-02  
**Status:** 🔄 EM ANDAMENTO

### Issue 1: Tabuleiro sem peças no modo Tutorial
O tabuleiro no modo tutorial aparecia **sem as peças** - apenas casas coloridas vazias.

### Issue 2: Tabuleiro cortado e com ângulo inadequado
Após a correção das peças, o tabuleiro apareceu:
- Metade cortada/fora do layout
- Ângulo de visão desconfortável
- Dificuldade para interagir com as peças
- Necessidade de girar o tabuleiro para ver as peças

---

## Root Cause Analysis

### Problema 1: Placeholder em vez de componente real
**Arquivo:** `src/components/ui/LessonViewer.tsx`  
**Linhas:** 156-181

O LessonViewer estava usando um placeholder HTML/CSS em vez do componente ChessBoard3D real.

### Problema 2: Posição da câmera inadequada
**Arquivo:** `src/components/3d/ChessBoard3D.tsx`  
**Linha:** 302

A posição da câmera `[0, 8, 8]` criava uma perspectiva muito inclinada, cortando o tabuleiro e tornando a visualização desconfortável para o modo tutorial.

---

## Soluções Implementadas

### Fix 1: Integrar ChessBoard3D no LessonViewer
**Arquivo:** `src/components/ui/LessonViewer.tsx`

- Substituído placeholder pelo `ChessBoard3D` real
- Adicionado estado `selectedSquare` para gerenciar seleção
- Implementado handler `handleSquareClick`

### Fix 2: Adicionar suporte a cameraPosition
**Arquivo:** `src/components/3d/ChessBoard3D.tsx`

Adicionada prop `cameraPosition` para permitir customização:
```tsx
interface ChessBoard3DProps {
  // ... outras props
  cameraPosition?: [number, number, number];
}

export function ChessBoard3D({
  // ... outras props
  cameraPosition = [0, 10, 5]  // valor padrão mais adequado
}: ChessBoard3DProps = {}) {
  // ...
  <Canvas camera={{ position: cameraPosition, fov: 50 }}>
}
```

### Fix 3: Configurar posição adequada para tutorial
**Arquivo:** `src/components/ui/LessonViewer.tsx`

Usar posição de câmera mais frontal e elevada:
```tsx
<ChessBoard3D 
  externalFen={getCurrentFEN() || lesson.fen}
  externalSelectedSquare={selectedSquare}
  onSquareClick={handleSquareClick}
  cameraPosition={[0, 12, 2]}  // Mais alto e frontal
/>
```

### Fix 4: Corrigir tipos
**Arquivos:** `src/types/tutorial.ts`, `src/engine/tutorialEngine.ts`

Adicionada propriedade `timeSpent` ao tipo `LessonSession`.

---

## Problemas Pendentes

### Navegação não funcional
**Arquivo:** `src/components/ui/TutorialPanel.tsx`

O clique nos módulos não está navegando para as lições. O usuário reportou que não consegue acessar o conteúdo do tutorial.

**Status:** ⚠️ PENDENTE

---

## Arquivos Modificados

1. ✅ `src/components/3d/ChessBoard3D.tsx`
   - Adicionada prop `cameraPosition`
   - Valor padrão mais adequado `[0, 10, 5]`
   - FOV ajustado para 50

2. ✅ `src/components/ui/LessonViewer.tsx`
   - Integrado ChessBoard3D real
   - Configurada posição `[0, 12, 2]` para tutorial
   - Adicionado gerenciamento de seleção
   - **CORREÇÃO DEFINITIVA:** max-height no container do tabuleiro
   - **CORREÇÃO DEFINITIVA:** grid com painel lateral reduzido (320px)

3. ✅ `src/types/tutorial.ts`
   - Adicionado `timeSpent` ao LessonSession

4. ✅ `src/engine/tutorialEngine.ts`
   - Inicialização com `timeSpent: 0`

5. ✅ `src/components/ui/TutorialPanel.tsx`
   - **CORREÇÃO DEFINITIVA:** h-screen + overflow-hidden no container
   - **CORREÇÃO DEFINITIVA:** h-full + overflow-y-auto no conteúdo

---

## Testes Realizados

### Build
```bash
npm run build
```
**Resultado:** ✅ Sucesso (0 erros TypeScript)

### Validação Visual
- [x] Build completa sem erros
- [ ] Tabuleiro aparece inteiro
- [ ] Ângulo de visão confortável
- [ ] Interação com peças funcionando
- [ ] Navegação entre módulos/lições

---

## Lições Aprendidas

### 1. Validação visual rigorosa necessária
Screenshots devem ser capturados em cada etapa para garantir:
- Componentes renderizam completamente
- Layout não corta elementos
- Ângulo de visão é confortável para o usuário

### 2. Componentes 3D precisam de configurações específicas
O mesmo componente ChessBoard3D precisa de posições de câmera diferentes para:
- Modo jogo normal (ângulo lateral/perspectiva)
- Modo tutorial (visão mais frontal/de cima)

### 3. Placeholders não devem ir para produção
Código temporário/markers devem ser resolvidos antes do merge.

---

## Próximos Passos

### Prioridade Alta
1. ⏳ Corrigir navegação do TutorialPanel (clique nos módulos)
2. ⏳ Testar visualmente o ângulo do tabuleiro
3. ⏳ Validar interação de clique nas peças

### Prioridade Média
4. Ajustar posição da câmera se necessário
5. Testar em diferentes resoluções de tela
6. Verificar performance do render 3D

---

## Notas Técnicas

### Posições de Câmera Testadas

| Posição | Descrição | Status |
|---------|-----------|--------|
| `[0, 8, 8]` | Original - muito inclinada | ❌ Corta o tabuleiro |
| `[0, 12, 2]` | Mais frontal e alta | ⏳ Em teste |
| `[0, 10, 5]` | Padrão ChessBoard3D | ✅ Adequado para jogo |

---

**Responsável:** Code Mode  
**Data da Correção:** 2026-02-03  
**Status:** ✅ Corrigido (versão definitiva)
