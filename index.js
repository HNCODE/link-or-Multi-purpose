const fs = require("fs");
const chalk = require("chalk");

const { Client, Intents, Collection, MessageEmbed } = require("discord.js");
const { loadCommands } = require("./handler/loadCommands");
const { loadSlashCommands } = require("./handler/loadSlashCommands");
const { loadEvents } = require("./handler/loadEvents");
const { checkValid } = require("./functions/validation/checkValid");
const Embeds = require("./functions/embeds/Embeds");
const Logger = require("./functions/Logger/Logger");
const Util = require("./functions/util/Util");
const config = require("./config.json");


const client = new Client({
    allowedMentions: {parse: ["roles", "users"],},
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_MEMBERS,
        Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
        Intents.FLAGS.GUILD_WEBHOOKS,
        Intents.FLAGS.GUILD_VOICE_STATES,
        Intents.FLAGS.GUILD_INVITES,
        Intents.FLAGS.GUILD_BANS,
        Intents.FLAGS.GUILD_PRESENCES,
      ],
});

client.commands = new Collection();
client.slash = new Collection();
client.cooldowns = new Collection();
client.aliases = new Collection();
client.categories = fs.readdirSync("./src/SlashCommands/");
client.logger = Logger;
client.say = Embeds;
client.utils = Util;

loadCommands(client);
loadSlashCommands(client);
loadEvents(client);
checkValid();

client.login(config.TOKEN).then(() => {
    console.log(
      chalk.bgBlueBright.black(
        `[READY]: 봇 로그인 성공: ${client.user.tag}`
      )
    );
  });

  client.on("ready", () => {
    require("./link/index.js")(client);
    // require("./linkFile/index.js")(client);
  })
