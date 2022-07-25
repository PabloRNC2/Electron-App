const { ipcRenderer } = require('electron')

window.onload = () => {
	ipcRenderer.send("getProducts")
}

const info = document.getElementById('info')

const name = document.getElementById('name')
const description = document.getElementById('description')
const crowns = document.getElementById('crowns')
const image = document.getElementById('image')
const discount = document.getElementById("discount")

const select = document.getElementById("select")

ipcRenderer.on("sendProducts", (event, data) => {
	JSON.parse(data).forEach(item => {
		const option = document.createElement("option")
		option.innerHTML = item.name
		option.value = item.name
		select.appendChild(option)
	})
})

function createProduct() {
	if (!name.value || !description.value || !crowns.value || !image.value) {
		return info.innerHTML = 'Debes rellenar todos los campos'
	} else {
		ipcRenderer.send(
			'createProduct',
			name.value,
			description.value,
			Number(crowns.value),
			image.value,
			Number(discount.value)

		)
	}
}

function editProduct() {
	if(!name.value) return info.innerHTML = ('Debes ingresar el nombre del producto.')

	ipcRenderer.send('editProduct', name.value, description.value, Number(crowns.value), image.value, Number(discount.value))
}

function deleteProduct() {
	ipcRenderer.send('deleteProduct', select.value)
}

ipcRenderer.on('alreadyOne', (event, data) => {
	info.innerHTML = `Ya hay un producto llamado ${data}`
})

ipcRenderer.on('notFound', (event, data) => {
	info.innerHTML = 'Este producto no existe'
})
