const { MessageEmbed } = require("discord.js");
const database = require('../../../link/module/db.js')
let db = database.db
const config = require(`../../../config.json`)

module.exports = {
  name: "라이센스목록",
  aliases: ["licenselist"],
  category: "LINK",
  description: "등록된 라이센스를 확인합니다.",
  userPerms: [],
  run: async (client, message, args) => {
    const usercode = args[0];
    await message.delete();
    if(!usercode){
      if(!config.owner.includes(message.author.id))return;
    db.all(`SELECT * FROM license ;`, async(err, data) => {
      if (err) {
        throw err;
    }
    if (data == "") {
      const Embed = new MessageEmbed()
      .setColor("#00D8FF")
      .setFooter({text: `License: ${data.length}개`})
      .addFields({name: '라이센스목록', value: '현재 라이센스가 없습니다.'},);

      return message.channel.send({embeds: [Embed]})
    } else {
      const Embed = new MessageEmbed()
      .setColor("#00D8FF")
      .setFooter({text: `License: ${data.length}개`})
      let count = 0;
      for(const nu of data){
        const license = data.filter(e => e === nu).map(e => {
          const gl = client.guilds.cache.get(e.guild)
          const qq = gl?gl.name:"없음"
          const ul = client.users.cache.get(e.userid)
          return `${count}. ${qq} - ${ul.tag}`
        })
        const licenses = license.length === 0 ? '`라이센스가 존재하지 않아요!`' : `${license.join('`\n`')}`
        count ++
        Embed.addFields({name: '라이센스목록', value: licenses},);
      }
      return message.channel.send({embeds: [Embed]})
    }
  })
} else {
  if(!usercode === "확인") return message.channel.send(`라이센스목록 - 봇 오너 전용\n라이센스목록 확인 - 본인 계정의 라이센스 유무 확인`)
  db.all(`SELECT * FROM license WHERE userid = '${message.author.id}' ;`, async(err, data) => {
    if (err) {
      throw err;
  }
  if (data == "") {
    return message.channel.send({content: `${message.author} 현재 라이센스가 없습니다.`})
  } else {  
    return message.channel.send({content: `${message.author} 현재 라이센스가 있습니다.`})
  }
  })
}
  },
};