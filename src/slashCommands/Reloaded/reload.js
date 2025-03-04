const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('reloadall')
        .setDescription('Recarrega todos os comandos do bot'),

    async execute(interaction) {
        const commandFiles = fs.readdirSync(path.join(__dirname)).filter(file => file.endsWith('.js'));

        try {
            for (const file of commandFiles) {
                delete require.cache[require.resolve(`./${file}`)];
                const newCommand = require(`./${file}`);
                interaction.client.commands.set(newCommand.data.name, newCommand);
            }

            await interaction.reply('✅ Todos os comandos foram recarregados com sucesso!');
        } catch (error) {
            console.error(error);
            await interaction.reply('❌ Erro ao recarregar os comandos.');
        }
    }
};
