const {SlashCommandBuilder} = require("@discordjs/builders")
const Discord = require("discord.js")
const tienda = require("../precios.json")


const prueba = require("../Schemas/items")

module.exports = {
    data: new SlashCommandBuilder()
    .setName("farm")
    .setDescription("Haces de granjero y agricultor"),
    
    async run(client, interaction){


      const data = await prueba.findOne({guildID: interaction.guild.id, userID: interaction.user.id})

      if(!data){

        let newdata = await new prueba({
          userID: interaction.user.id,
          guildID: interaction.guild.id,
          items: {
            bananas: 0,
            manzanas: 0
          }
      }).save()

    
      
      
      }

      let finalitems = []
      let items = []


      const nbanana = Math.floor(Math.random() * 19)+1

      await prueba.findOneAndUpdate({guildID: interaction.guild.id, userID: interaction.user.id}, {
        $inc: {
          items: {
            bananas: nbanana
          }
        }
      })
      

      const posimanzana = Math.floor(Math.random() * 100)
      if(posimanzana >= 50){
        var nmanzana = Math.floor(Math.random() * 9) + 1

        await prueba.findOneAndUpdate({guildID: interaction.guild.id, userID: interaction.user.id}, 
          {
            
              $inc: {
                
                manzanas: nmanzana
              }
            
            
          })

        items.push("🍎")
       
      

      }
     

      finalitems.push(`${nbanana} 🍌`)
      items.forEach(i => {
        if(i === "🍎"){
          finalitems.push(`${nmanzana} 🍎`)

        }

        
      })

      
      



      
       

   
   

        

       
     
      
    
      
    
        
        
        
    
  

      const embed = new Discord.MessageEmbed()
      .setTitle("Has recolectado estos items en tu aventura")
      .setDescription(finalitems.join("\n"))

      interaction.reply({embeds: [embed]})
       
    }

  
}