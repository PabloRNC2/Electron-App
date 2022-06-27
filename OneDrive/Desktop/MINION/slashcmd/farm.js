const {SlashCommandBuilder} = require("@discordjs/builders")
const Discord = require("discord.js")
const tienda = require("../precios.json")


const prueba = require("../Schemas/items")

module.exports = {
    data: new SlashCommandBuilder()
    .setName("farm")
    .setDescription("Haces de granjero y agricultor"),
    cooldown: 0,
    
    async run(client, interaction){


      const data = await prueba.findOne({guildID: interaction.guild.id, userID: interaction.user.id})

      if(!data){

        let newdata = await new prueba({
          userID: interaction.user.id,
          guildID: interaction.guild.id,
        
      }).save()

    
      
      
      }

      let finalitems = []
      let items = []


      const nbanana = Math.floor(Math.random() * 19)+1

      
      

      const posimanzana = Math.floor(Math.random() * 100)
      if(posimanzana >= 50){
        var nmanzana = Math.floor(Math.random() * 9) + 1

        

        items.push("🍎")
       
      

      }else{
        var nmanzana = 0
      }

      const posiazucar = Math.floor(Math.random() * 99)+1

      if(posiazucar <= 35){
        var nazucar = Math.floor(Math.random() * 9)+1

        items.push("<:sugar:958768303004852326>")
      }else{
        var nazucar = 0
      }

      const posifresas = Math.floor(Math.random() * 99) + 1

      if(posifresas <= 20){

        var nfresa= Math.floor(Math.random() * 6)+1

        items.push("🍓")
      }else{
        var nfresa = 0
      }
     

      finalitems.push(`${nbanana} 🍌`)
      items.forEach(i => {

        switch(i){
          case "🍎":{
            finalitems.push(`${nmanzana} 🍎`)
          }
          break;
          case "<:sugar:958768303004852326>": {
            finalitems.push(`${nazucar} <:sugar:958768303004852326>`)
          }
          break;
          case "🍓": {
            finalitems.push(`${nfresa} 🍓`)
          }
          break;
        }    
      })

   
      
    
        
      await prueba.findOneAndUpdate({guildID: interaction.guild.id, userID: interaction.user.id}, {
        items: {
          
            bananas: 
            {
              amount: data? data.items.bananas.amount + nbanana: nbanana,
              id: "1"
            },
            manzanas:{
              amount: data? data.items.manzanas.amount + nmanzana: nmanzana,
              id: "2"
            } ,
            fresas: {
             amount:  data? data.items.fresas.amount + nfresa: nfresa,
             id: "3"
            },
            azucar: {
              amount: data? data.items.azucar.amount + nazucar: nazucar,
              id: "4"
            },
            mermelada: {
              amount: data? data.items.mermelada.amount: 0,
              id: "5"
            }
        }
        
      })
        
    
  

      const embed = new Discord.MessageEmbed()
      .setTitle("Has recolectado estos items en tu aventura con Gru y los minions")
      .setAuthor({name: `${interaction.user.tag}`, iconURL: `${interaction.user.displayAvatarURL({dynamic: true})}`})
      .setDescription(`x${finalitems.join("\nx")}`)
      .setColor("RANDOM")
      .setTimestamp()

      interaction.reply({embeds: [embed]})
       
    }

  
}