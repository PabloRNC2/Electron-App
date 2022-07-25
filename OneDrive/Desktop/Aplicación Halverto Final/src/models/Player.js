const { Schema, model } = require('mongoose')

const Player = model(
	'Player',
	new Schema(
		{
			epicName: {
				type: String,
				required: true,
			},
			twitchProfile: {
				type: Object,
				default: null,
			},
			wins: {
				type: Array,
				required: true,
			},
			display_name: {
				type: String,
				required: true,
			},
			currency: {
				type: Number,
				default: 1,
			},
			profileImage: {
				type: String,
				default: null,
			},
		},
		{
			timestamps: true,
		}
	)
)

module.exports = Player
