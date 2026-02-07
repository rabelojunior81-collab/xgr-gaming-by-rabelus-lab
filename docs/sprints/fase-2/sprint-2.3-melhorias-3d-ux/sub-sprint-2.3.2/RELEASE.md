# RELEASE: Sub-Sprint 2.3.2 - Rotação de Câmera Hot-Seat

## 📦 Informações do Release

| Campo | Valor |
|-------|-------|
| **Versão** | v1.5.2-fase2.sprint3.2 |
| **Data** | 2026-02-07 |
| **Sub-Sprint** | 2.3.2 - Rotação de Câmera Hot-Seat |
| **Sprint** | 2.3 - Melhorias 3D e UX |
| **Status** | ✅ RELEASED |

---

## 🎯 Visão Geral

Sistema completo de **rotação de câmera** para modo Hot-Seat (dois jogadores), proporcionando experiência imersiva de duelo com transições cinematográficas.

### Features Entregues

| Feature | Descrição | Status |
|---------|-----------|--------|
| **3 Modos de Câmera** | Tabletop, Duel, Fixed | ✅ |
| **Transição Suave** | Animação ease-in-out-cubic, 1.5s | ✅ |
| **Sincronização Automática** | Gira após cada lance válido | ✅ |
| **UI de Seleção** | Interface intuitiva com ícones | ✅ |
| **Persistência** | Modo salvo entre sessões | ✅ |
| **Testes** | 10 testes unitários | ✅ |

---

## 🎮 Modos de Câmera

### Modo Mesa (Tabletop)
- **Posição:** (0, 15, 0) - Visão de cima
- **Uso ideal:** Tablets, jogadores lado a lado
- **Característica:** Posição fixa para ambos os jogadores

### Modo Duelo (Duel)
- **Posição Brancas:** (0, 8, 12)
- **Posição Pretas:** (0, 8, -12)
- **Uso ideal:** Desktop, experiência cinematográfica
- **Característica:** Alterna 180° a cada lance

### Modo Fixo (Fixed)
- **Posição:** (0, 8, 12) - Tradicional
- **Uso ideal:** Jogadores que preferem visão única
- **Característica:** Não gira, posição clássica

---

## 🧪 Qualidade

### Testes
- **Unitários:** 126/126 passando
- **E2E:** 21/21 passando
- **Cobertura:** >80%

### Performance
- **FPS:** ≥ 60 durante transições
- **Duração:** 1.5s configurável
- **Easing:** ease-in-out-cubic suave

---

## 📁 Arquivos

```
src/
├── features/
│   ├── game/
│   │   ├── components/
│   │   │   └── CameraController.tsx
│   │   └── store/
│   │       └── gameStore.ts (atualizado)
│   └── ui/
│       └── components/
│           └── CameraModeSelector.tsx
└── __tests__/unit/camera/
    └── cameraController.test.ts
```

---

## 🚀 Como Usar

### Selecionar Modo
```typescript
import { CameraModeSelector } from '@ui/components/CameraModeSelector';

<CameraModeSelector />
```

### No Componente 3D
```typescript
import { CameraController } from '@game/components/CameraController';

<Canvas>
  <CameraController transitionDuration={1.5} />
  {/* ... resto da cena */}
</Canvas>
```

### Programaticamente
```typescript
const { setCameraMode } = useGameStore();
setCameraMode('duel'); // 'tabletop' | 'duel' | 'fixed'
```

---

## ✅ Checklist RQP

- [x] 3 modos implementados
- [x] Transição suave funcionando
- [x] Persistência ativa
- [x] Testes passando
- [x] Documentação completa
- [x] Build OK

**Status:** ✅ **Sub-Sprint 2.3.2 Concluída!**
