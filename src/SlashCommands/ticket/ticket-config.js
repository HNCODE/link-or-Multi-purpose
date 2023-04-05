const { MessageEmbed } = require('discord.js')
const setupSchema = require('../../../database/guildData/ticket')
module.exports = {
    //replace with your command handler
    name: '티켓설정',
    description: '셋업 티켓에 대해 설정합니다.',
    category: 'ticket',
    userPerms: ["MANAGE_GUILD"],
    options: [
        {
            name: '보기',
            description: '티켓 셋업 설정을 보여줍니다.',
            type: 'SUB_COMMAND'
        },
        {
            name: '초기화',
            description: '티켓 셋업 설정을 초기화합니다.',
            type: 'SUB_COMMAND',
        },
        {
            name: '서포터-역할',
            description: '티켓 서포터 역할을 지정합니다.',
            type: 'SUB_COMMAND',
            options: [
                {
                    name: '역할',
                    description: '역할을 지정해주세요',
                    type: 'ROLE',
                    required: true,
                },
            ],
        },
        {
            name: '티켓-카테고리',
            description: '티켓 전용 카테고리 지정',
            type: 'SUB_COMMAND',
            options: [
                {
                    name: '카테고리',
                    description: '티켓을 열 카테고리를 지정해주세요.',
                    type: 'CHANNEL',
                    channelTypes: ['GUILD_CATEGORY'],
                    required: true,
                },
            ],
        },
    ],
    run: async (client, interaction, args) => {
        if (interaction.options.getSubcommand() === '서포터-역할') {
            const role = interaction.options.getRole('역할')
            const roleID = role.id
            const data = await setupSchema.findOne({
                guildId: interaction.guild.id,
              });
              if(data){
                if(data.categoryId){
                    await setupSchema.findOneAndRemove({
                        guildId: interaction.guild.id,
                      });  
                      let newData = new setupSchema({
                        supportId: roleID,
                        categoryId: data.categoryId,                    
                        guildId: interaction.guild.id,
                      });
                      newData.save();
                      await interaction.reply({
                        content: `서포트 역할: <@&${roleID}> 변경했습니다.`,
                        ephemeral: true,
                    })
                } else if(!data.categoryId){
                    await setupSchema.findOneAndRemove({
                        guildId: interaction.guild.id,
                      });  
                      let newData = new setupSchema({
                        supportId: roleID,
                        categoryId: "",                    
                        guildId: interaction.guild.id,
                      });
                      newData.save();
                      await interaction.reply({
                        content: `서포트 역할: <@&${roleID}> 변경했습니다.`,
                        ephemeral: true,
                    })
                }
              } else if(!data){
                let newData = new setupSchema({
                    supportId: roleID,
                    categoryId: "",                    
                    guildId: interaction.guild.id,
                  });
                  newData.save();
                  await interaction.reply({
                    content: `서포트 역할: <@&${roleID}> 변경했습니다.`,
                    ephemeral: true,
                })
              }
        } else if (interaction.options.getSubcommand() === '티켓-카테고리') {
            const cat = interaction.options.getChannel('카테고리')
            const catId = cat.id
            const data = await setupSchema.findOne({
                guildId: interaction.guild.id,
              });
              if(data){
                if(data.supportId){
                    await setupSchema.findOneAndRemove({
                        guildId: interaction.guild.id,
                      });  
                      let newData = new setupSchema({
                        supportId: data.supportId,
                        categoryId: catId,                    
                        guildId: interaction.guild.id,
                      });
                      newData.save();
                      await interaction.reply({
                        content: `티켓 서포트 카테고리: <#${catId}> 변경했습니다.`,
                        ephemeral: true,
                    })
                } else if(!data.supportId){
                    await setupSchema.findOneAndRemove({
                        guildId: interaction.guild.id,
                      });  
                      let newData = new setupSchema({
                        supportId: "",
                        categoryId: catId,                    
                        guildId: interaction.guild.id,
                      });
                      newData.save();
                      await interaction.reply({
                        content: `티켓 서포트 카테고리: <#${catId}> 변경했습니다.`,
                        ephemeral: true,
                    })
                }
              } else if(!data){
                let newData = new setupSchema({
                    supportId: "",
                    categoryId: catId,                    
                    guildId: interaction.guild.id,
                  });
                  newData.save();
                  await interaction.reply({
                    content: `티켓 서포트 카테고리: <#${catId}> 변경했습니다.`,
                    ephemeral: true,
                })
              }
        }
        
        else if (interaction.options.getSubcommand() === '보기') {

            const doc = await setupSchema.findOne({
                guildId: interaction.guild.id
            })

            if (!doc) {
                setupSchema.create({guildId: interaction.guild.id})
                return `DB에서 이서버의 셋업 티켓에 대해 찾을 수 없습니다.`
            }

            const embed = new MessageEmbed()
            .setColor('RANDOM')
            .setTitle('티켓 설정')
            .setFields(
                {name: `서포터 역할`, value: `${doc.supportId ? `<@&${doc.supportId}>` : 'None'}`, inline: true},
                {name: `서포터 카테고리`, value: `${doc.categoryId ? `<#${doc.categoryId}>` : 'None'}`, inline: true},
            )

            interaction.reply({embeds: [embed]})
        }
        else if (interaction.options.getSubcommand() === '초기화') {
            const result = await setupSchema.findOne({guildId: interaction.guild.id})
            if (result) {
                result.delete()
                interaction.reply({content: '구성 데이터 재설정 성공', ephemeral: true})
            } else {
                interaction.reply({content: `설정된 구성이 없습니다.`, ephemeral: true})
            }
        }
        }
}