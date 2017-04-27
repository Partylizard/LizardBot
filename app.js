const Discord = require('discord.js');
const config = require('./config.json');
const reply = require('./reply.json')
const fs = require('fs');

const bot = new Discord.Client();

function quakecon() {
  let countdown = (Date.UTC(2017, 07, 24) - Date.now());
  let quakecon = Math.floor(countdown/(1000*60*60*24));
  if (bot.user.username !== `${quakecon} days to Quakecon`) {
    bot.user.setUsername(`${quakecon} days to Quakecon`).catch(console.error);
    console.log(`Bot username changed at ${Date()}.`)
  }
};

bot.on("ready", () => {
  console.log("Connected.");
  console.log(`${Date()}`);
  quakecon();
  bot.setInterval(quakecon, 3600000);
});

bot.on("message", message => {
  if (message.author.bot) return;

  // For /o/ and \o\
  if (reply[message.content]) {
    message.channel.sendMessage(reply[message.content]).catch(console.error);
  }

  if(!message.content.startsWith(config.prefix)) return;

  let command = message.content.split(" ")[0];
  command = command.slice(config.prefix.length).toLowerCase();

  let args = message.content.split(" ").slice(1);

  let result = args.join(' ');

  if (command === "ping") {
    message.channel.sendMessage(`\`${Date.now() - message.createdTimestamp}ms\``).catch(console.error);
  }

  else if (command === "join") {
    let voiceChannel = message.member.voiceChannel;

    if (!voiceChannel || voiceChannel.type !== 'voice') {
      message.channel.sendMessage('You must be in a voice channel.').catch(console.error);
    }

    else if (message.guild.voiceConnection) {
      message.channel.sendMessage('I\'m already connected.').catch(console.error);
    }

    else {
      voiceChannel.join().then(() => {
        message.channel.sendMessage(`Joined ${voiceChannel}.`).catch(console.error);
      }).catch(console.error);
    }
  }

  else if (command === "leave") {
    let voiceChannel = message.member.voiceChannel;
    if (!voiceChannel || !voiceChannel.connection) {
      message.channel.sendMessage('I\'m not in a voice channel.');
    }

    else {
      message.channel.sendMessage(`Leaving ${voiceChannel}.`).then(() => {
        voiceChannel.leave()
      }).catch(console.error);
    }
  }

  else if (command === "play") {
    // TODO make this auto join when typing play
    if (!message.member.voiceChannel || message.member.voiceChannel.type !== 'voice') {
      message.channel.sendMessage('Type !join first.').catch(console.error);
    }
    else {
      let dispatcher;
      dispatcher = message.guild.voiceConnection.playFile(config.music);
    }
  }

  else if (command === "setstatus") {
    console.log("test");
    if (!result) {
      result = 'online';
    }
    bot.user.setStatus(`${result}`).catch(console.error);
  }

  else if (command === "setgame") {
    console.log("test");
    if (!result) {
      result = null;
    }
    bot.user.setGame(`${result}`).catch(console.error);
  }

  else if (command === "say") {
    message.channel.sendMessage(args.join(" ")).catch(console.error);
  }

  else if (command === "avatar") {
    message.reply(message.author.avatarURL).catch(console.error);
  }

  else if (command === "hello") {
    message.reply("kys nigger.").catch(console.error);
  }

  else if (command === "kys") {
    message.reply("hello friendo.").catch(console.error);
  }

  else if (command === "date") {
    message.channel.sendMessage(`${Date()}`).catch(console.error);
  }

  else if (command === "quakecon") {
    let countdown = (Date.UTC(2017, 07, 24) - Date.now());
    let days = Math.floor(countdown/(1000*60*60*24));
    let hours = Math.floor((countdown/(1000*60*60))%24);
    let minutes = Math.floor((countdown/(1000*60))%60);
    let seconds = Math.floor((countdown/1000)%60);
    message.channel.sendMessage(`${days} days ${hours} hours ${minutes} minutes and ${seconds} seconds until quakecon.`).catch(console.error);
  }

  else {
    message.channel.sendMessage("Invalid command.").catch(console.error);
  }

});


bot.login(config.token);
