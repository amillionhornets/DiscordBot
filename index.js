const { Client, GatewayIntentBits } = require('discord.js');
const readline = require('readline');

// Create a new client instance with the necessary intents
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.MessageContent,
  ],
});

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// When the bot is ready
client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

// Command to set the nickname
client.on('messageCreate', async (message) => {
  if (message.content === '!setname' && message.guild) {
    // Ask the user for their first name
    await message.channel.send('What is your first name?');

    // Wait for a response
    const filter = (response) => response.author.id === message.author.id;
    const collected = await message.channel.awaitMessages({
      filter,
      max: 1,
      time: 60000,
      errors: ['time'],
    });

    if (collected.size > 0) {
      const firstName = collected.first().content;
      const discordUsername = message.author.username;
      const newNickname = `${firstName} | ${discordUsername}`;

      try {
        // Try to change the user's nickname
        await message.member.setNickname(newNickname);
        await message.channel.send(`Your nickname has been changed to: ${newNickname}`);
      } catch (error) {
        console.error('Error changing nickname:', error);
        await message.channel.send('I do not have permission to change your nickname.');
      }
    } else {
      await message.channel.send('You took too long to respond! Please try again.');
    }
  }
});

// Log in using your bot token
client.login('');
