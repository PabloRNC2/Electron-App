const Discord = require("discord.js")
const client = new Discord.Client({intents: 32767})
const fs = require("fs")



client.slash = new Discord.Collection()
const slashCommandFiles = fs.readdirSync("./slashcmd").filter(file => file.endsWith(".js"))

for(const file of slashCommandFiles){
    const slash = require(`./slashcmd/${file}`)
    client.slash.set(slash.data.name, slash)
}

client.on("interactionCreate", async(interaction) => {
    if(!interaction.isCommand()) return
    const slashcmd = client.slash.get(interaction.commandName) 

    try{
        await slashcmd.run(client, interaction)
    } catch(error){
        console.log(error)
    }
})

client.on("ready", async() => {
    console.log("Bot listo")
})

require("./slashcommands")
require("./conexion")


client.login("OTU2OTk5ODk2NTU5Mzg2NjQ0.Yj4Zmw.k9nV-rxRCOLsxTYqaR7AtFHI154")