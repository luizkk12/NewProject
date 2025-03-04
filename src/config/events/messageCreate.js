const { EmbedBuilder, Events } = require('discord.js');
const { QuickDB } = require('quick.db');
const db = new QuickDB();

module.exports = {
    name: Events.MessageCreate,
    execute: async message => {
        let prefix = await db.get(`prefix_${message.guild.id}`) || 'S+';
        
        if (message.author.bot) return;
        if (message.content === `<@${message.client.user.id}>` || message.content === `<@!${message.client.user.id}>`) {
            const embed = new EmbedBuilder()
            .setTitle(':hi: **| Alguém me Marcou!**')
            .setDescription(`Olá <@${message.author.id}> eu me chamo **__${message.client.user.username}__**, se você quiser ver meus comandos digite: \`${prefix}help\` estou a sua disposição!
      
      > Entre no servidor de suporte clicando no botão "SSP" abaixo:`)
            .setColor('6a5acd')
            .setFooter({ text: 'Qualquer coisa é só me chamar!' })
            .setTimestamp();
            
            
            return message.reply({ embeds: [embed] });
        }
        
        if (!message.content.startsWith(prefix)) return;
        
        const args = message.content.slice(prefix.length).trim().split(/ +/g);
        const commandName = args.shift().toLowerCase();
        const clientCommand = message.client.commands.get(commandName);
        
        if (!clientCommand) return;
        
        try {
            clientCommand.execute(message, args);
        } catch (error) {
            console.error(error);
        }
    }
}
