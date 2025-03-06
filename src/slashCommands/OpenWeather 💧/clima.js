const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('clima')
    .setDescription('Veja o clima de cidades/estados e países! ☀️')
    .addStringOption(option => option.setName('cidade')
    .setDescription('Nome da cidade/estado')
    .setRequired(true) 
    ),
    async execute(interaction) {
        const apiKey = '18498f3dc51bc519387ace5b590ea665';
        const cidade = interaction.options.getString('cidade');
      try {
          const url = `https://api.openweathermap.org/data/2.5/weather?q=${cidade}&appid=${apiKey}&lang=pt_br&units=metric`;
   const response = await axios.get(url);
   const data = response.data;
   const embed = new EmbedBuilder()
   .setTitle(`☁️ **| Clima em ${data.name}, ${data.sys.country}**`)
   .setColor('Blue')
   .addFields({
   name: '🌡 Temperatura', value: `${data.main.temp}°C`, inline: true },
   {
   name: '🌡 Sensação Térmica', value: `${data.main.feels_like}°C`, inline: true },
   {
   name: '💧 Umidade', value: `${data.main.humidity}%`, inline: true },
   {
   name: '🌬 Vento', value: `${data.wind.speed} m/s`, inline: true },
   {
   name: '🌥 Condição', value: data.weather[0].description, inline: true }
   )
               .setThumbnail(`https://openweathermap.org/img/wn/${data.weather[0].icon}.png`)
        .setFooter({ text: 'Fonte: Open Weather' });
        
        await interaction.reply({ embeds: [embed] }); 
    
     } catch (error) {
         console.error(error);
await interaction.reply({ content: '❌️ Cidade não encontrada ou erro na API.', ephemeral: true }) ;
     } 
   }
};
