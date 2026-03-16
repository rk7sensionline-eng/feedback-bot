require('dotenv').config();
const { REST, Routes, SlashCommandBuilder } = require('discord.js');

const TOKEN = process.env.DISCORD_TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;
const GUILD_ID = process.env.GUILD_ID; // Opcional: para registrar só no seu servidor (mais rápido)

const commands = [
  new SlashCommandBuilder()
    .setName('feedback-setup')
    .setDescription('📋 Envia a mensagem de feedback no canal atual')
    .setDefaultMemberPermissions('8') // Apenas admins
    .toJSON()
];

const rest = new REST({ version: '10' }).setToken(TOKEN);

(async () => {
  try {
    console.log('⏳ Registrando comandos...');

    // Use GUILD_ID para testar (instantâneo) ou remova para global (pode demorar até 1h)
    if (GUILD_ID) {
      await rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), { body: commands });
      console.log('✅ Comandos registrados no servidor!');
    } else {
      await rest.put(Routes.applicationCommands(CLIENT_ID), { body: commands });
      console.log('✅ Comandos registrados globalmente!');
    }
  } catch (err) {
    console.error('❌ Erro ao registrar comandos:', err);
  }
})();
