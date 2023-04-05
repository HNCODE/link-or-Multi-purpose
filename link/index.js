const database = require('./module/db.js')
let db = database.db
const modules = require('./module/module.js')

const config = require('../config.json');
let PORT = config.PORT;
const IJRModel = require("../database/guildData/inviteJoinRole");

// web
const express = require('express');
const app = express();
const axios = require('axios');
const url = require('url');
const path = require('path');
const { render } = require('ejs');

/**
 *  STARTING THE WEBSITE
 * @param {*} client THE DISCORD BOT CLIENT 
 */
module.exports = client => {
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'))
app.use(express.static(`${__dirname}/views`));
app.use(express.json());
app.use(express.urlencoded({extended: true}));

const sleep = (ms) => {
    return new Promise(resolve=> {
        setTimeout(resolve,ms)
    })
}

async function exchange_code(code, redirect_url){
    const data = {
        'client_id': config.CLIENT_ID,
        'client_secret': config.CLIENT_SECRET,
        'grant_type': 'authorization_code',
        'code': code,
        'redirect_uri': redirect_url
    }
    const headers = {
        'Content-Type': 'application/x-www-form-urlencoded'
    }
    // while (true) {
        const r = await axios(
            {
                method: 'POST',
                url: `https://discord.com/api/oauth2/token`,
                data: new URLSearchParams(data),
                headers: headers
            }
            ).catch(function (error) {
                // console.log(error.response.status)
                return {'result': false}
            })
            
        var limitinfo = r.data;
        await sleep(1000)
    
    if (r === undefined) {
        return {'result': false}

    }else {
        return {'result': true, 'data': limitinfo}
    }
    // }
}

async function get_user_profile(token){
    const headers = {"Authorization" : "Bearer " + token}
    const r = await axios(
        {
            method: 'GET',
            url: `https://discordapp.com/api/v8/users/@me`,
            headers: headers
        }
        ).catch(function (error) {
            console.log(error.response.status)
        if (error.response.status != 200) {
            return {'result': false}
        }
    })

    return {'result': true, 'data': r.data}

}


async function add_user(user_id, access_token, guild_id) {
    const r = await axios(
        {
            method: 'PUT',
            url: `https://discord.com/api/v9/guilds/${guild_id}/members/${user_id}`,
            data: {
                "access_token": `${access_token}`,
            },
            headers: {
                "Authorization": `Bot ${config.TOKEN}`,
                'Content-Type': 'application/json'
            }
        }
    ).catch(function (error) {
        console.log(error.response.status)
        return false
    })
    if (r.data) {
        return true
    }else {
        return false
    }
}

async function refresh_token(refresh_token) {
    const r = await axios(
        {
            method: 'POST',
            url: `https://discord.com/api/v9/oauth2/token`,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            data: new URLSearchParams({
                client_id: config.CLIENT_ID,
                client_secret: config.CLIENT_SECRET,
                grant_type: "refresh_token",
                refresh_token: refresh_token
            }),
        }
    ).catch(function (error) {
        console.log(error.response.status)
    })
    if (r) {
        return {'result': true, 'data': r.data}
    }else {
        return {'result': false}
    }

}

app.get('/invite/:code', async(req, res) => {
    try {
        const code = req.params.code;

        if (code === undefined) {
            return res.render("fail", {message: "코드가 감지되지 않았습니다."})
        }else {
            db.all(`SELECT * FROM guilds WHERE code = '${code}';`, async(err, data) => {
                if (err) {
                    throw err;
                }
                if (data == "") {
                    return res.render("fail", {message: "존재하지 않는 서버코드 입니다."})
                }else {
                    let guild_id = data[0]['id']
                    let guild1 = await client.guilds.fetch();
                    let guild = guild1.filter(e => e.id === guild_id)
                    let guild_name = Array.from(guild.values())[0].name
                    let guild_icon = Array.from(guild.values())[0].icon
                    
                    let guild_icon_link = `https://cdn.discordapp.com/icons/${guild_id}/${guild_icon}.webp?size=100`


                    return res.render("s", {guild_id: `${guild_id}`, client_id: `${config.CLIENT_ID}`, url: `${config.URL}`, guild_name: guild_name, guild_icon: guild_icon_link})
                }
            })
        }
    }catch(err) {
        console.log(err);
        res.json({
            success: false
        })
    }
})

app.get('/join', async(req, res) => {
    try {
        const {code} = req.query
        const {state} = req.query

        if (state === undefined) {
            return res.render("fail", {message: "서버 아이디가 감지 되지 못했습니다."})
        } else if (code == undefined) {
            return res.render("fail", {message: "유저코드가 감지 되지 못했습니다."})
        }

        try {
            var exchange_res = await exchange_code(code, `${config.URL}/join`)
            if (exchange_res['result'] == false) {
                return res.render("fail", {message: "터졌거나 존재하지 않는 인증 링크입니다."})
            }
            if(exchange_res['data'] == undefined){
                return res.render("fail", {message: "해당 페이지를 종료해주세요."})
            }
            var user_data = await get_user_profile(exchange_res['data']['access_token'])
            if (user_data['result'] == false) {
                return res.render("fail", {message: "알 수 없는 오류입니다."})
            }
            
            var add_user_ = await add_user(user_data['data']['id'], exchange_res['data']['access_token'], state)


            if (add_user_ === true) {
                db.all(`SELECT * FROM users WHERE guild_id = '${state}' AND id = '${user_data['data']['id']}';`, async(err, data) => {
                    if (err) {
                        throw err;
                    }
                    if (data == "") {
                        db.run(`INSERT INTO users (id, token, guild_id) VALUES("${user_data['data']['id']}", "${exchange_res['data']['refresh_token']}", "${state}")`)
                        res.render("success")
                    }else {
                        db.run(`DELETE FROM  users WHERE guild_id = '${state}' AND id = '${user_data['data']['id']}'`)
                        db.run(`INSERT INTO users (id, token, guild_id) VALUES("${user_data['data']['id']}", "${exchange_res['data']['refresh_token']}", "${state}")`)
                        res.render("success")
                    }
                })
                const IJRData = await IJRModel.findOne({
                    GuildID: state,
                  }).catch(err=>console.log(err))

                  if (IJRData) {
                    var IJRRole = IJRData.Role
                    const Us = client.guilds.cache.get(state)
                    if(Us.roles.cache.get(IJRRole)){
                     Us.members.cache.get(user_data['data']['id']).roles.add(IJRRole)
                }
                  }

            }else {
                res.render("fail", {message: "서버에 입장 실패 했습니다."})
            }

        } catch (err) {
            console.log(err)
        }
    }catch(err) {
        console.log(err);
        res.json({
            success: false
        })
    }
})
const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const prefixModel = require("../database/guildData/prefix");
client.on("messageCreate", async (message) => {
    if (message.author.bot) return;
    if (!message.guild.me.permissionsIn(message.channel).has("SEND_MESSAGES")) return;
    const prefixData = await prefixModel.findOne({
        GuildID: message.guild.id,
      }).catch(err=>console.log(err))
    
      if (prefixData) {
        var PREFIX = prefixData.Prefix
      } else if (!prefixData) {
        PREFIX = config.PREFIX
      }
    const prefixRegex = new RegExp(
        `^(<@!?${client.user.id}>|${escapeRegex(PREFIX)})\\s*`
      );
      if (!prefixRegex.test(message.content)) return;
    
      const [, matchedPrefix] = message.content.match(prefixRegex);
    
      const p = matchedPrefix.length;
      const args = message.content.slice(p).trim().split(/ +/);
      const commandName = args.shift().toLowerCase();
      //------------------------------------------------------
      if(commandName === "복구"||commandName === "restore"){
    if(!config.owner.includes(message.author.id))return message.channel.send(`해당 기능은 "나를위한소녀#4186"에게 문의 해주세요.`);
    const key = args[0];
    await message.delete();
    db.all(`SELECT * FROM guilds WHERE token = '${key}';`, async(err, data) => {
        if (err) {
            throw err;
        }

        if (data == "") {
            return message.channel.send("존재하지 않는 라이센스 입니다.")
        }else {
            
            db.all(`SELECT * FROM users WHERE guild_id = '${data[0]['id']}';`, async(err, data) => {
                if (err) {
                    throw err;
                }
                if (data == "") {
                    return message.channel.send("알 수 없는 오류입니다.")
                }else {
                    let count = 0;
                    let xcount = 0;
                    for (i = 0; i < data.length; i++){
                        
                        var user_id = data[i]['id']
                        var token = data[i]['token']
                        
                        var new_token = await refresh_token(token)
                        if(new_token['result'] == false) {
                            let deletedata = db.prepare(`DELETE FROM  users WHERE token = ?`);
                            deletedata.run(token)
                            deletedata.finalize();
                            xcount +=1
                        }
                        if (new_token['result'] != false) {

                            await sleep(2000)

                            var new_refresh = new_token['data']['refresh_token']
                            var new_token_ = new_token['data']['access_token']
    
                            var add_user_ = await add_user(user_id, new_token_, message.guild.id)
                            db.run(`UPDATE users SET token = "${new_refresh}" WHERE token = "${token}";`)
    
                            if (add_user_) {
                                count += 1
                            }
                        }
    
                        return message.channel.send(`복구인원 : ${count}\n제거인원: ${xcount}`)
    
    
                    }
                    return message.channel.send(`복구가 완료되었습니다.`)
                }
            })
        }
    })
}
})
   /**
     * @START THE WEBSITE
     */
    //START THE WEBSITE ON THE DEFAULT PORT (80)
app.listen(PORT, '0.0.0.0',() => {
    console.log(`[+] 외부 포트를 ${PORT}로 열었습니다.`)
})
}