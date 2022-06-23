const mongoose = require("mongoose")

mongoose.connect("mongodb+srv://pablo2008:pablo2008@minion.g7k58.mongodb.net/myFirstDatabase?retryWrites=true&w=majority", {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(db=> console.log("Conectado a MongoDB"))
.catch(err=> console.log(err))