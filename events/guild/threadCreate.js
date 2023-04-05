const { MessageEmbed } = require('discord.js');
const channelData = require("../../database/guildData/channelupdates")

module.exports = async(thread) => {
    const data = await channelData.findOne({
        GuildID: thread.guild.id
    })

    if (!data) return;

    const embed = new MessageEmbed()
    .setTitle('스레드 생성')
    .setDescription(`
스레드 이름: ${thread.name}
스레드 ID: ${thread.id}
스레드 생성자: ${thread.guild.members.cache.get(thread.ownerId)}
Parent Channel: ${thread.parent.name}`)
    .setColor("GREEN")
    .setTimestamp()

    thread.guild.channels.cache.get(data.ChannelID).send({ embeds: [embed] })
}
