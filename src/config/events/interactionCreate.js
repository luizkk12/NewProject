const { Events, MessageFlags } = require('discord.js');

module.exports = {
    name: Events.InteractionCreate,
    execute: async interaction => {
        if (interaction.isChatInputCommand()) {
            let clientCommand = interaction.client.slashCommands.get(interaction.commandName);
            
            if (!clientCommand) return;
            
            try {
                clientCommand.execute(interaction);
            } catch (error) {
                if (interaction.replied || interaction.deferred) {
                    await interaction.followUp({ content: `❌ | Algo deu errado!`, flags: MessageFlags.Ephemeral });
                } else {
                    await interaction.reply({ content: `❌ | Algo deu errado!`, flags: MessageFlags.Ephemeral });
                }
                
                console.error(error);
            }
        }
    }
}
