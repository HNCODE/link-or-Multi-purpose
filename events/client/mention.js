module.exports = async (message, client) => {
  if (message.author.bot) return;
  if (!message.guild) return;
  if (!message.guild.me.permissionsIn(message.channel).has("SEND_MESSAGES"))
    return;

  const { PREFIX } = require("../../config.json")  
    client.prefix = PREFIX;

  // mentioned bot
  if (message.content ===`<@!${client.user.id}>` || message.content === `<@${client.user.id}>`) {
    return message.channel.send(
      `이 서버의 접두사는 \`${PREFIX}\`입니다. \n\n명령 목록을 가져오려면 \`${PREFIX}help\`를 입력하십시오.`
    );
  }
};
