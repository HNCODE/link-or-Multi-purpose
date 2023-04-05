const { MessageEmbed } = require('discord.js');
const channelData = require("../../database/guildData/channelupdates")

module.exports = async(thread) => {
    const data = await channelData.findOne({
        GuildID: thread.guild.id
    })

    if (!data) return;

    const embed = new MessageEmbed()
    .setTitle('스레드 제거')
    .setDescription(`
스레드 이름: ${thread.name}
스레드 ID: ${thread.id}
스레드 주인: <@!${thread.ownerId}>
스레드 참가 인원수: ${thread.memberCount}
메세지 양: ${thread.messages.cache.size}
Parent Channel: ${thread.parent.name}`)
    .setColor("RED")
    .setTimestamp()

    thread.guild.channels.cache.get(data.ChannelID).send({ embeds: [embed] })
}