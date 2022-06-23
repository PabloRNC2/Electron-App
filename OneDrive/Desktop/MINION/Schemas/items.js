const {Schema, model} = require("mongoose")

const items = new Schema({
    userID: {
        type: String,
        required: true
    },
    guildID: {
        type: String,
        required: true
    },

    items: {
        type: {
            bananas: {
                type: Number,
                default: 0
            }
        }
    },
    
        bananas: {
            type: Number,
            default: 0
        },
        manzanas: {
            type: Number,
            dafault: 0
        }
    })

module.exports = model("items", items)