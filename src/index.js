'use strict';

const fs = require('fs');
const answers = require('./answers.js');
const getRandom = require("./getRandomElement.js");
const APIRequest = require("./APIRequests.js");


const { Client, GatewayIntentBits, Partials, Collection } = require('discord.js');
const { Player } = require('discord-player');
const express = require('express');
require('console-stamp')(console, { format: ':date(yyyy/mm/dd HH:MM:ss)' });

const registerPlayerEvents = require(`${__dirname}/events/discord-player/player`);
const cst = require(`${__dirname}/utils/constants`);


const ENV = process.env;


let client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildVoiceStates,
    ],
    partials: [Partials.Channel],
    disableMentions: 'everyone',
});

client.config = cst.config;
client.commands = new Collection();
client.player = new Player(client, {
    autoRegisterExtractor: false,
    ytdlOptions: cst.ytdlOptions
});


const player = client.player;




const setEnvironment = () => {
    return new Promise((resolve, reject) => {
        client.config.name = typeof (ENV.BOT_NAME) === 'undefined'
            ? client.config.name
            : ENV.BOT_NAME;

        client.config.prefix = typeof (ENV.PREFIX) === 'undefined'
            ? client.config.prefix
            : ENV.PREFIX;

        client.config.playing = typeof (ENV.PLAYING) === 'undefined'
            ? client.config.playing
            : ENV.PLAYING;

        client.config.defaultVolume = typeof (ENV.DEFAULT_VOLUME) === 'undefined'
            ? client.config.defaultVolume
            : Number(ENV.DEFAULT_VOLUME);

        client.config.maxVolume = typeof (ENV.MAX_VOLUME) === 'undefined'
            ? client.config.maxVolume
            : Number(ENV.MAX_VOLUME);

        client.config.autoLeave = typeof (ENV.AUTO_LEAVE) === 'undefined'
            ? client.config.autoLeave
            : (String(ENV.AUTO_LEAVE) === 'true' ? true : false);

        client.config.autoLeaveCooldown = typeof (ENV.AUTO_LEAVE_COOLDOWN) === 'undefined'
            ? client.config.autoLeaveCooldown
            : Number(ENV.AUTO_LEAVE_COOLDOWN);

        client.config.displayVoiceState = typeof (ENV.DISPLAY_VOICE_STATE) === 'undefined'
            ? client.config.displayVoiceState
            : (String(ENV.DISPLAY_VOICE_STATE) === 'true' ? true : false);

        client.config.port = typeof (ENV.PORT) === 'undefined'
            ? client.config.port
            : Number(ENV.PORT);

        client.config.textQuery = typeof (ENV.TEXT_QUERY_TYPE) === 'undefined'
            ? client.config.textQuery
            : ENV.TEXT_QUERY_TYPE

        client.config.urlQuery = typeof (ENV.URL_QUERY_TYPE) === 'undefined'
            ? client.config.urlQuery
            : ENV.URL_QUERY_TYPE;

        //console.log('setEnvironment: ', client.config);
        resolve();
    });
}


const loadFramework = () => {
    console.log(`-> loading Web Framework ......`);
    return new Promise((resolve, reject) => {
        const app = express();
        const port = client.config.port || 33333;

        app.get('/', function (req, res) {
            res.send('200 ok.')
        });

        app.listen(port, function () {
            console.log(`Server start listening port on ${port}`);
            resolve();
        });
    })
}


const loadEvents = () => {
    console.log(`-> loading Events ......`);
    return new Promise((resolve, reject) => {
        const files = fs.readdirSync(`${__dirname}/events/`).filter(file => file.endsWith('.js'));

        console.log(`+--------------------------------+`);
        for (const file of files) {
            try {
                const event = require(`${__dirname}/events/${file}`);
                console.log(`| Loaded event ${file.split('.')[0].padEnd(17, ' ')} |`);

                client.on(file.split('.')[0], event.bind(null, client));
                delete require.cache[require.resolve(`${__dirname}/events/${file}`)];
            } catch (error) {
                reject(error);
            }
        };
        console.log(`+--------------------------------+`);
        console.log(`${cst.color.grey}-- loading Events finished --${cst.color.white}`);
        resolve();
    })
}

