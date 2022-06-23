const Discord = require("discord.js")
const {REST} = require("@discordjs/rest")
const {Routes} = require("discord-api-types/v9")
const fs = require("fs")


const commands  = []

const slashCommandFiles = fs.readdirSync("./slashcmd").filter(file => file.endsWith(".js"))

for(const file of slashCommandFiles){
    const slash = require(`./slashcmd/${file}`)
    commands.push(slash.data.toJSON())
}

const rest = new REST({version: "9"}).setToken("OTU2OTk5ODk2NTU5Mzg2NjQ0.Yj4Zmw.k9nV-rxRCOLsxTYqaR7AtFHI154")

createSlash()

async function createSlash(){
    try {
    await rest.put(
        Routes.applicationCommands("956999896559386644"), {
            body: commands
        }
    )

    console.log("Slash Commands Agregados Correctamente")
    } catch(error){
        console.log(error)
    }
}
