const database = require('../../../link/module/db.js')
let db = database.db
const config = require(`../../../config.json`)

module.exports = {
  name: "라이센스제거",
  aliases: ["licenseRemove"],
  category: "LINK",
  description: "등록된 라이센스를 제거합니다.",
  userPerms: [],
  run: async (client, message, args) => {
    const usercode = args[0];
    await message.delete();
    if(!config.owner.includes(message.author.id))return;
    db.all(`SELECT * FROM license WHERE userid = '${usercode}';`, async(err, data) => {
      if (err) {
        throw err;
    }
    if (data == "") {
      return message.channel.send(`해당 라이센스 제거 실패했습니다.`)
    } else {
      let deletedata = db.prepare(`DELETE FROM  license WHERE userid = ?`);
      deletedata.run(usercode)
      deletedata.finalize();
      return message.channel.send(`해당 라이센스를 제거했습니다.`)
    }
    })
  },
};