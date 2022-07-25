const { connect } = require('mongoose')
require('dotenv').config()

connect('mongodb+srv://Halverto:H25237865@cluster0.7b8lu.mongodb.net/fgwl?retryWrites=true&w=majority', {
	useNewUrlParser: true,
	useUnifiedTopology: true
}).then(() => {
	console.log('Conectado a MongoDB')
})

