# DECISIONS: Sub-Sprint 2.1.3 - Resiliência Emocional

## ADR-001: Integração do EmotionalIndicator na UI
**Status:** Accepted  
**Data:** 2026-02-02  
**Contexto:** Necessidade de exibir o estado emocional da IA na interface do usuário  
**Decisão:** Integrar EmotionalIndicator no GameControls, entre os jogadores e os botões de ação  
**Alternativas consideradas:**
- Overlay flutuante no tabuleiro (rejeitado: polui visualmente)
- Aba separada (rejeitado: não visível em tempo real)
- Header global (rejeitado: perde contexto do jogador atual)
**Consequências:** UX limpa, informação contextual visível durante a partida

## ADR-002: Protocolo de Governança de Ambiente
**Status:** Accepted  
**Data:** 2026-02-02  
**Contexto:** Processos Node.js órfãos acumulados em múltiplas portas causando instabilidade  
**Decisão:** Implementar Protocolo de Governança em 3 fases:
1. **Fase de Testes Visuais Autônomos:** Iniciar servidor, capturar screenshots, gerar evidências
2. **Fase de Coordenação Bilateral:** Pausar execução, comunicar URL/escopo, aguardar aprovação
3. **Fase de Higiene Retroativa:** Encerrar servidor, limpar processos, manter ambiente sanitizado
**Alternativas consideradas:**
- Manter servidor sempre ativo (rejeitado: acumulo de processos)
- Usar Docker (rejeitado: complexidade adicional)
**Consequências:** Ambiente limpo, rastreabilidade total, validação visual obrigatória

## ADR-003: Validação Visual Obrigatória
**Status:** Accepted  
**Data:** 2026-02-02  
**Contexto:** Componentes implementados sem verificação visual real no navegador  
**Decisão:** Toda implementação de UI deve ser:
1. Testada visualmente no navegador
2. Capturada em screenshots para documentação
3. Validada bilateralmente antes de merge
**Alternativas consideradas:**
- Apenas testes unitários (rejeitado: não garantem rendering correto)
- Storybook (rejeitado: não implementado no projeto)
**Consequências:** Qualidade visual garantida, documentação rica, feedback imediato

## ADR-004: Localização do EmotionalIndicator
**Status:** Accepted  
**Data:** 2026-02-02  
**Contexto:** Onde posicionar o indicador emocional no layout  
**Decisão:** Posicionar entre as informações dos jogadores (White/Black) e os botões de ação  
**Alternativas consideradas:**
- Acima dos jogadores (rejeitado: perde contexto)
- Abaixo dos botões (rejeitado: pouco visível)
- No header (rejeitado: não relacionado ao jogador atual)
**Consequências:** Contexto claro, hierarquia visual mantida

## Lições Aprendidas
- **Sempre validar visualmente:** Componentes podem estar implementados mas não integrados
- **Screenshots são evidências:** Documentação visual é crucial para validação bilateral
- **Limpeza de ambiente:** Processos órfãos causam instabilidade imprevisível
- **Protocolo estruturado:** Fases claras evitam sobreposição e garantem qualidade

## Evidências Visuais
Screenshots capturados em `screenshots/`:
- `01-main-menu.png` - Menu principal
- `02-game-with-emotional-indicator.png` - Jogo com indicador emocional visível
- `03-after-move-thinking.png` - Estado durante processamento da IA

## Resultado da Validação Bilateral
**Status:** ✅ APROVADO  
**Data:** 2026-02-02  
**Validador:** Stakeholder  
**Observações:** EmotionalIndicator funcionando conforme especificado, estado emocional "Neutro" exibido corretamente entre os jogadores e botões.
