const database = require('../../../link/module/db.js')
let db = database.db
const config = require(`../../../config.json`)

module.exports = {
  name: "인원확인",
  aliases: ["mcount"],
  category: "LINK",
  description: "복구 가능 인원수를 확인합니다.",
  userPerms: [],
  run: async (client, message, args) => {
    const key = args[0];
    db.all(`SELECT * FROM guilds WHERE token = '${key}';`, async(err, data) => {
        if (err) {
            throw err;
        }
        if (data == "") {
            return message.channel.send("존재하지 않는 라이센스 입니다.")
        }else {
            if(data[0].userid === message.author.id){
                db.all(`SELECT * FROM users WHERE guild_id = '${data[0]['id']}';`, async(err, data) => {
                    if (err) {
                        throw err;
                    }
    
                    if (data == "") {
                        return message.channel.send("알 수 없는 오류입니다.")
                    }else {
                        let count = 0;
                        for (i = 0; i<data.length; i++) {
                            count += 1
                        }
                        return message.channel.send(`총 인원은 ${count}명 입니다.`)
                    }
                })
            }else if(config.owner.includes(message.author.id)){
                db.all(`SELECT * FROM users WHERE guild_id = '${data[0]['id']}';`, async(err, data) => {
                    if (err) {
                        throw err;
                    }
    
                    if (data == "") {
                        return message.channel.send("알 수 없는 오류입니다.")
                    }else {
                        let count = 0;
                        for (i = 0; i<data.length; i++) {
                            count += 1
                        }
                        return message.channel.send(`총 인원은 ${count}명 입니다.`)
                    }
                })
            }
        }
    })
  },
};