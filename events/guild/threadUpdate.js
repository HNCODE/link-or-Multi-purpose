const { MessageEmbed } = require('discord.js')
const channelData = require('../../database/guildData/channelupdates')

module.exports = async(oldThread, newThread) => {
    const data = await channelData.findOne({
        GuildID: newThread.guild.id,
    })
    if (!data) return;

    if (oldThread.name !== newThread.name) {
        const nameEmbed = new MessageEmbed()
        .setTitle(`${oldThread.name}`)
        .addField("스레드 이름 변경",`${oldThread.name} => ${newThread.name}`, true)
        .setColor("GREEN")
        .setTimestamp()

        newThread.guild.channels.cache.get(data.ChannelID).send({embeds: [nameEmbed]})

    } else if (oldThread.rateLimitPerUser !== newThread.rateLimitPerUser) {
        let rateLmitEmbed = new MessageEmbed()
        .setTitle(`${oldThread.name}`)
        .addField("스레드 Slowmode 업데이트",`${oldThread.rateLimitPerUser} => ${newThread.rateLimitPerUser}`)
        .setColor("GREEN")
        .setTimestamp()

        newThread.guild.channels.cache.get(data.ChannelID).send({embeds: [rateLmitEmbed]})
    } else if (oldThread.archived !== newThread.archived) {
        let archivedEmbed = new MessageEmbed()
        .setTitle(`${oldThread.name}`)
        .addField("스레드 보관 여부",`${oldThread.archived ? "Yes" : "No"} => ${newThread.archived ? "Yes" : "No"}`)
        .setColor("GREEN")
        .setTimestamp()

        newThread.guild.channels.cache.get(data.ChannelID).send({embeds: [archivedEmbed]})
    }

}