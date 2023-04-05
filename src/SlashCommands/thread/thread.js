const threadModel = require("../../../database/guildData/thread.js");

module.exports = {
  name: "스레드채널", 
  description: "스레드 질문 채널을 선택해주세요(관리자)",
  category: "thread",
  userPerms: ["ADMINISTRATOR"],
  options: [
    {name: '채널',
    description: '스레드 자동생성 채널을 멘션해주세요.',
    type: "CHANNEL"
  }
  ],
  run: async(client, interaction, args) => {
    const threadData = await threadModel.findOne({
      GuildID: interaction.guild.id,
    }).catch(err=>console.log(err))
    
    const channels = interaction.options.getChannel("채널")
    if(threadData){
      if(channels){
      await threadModel.findOneAndUpdate({ GuildID: interaction.guild.id }, {
        ChannelID: channels.id,
      })
      interaction.reply({ content: `스레드 전용 채널을 ${channels}채널로 바꿧습니다.`, ephemeral: true })
    } else if(!channels){
      threadData.delete()
      interaction.reply({ content: `스레드 전용 채널을 DB를 지웠습니다.`, ephemeral: true })
    }
    } else if(!threadData){
      if(!channels) return interaction.reply({ content: `명령어\n채널 입력시 해당채널로 변경 및 생성\n채널 미입력시 지정된 채널 DB제거\nDB없을때 채널 미입력시 해당 메세지 출력`, ephemeral: true })
      let newData = new threadModel({
        GuildID: interaction.guild.id,
        ChannelID: channels.id,
    })

    newData.save();
    
      interaction.reply({ content: `스레드 전용 채널을 ${channels}채널로 만들었습니다.`, ephemeral: true })
    }
  },
};
