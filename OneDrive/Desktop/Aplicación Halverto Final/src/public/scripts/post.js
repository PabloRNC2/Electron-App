const { ipcRenderer } = require('electron')
const info = document.getElementById('info')
const select = document.getElementById('select')
const selectCrowns = document.getElementById("selectCrowns")
const input = document.getElementById('id')

function load() {
	ipcRenderer.send('load')
}

function deleteWin() {
	
	ipcRenderer.send("deleteWin", selectCrowns.value)
}

function submit() {
  
	info.innerHTML = ''
	ipcRenderer.send('submit', input.value, select.value)
}

ipcRenderer.on('newWin', (event, data) => {
	info.innerHTML = `Se añadió una victoria a ${data}`
})
ipcRenderer.on('dataExchange', (event, data) => {
	const table = document.getElementById('table')

	const div = document.getElementById('buscador')
	const row = document.getElementById('row')

	const crown_add_button = document.getElementById('add_crown')
	if (crown_add_button) {
		div.removeChild(crown_add_button)
	}

	const currency_div = document.getElementById('div2')

	if (currency_div) {
		row.removeChild(currency_div)
	}

	table.innerHTML = ''
    selectCrowns.innerHTML = ''
	const crownNumber = document.getElementById('crownNumber')
	crownNumber.innerHTML = `Currency: ${JSON.parse(data).currency}`
	const infoRow = table.insertRow(0)
	const cell = infoRow.insertCell(0)
	const text = document.createTextNode(JSON.parse(data).epicName)
	cell.appendChild(text)
	JSON.parse(data)
		.wins.reverse()
		.forEach((win, index) => {
			const option = document.createElement("option")
			option.innerHTML = `${JSON.parse(data).wins.length - index}-${win.date}`
			option.value = `${JSON.parse(data).display_name}/${win.date}`
			option.style.color = "black"
			selectCrowns.appendChild(option)
			const row = table.insertRow(index + 1)
			const cell_points = row.insertCell(0)
			cell_points.className = 'numberWin'
			const number = document.createTextNode(JSON.parse(data).wins.length - index)
			cell_points.appendChild(number)
			const cell_name = row.insertCell(1)
			cell_name.className = 'timestamp'
			const date = document.createTextNode(win.date)
			cell_name.appendChild(date)
		})
	const button = document.createElement('button')
	button.id = 'add_crown'
	button.innerHTML = 'Añadir victoria'
	button.className = 'next-button'
	div.appendChild(button)

	button.onclick = () => {
		ipcRenderer.send('addCrown', JSON.parse(data).display_name)
	}

	const div2 = document.createElement('div')
	const number_input = document.createElement('input')
	const currency_button = document.createElement('button')
	div2.className = 'col-sm'
	div2.id = 'div2'
	number_input.type = 'number'
	number_input.placeholder = 'Edita currency'
	number_input.style.color = 'black'
	currency_button.className = 'next-button'
	currency_button.innerHTML = 'Guardar'
	row.appendChild(div2)
	div2.appendChild(number_input)
	div2.appendChild(currency_button)

	currency_button.onclick = () => {
		ipcRenderer.send('editCurrency',JSON.parse(data).display_name, Number(number_input.value))
	}
})

function deleteLog() {
	ipcRenderer.send('deleteLog')
}

select.onchange = () => {
	switch (select.value) {
	case 'id' : {
		input.placeholder = 'Ingrese la ID del usuario'
	}
		break
	case 'epic' : {
		input.placeholder = 'Ingrese el nombre de EpicGames'
	}
		break
	case 'twitch' : {
		input.placeholder = 'Ingrese el nombre de Twitch'
	}
	}
}


ipcRenderer.on('notFound', () => {
	info.innerHTML = 'No se ha encontrado al usuario'
})

ipcRenderer.on('emptyLog', () => {
	info.innerHTML = 'El log del juego esta vacio'
})

ipcRenderer.on('logDeleted', () => {
	info.innerHTML = 'Log borrado correctamente'
})

ipcRenderer.on('createdProduct', (event, data) => {
	info.innerHTML = `El producto: ${data} fue creado`
})

ipcRenderer.on('crownAdded', (event, data) => {
	info.innerHTML = `Se añadió una corona a ${data} correctamente`
})

ipcRenderer.on('currencyEdited', (event, name, value) => {
	info.innerHTML = `Se edito la currency de ${name} a ${value}`
})

ipcRenderer.on('productEdited', (event, data) => {
	info.innerHTML = `Se editó el producto ${data}`
})

ipcRenderer.on("productDeleted", (event, data) => {
	info.innerHTML = `Se eliminó el producto ${data}`
})
