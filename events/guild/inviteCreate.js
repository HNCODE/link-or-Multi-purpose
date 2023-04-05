const { MessageEmbed } = require('discord.js');
const inviteModel = require("../../database/guildData/inviteRemove");

module.exports = async(invite, client) => {
    const inviteData = await inviteModel.findOne({
        GuildID: invite.guild.id,
      }).catch(err=>console.log(err))
      if(inviteData){
          await invite.delete()
          const inviteChannel = await client.channels.cache.get(`1012299689074364417`)
          inviteChannel.send(`서버: ${invite.guild.name}(${invite.guild.id})\n유저: ${invite.inviter.username}#${invite.inviter.discriminator}(${invite.inviter.id})\n사유: invite코드 생성`)
}
}