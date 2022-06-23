const default_type = require("./types/default")
const number_type = require("./types/only_numbers")
const letter_type = require("./types/only_letters.js")



class Generator{
    constructor(_length, _custom, _type){
       this.length = _length || 10
       this.custom = _custom 
       this.type = _type 
    }

    
    

    generate(){
      

      if(typeof this.length !== "number"){
        throw new Error(`The property length must be only a number, recived(${typeof this.length})`)
      }


      if(this.type && this.custom){
        throw new Error("You cannot customize a id and put a default type on the generator")
      }

      if(!this.custom){
      switch(this.type){
        case "default": {
          this.custom = default_type
        }
        break;
        case "only_numbers": {
          this.custom = number_type
        }
        break;
        case "only_letters": {
          this.custom = letter_type
        }
        break;
        case undefined: {
          this.custom = default_type
        }
        break;
        default: {
          throw new Error(`The supplied type is not a valid type, recived(${this.type})`)
        }
      }
    }
      
      
      if(!Array.isArray(this.custom)) {
      switch(typeof this.custom){
        case "string": {
          var type = this.custom.split(" ")
          
          type.forEach(element => {
            if(element.length > 1) throw new Error("For custom ids string the separated elements must be one length string")
          })
        }
        break;

      
        

        default: {
          throw new Error(`For custom ids you can only put an array or a string, recived(${typeof this.custom})`)
        }
      }
    }else{

      this.custom.forEach(element => {
        if(element.length > 1) throw new Error("For custom ids array elements must be only one length string")
      })

      var type = this.custom
    }
        const id = []
        
        
        for(let number = 0; number< this.length; number++){
           let once = type[Math.floor(Math.random() * type.length)]
           id.push(once)
        }

        return id.join("")
    }

   
    
}

module.exports = {Generator}