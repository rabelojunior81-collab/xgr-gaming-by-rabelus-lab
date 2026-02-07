# New Roadmap - Chess XGR Gaming

**Versao:** 1.0  
**Data:** 2026-02-07  
**Base:** Auditoria holistica profunda + GDD oficial + estado real do codigo

---

## 1. Objetivo

Estruturar, de forma sumarizada e holisticamente ordenada, o plano de evolucao do projeto com foco em:
- maior impacto para o usuario;
- menor risco tecnico;
- maior aderencia ao GDD;
- progressao sustentavel por sprint.

---

## 2. Matriz Final de Priorizacao

| Item | Prioridade GDD | Estado Atual | Gap | Esforco | Impacto | Score Relativo |
|---|---|---|---|---|---|---|
| Tutoriais Interativos (validacao + feedback) | Alta | Parcial | Alto | Alto | Muito Alto | 95 |
| IA Neural-X completa (5 fatores + comportamento) | Alta | Parcial | Alto | Alto | Alto | 90 |
| Otimizacao 3D (instancing/material pooling) | Media | Parcial | Alto | Medio | Alto | 85 |
| Polish visual (post-processing/shaders) | Alta | Parcial | Alto | Medio | Alto | 80 |
| Persistencia e continuidade de jornada | Media | Parcial | Medio | Baixo | Medio-Alto | 70 |
| Biblioteca de partidas historicas | Media | Ausente | Alto | Alto | Medio | 60 |
| Curve fitting adaptativo | Media | Ausente | Alto | Alto | Medio | 55 |
| Achievements e metaprogressao | Baixa | Ausente | Medio | Medio | Medio-Baixo | 30 |
| Certificados XGR | Baixa | Ausente | Medio | Medio | Baixo | 25 |

---

## 3. Proximos passos sugeridos (ordenados)

## Fase 1 - Estabilizacao e debito critico (1-2 semanas)

### Objetivo
Consolidar base tecnica e reduzir risco de regressao.

### Entregas
1. remover duplicidades tecnicas de camera/3D legado;
2. ajustar otimizacoes basicas de render (instancing parcial, pooling de material, sombras por distancia);
3. melhorar tratamento de erro de engine e analise na UI;
4. reforcar testes de integracao em fluxos core.

### Criterio de saida
- build e fluxos core estaveis;
- sem debito critico conhecido aberto.

---

## Fase 2 - IA Neural-X completa (2-4 semanas)

### Objetivo
Materializar comportamento adaptativo coerente com os 5 fatores.

### Entregas
1. completar influencia dos 5 fatores no motor de decisao;
2. elevar fator de precisao tecnica (erro/blunder/profundidade);
3. consolidar agressividade como politica de escolha de plano/lance;
4. implementar base de weakness detection;
5. iniciar ajuste dinamico de desafio.

### Criterio de saida
- perfis de IA claramente distintos e consistentes;
- comportamento percebido alinhado a configuracao do usuario.

---

## Fase 3 - Tutor interativo (2-4 semanas)

### Objetivo
Converter conteudo em aprendizado ativo mensuravel.

### Entregas
1. TutorialEngine com validacao por objetivo;
2. feedback em tempo real durante licao;
3. hints progressivos e explicacao contextual;
4. progresso persistente e desbloqueio por competencia;
5. primeira versao do modo "Por Que?".

### Criterio de saida
- licoes jogaveis e validaveis de ponta a ponta;
- progresso educacional persistente.

---

## Fase 4 - Performance + assinatura visual premium (2-3 semanas)

### Objetivo
Aproximar experiencia visual da ambicao do GDD com estabilidade de FPS.

### Entregas
1. consolidar instancing para pecas repetidas;
2. aplicar post-processing por tema;
3. elevar identidade visual dos temas;
4. refinar camera para modos mais cinematograficos.

### Criterio de saida
- ganho perceptivel de qualidade visual e fluidez.

---

## Fase 5 - Expansao de valor (4+ semanas)

### Objetivo
Aumentar retencao e profundidade de estudo.

### Entregas
1. biblioteca de partidas historicas guiadas;
2. analise pos-partida mais rica (heatmap, insights);
3. metaprogressao por achievements;
4. certificados XGR (quando trilha educacional estiver madura).

### Criterio de saida
- maior recorrencia de uso e maior valor educacional percebido.

---

## 4. Sequenciamento recomendado

1. Nao pular Fase 1.
2. Iniciar Fase 2 antes da 3, com sobreposicao controlada quando estabilidade permitir.
3. Iniciar Fase 4 apos MVP funcional de IA + Tutor.
4. Levar Fase 5 somente depois de consolidar performance e UX.

---

## 5. Riscos e mitigacoes

1. Escopo inflado por sprint.
   - Mitigacao: criterios de saida objetivos e cortes antecipados.
2. Evolucao visual antes de fechar core educacional/IA.
   - Mitigacao: seguir ordem de fases.
3. Regressao por refatoracao ampla.
   - Mitigacao: incrementos pequenos + testes de integracao.
4. Crescimento acoplado de store.
   - Mitigacao: modularizacao em slices/casos de uso.

---

## 6. Acoes imediatas

1. abrir backlog atomico da Fase 1;
2. definir responsaveis por trilha (IA, Tutor, 3D, UX, QA);
3. fechar cronograma das duas primeiras sprints;
4. criar checkpoint semanal de risco/progresso;
5. revisar este roadmap ao fim de cada sprint.

---

## 7. Historico

| Versao | Data | Autor | Descricao |
|---|---|---|---|
| 1.0 | 2026-02-07 | OpenCode | Roadmap estruturado a partir da auditoria holistica |
