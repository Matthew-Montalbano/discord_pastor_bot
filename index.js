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
    const helpMessage = 'Prefix any commands with \'+\'\n----------------------------------------------------------------------------\nrandom - Gives a random verse\npraise - Get some praise';
    message.channel.send(bold(helpMessage));
}

let praise = (message, contents) => {
    if (contents.length > 1) {
        message.channel.send(bold(`Praise ${contents[1]}!`));
    } else {
        message.channel.send(bold(`Praise ${message.author}!`));
    }
}

let condemn = (message, contents) => {
    message.channel.send(bold(`I condemn ${contents[1]} to hell!`));
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
                //'+condemn': condemn
                }


bot.on('message', (message) => {
    let contents = message.content.split(" ");
    let command = contents[0]
    if (commands.hasOwnProperty(command)) {
        commands[command](message, contents);
    }
});

bot.login('NzI1MDI0NTE1MzMxMTk0OTEw.XvI3lA.XrRdPMgVBsiVZR1GzYN_gy-TUMk');