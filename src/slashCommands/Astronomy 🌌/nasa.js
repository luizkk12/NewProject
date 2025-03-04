const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');
const { translate } = require('@vitalets/google-translate-api');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('nasa')
        .setDescription('Mostra a Foto do Dia da NASA em português 🛰️'),
    
    async execute(interaction) {
        try {
            const response = await axios.get(`https://api.nasa.gov/planetary/apod?api_key=${process.env.NASA_API_KEY}`);

            const { title, explanation, url, hdurl, date } = response.data;

            // Traduzindo título e explicação para PT-BR
            const translatedTitle = await translate(title, { to: 'pt' });
            const translatedExplanation = await translate(explanation, { to: 'pt' });

            const embed = new EmbedBuilder()
                .setColor(0x1E90FF)
                .setTitle(`📸 ${translatedTitle.text}`)
                .setURL(hdurl || url)
                .setDescription(`${translatedExplanation.text}`)
                .setImage(url)
                .setFooter({ text: `📅 Data: ${date} | Fonte: NASA` });

            await interaction.reply({ embeds: [embed] });

        } catch (error) {
            console.error(error);
            await interaction.reply('🚀 Ocorreu um erro ao buscar os dados da NASA. Tente novamente mais tarde.');
        }
    }
};
