require('dotenv').config();
const { Client, GatewayIntentBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ModalBuilder, TextInputBuilder, TextInputStyle, PermissionFlagsBits } = require('discord.js');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ]
});

const TOKEN = process.env.DISCORD_TOKEN;
const FEEDBACK_CHANNEL_ID = process.env.FEEDBACK_CHANNEL_ID; // Canal onde os feedbacks aparecem

// ========================
// EVENTO: BOT PRONTO
// ========================
client.once('ready', () => {
  console.log(`✅ Bot online como ${client.user.tag}`);
});

// ========================
// COMANDO: /feedback-setup
// Envia a mensagem inicial com botão para abrir o modal
// ========================
client.on('interactionCreate', async (interaction) => {

  // --- SLASH COMMAND: /feedback-setup ---
  if (interaction.isChatInputCommand() && interaction.commandName === 'feedback-setup') {
    if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
      return interaction.reply({ content: '❌ Apenas admins podem usar esse comando.', ephemeral: true });
    }

    const embed = new EmbedBuilder()
      .setColor(0x5865F2)
      .setTitle('⭐ Avalie sua compra!')
      .setDescription('Ficou satisfeito com sua compra? Deixe seu feedback e ajude nossa comunidade!\n\nClique no botão abaixo para avaliar.')
      .setThumbnail('https://cdn.discordapp.com/emojis/1234567890.webp') // Opcional
      .setFooter({ text: 'Sistema de Feedback' });

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId('open_feedback')
        .setLabel('⭐ Deixar Feedback')
        .setStyle(ButtonStyle.Primary)
    );

    await interaction.reply({ embeds: [embed], components: [row] });
  }

  // --- BOTÃO: Abre o modal de feedback ---
  if (interaction.isButton() && interaction.customId === 'open_feedback') {
    const modal = new ModalBuilder()
      .setCustomId('feedback_modal')
      .setTitle('📝 Avalie sua compra');

    const nomeInput = new TextInputBuilder()
      .setCustomId('nome_plano')
      .setLabel('Nome do Plano / Produto')
      .setStyle(TextInputStyle.Short)
      .setPlaceholder('Ex: PLANO BASIC')
      .setRequired(true);

    const valorInput = new TextInputBuilder()
      .setCustomId('valor_pago')
      .setLabel('Valor Pago (R$)')
      .setStyle(TextInputStyle.Short)
      .setPlaceholder('Ex: 24.90')
      .setRequired(true);

    const notaInput = new TextInputBuilder()
      .setCustomId('nota_estrelas')
      .setLabel('Nota (1 a 5 estrelas)')
      .setStyle(TextInputStyle.Short)
      .setPlaceholder('Digite um número de 1 a 5')
      .setMaxLength(1)
      .setRequired(true);

    const comentarioInput = new TextInputBuilder()
      .setCustomId('comentario')
      .setLabel('Comentário')
      .setStyle(TextInputStyle.Paragraph)
      .setPlaceholder('Deixe seu comentário sobre a compra...')
      .setRequired(false);

    modal.addComponents(
      new ActionRowBuilder().addComponents(nomeInput),
      new ActionRowBuilder().addComponents(valorInput),
      new ActionRowBuilder().addComponents(notaInput),
      new ActionRowBuilder().addComponents(comentarioInput),
    );

    await interaction.showModal(modal);
  }

  // --- MODAL SUBMIT: Processa o feedback ---
  if (interaction.isModalSubmit() && interaction.customId === 'feedback_modal') {
    const nomePlano = interaction.fields.getTextInputValue('nome_plano');
    const valorPago = interaction.fields.getTextInputValue('valor_pago');
    const notaRaw = interaction.fields.getTextInputValue('nota_estrelas');
    const comentario = interaction.fields.getTextInputValue('comentario') || 'Sem comentário';

    const nota = parseInt(notaRaw);
    if (isNaN(nota) || nota < 1 || nota > 5) {
      return interaction.reply({ content: '❌ Nota inválida! Digite um número de 1 a 5.', ephemeral: true });
    }

    const estrelas = gerarEstrelas(nota);
    const valor = parseFloat(valorPago.replace(',', '.'));
    const valorFormatado = isNaN(valor) ? valorPago : valor.toFixed(2);

    const embed = new EmbedBuilder()
      .setColor(getCorPorNota(nota))
      .setAuthor({
        name: `${interaction.user.username} avaliou a compra em nossa loja em ${nota} estrela${nota > 1 ? 's' : ''}`,
        iconURL: interaction.user.displayAvatarURL({ dynamic: true })
      })
      .setDescription(
        `**Comentário de ${interaction.user}:** ${comentario}\n\n` +
        `🏷️ **| Nome:** ${nomePlano}\n` +
        `💰 **| Valor:** ${valorFormatado}\n` +
        `🛒 **| Quantidade:** 1\n` +
        `💵 **| Total:** ${valorFormatado}`
      )
      .setFooter({ text: `Hoje às ${getHoraAtual()}` })
      .setTimestamp();

    // Botões de estrelas decorativos
    const starsRow = new ActionRowBuilder().addComponents(
      ...Array.from({ length: 5 }, (_, i) =>
        new ButtonBuilder()
          .setCustomId(`star_display_${i}`)
          .setLabel('★')
          .setStyle(i < nota ? ButtonStyle.Success : ButtonStyle.Secondary)
          .setDisabled(true)
      )
    );

    const feedbackChannel = interaction.guild.channels.cache.get(FEEDBACK_CHANNEL_ID) || interaction.channel;

    await feedbackChannel.send({ embeds: [embed], components: [starsRow] });

    await interaction.reply({
      content: `✅ Feedback enviado com sucesso! ${estrelas}`,
      ephemeral: true
    });
  }
});

// ========================
// HELPERS
// ========================
function gerarEstrelas(nota) {
  return '⭐'.repeat(nota) + '☆'.repeat(5 - nota);
}

function getCorPorNota(nota) {
  const cores = { 1: 0xFF3333, 2: 0xFF8800, 3: 0xFFCC00, 4: 0x88DD00, 5: 0x00CC44 };
  return cores[nota] || 0x5865F2;
}

function getHoraAtual() {
  return new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
}

// ========================
// LOGIN
// ========================
client.login(TOKEN);
