const { MessageEmbed } = require('discord.js');

const threadData = require("../../database/guildData/thread");
const threadclosedData = require("../../database/guildData/threadclosed");


module.exports = async (message) => {
    if(message.author.bot) return
    const data = await threadData.findOne({
        GuildID: message.guild.id
    })

    if (!data) return;
    const channel = parseInt(data.ChannelID)
if(message.channel.id != channel) return;
    const th_name = message.content
    const thread = await message.startThread({
        name: th_name,
        autoArchiveDuration: 1440,
    });
//--------------------------------------------
const threadID = thread.id
        let newData = new threadclosedData({
          ChannelID: threadID,
          GuildID: message.guild.id,
          OwnerID: message.author.id
        })
  
      newData.save();

      const embed = new MessageEmbed()
      .setTitle('질문 규칙')
      .setDescription(`스레드 ID: ${thread.id}`)
  .addFields(
      {name:'질문양식',value: '1. 오류내용\n2. 사용된코드 ( 캡처, 복사 )\n3. 자기가 코드를 실행해봤는지 여부\n4. 해결 노력을 했는지 여부'},
      {name:'※주의사항※',value: '1. 재촉하지마세요.\n2. 존칭어 사용해주세요.\n3. 본인이 최대한 문제를 찾아서 한번에 물어보세요.\n4. 예의 지키세요.\n\n문제가 해결되셨다면 꼭! \n`/닫기`로 스레드를 닫아주세요\n스레드에서 멘션 금지'}
            )
      .setThumbnail(message.author.displayAvatarURL())
      .setColor("GREEN")
      .setTimestamp()
      thread.send({embeds:[embed]})
//------------------------------------------------------  

}