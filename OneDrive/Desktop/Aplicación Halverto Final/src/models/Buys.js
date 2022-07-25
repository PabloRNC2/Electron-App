const { Schema, model } = require('mongoose')

const Buys = model(
	'Buys',
	new Schema(
		{
			player: {
				type: Object,
				required: true,
			},
			item: {
				type: Object,
				required: true,
			},
			date: {
				type: Number,
				required: true,
			},
			status: {
              type: String,
			  default: null
			}
		},
		{
			timestamps: true,
		}
	)
)

module.exports = Buys