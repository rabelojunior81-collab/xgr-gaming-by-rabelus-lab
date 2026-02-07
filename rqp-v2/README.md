# RQP Core v2.0.0

> **Rabelus Quant Protocol - Simplified Edition**

Framework operacional para desenvolvimento de software via agentes de IA. Versão simplificada e funcional.

## ✨ Características

- 🎯 **9 Agentes Especializados** - Do Discovery à Release
- 🔒 **6 Gates de Segurança** - SG-001 a SG-006
- 💫 **Soul System** - Identidade persistente do projeto
- 🔄 **Handoff Protocol** - Transferência segura entre agentes
- 📊 **Validação Contínua** - Integridade e qualidade
- 🚀 **Single Package** - Instalação simples

## 📦 Instalação

```bash
npm install -g @rqp/core
```

## 🚀 Uso Rápido

### Novo Projeto

```bash
rqp init --name meu-projeto --template react
cd meu-projeto
rqp status
```

### Projeto Existente

```bash
cd meu-projeto
rqp onboard
rqp status
```

## 📋 Comandos

| Comando | Descrição |
|---------|-----------|
| `rqp init` | Inicializa novo projeto |
| `rqp onboard` | Adota RQP em projeto existente |
| `rqp status` | Mostra status do projeto |
| `rqp agent` | Gerencia agentes |
| `rqp gate` | Executa gates de qualidade |
| `rqp validate` | Valida código e qualidade |
| `rqp soul` | Gerencia souls |
| `rqp docs` | Gera documentação |
| `rqp research` | Pesquisa estruturada |

## 🏗️ Arquitetura

```
rqp/
├── src/
│   ├── commands/      # 9 comandos CLI
│   ├── core/          # Engines, Managers, Validators
│   ├── types/         # TypeScript definitions
│   ├── templates/     # Templates estáticos
│   └── utils/         # Helpers
├── tests/             # Testes unitários
└── package.json       # Single package
```

## 🧪 Desenvolvimento

```bash
# Instalar dependências
npm install

# Build
npm run build

# Testes
npm test

# Watch mode
npm run dev
```

## 📄 Licença

MIT

---

**Desenvolvido com 💚 por Rabelus Lab**
