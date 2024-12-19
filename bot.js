const { Client, GatewayIntentBits } = require('discord.js');

// Create a new client instance with the necessary intents
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,  // Enables access to member events like nickname changes
    GatewayIntentBits.MessageContent, // Allows reading message content (important for bot commands)
  ],
});

// When the bot is ready
client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

// Command to set the nickname
client.on('messageCreate', async (message) => {
  // Log incoming messages for debugging
  console.log('Received message:', message.content);

  // Check if the message is a command and if the bot should respond
  if (message.content === '!setname' && message.guild) {
    console.log('Received !setname command');  // Debug: command detected

    try {
      // Send a message asking for the user's first name
      await message.channel.send('What is your first name?');
      console.log('Sent prompt for first name');  // Debug: sent prompt for first name

      // Wait for a response
      const filter = (response) => response.author.id === message.author.id;
      const collected = await message.channel.awaitMessages({
        filter,
        max: 1,
        time: 60000, // 60 seconds timeout
        errors: ['time'],
      });

      if (collected.size > 0) {
        const firstName = collected.first().content;
        const discordUsername = message.author.username;
        const newNickname = `${firstName} | ${discordUsername}`;

        // Try to change the user's nickname
        try {
          console.log(`Attempting to change nickname to: ${newNickname}`);
          await message.member.setNickname(newNickname);
          await message.channel.send(`Your nickname has been changed to: ${newNickname}`);
          console.log(`Successfully changed nickname to: ${newNickname}`);
        } catch (error) {
          console.error('Error changing nickname:', error);
          await message.channel.send('I do not have permission to change your nickname.');
        }
      } else {
        await message.channel.send('You took too long to respond! Please try again.');
      }
    } catch (error) {
      console.error('Error during nickname change process:', error);
      await message.channel.send('Something went wrong while asking for your first name.');
    }
  }
});

// Log in using your bot token
client.login('');
