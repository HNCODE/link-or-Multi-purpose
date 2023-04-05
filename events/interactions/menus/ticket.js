const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');
const setupSchema = require('../../../database/guildData/ticket');
const {owner} = require('../../../config.json');

module.exports = async (interaction, client) => {
    if (!interaction.isButton()) return;
    if (interaction.customId === "t-player") {// 티켓 생성
        
        const guild = interaction.guild;
        const user = interaction.user
        const check = guild.channels.cache.find((c) => c.topic === `${user.id}`)
        const doc = await setupSchema.findOne({guildId: interaction.guild.id})
        if(doc){
            if(!doc.supportId) return interaction.channel.send({content: `❎ ${interaction.member} 현재 서포트 역할이 정해지지 않아 사용이 불가합니다..`});
            if(!doc.categoryId) return interaction.channel.send({content: `❎ ${interaction.member} 현재 카테고리가 정해지지 않아 사용이 불가합니다..`});
        }else{
            return interaction.channel.send({content: `❎ ${interaction.member}티켓 서포트 설정이 되어 있지 않아 사용이 불가합니다.`})
        }
        const supportRoleId = doc.supportId
        const catId = doc.categoryId
        const staff = doc.supportId

        if (!check) {
            const x = interaction.guild.channels.create(`${interaction.user.tag}`, {
                permissionOverwrites: [{
                        id: interaction.user.id,
                        allow: ['SEND_MESSAGES', 'VIEW_CHANNEL', 'ADD_REACTIONS', 'EMBED_LINKS', 'ATTACH_FILES']
                    },
                    {
                        id: interaction.guild.roles.everyone,
                        deny: ['VIEW_CHANNEL']
                    },
                    {
                        id: supportRoleId,
                        allow: ['SEND_MESSAGES', 'VIEW_CHANNEL', 'MANAGE_MESSAGES']
                    },
                    {
                        id: owner[0],
                        allow: ['SEND_MESSAGES', 'VIEW_CHANNEL', 'MANAGE_MESSAGES', 'MANAGE_CHANNELS']
                    }
                ],
                type: 'text',
                parent: catId,
                topic: interaction.user.id
            }).then(async channel => {
                channel.send({
                    content: `환영합니다! : <@${interaction.user.id}> <@&${staff}>`,
                    embeds: [embed],
                    components: [del]
                })
                interaction.reply({ content: `티켓 생성 <#${channel.id}>`, ephemeral: true })
            })

            const embed = new MessageEmbed()
                .setTitle('Ticket | 서버원')
                .setDescription('안녕하세요!\n가능한 빨리 서포터들이 함께 할 것입니다.\n감사합니다!\n\n**질문 양식:**\n\`\`\`**질문 내용:**\n**질문 이유:**\n**증거(필요한 경우):**\n**그외 내용:**\`\`\`')
                .setFooter({
                    text: '티켓은 관리자만 닫을 수 있습니다.'
                })
                .setColor('GREEN')
                .setTimestamp()

            const del = new MessageActionRow()
                .addComponents(
                    new MessageButton()
                    .setCustomId('t-delete')
                    .setLabel('🔒 티켓 종료')
                    .setStyle('SUCCESS')
                )
        } else {
            interaction.reply({
                custom: true,
                content: "이미 티켓이 열려있습니다.",
                ephemeral: true,
            })
        }

    } else if (interaction.customId === "t-bug") {// 버그
        
        const guild = interaction.guild;
        const user = interaction.user
        const check = guild.channels.cache.find((c) => c.topic === `${user.id}`)
        const doc = await setupSchema.findOne({guildId: interaction.guild.id})
        if(doc){
            if(!doc.supportId) return interaction.channel.send({content: `❎ ${interaction.member} 현재 서포트 역할이 정해지지 않아 사용이 불가합니다..`});
            if(!doc.categoryId) return interaction.channel.send({content: `❎ ${interaction.member} 현재 카테고리가 정해지지 않아 사용이 불가합니다..`});
        }else{
            return interaction.channel.send({content: `❎ ${interaction.member}티켓 서포트 설정이 되어 있지 않아 사용이 불가합니다.`})
        }
        const supportRoleId = doc.supportId
        const catId = doc.categoryId
        const staff = doc.supportId

        if (!check) {
            const x = interaction.guild.channels.create(`${interaction.user.tag}`, {
                permissionOverwrites: [{
                        id: interaction.user.id,
                        allow: ['SEND_MESSAGES', 'VIEW_CHANNEL', 'ADD_REACTIONS', 'EMBED_LINKS', 'ATTACH_FILES']
                    },
                    {
                        id: interaction.guild.roles.everyone,
                        deny: ['VIEW_CHANNEL']
                    },
                    {
                        id: supportRoleId,
                        allow: ['SEND_MESSAGES', 'VIEW_CHANNEL', 'MANAGE_MESSAGES', 'MANAGE_CHANNELS']
                    },
                    {
                        id: owner[0],
                        allow: ['SEND_MESSAGES', 'VIEW_CHANNEL', 'MANAGE_MESSAGES', 'MANAGE_CHANNELS']
                    }
                ],
                type: 'text',
                parent: catId,
                topic: interaction.user.id
            }).then(async channel => {
                channel.send({
                    content: `환영합니다! : <@${interaction.user.id}> <@&${staff}>`,
                    embeds: [embed],
                    components: [del]
                })
                interaction.reply({ content: `티켓 생성 <#${channel.id}>`, ephemeral: true })
            })

            const embed = new MessageEmbed()
                .setTitle('Ticket | 버그')
                .setDescription('안녕하세요!\n가능한 빨리 서포터들이 함께 할 것입니다.\n감사합니다!\n\n**양식:**\n\`\`\`**버그 내용:**\n**:**\n**증거(필요한 경우):**\n**그외 내용:**\`\`\`')
                .setFooter({
                    text: '티켓은 관리자만 닫을 수 있습니다.'
                })
                .setColor('GREEN')
                .setTimestamp()

                const del = new MessageActionRow()
                .addComponents(
                    new MessageButton()
                    .setCustomId('t-delete')
                    .setLabel('🔒 티켓 종료')
                    .setStyle('SUCCESS')
                )
        } else {
            interaction.reply({
                custom: true,
                content: "이미 티켓이 열려있습니다.",
                ephemeral: true,
            })
        }

    } else if (interaction.customId === "t-feed") {// 피드백
        
        const guild = interaction.guild;
        const user = interaction.user
        const check = guild.channels.cache.find((c) => c.topic === `${user.id}`)
        const doc = await setupSchema.findOne({guildId: interaction.guild.id})
        if(doc){
            if(!doc.supportId) return interaction.channel.send({content: `❎ ${interaction.member} 현재 서포트 역할이 정해지지 않아 사용이 불가합니다..`});
            if(!doc.categoryId) return interaction.channel.send({content: `❎ ${interaction.member} 현재 카테고리가 정해지지 않아 사용이 불가합니다..`});
        }else{
            return interaction.channel.send({content: `❎ ${interaction.member}티켓 서포트 설정이 되어 있지 않아 사용이 불가합니다.`})
        }
        const supportRoleId = doc.supportId
        const catId = doc.categoryId
        const staff = doc.supportId

        if (!check) {
            const x = interaction.guild.channels.create(`${interaction.user.tag}`, {
                permissionOverwrites: [{
                        id: interaction.user.id,
                        allow: ['SEND_MESSAGES', 'VIEW_CHANNEL', 'ADD_REACTIONS', 'EMBED_LINKS', 'ATTACH_FILES']
                    },
                    {
                        id: interaction.guild.roles.everyone,
                        deny: ['VIEW_CHANNEL']
                    },
                    {
                        id: supportRoleId,
                        allow: ['SEND_MESSAGES', 'VIEW_CHANNEL', 'MANAGE_MESSAGES', 'MANAGE_CHANNELS']
                    },
                    {
                        id: owner[0],
                        allow: ['SEND_MESSAGES', 'VIEW_CHANNEL', 'MANAGE_MESSAGES', 'MANAGE_CHANNELS']
                    }
                ],
                type: 'text',
                parent: catId,
                topic: interaction.user.id
            }).then(async channel => {
                channel.send({
                    content: `환영합니다! : <@${interaction.user.id}> <@&${staff}>`,
                    embeds: [embed],
                    components: [del]
                })
                interaction.reply({ content: `티켓 생성 <#${channel.id}>`, ephemeral: true })
            })

            const embed = new MessageEmbed()
                .setTitle('Ticket | 피드백')
                .setDescription('안녕하세요!\n가능한 빨리 서포터들이 함께 할 것입니다.\n감사합니다!\n\n**피드백 내용:**\n\`\`\`**피드백 이유:**\n**증거(필요한 경우):**\n**그외 내용:**\`\`\`')
                .setFooter({
                    text: '티켓은 관리자만 닫을 수 있습니다.'
                })
                .setColor('GREEN')
                .setTimestamp()

                const del = new MessageActionRow()
                .addComponents(
                    new MessageButton()
                    .setCustomId('t-delete')
                    .setLabel('🔒 티켓 종료')
                    .setStyle('SUCCESS')
                )
        } else {
            interaction.reply({
                custom: true,
                content: "이미 티켓이 열려있습니다.",
                ephemeral: true,
            })
        }
    } else if (interaction.customId === "t-staff") {// 스태프
        
        const doc = await setupSchema.findOne({guildId: interaction.guild.id})
        if(doc){
            if(!doc.supportId) return interaction.channel.send({content: `❎ ${interaction.member} 현재 서포트 역할이 정해지지 않아 사용이 불가합니다..`});
            if(!doc.categoryId) return interaction.channel.send({content: `❎ ${interaction.member} 현재 카테고리가 정해지지 않아 사용이 불가합니다..`});
        }else{
            return interaction.channel.send({content: `❎ ${interaction.member}티켓 서포트 설정이 되어 있지 않아 사용이 불가합니다.`})
        }
        const guild = interaction.guild;
        const user = interaction.user
        const check = guild.channels.cache.find((c) => c.topic === `${user.id}`)
        const supportId = doc.supportId
        const catId = doc.categoryId
        if(!interaction.member.roles.cache.get(supportId)) return interaction.reply({ content: `해당 티켓은 ${interaction.guild.roles.cache.get(supportId)}전용 티켓입니다.`, ephemeral: true })
        if (!check) {
            const x = interaction.guild.channels.create(`${interaction.user.tag}`, {
                permissionOverwrites: [{
                        id: interaction.user.id,
                        allow: ['SEND_MESSAGES', 'VIEW_CHANNEL', 'ADD_REACTIONS', 'EMBED_LINKS', 'ATTACH_FILES']
                    },
                    {
                        id: interaction.guild.roles.everyone,
                        deny: ['VIEW_CHANNEL']
                    },
                    {
                        id: owner[0],
                        allow: ['SEND_MESSAGES', 'VIEW_CHANNEL', 'MANAGE_MESSAGES', 'MANAGE_CHANNELS']
                    },
                ],
                type: 'text',
                parent: catId,
                topic: interaction.user.id
            }).then(async channel => {
                channel.send({
                    content: `환영합니다! : <@${interaction.user.id}>`,
                    embeds: [embed],
                    components: [del]
                })
                interaction.reply({ content: `서포터 전용 티켓 생성 <#${channel.id}>`, ephemeral: true })
            })

            const embed = new MessageEmbed()
                .setTitle('Ticket | 서포터 전용')
                .setDescription('안녕하세요!\n서포터 전용 티켓이며 관리자 권한, 봇 오너 만 채널을 볼 수 있습니다.\n감사합니다!')
                .setColor('GREEN')
                .setTimestamp()

                const del = new MessageActionRow()
                .addComponents(
                    new MessageButton()
                    .setCustomId('t-delete')
                    .setLabel('🔒 티켓 종료')
                    .setStyle('SUCCESS')
                )
        } else {
            interaction.reply({
                custom: true,
                content: "이미 티켓이 열려있습니다.",
                ephemeral: true,
            })
        }
    } else if (interaction.customId === "t-other") {// 그외
        
        const guild = interaction.guild;
        const user = interaction.user
        const check = guild.channels.cache.find((c) => c.topic === `${user.id}`)
        const doc = await setupSchema.findOne({guildId: interaction.guild.id})
        if(doc){
            if(!doc.supportId) return interaction.channel.send({content: `❎ ${interaction.member} 현재 서포트 역할이 정해지지 않아 사용이 불가합니다..`});
            if(!doc.categoryId) return interaction.channel.send({content: `❎ ${interaction.member} 현재 카테고리가 정해지지 않아 사용이 불가합니다..`});
        }else{
            return interaction.channel.send({content: `❎ ${interaction.member}티켓 서포트 설정이 되어 있지 않아 사용이 불가합니다.`})
        }
        const supportRoleId = doc.supportId
        const catId = doc.categoryId
        const staff = doc.supportId
        
        if (!check) {
            const x = interaction.guild.channels.create(`${interaction.user.tag}`, {
                permissionOverwrites: [{
                        id: interaction.user.id,
                        allow: ['SEND_MESSAGES', 'VIEW_CHANNEL', 'ADD_REACTIONS', 'EMBED_LINKS', 'ATTACH_FILES']
                    },
                    {
                        id: interaction.guild.roles.everyone,
                        deny: ['VIEW_CHANNEL']
                    },
                    {
                        id: supportRoleId,
                        allow: ['SEND_MESSAGES', 'VIEW_CHANNEL', 'MANAGE_MESSAGES', 'MANAGE_CHANNELS']
                    },
                    {
                        id: owner[0],
                        allow: ['SEND_MESSAGES', 'VIEW_CHANNEL', 'MANAGE_MESSAGES', 'MANAGE_CHANNELS']
                    }
                ],
                type: 'text',
                parent: catId,
                topic: interaction.user.id
            }).then(async channel => {
                channel.send({
                    content: `환영합니다! : <@${interaction.user.id}> <@&${staff}>`,
                    embeds: [embed],
                    components: [del]
                })
                interaction.reply({ content: `티켓 생성 <#${channel.id}>`, ephemeral: true })
            })

            const embed = new MessageEmbed()
                .setTitle('Ticket | 그외')
                .setDescription('안녕하세요!\n가능한 빨리 서포터들이 함께 할 것입니다.\n감사합니다!\n\n**질문 양식:**\n\`\`\`**질문 내용:**\n**질문 이유:**\n**증거(필요한 경우):**\n**그외 내용:**\`\`\`')
                .setFooter({
                    text: '티켓은 관리자만 닫을 수 있습니다.'
                })
                .setColor('GREEN')
                .setTimestamp()

                const del = new MessageActionRow()
                .addComponents(
                    new MessageButton()
                    .setCustomId('t-delete')
                    .setLabel('🔒 티켓 종료')
                    .setStyle('SUCCESS')
                )
        } else {
            interaction.reply({
                custom: true,
                content: "이미 티켓이 열려있습니다.",
                ephemeral: true,
            })
        }
    } else if (interaction.customId === 't-delete') {
        const doc = await setupSchema.findOne({guildId: interaction.guild.id})
        // 채널 삭제 코드로 변경해야함
        if (owner.includes(interaction.member.id)) {
            const thread = interaction.channel
            thread.delete()
            // const userThread = thread.topic

            // thread.permissionOverwrites.edit(userThread, { VIEW_CHANNEL: false })
            interaction.reply({custom: true, content: `✅ 티켓을 닫았습니다.(Bot Onwer)`, ephemeral: true})
        } else if(interaction.member.roles.cache.get(doc.supportId)){
            const thread = interaction.channel
            thread.delete()
            // const userThread = thread.topic

            // thread.permissionOverwrites.edit(userThread, { VIEW_CHANNEL: false })
            interaction.reply({custom: true, content: `✅ 티켓을 닫았습니다.`, ephemeral: true})

        }else interaction.reply({custom: true, content: '❎ 권한이 부족합니다.', ephemeral: true})

    }
}
