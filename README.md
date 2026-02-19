# 🤖 Bot de Agendamentos - WhatsApp com Baileys

Sistema completo de agendamento de serviços via WhatsApp usando a biblioteca Baileys.

## 📋 Índice

- [O que é o Baileys?](#o-que-é-o-baileys)
- [Requisitos](#requisitos)
- [Instalação](#instalação)
- [Como Funciona](#como-funciona)
- [Primeiro Bot](#primeiro-bot)
- [Recursos Avançados](#recursos-avançados)
- [Integração com Banco de Dados](#integração-com-banco-de-dados)
- [Dicas de Produção](#dicas-de-produção)
- [Troubleshooting](#troubleshooting)

## 🎯 O que é o Baileys?

O Baileys é uma biblioteca JavaScript/TypeScript que permite criar bots para WhatsApp **sem usar a API oficial**. Ele funciona simulando um cliente WhatsApp Web.

### Vantagens:
- ✅ **Gratuito** (não precisa pagar pela API oficial)
- ✅ Suporta todas as funcionalidades do WhatsApp
- ✅ Fácil de usar
- ✅ Bem documentado

### Desvantagens:
- ⚠️ Não é oficialmente suportado pelo WhatsApp
- ⚠️ Precisa de um número de telefone dedicado
- ⚠️ Pode ter problemas se o WhatsApp mudar o protocolo

## 📦 Requisitos

- Node.js versão 16 ou superior
- NPM ou Yarn
- Um número de telefone para o bot (não use seu número pessoal)
- Banco de dados (MongoDB, MySQL, PostgreSQL)

## 🚀 Instalação

### 1. Criar o projeto

```bash
mkdir bot-agendamentos
cd bot-agendamentos
npm init -y
```

### 2. Instalar dependências

```bash
npm install @whiskeysockets/baileys
npm install @hapi/boom
npm install pino
npm install qrcode-terminal

# Para banco de dados (escolha um):
npm install mongoose      # MongoDB
npm install mysql2        # MySQL
npm install pg            # PostgreSQL
```

### 3. Criar estrutura de pastas

```
bot-agendamentos/
├── node_modules/
├── auth_info_baileys/    (criado automaticamente)
├── downloads/            (para mídias recebidas)
├── bot.js               (arquivo principal)
├── database.js          (conexão com banco)
├── package.json
└── README.md
```

## 📱 Como Funciona

### Fluxo Básico:

1. **Conexão**: O bot gera um QR Code que você escaneia com seu WhatsApp
2. **Autenticação**: As credenciais ficam salvas localmente
3. **Eventos**: O bot escuta eventos (mensagens recebidas, status, etc.)
4. **Respostas**: Processa mensagens e responde automaticamente

### Componentes Principais:

```javascript
// 1. Criar socket (conexão)
const sock = makeWASocket({ auth: state });

// 2. Escutar eventos de mensagem
sock.ev.on('messages.upsert', async ({ messages }) => {
    // Processar mensagens
});

// 3. Enviar mensagens
await sock.sendMessage(destinatario, { text: 'Olá!' });
```

## 🎓 Primeiro Bot

### Bot Simples (Echo Bot)

```javascript
const { default: makeWASocket, useMultiFileAuthState } = require('@whiskeysockets/baileys');

async function start() {
    const { state, saveCreds } = await useMultiFileAuthState('auth_info');
    
    const sock = makeWASocket({
        auth: state,
        printQRInTerminal: true,
    });
    
    sock.ev.on('creds.update', saveCreds);
    
    sock.ev.on('messages.upsert', async ({ messages }) => {
        const msg = messages[0];
        if (!msg.message || msg.key.fromMe) return;
        
        const text = msg.message.conversation || '';
        const from = msg.key.remoteJid;
        
        // Repete o que o usuário disse
        await sock.sendMessage(from, { 
            text: `Você disse: ${text}` 
        });
    });
}

start();
```

### Executar:

```bash
node bot.js
```

Um QR Code aparecerá no terminal. Escaneie com seu WhatsApp!

## 🔥 Recursos Avançados

### 1. Sistema com Estados (Conversação)

```javascript
// Gerenciar fluxo de conversa
const estados = new Map();

function getEstado(userId) {
    if (!estados.has(userId)) {
        estados.set(userId, { etapa: 'inicial', dados: {} });
    }
    return estados.get(userId);
}

// Uso:
sock.ev.on('messages.upsert', async ({ messages }) => {
    const msg = messages[0];
    const from = msg.key.remoteJid;
    const estado = getEstado(from);
    
    if (estado.etapa === 'aguardando_nome') {
        estado.dados.nome = messageText;
        estado.etapa = 'aguardando_servico';
        // Continuar fluxo...
    }
});
```

### 2. Mensagens com Botões

```javascript
await sock.sendMessage(from, {
    text: 'Escolha uma opção:',
    footer: 'Sistema de Agendamentos',
    buttons: [
        { buttonId: 'btn1', buttonText: { displayText: 'Novo Agendamento' } },
        { buttonId: 'btn2', buttonText: { displayText: 'Meus Agendamentos' } }
    ]
});
```

### 3. Listas de Opções

```javascript
await sock.sendMessage(from, {
    text: 'Selecione um serviço:',
    buttonText: 'Ver Opções',
    sections: [
        {
            title: 'Serviços',
            rows: [
                { title: 'Corte', rowId: 'corte' },
                { title: 'Barba', rowId: 'barba' }
            ]
        }
    ]
});
```

### 4. Enviar Imagens

```javascript
await sock.sendMessage(from, {
    image: { url: 'https://exemplo.com/foto.jpg' },
    caption: 'Confira nosso trabalho!'
});
```

### 5. Download de Mídia

```javascript
const { downloadMediaMessage } = require('@whiskeysockets/baileys');

const buffer = await downloadMediaMessage(msg, 'buffer');
fs.writeFileSync('imagem.jpg', buffer);
```

## 💾 Integração com Banco de Dados

### MongoDB

```javascript
const mongoose = require('mongoose');

const AgendamentoSchema = new mongoose.Schema({
    whatsapp: String,
    nome: String,
    servico: String,
    data: String,
    horario: String,
    status: { type: String, default: 'pendente' }
});

const Agendamento = mongoose.model('Agendamento', AgendamentoSchema);

// Conectar
await mongoose.connect('mongodb://localhost:27017/agendamentos');

// Salvar
const novo = new Agendamento({ whatsapp: from, nome: 'João', ... });
await novo.save();

// Buscar
const agendamentos = await Agendamento.find({ whatsapp: from });
```

### MySQL

```javascript
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    database: 'agendamentos',
});

// Salvar
await pool.query(
    'INSERT INTO agendamentos (whatsapp, nome, data, horario) VALUES (?, ?, ?, ?)',
    [from, nome, data, horario]
);

// Buscar
const [rows] = await pool.query(
    'SELECT * FROM agendamentos WHERE whatsapp = ?',
    [from]
);
```

## 🏭 Dicas de Produção

### 1. Use PM2 para manter o bot rodando

```bash
npm install -g pm2
pm2 start bot.js --name "bot-agendamentos"
pm2 logs
pm2 restart bot-agendamentos
```

### 2. Reconexão Automática

```javascript
sock.ev.on('connection.update', (update) => {
    const { connection, lastDisconnect } = update;
    
    if (connection === 'close') {
        const shouldReconnect = 
            lastDisconnect?.error?.output?.statusCode !== 401;
        
        if (shouldReconnect) {
            setTimeout(start, 5000); // Reconecta em 5s
        }
    }
});
```

### 3. Logs Estruturados

```javascript
const pino = require('pino');
const logger = pino({ level: 'info' });

logger.info('Bot iniciado');
logger.error('Erro ao processar mensagem', { error });
```

### 4. Rate Limiting (Evitar Banimento)

```javascript
// Delay entre mensagens em massa
async function enviarEmMassa(destinatarios, mensagem) {
    for (const dest of destinatarios) {
        await sock.sendMessage(dest, { text: mensagem });
        await delay(3000); // 3 segundos entre mensagens
    }
}
```

### 5. Variáveis de Ambiente

```javascript
// .env
DB_HOST=localhost
DB_USER=root
DB_PASS=senha123
PHONE_NUMBER=5511999999999

// bot.js
require('dotenv').config();
const dbHost = process.env.DB_HOST;
```

## 🐛 Troubleshooting

### Problema: QR Code não aparece

**Solução:**
```bash
npm install qrcode-terminal
```

```javascript
const sock = makeWASocket({
    auth: state,
    printQRInTerminal: true, // Importante!
});
```

### Problema: "Connection Closed"

**Causas comuns:**
- Internet instável
- WhatsApp Web desconectado no celular
- Número banido/bloqueado

**Solução:**
```javascript
// Implementar reconexão automática (ver seção acima)
```

### Problema: Mensagens não sendo recebidas

**Verificar:**
1. Bot está rodando?
2. Número está conectado?
3. Event listener está configurado?

```javascript
sock.ev.on('messages.upsert', async ({ messages }) => {
    console.log('Mensagem recebida:', messages);
});
```

### Problema: "Cannot read property 'conversation'"

**Solução:**
```javascript
// Sempre verificar se a mensagem existe
const text = msg.message?.conversation || 
             msg.message?.extendedTextMessage?.text || 
             '';
```

### Problema: Bot sendo banido

**Dicas para evitar:**
- Não envie muitas mensagens de uma vez
- Use delays entre mensagens (mínimo 2-3 segundos)
- Não use para spam
- Use um número dedicado (não seu pessoal)
- Evite enviar para números que não te conhecem

## 📚 Recursos Úteis

- [Documentação Oficial Baileys](https://github.com/WhiskeySockets/Baileys)
- [Exemplos no GitHub](https://github.com/WhiskeySockets/Baileys/tree/master/Example)
- Arquivo `recursos-avancados-baileys.js` neste projeto

## 🤝 Fluxo Completo do Sistema de Agendamento

```
Usuário: "Oi"
Bot: Menu de opções

Usuário: "1" (Novo agendamento)
Bot: "Qual seu nome?"

Usuário: "João Silva"
Bot: "Escolha o serviço: 1-Corte, 2-Barba..."

Usuário: "1"
Bot: "Escolha a data (DD/MM/AAAA):"

Usuário: "15/02/2026"
Bot: "Horários disponíveis: 1-09:00, 2-10:00..."

Usuário: "2"
Bot: "Confirme: João Silva - Corte - 15/02 às 10:00?"

Usuário: "Confirmar"
Bot: "✅ Agendamento confirmado!"
[Salva no banco de dados]
```

## 🎯 Próximos Passos

1. ✅ Implementar bot básico
2. ✅ Adicionar sistema de estados
3. ✅ Conectar com banco de dados
4. ⬜ Criar painel web de administração
5. ⬜ Implementar lembretes automáticos
6. ⬜ Adicionar sistema de pagamentos
7. ⬜ Deploy em servidor (VPS/Cloud)

## ⚖️ Aviso Legal

Este projeto usa a biblioteca Baileys, que **não é oficialmente suportada** pelo WhatsApp. Use por sua conta e risco. Recomenda-se usar um número dedicado para o bot, não seu número pessoal.

---

**Desenvolvido para fins educacionais**
