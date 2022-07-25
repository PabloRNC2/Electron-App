const { ipcRenderer } = require('electron')

window.onload = () => {
	get()
}

function get(){

	ipcRenderer.send('getBuys')
}

ipcRenderer.on('reciveBuys', (event, data) => {
	const table = document.getElementById('table')

    console.log(data)

	table.innerHTML = ''

	const row = table.insertRow(0)

	const date = row.insertCell(0)
	const date_text = document.createTextNode('Fecha')
	date.appendChild(date_text)
	const name = row.insertCell(1)
	const name_text = document.createTextNode('Nombre comprador')
	name.appendChild(name_text)
	const nombre_articulo = row.insertCell(2)
	const nombre_articulo_text = document.createTextNode('Nombre artículo')
	nombre_articulo.appendChild(nombre_articulo_text)
	const price = row.insertCell(3)
	const price_text = document.createTextNode('Precio')
	price.append(price_text)

	data.filter(buy => buy._doc.status === "accepted").forEach((buy, index) => {
		const row = table.insertRow(index + 1)

		const date = row.insertCell(0)
		const date_text = document.createTextNode(buy._doc.date)
		date.appendChild(date_text)
		const name = row.insertCell(1)
		const name_text = document.createTextNode(buy._doc.player.epicName + '/' + buy._doc.player.twitchProfile.displayName)
		name.appendChild(name_text)
		const nombre_articulo = row.insertCell(2)
		const nombre_articulo_text = document.createTextNode(buy._doc.item.name)
		nombre_articulo.appendChild(nombre_articulo_text)
		const price = row.insertCell(3)
		const price_text = document.createTextNode(buy._doc.item.price)
		price.append(price_text)
	})
})
