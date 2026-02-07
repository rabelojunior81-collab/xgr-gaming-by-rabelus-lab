# 📋 Plano de Reorganização CORRETO

> **Data:** 2026-02-06  
> **Agente:** IMPL-001  
> **Estratégia:** Passo a passo, validação entre cada etapa

---

## 🎯 Estratégia (A CORRETA)

### ❌ O que EU FIZ ERRADO antes:
1. Removi pastas antigas primeiro
2. Depois vi que tinha erros
3. Build quebrou

### ✅ O que vou fazer AGORA (correto):
1. **Manter** pastas antigas funcionando
2. Criar estrutura nova (features/)
3. Copiar arquivos para nova estrutura
4. Atualizar imports NOS ARQUIVOS NOVOS
5. Testar build (antiga + nova coexistindo)
6. Atualizar App.tsx para usar nova estrutura
7. Testar build novamente
8. SÓ ENTÃO remover pastas antigas
9. Testar build final

---

## 📋 Checklist de Etapas

### Etapa 1: Preparação
- [ ] Backup do estado atual
- [ ] Verificar build está funcionando
- [ ] Verificar testes estão passando

### Etapa 2: Criar Estrutura Nova
- [ ] Criar src/features/
- [ ] Criar src/features/game/
- [ ] Criar src/features/tutorial/
- [ ] Criar src/features/ai/
- [ ] Criar src/features/ui/
- [ ] Criar src/shared/

### Etapa 3: Copiar Arquivos
- [ ] Copiar (não mover!) arquivos para features/
- [ ] Manter originais intactos

### Etapa 4: Atualizar Imports (Nos NOVOS arquivos)
- [ ] Atualizar @/store/ para @game/store/ etc
- [ ] Fazer arquivo por arquivo
- [ ] Validar cada um

### Etapa 5: Criar Barrels
- [ ] Criar index.ts em cada feature
- [ ] Exportar componentes públicos

### Etapa 6: Atualizar App.tsx
- [ ] Mudar imports para usar nova estrutura
- [ ] Testar build

### Etapa 7: Testar TUDO
- [ ] npm run build
- [ ] npm test
- [ ] npm run dev

### Etapa 8: Só então remover antiga
- [ ] REMOVER pastas antigas (components/, engine/, etc)
- [ ] Testar build final
- [ ] Testar testes final

---

## 🚫 Regras de Ouro

1. **NUNCA** remover pasta antiga antes de validar nova
2. **SEMPRE** testar build após cada etapa
3. **SEMPRE** ter backup funcional
4. **NUNCA** assumir que "vai dar certo"

---

**Iniciando Etapa 1...**
