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
        type: Object,
        default: {
           
        bananas: {
                type: Object,
                default: {
                    amount: {
                        type: Number,
                        default: 0
                    },
                    id: {
                        type: String,
                        default: "1"
                    }
                }
            },
        manzanas: {
            type: Object,
            default: {
                amount: {
                    type: Number,
                    default: 0
                },
                id: {
                    type: String,
                    default: "2"
                }
            }
        },
        fresas: {
            type: Object,
            default: {
              amount: {
                  type: Number,
                  default: 0
              },
              id: {
                  type: String,
                  default: "3"
              }
            }
        },
        azucar: {
          type: Object,
          default: {
              amount: {
                  type: Number,
                  default: 0
              },
              id: {
                  type: String,
                  default: "4"
              }
          }
        },
        mermelada: {
         type: Object,
         default: {
             amount: {
                 type: Number,
                 default: 0
             },
             id: {
                 type: String,
                 default: "5"
             }
         }
        }
        }
    },
    
        
    })

module.exports = model("items", items)