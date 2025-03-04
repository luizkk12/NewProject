const { EmbedBuilder } = require('discord.js');

module.exports = {
    data: {
    name: "ping",
    description: "Mostra a latência do bot."
},
    async execute(message, args) {
    let embed = new EmbedBuilder()
   .setColor('#FF0000')
   .setTitle('🏓 **| Pong!**')
    .setDescription(`A minha latência atual é: **__${message.client.ws.ping}__ms**`)
    
    message.reply({ embeds: [embed] })
}
};
