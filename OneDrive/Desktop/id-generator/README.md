# Randomly-id-generator
A powerful node module that allows you to generate random ids:
```yarn
npm i randomly-id-generator
```

If you want to generate a random id you only have to do this: 
```js
const {Generator} = require("randomly-id-generator")

const id = new Generator()
.generate()

console.log(id) //the id generated

 //we declare id as a new Generator and we generate a new id



```
You can customize your id: 
```js
const id = new Generator()

id.length = 13 //the number of characters the id will have

id.custom = "a b c" //you can customize the characters putting on a string separeted with an empty character or on an array ["a", "b", "c"]

id.type = "only_numbers" //the type of id, you cannot customize an id and put a type otherwise the npm will throw an error

id.generate() //generates the id

console.log(id)

```
Types of ids: 
```js
"default" //the default id composed by numbers, letters and symbols
"only_numbers" //only numbers on the id
"only_letters" //only letters on the id
```

If you want to report an issue or a bug you can go to this [GitHub Repository] and report it[clik here](https://github.com/PabloRNC/randomly-id-generator/issues) to report it and I will fixed as fast as I can




