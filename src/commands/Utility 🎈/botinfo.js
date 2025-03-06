const { EmbedBuilder } = require('discord.js');
const { dependencies } = require('../../../package.json');

module.exports = {
    data: {
        name: 'botinfo',
        description: 'Veja as informações do bot.',
        usage: 'botinfo',
        category: 'Utilidades'
    },
    
    execute: async (message, args) => {
        let tag = message.client.user.tag;
        let id = message.client.user.id;
        let donosId = ['983856696399134751', '1312423682907312150'];
        let servidores = message.client.guilds.cache.size;
        let membros = message.client.users.cache.filter(user => !user.bot).size;
        let pronto = Math.trunc(message.client.readyTimestamp / 1000);
        let donos = donosId.map(id => `${message.client.users.cache.get(id).username} (${id})`);
        let comandos = message.client.commands.size;
        let slashCommands = message.client.slashCommands.size;
        let versaoDjs = dependencies['discord.js'];
        
        let embed = new EmbedBuilder()
        .setTitle(`**ℹ️ | Minhas informações.**`)
        .addFields(
            {
                name: "**#️⃣ | Minha tag e ID**", value: `${tag} (${id})`
            },
            {
                name: "**👑 Meus criadores**", value: `${donos.join(", ")}`
            },
            {
                name: "**😎 Quantidade de servidores que estou presente**", value: `${servidores}`
            },
            {
                name: "**📺 Quantidade de usuários que estou assistindo**", value: `${membros}`
            },
            {
                name: "**⚙️ Quantidade de comandos**", value: `${comandos}`
            },
            {
                name: "**🍫 Quantidade de comandos de barra (/)**", value: `${slashCommands}`
            },
            {
                name: "**🟢 Estou online desde**", value: `<t:${pronto}:F> (<t:${pronto}:R>)`
            },
            {
                name: "**🔰 Versão do Node.js**", value: `${process.version}`
            },
            {
                name: "**💻 Versão do Discord.js**", value: `${versaoDjs.replace('^', 'v')}`
            }
        )
        .setFooter({ text: `Comando executado por ${message.author.username}` })
        .setColor(0x34b4eb)
        .setTimestamp();
        
        await message.reply({ embeds: [embed] });
    }
}
