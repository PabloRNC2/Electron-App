const Discord = require("discord.js")
const client = new Discord.Client({intents: 32767})
const fs = require("fs")
const ms = require("ms")
const Timeout = new Discord.Collection()
const {load} = require("@lavaclient/spotify")
const {Node} = require("lavaclient")
require("@lavaclient/queue/register")
const {sMeme, eMeme, all} = require("discordia.js-memes")
const { Client } = require("djs-minigames") //importamos la clase Client de mi npm djs-minigames

client.games = new Client({
    emitEvents: true, //si los eventos se emitiran o no
    language: "ES", //el idioma que estarán los juegos, se puede poner en ingles o español, pordefecto en ingles
    playMoreThanOne: false, //si se podrán jugar más de dos partidas del mismo juego a la vez
    defaultTimeout: 60000, //el tiempo por defecto que tendrán todos los juegos de multijugador
})

client.games.on("tictactoeEnd", async(data) => { //este evento de node se emitira cuando el tictactoe acabe

if(data.status === "won"){ //si la status de el parametro data que representa el tictactoe en si es que se ha ganado que mande un embed
const embed = new Discord.MessageEmbed()
.setTitle("TicTacToe terminado")
.setDescription(`Se enfrentaron ${data.target.username} Vs ${data.user.username} y ganó ${data.winner.username}`) //data.target es el que fue retado, data.user el que hizo el comando y data.winner el que gano
//y todos son User
.setColor("BLUE")
.setTimestamp()

return data.textChannel.send({embeds: [embed]}) //data.textChannel representa un TextBasedChannel de discord.js con el método send para enviar el embed
}
if(data.status === "tied"){ //si en vez de ganarse se empató el juego que retorne otro embed
    const embed = new Discord.MessageEmbed()
    .setTitle("TicTacToe terminado")
    .setDescription(`Se enfrentaron ${data.target.username} Vs ${data.user.username} y quedaron empate`) //lo mismo que explique antes pero ahora no es data.winner ya que en este caso sería null
    .setColor("BLUE")
    .setTimestamp()  

    return data.textChannel.send({embeds: [embed]}) //enviamos el embed
}
})









const peo = new sMeme()
peo.type = 1

console.log()

const {Generator} = require("randomlya-id-generator")

const id = new Generator()

id.length = 10
id.type = "ONLY_NUMBERS"

console.log(id.generate())







client.slash = new Discord.Collection()
const slashCommandFiles = fs.readdirSync("./slashcmd").filter(file => file.endsWith(".js"))


    for(const file of slashCommandFiles){
     
        const slash = require(`./slashcmd/${file}`)

        

        client.slash.set(slash.data.name, slash)
    }
    


client.on("interactionCreate", async(interaction) => {
    if(!interaction.isCommand()) return
    const slashcmd = client.slash.get(interaction.commandName)

    if(!slashcmd) return 
    
    if(slashcmd.cooldown){
        

        if(Timeout.has(`${interaction.commandName}${interaction.user.id}`)){ 

         const embed = new Discord.MessageEmbed()
        .setTitle(`Hey! No vayas tan rápido hace poco que usaste este comando`)
        .setDescription(`Tienes que esperar ${ms(Timeout.get(`${interaction.commandName}${interaction.user.id}`) - Date.now(), {long: false})} para volver a utilizar este comando`)
        .setColor("RED")
        .setFooter({text: `Espera ${ms(Timeout.get(`${interaction.commandName}${interaction.user.id}`) - Date.now(), {long: false})}`})
        .setTimestamp()
            return interaction.reply({embeds: [embed]})
        
    }
    await slashcmd.run(client, interaction)
            
    Timeout.set(`${interaction.commandName}${interaction.user.id}`, Date.now() + slashcmd.cooldown)
    setTimeout(() => {
        Timeout.delete(`${interaction.commandName}${interaction.user.id}`)
    }, slashcmd.cooldown)

            
       
    }
    else{
        try{
            await slashcmd.run(client, interaction)
        } catch(error){
        console.log(error)
    
    }
}
    
})

client.music = new Node({
    connection:{
        host: "lavalink.oops.wtf",
        port: 443,
        password: "www.freelavalink.ga",
        secure: true
    },
    sendGatewayPayload: (id, playload) =>  client.guilds.cache.get(id).shard.send(playload)
    
})

   load({

        client: {
            id: "d592fe0b161c49a7a1dcfe353a449c94",
            secret: "c7468a75170d4a6493295a45c52b449d"
        },
        autoResolveYoutubeTracks: true
    })

    

client.on("ready", async() => {
    console.log("Bot listo")

    

        console.log(client.guilds.cache.map(g =>g.members.cache.size))
    

    client.music.connect(client.user.id)
        
   client.music.on("connect", () => {
       console.log("Conectado a LavaLink")
   })

   
    
    
})

require("./slashcommands")
require("./conexion")



client.on("shardError", error => {
    console.log(error)
})

client.login("OTU2OTk5ODk2NTU5Mzg2NjQ0.Yj4Zmw.TWLhmd2Ml8_yrB6DRgQT2H-ms_E")