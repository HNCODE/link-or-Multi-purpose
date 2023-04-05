const database = require('../../../link/module/db.js')
let db = database.db
const config = require(`../../../config.json`)

module.exports = {
  name: "라이센스",
  aliases: ["license"],
  category: "LINK",
  description: "초대링크 생성 가능 유무 license에 guild, userid를 등록합니다.",
  userPerms: [],
  run: async (client, message, args) => {
    const guild = args[0];
    const user = args[1];
    await message.delete();
    if(!config.owner.includes(message.author.id))return;
    const gld = client.guilds.cache.get(guild)
    const ue = client.users.cache.get(user)
    if(!gld)return message.channel.send(`봇이 해당 서버에 있는지 확인해주세요.`);
    if(!ue)return message.channel.send(`봇이 있는 곳에 해당 유저가 있는지 확인해주세요`);
    if(!gld.members.cache.get(user))return message.channel.send(`해당 길드에 해당 유저가 있는지 확인해주세요`);
    // if(client.guilds.cache.get(guild))
    db.all(`SELECT * FROM license;`, async(err, de) => {
    db.all(`SELECT * FROM license WHERE userid = '${user}';`, async(err, data) => {
      if (err) {
        throw err;
    }
    const dff = de.filter(e => e.userid === ue.id)
    const dfff = de.filter(e => e.guild === gld.id)
    if (data == "") {
      let insertdata = db.prepare(`INSERT INTO license VALUES(?,?)`);
      insertdata.run(gld.id, ue.id);
      insertdata.finalize();
      return message.channel.send(`${gld.name} - ${ue.tag} 을 등록했습니다.`)
    } else {
      const df = data.filter(e => e.userid === ue.id)
      if(df.length > 0){
        return message.channel.send(`${ue.tag}님은 이미 ${gld.nam}길드 라이센스가 있습니다.< 현재 링크 생성 X >`)
      } else {
        let insertdata = db.prepare(`INSERT INTO license VALUES(?,?)`);
        insertdata.run(gld.id, ue.id);
        insertdata.finalize();
        return message.channel.send(`${gld.name}<${dff.length}개> - ${ue.tag}<${dfff.length}개> 을 등록했습니다.`)
      }

    }
    })
  })
  },
};