const loadPlayer = () => {
    return new Promise(async (resolve, reject) => {
        try {
            await player.extractors.loadDefault();
            registerPlayerEvents(player, client);
        } catch (error) {
            reject(error);
        }
        console.log('-> loading Player Events finished');
        resolve();
    })
}


const loadCommands = () => {
    console.log(`-> loading Commands ......`);
    return new Promise((resolve, reject) => {
        const files = fs.readdirSync(`${__dirname}/commands/`).filter(file => file.endsWith('.js'));

        console.log(`+---------------------------+`);
        for (const file of files) {
            try {
                const command = require(`${__dirname}/commands/${file}`);

                console.log(`| Loaded Command ${command.name.toLowerCase().padEnd(10, ' ')} |`);

                client.commands.set(command.name.toLowerCase(), command);
                delete require.cache[require.resolve(`${__dirname}/commands/${file}`)];
            } catch (error) {
                reject(error);
            }
        };
        console.log(`+---------------------------+`);
        console.log(`${cst.color.grey}-- loading Commands finished --${cst.color.white}`);
        resolve();
    })
}



process.on('unhandledRejection', error => {
    console.error('Unhandled promise rejection:', error);
});



const HuyID = "176217107724369920";





// Translate string
// async function translateString(string){
//   try{
//     let dich
//     fetch("https://translate.googleapis.com/translate_a/single?client=gtx&sl="+ "en" + "&tl=" + "vi" + "&dt=t&q=" + encodeURI(string))
//     .then(res => res.json())
//     .then(re => {dich = re[0][0][0]})
//     return dich
//   }
//   catch(error){
//     console.log(error);
//     return 'Error getting quote.';
//   }
// }



client.on('messageCreate', async function(msg){
  if (msg.content.toLowerCase().includes("xinh quá")) {
    if (msg.author.id.toString() === HuyID){
      msg.reply(getRandom(answers.traLoiKhenCuaHuy));
    }
    else{
      msg.reply(getRandom(answers.traLoiKhen));
    }
  }
  // Tra Loi goi
  if (msg.content.toLowerCase().includes("ơi!!")){
    if (msg.author.id.toString() === HuyID){
      msg.reply(getRandom(answers.traLoiGoiHuy));
    }
    else{
      msg.reply(getRandom(answers.traLoiGoi));
    }
  }

  if (msg.content.toLowerCase().includes("yếu đuối")){
    let originalString
    await APIRequest.getZenQuote().then(quote => {
      originalString = quote
    })
    
    
    fetch("https://translate.googleapis.com/translate_a/single?client=gtx&sl="+ "en" + "&tl=" + "vi" + "&dt=t&q=" + encodeURI(originalString))
    .then(res => res.json())
    .then(re => {msg.reply(getRandom(answers.quotesPrefixes) + re[0][0][0])})
    
  }

  // Loi khuyen
  if (msg.content.toLowerCase().includes("lời khuyên")){
    let originalString
    await APIRequest.getAffirmation().then(quote => {
      originalString = quote
    })

    fetch("https://translate.googleapis.com/translate_a/single?client=gtx&sl="+ "en" + "&tl=" + "vi" + "&dt=t&q=" + encodeURI(originalString))
    .then(res => res.json())
    .then(re => {msg.reply(getRandom(answers.quotesPrefixes) + re[0][0][0])})
  }
});


// Greet when first join server
client.on('guildCreate', guild => {
    const channel = guild.channels.cache.find(channel => channel.type === 'GUILD_TEXT' && channel.permissionsFor(guild.me).has('SEND_MESSAGES'))
    channel.send("Xin chào các bạn, mình là Châu Khánh. Rất vui được làm quen!😚😚😚")
})



// Login the bot
Promise.resolve()
    .then(() => setEnvironment())
    .then(() => loadFramework())
    .then(() => loadEvents())
    .then(() => loadPlayer())
    .then(() => loadCommands())
    .then(() => {
        console.log(`${cst.color.green}*** All loaded successfully ***${cst.color.white}`);
        client.login(ENV.TOKEN);
    });
