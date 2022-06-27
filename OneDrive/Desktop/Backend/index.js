const express = require("express")
const app = express()
const cors = require("cors")
const fs = require("fs")
let clear = false
let deleted = false


app.set("port", process.env.PORT || 3001)

app.use(cors())
app.use(express.urlencoded({extended: false}))
app.use(express.json())

app.post("/update", (req, res) => {
if(req.body.delete){
  const json = require("./table.json")
   json.splice(0, json.length)
   fs.writeFile("./table.json", JSON.stringify(json), () => {
    console.log("Updated")
   })
}else{
  const json = require("./table.json")
  if(json.find(e => e.name === req.body.name)){
    const index = json.findIndex(e => e.name === req.body.name)
   json[index].points = json[index].points + 1 
   fs.writeFile("./table.json", JSON.stringify(json), () => {
    console.log("Updated")
   })
  }else{
    const json = require("./table.json")
    json.push({name: req.body.name, points: 1})
    fs.writeFile("./table.json", JSON.stringify(json), () => {
        console.log("Updated")
       })
  }
}
})

app.get("/table", (req, res) => {
    const sendedJSON = require("./table.json")
    res.status(200).send(sendedJSON)
})

app.get("/has_to_clear", (req, res) =>  {
   res.status(200).send(clear)
})

app.post("/clear", (req, res) => {
    clear = req.body.value
})

app.post("/delete", (req, res) => {
  const json = require("./table.json")
  const index = json.findIndex(e => e.name === req.body.name)
  if(index === -1){
    res.status(400).send(false)
  }else{
  if(json[index].points === 1){
    json.splice(index, 1)
  }else{
  json[index].points = json[index].points - 1
  }
  fs.writeFile("./table.json", JSON.stringify(json), () => {
    console.log("Updated")
  })
  res.status(200).send(true)
  }
})
app.listen(app.get("port"), () => {
    return console.log(`Conectado al puerto ${app.get("port")}`)
})