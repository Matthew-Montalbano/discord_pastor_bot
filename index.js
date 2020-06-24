const Discord = require('discord.js');
const fs = require('fs');
const bot = new Discord.Client();


let bold = (message) => {
    return "**" + message + "**";
}

let random = (message, contents) => {
    let verseNum = Math.floor(Math.random() * verses.length);
    let verse = verses[verseNum];
    let array = verse.split('|');
    verse = bold(array[0] + " " + array[1] + ":" + array[2] + "\n" + array[3].substring(1, array[3].length - 2));
    message.channel.send(verse);
}

let help = (message, contents) => {
    const helpEmbed = new Discord.MessageEmbed()
        .setColor('#f60930')
        .setTitle('Help')
        .setDescription('Prefix any commands with \'+\'')
        .addField(bold(':book: random'), 'Gives a random verse')
        .addField(bold(':raised_hands: praise'), 'Get some praise');
    message.channel.send(helpEmbed);
}

let praise = (message, contents) => {
    let target = null;
    target = (contents.length > 1) ? contents[1] : message.author;
    message.channel.send(bold(`Praise ${target}! Hallelujah!`));
}

let getOnlineUsers = () => {
    let users = bot.users.cache;
    let keys = Array.from(users.keys());
    let online = []
    for (let i = 0; i < keys.length; i++) {
        let user = users.get(keys[i]);
        if (user.presence.status == 'online' && user.bot == false) {
            online.push(user);
        }
    }
    return online;
}

let bless = (message, contents) => {
    let onlineUsers = getOnlineUsers();
    let blessString = "**10AM Students of the Lord...**\n";
    for (let i = 0; i < onlineUsers.length; i++) {
        blessString += `${onlineUsers[i]}, you have been *blessed* ! :pray:\n`
    }
    message.channel.send(blessString);
}


let getAvailableVerses = () => {
    const books = ['Genesis', 'Leviticus', 'Revelations', 'Exodus', 'Samuel 1', 'Samuel 2', 'Job', 'John', 'Matthew', 'Numbers', 'Deuteronomy', 'Kings 1', 'Kings 2', 'Psalms', 'Ezekial'];
    verses = [];
    fs.readFile('verses.txt', 'utf8', (err, data) => {
        if (err) {
            return console.log(err);
        }
        let allVerses = data.split('\n');
        for (let i = 0; i < allVerses.length; i++) {
            if (books.includes(allVerses[i].split('|')[0])) {
                verses.push(allVerses[i]);
            }
        }
    });
    return verses;
}

var verses = getAvailableVerses();
let commands = {'+random': random,
                '+help': help,
                '+praise': praise,
                '+bless': bless
                }


bot.on('message', (message) => {
    let contents = message.content.split(" ");
    let command = contents[0]
    if (commands.hasOwnProperty(command)) {
        commands[command](message, contents);
    }
});

let getCredentials = () => {
    return fs.readFileSync('credentials.txt', 'utf8');
}

bot.login(getCredentials());