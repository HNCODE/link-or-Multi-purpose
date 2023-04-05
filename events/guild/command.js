const prefixModel = require("../../database/guildData/prefix");
const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const { owner } = require('../../config.json')
const config = require('../../config.json')
const { Collection } = require("discord.js")
module.exports = async (message, cooldowns) => {

  let client = message.client;

  const prefixData = await prefixModel.findOne({
    GuildID: message.guild.id,
  }).catch(err=>console.log(err))

  if (prefixData) {
    var PREFIX = prefixData.Prefix
  } else if (!prefixData) {
    PREFIX = config.PREFIX
  }

  client.prefix = PREFIX;

  if (message.author.bot) return;


  if (!message.guild.me.permissionsIn(message.channel).has("SEND_MESSAGES"))
    return;

  const prefixRegex = new RegExp(
    `^(<@!?${client.user.id}>|${escapeRegex(PREFIX)})\\s*`
  );
  if (!prefixRegex.test(message.content)) return;

  const [, matchedPrefix] = message.content.match(prefixRegex);

  const p = matchedPrefix.length;
  const args = message.content.slice(p).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();

  const command =
    client.commands.get(commandName) ||
    client.commands.find(
      (cmd) => cmd.aliases && cmd.aliases.includes(commandName)
    );

  if (!command) return;
    //command enaled thing
    if(command.enabled === false) {
      return message.reply('이 명령은 사용할 수 없습니다!')
    }
    // ownerOnly thing
    if(command.ownerOnly === true) {
      if(!message.author.id === owner) {
        return message.reply('이 명령은 서버 소유자만 가능합니다!')
      }
    }
    // user permissions handler
  if (!message.member.permissions.has(command.userPerms || [])) {
    if(command.userPermError === null || command.userPermError === undefined) {
      return message.reply(`해당 명령어를 사용하려면 \`${command.userPerms}\` 권한이 필요합니다.`);
    } else {
      return message.reply(command.userPermError)
    }
  }


  // bot permissions handler
  if (!message.guild.me.permissions.has(command.botPerms || [])) {
  if(command.botPermError === null || command.botPermError === undefined) {
    return message.reply(
      `이 명령을 올바르게 실행하려면 \`${command.botPerms}\`권한이 필요합니다.`
    );
 } else {
    return message.reply(command.botPermError)
  }
  }
      //guildOnly thing
  if(command.guildOnly === true) {
    console.log(message.channel.type)
    if(message.channel.type === 'DM' || message.channel.type === 'GROUP_DM') {
      return message.reply('이 명령은 서버 전용입니다!')
    }
  }

  //min args and max args thing
  const arguments = message.content.split(/[ ]+/)

        arguments.shift()
        if (
          arguments.length < command.minArgs ||
          (command.maxArgs !== null && arguments.length > command.maxArgs)
        ) {
          return message.reply(command.expectedArgs)
          
        }

  // cooldowns
  if (!cooldowns.has(command.name)) {
    cooldowns.set(command.name, new Collection());
  }

  const now = Date.now();
  const timestamps = cooldowns.get(command.name);
  const cooldownAmount = (command.cooldown || 1) * 1000;

  if (timestamps.has(message.author.id)) {
    const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

    if (now < expirationTime) {
      const timeLeft = (expirationTime - now) / 1000;
      return message.reply(
        `${timeLeft.toFixed(
          1
        )} 정도 대기 후 \`${command.name}\` 를 사용해주세요!`
      );
    }
  }

  timestamps.set(message.author.id, now);
  setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

  try {
    command.run(client, message, args, p, cooldowns);
  } catch (error) {
    console.error(error);
    let embed2000 = new MessageEmbed()
      .setDescription("해당 명령을 실행하는 동안 오류가 발생했습니다.")
      .setColor("BLUE");
    message.channel.send({ embeds: [embed2000] }).catch(console.error);
  }
};
