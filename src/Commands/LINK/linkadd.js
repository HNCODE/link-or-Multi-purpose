const database = require('../../../link/module/db.js')
let db = database.db
const config = require(`../../../config.json`)

module.exports = {
  name: "링크생성",
  aliases: ["linkadd", "등록"],
  category: "LINK",
  description: "초대링크를 생성합니다.",
  userPerms: [],
  run: async (client, message, args) => {
    const code = args[0];
    await message.delete();
    const num = Number(message.guild.id)*2-3333
    const token = `Sin-${num}`
    db.all(`SELECT * FROM license;`, async(err, de) => {
      const dff = de.filter(e => e.userid === message.author.id&&e.guild === message.guild.id)
      if(!dff.length > 0) return message.channel.send(`${message.guild.name} - <@${message.author.id}> 는 등록되지 않은 라이센스 입니다.\n\`\`\`diff\n+ 등록방법\n- 1. 라이센스 승인 요청을 한다.\n- 2. <서버 이름 - 유저이름> 형식으로 승인을 받는다\n- 3. 해당 서버에 해당 유저계정으로 링크를 생성한다.\n\`\`\` `)
      // return console.log(de)
        let deletedata = db.prepare(`DELETE FROM  license WHERE userid = ?`);
      deletedata.run(message.author.id)
      deletedata.finalize();
      let insertdata = db.prepare(`INSERT INTO guilds VALUES(?,?,?,?)`);
    insertdata.run(message.guild.id, token, `${code}`, message.author.id);
    insertdata.finalize();
    return message.author.send(`생성 링크: **${config.URL}/invite/${code}**\n라이센스: *${token}*`)
    })
  },
};