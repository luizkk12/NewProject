const { SlashCommandBuilder, EmbedBuilder, MessageFlags } = require('discord.js');
const { get } = require('axios');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('planets')
        .setDescription('Veja as informações de algum planeta.')
        .addStringOption(option => 
            option.setName('planeta')
                .setDescription('Cite algum planeta.')
                .setRequired(true)
        ),

    execute: async (interaction) => {
        await interaction.deferReply(); // Adia a resposta para evitar timeout

        let planeta = interaction.options.getString('planeta').toLowerCase();
        let link = `https://api.le-systeme-solaire.net/rest/bodies/${encodeURIComponent(planeta)}`;

        try {
            let info = await get(link);
            let data = info.data;
            let luas = [];
            
            if (data.moons && data.moons.length > 0) {
                luas = data.moons.map(lua => lua.moon);
            }

            let embed = new EmbedBuilder()
                .setTitle(`**ℹ️ | Informações do corpo celestial.**`)
                .addFields(
                    { name: "🏷️ __**Nome do corpo celestial**__", value: data.englishName },
                    { name: "🌎 __**É um planeta?**__", value: data.isPlanet ? "Sim" : "Não" },
                    { name: "🧲 __**Gravidade**__", value: `${data.gravity ? `${data.gravity} m/s²` : "Desconhecida"}` },
                    { name: "__**Luas**__", value: `${luas.length > 0 ? luas.join(", ") : "Este corpo celestial não possui nenhuma lua."}` }
                )
                .setFooter({ text: `Comando executado por ${interaction.user.username}` })
                .setColor(0x3a3ca6)
                .setTimestamp();

            await interaction.followUp({ embeds: [embed] });
        } catch (err) {
            await interaction.followUp({ 
                content: `**❌ | Não achei nenhum corpo celestial chamado \`${planeta}\`. Certifique-se de escrever em inglês ou tente novamente mais tarde.**`, 
                flags: MessageFlags.Ephemeral
            });
            console.error(err);
        }
    }
};
