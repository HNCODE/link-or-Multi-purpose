const prefixData = require("../../../database/guildData/prefix")

module.exports = async(interaction, client)=> {
    if (!interaction.isSelectMenu()) return;

    let msg = await interaction.channel.messages.fetch(interaction.message.id)

    if (interaction.values[0] === "prefix") {

        await interaction.deferUpdate()

        const data = await prefixData.findOne({
            GuildID: interaction.guild.id
        })

        if (!data) {
            msg.edit("새 prefix(접두사)를 보내주시기 바랍니다!")

            const filter = (m) => m.author.id === interaction.member.id

            const collector = await interaction.channel.createMessageCollector({ filter, time: 60000 })

            collector.on("collect", async(collected, returnValue)=> {
                let prefix = collected.content

                if (prefix.length >= 5) {
                    return msg.edit(`접두사는 5자 미만이어야 합니다!`)
                }

                let newData = new prefixData({
                    Prefix: prefix,
                    GuildID: interaction.guild.id
                })

                newData.save()

                await collector.stop()

                return msg.edit(`Prefix(접두사) 변경: ${prefix}!`)
            })

            collector.on('end', async(collected, reason)=> {
                console.log("Collector Stopped!")
            })
        } else if (data) {

            await msg.edit('새 prefix(접두사)를 보내주시기 바랍니다!')
            const newFilter = (m) => m.author.id === interaction.member.id

            const newCollector = await interaction.channel.createMessageCollector({ newFilter, time: 60000 })

            newCollector.on("collect", async(collected, returnValue)=> {
                let newPrefix = collected.content

                if (newPrefix.length >= 5) {
                    return msg.edit(`접두사는 5자 미만이어야 합니다!`)
                }
                await prefixData.findOneAndRemove({
                    GuildID: interaction.guild.id
                })

                let newPrefixData = new prefixData({
                    Prefix: newPrefix,
                    GuildID: interaction.guild.id,
                })

                newPrefixData.save()

                await newCollector.stop()

                return msg.edit(`Prefix(접두사) 변경: ${newPrefix}`)
            })

            newCollector.on('end', async(collected, reason)=> {
                console.log("Collector Stopped!")
            })
        }
    }
}