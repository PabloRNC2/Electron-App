const { ipcRenderer } = require("electron")
const select = document.getElementById("select")
const table = document.getElementById("table")
window.onload = () => {
    search()
}
function search() {
    ipcRenderer.send("getWinLog", select.value)
}

ipcRenderer.on("giveWinsLog", (event, wins) => {
    const row = table.insertRow(0)
    const date_cell = row.insertCell(0)
    const date = document.createTextNode("Fecha")
    date_cell.appendChild(date)
    const name_cell = row.insertCell(0)
    const name = document.createTextNode("Nombre")
    name_cell.appendChild(name)
    JSON.parse(wins).forEach((win, index) => {
    const row = table.insertRow(index + 1)
    const date_cell = row.insertCell(0)
    const date = document.createTextNode(win.date)
    date_cell.appendChild(date)
    const name_cell = row.insertCell(0)
    const name = document.createTextNode(win.epicName)
    name_cell.appendChild(name)
})
})

select.onchange = () => {
    search()
}