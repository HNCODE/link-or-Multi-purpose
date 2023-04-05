const database = require('../../../link/module/db.js')
let db = database.db
const config = require(`../../../config.json`)

module.exports = {
  name: "초대코드",
  aliases: ["linkcode"],
  category: "LINK",
  description: "초대링크를 변경합니다.",
  userPerms: [],
  run: async (client, message, args) => {
    const code = args[0];
    const key = args[1];
    db.all(`SELECT * FROM guilds WHERE token = '${key}';`, async(err, data) => {
      if (err) {
          throw err;
      }
      if (data == "") {
          return message.channel.send("존재하지 않는 라이센스 입니다.")
      }else {
        if(data[0].userid === message.author.id){
          db.run(`UPDATE guilds SET code = '${code}' WHERE id = '${message.guild.id}';`)
          message.author.send(`현재 링크: **${config.URL}/invite/${code}**\n라이센스: *${key}*`)
          return message.channel.send(`링크: **${config.URL}/invite/${code}** 로 변경되었습니다.`)
        }else if(config.owner.includes(message.author.id)){
          db.run(`UPDATE guilds SET code = '${code}' WHERE id = '${message.guild.id}';`)
          return message.channel.send(`링크: **${config.URL}/invite/${code}** 로 변경되었습니다.`)
        }
      }
    })
  },
};