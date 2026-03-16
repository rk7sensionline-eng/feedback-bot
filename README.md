# ⭐ Bot de Feedback - Discord

Bot que permite clientes avaliarem compras com estrelas, igual ao da imagem.

---

## 📦 Instalação

### 1. Pré-requisitos
- [Node.js](https://nodejs.org) v18 ou superior
- Conta no [Discord Developer Portal](https://discord.com/developers/applications)

### 2. Criar o Bot no Discord

1. Acesse o [Discord Developer Portal](https://discord.com/developers/applications)
2. Clique em **"New Application"** → dê um nome
3. Vá em **"Bot"** → clique em **"Add Bot"**
4. Copie o **TOKEN** do bot
5. Em **"OAuth2 > URL Generator"**:
   - Marque `bot` e `applications.commands`
   - Permissões: `Send Messages`, `Embed Links`, `Use Slash Commands`
   - Copie o link gerado e adicione o bot ao seu servidor

### 3. Configurar o projeto

```bash
# Clone ou baixe os arquivos
cd feedback-bot

# Instale as dependências
npm install

# Copie o arquivo de variáveis de ambiente
cp .env.example .env
```

Edite o arquivo `.env` e preencha:
```
DISCORD_TOKEN=    ← Token do bot (Developer Portal > Bot)
CLIENT_ID=        ← ID do bot (Developer Portal > General Information)
FEEDBACK_CHANNEL_ID= ← ID do canal onde os feedbacks serão postados
GUILD_ID=         ← ID do seu servidor (clique direito no servidor > Copiar ID)
```

> 💡 Para ver os IDs, ative o **Modo Desenvolvedor** no Discord:
> Configurações → Avançado → Modo Desenvolvedor ✅

### 4. Registrar os comandos

```bash
npm run deploy
```

### 5. Iniciar o bot

```bash
npm start
```

---

## 🚀 Como usar

1. Em qualquer canal do servidor, use o comando:
   ```
   /feedback-setup
   ```
   Isso vai enviar a mensagem com o botão de avaliação.

2. Os usuários clicam em **"⭐ Deixar Feedback"** → preenchem o formulário → enviam.

3. O feedback aparece automaticamente no canal configurado em `FEEDBACK_CHANNEL_ID`.

---

## ⭐ Resultado

O bot envia um embed com:
- Nome de usuário + avatar
- Comentário
- Nome do plano, valor, total
- Botões de estrelas coloridos (verde = nota dada, cinza = sem nota)
- Cor do embed muda de acordo com a nota (vermelho → verde)

---

## 🛠️ Personalização

No `index.js` você pode editar:
- **Campos do formulário** → dentro do `ModalBuilder`
- **Aparência do embed** → dentro do `EmbedBuilder`
- **Cores por nota** → função `getCorPorNota()`
