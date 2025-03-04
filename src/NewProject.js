const Discord = require('discord.js');
const Database = require('quick.db');
const fs = require('node:fs');
const path = require('node:path');
const db = new Database.QuickDB();

class NewProject {
  constructor() {
    this.token = require('./config/config.json').token;
    this.intents = Object.values(Discord.GatewayIntentBits);
    this.client = new Discord.Client({ intents: this.intents });
  }
  
  setup() {
    this.client.once(Discord.Events.ClientReady, async (bot) => {
      await this.loadCommands();	
      await this.loadSlashCommands();
   
      console.log(`[✅ BOT ONLINE] Estou online!\n[😎 ATIVO] Estou em ${bot.guilds.cache.size} servidores!\n[🙂 DISPOSTO] Estou ajudando ${bot.users.cache.filter(user => !user.bot).size} usuários.`);
     
      let index = 0;
      let activities = [
        `😎 Estou em ${bot.guilds.cache.size} servidores!`,
        `😆 Estou ajudando ${bot.users.cache.filter(user => !user.bot).size} usuários!`,
        `💻 Sabia que eu sou programado em Node.js, usando a biblioteca discord.js?`
      ];
     
      setInterval(() => {
        bot.user.setActivity(activities[index], { type: Discord.ActivityType.Playing });
        index = (index + 1) % activities.length;  
      }, 15_000);
    });
  }
  
  loadCommands() {
    this.client.commands = new Discord.Collection();
    
    const folder = path.join(__dirname, 'commands');
    const folders = fs.readdirSync(folder);
    
    for (const f of folders) {
      const folderAgain = path.join(folder, f);
      const files = fs.readdirSync(folderAgain).filter(file => file.endsWith('.js'));
      
      for (const file of files) {
        const cmd = path.join(folderAgain, file);
        const command = require(cmd);
        
        if ('data' in command && 'execute' in command) {
          this.client.commands.set(command.data.name, command);
        } else {
          console.log(`[⚠️ AVISO] O comando '${file}' não há uma propriedade 'data' ou 'execute'.`);
        }
      }
    }
  }
  
  async loadSlashCommands() {
    this.client.slashCommands = new Discord.Collection();
    const slashCommands = [];
    
    const slashFolder = path.join(__dirname, 'slashCommands');
    const slashFolders = fs.readdirSync(slashFolder);
    
    for (const folder of slashFolders) {
      const slashFolderAgain = path.join(slashFolder, folder);
      const slashFiles = fs.readdirSync(slashFolderAgain).filter(slash => slash.endsWith('.js'));
      
      for (const file of slashFiles) {
        const slashcmd = path.join(slashFolderAgain, file);
        const slashCommand = require(slashcmd);
        
        if ('data' in slashCommand && 'execute' in slashCommand) {
          slashCommands.push(slashCommand.data.toJSON());
          this.client.slashCommands.set(slashCommand.data.name, slashCommand);
        }
      }
    }
    
    try {
      console.log('🔄 Registrando comandos de barra (/)...');	
    
      const rest = new Discord.REST().setToken(this.token);
      
      const data = await rest.put(Discord.Routes.applicationCommands(this.client.user.id), { body: slashCommands });
      
      console.log(`✅ Foram carregados ${data.length} comandos de barra (/) com sucesso.`);
    } catch (err) {
      console.error(err);
    }
  }
  
  loadEvents() {
    const eventsFolder = path.join(__dirname, 'config/events');
    const files = fs.readdirSync(eventsFolder).filter(event => event.endsWith('.js'));
    
    for (const file of files) {
      const ev = path.join(eventsFolder, file);
      const event = require(ev);
      
      if (event.once) {
        this.client.once(event.name, (...args) => event.execute(...args));
      } else {
        this.client.on(event.name, (...args) => event.execute(...args));
      }
    }
  }
  
  start() {
    this.client.login(this.token);
  }
}

module.exports = NewProject;
