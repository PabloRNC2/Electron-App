const { model, Schema } = require('mongoose')

const Shop = model('Shop', 
	new Schema(
		{
			items: [
				{
					image: { type: String, required: true },
					name: { type: String, required: true },
					price: { type: Number, required: true },
					description: { type: String, required: true },
					discount: {type: Number, required: true}
				}  
			]
		},
		{
			timestamps: true
		}
	)
)

module.exports = Shop