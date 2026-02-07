# SPEC: Sub-Sprint 2.1.3 - Resiliência Emocional

## Metadados
- **Versão:** v1.3.3-fase2.sprint1.3
- **Data:** 2026-02-02
- **Complexidade:** Média-Alta
- **Estimativa:** 5-7 horas

## Objetivo
Implementar Fator 5 da IA Neural-X: Resiliência Emocional (último fator!)

## Requisitos Funcionais
1. Detectar situação de vantagem/desvantagem da IA
2. Ajustar comportamento baseado na situação:
   - Perdendo → mais arriscado/agressivo (tenta complicar)
   - Ganhando → mais conservador (simplifica)
   - Empatado → comportamento normal
3. Sistema de "emoções" da IA (opcional para UX):
   - Mensagens baseadas na situação
   - Estados: Confiante, Preocupado, Desesperado, Triunfante
4. Personalidade afeta a resiliência:
   - Aggressive: mais propenso a riscos mesmo perdendo
   - Solid: mais conservador mesmo ganhando
   - Positional/Tactical: balanceado

## Requisitos Técnicos
- Cálculo de vantagem material e posicional
- Thresholds configuráveis para "perdendo"/"ganhando"
- Fator de ajuste de comportamento (-1 a +1)
- Integração com sistema de movimentos existente

## Critérios de Aceitação
- [ ] IA detecta corretamente quando está ganhando/perdendo
- [ ] Comportamento muda visivelmente baseado na situação
- [ ] Personalidade afeta as reações emocionais
- [ ] Transições suaves entre estados emocionais
- [ ] Testes unitários passando (>80% cobertura)
