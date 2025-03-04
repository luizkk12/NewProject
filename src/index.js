const NewProject = require('./NewProject.js');
const client = new NewProject();

client.setup();
client.loadEvents();
client.start();
