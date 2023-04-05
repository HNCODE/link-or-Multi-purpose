const { MessageEmbed, MessageActionRow, MessageButton} = require("discord.js");
const { owner } = require('../../../config.json');
module.exports = {
  name: "티켓셋업",
  description: "티켓 셋업 - 채널에 티켓 버튼을 생성합니다.",
  category: "ticket",
  userPerms: ["MANAGE_GUILD"],
  options: [
    {
        name: '채널',
        description: '패널을 생성할 채널을 입력해주세요.',
        type: 'CHANNEL',
        required: true
    },
],
run: async (client, interaction, args) => {
    const guild = interaction.guild;
    const channel = interaction.options.getChannel('채널')

    let helpMenu = new MessageActionRow()
    .addComponents(
        new MessageButton()
        .setCustomId('t-player')
        .setLabel('티켓')
        .setEmoji('<:report:1006582144019218592>')
        .setStyle('SUCCESS'),
    )
    .addComponents(
        new MessageButton()
        .setCustomId('t-bug')
        .setLabel('버그')
        .setEmoji('<:6619discordbug:1006578999453028482>')
        .setStyle('SUCCESS'),
    )
    .addComponents(
        new MessageButton()
        .setCustomId('t-feed')
        .setLabel('피드백')
        .setEmoji('<:boost:1006581493465886822>')
        .setStyle('SUCCESS'),
    )
    .addComponents(
        new MessageButton()
        .setCustomId('t-staff')
        .setLabel('관리자')
        .setEmoji('<:4443discordstaff:1006578997892755556>')
        .setStyle('DANGER'),
    )
    .addComponents(
        new MessageButton()
        .setCustomId('t-other')
        .setLabel('그 외')
        .setEmoji('<:qa:1006580622002757692>')
        .setStyle('SECONDARY'),
        )


    let helpEmbed = new MessageEmbed()
    .setColor('BLUE')
    .setTitle('🎫 티켓 생성')
    .setDescription(
        "__**티켓 생성하는 방법!**__\n" +
        "> 아래 버튼을 클릭하여 생성해주세요!\n" +
        "> 티켓이 만들어지면 필요한 도움을 받을 수 있습니다.\n" +
        "> 신중하게 생성해주세요. 이유 없이 생성시에 이용금지 당할 수 있습니다.\n\n"+
        `> 티켓은 ${interaction.guild.name} 서버와 관련된 사항으로 생성해주세요.\n`+
        "> 봇 개발 관련 질문하는 곳이 아닙니다."
    )
    interaction.reply({
        custom: true,
        content: '성공적으로 패널을 생성했습니다.',
        ephemeral: true,
    })
    channel.send({ embeds: [helpEmbed], components: [helpMenu]})
  }
};
