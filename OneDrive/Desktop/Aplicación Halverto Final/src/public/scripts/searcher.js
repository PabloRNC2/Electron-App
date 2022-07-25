const { ipcRenderer } = require("electron");
const select = document.getElementById("select");
const order_select = document.getElementById("order-select");
const value = document.getElementById("input_text");
function search() {
  switch (select.value) {
    case "EpicGames":
      {
        ipcRenderer.send("search", "EpicGames", value.value);
      }
      break;
    case "Twitch": {
      ipcRenderer.send("search", "Twitch", value.value);

  }
}
}

function createPlayer() {
  const input = document.getElementById("newProfileName")
  ipcRenderer.send("createProfile", input.value)
}

ipcRenderer.on("profileCreated", (event, data) => {
  const p = document.getElementById("info")
  p.innerHTML = `Se ha creado el perfil de ${data}`
  p.style.display = "block"
  search()
})
ipcRenderer.on("alreadyAProfile", (event, data) => {
  const p = document.getElementById("info")
  p.innerHTML = `Ya hay un perfil llamado ${data}`
  p.style.display = "block"
})
ipcRenderer.on("searchFinish", (event, data, type) => {

  const table = document.getElementById("table");
  table.innerHTML = "";

  const parseData = JSON.parse(data)
  if(order_select.value === "Mayor a menor") parseData.sort((a, b) => b.currency - a.currency)
  if(order_select.value === "Menor a mayor") parseData.sort((a, b) => a.currency - b.currency)

  const row = table.insertRow(0);

  if (type === "EpicGames") {
    const cell_name = row.insertCell(0);
    const name = document.createTextNode("Nombre EpicGames");
    cell_name.appendChild(name);
  } else {
    const cell_name = row.insertCell(0);
    const name = document.createTextNode("Nombre Twitch");
    cell_name.appendChild(name);
  }
  const cell_id = row.insertCell(1);
  const id = document.createTextNode("Id");
  cell_id.appendChild(id);
  const cell_crowns = row.insertCell(2);
  const crowns = document.createTextNode("Currency");
  cell_crowns.appendChild(crowns);
  const cell_wins = row.insertCell(3)
  const wins = document.createTextNode("Victorias");
  cell_wins.appendChild(wins)
  if (type === "EpicGames") {
    const cell_name = row.insertCell(4);
    const name = document.createTextNode("Nombre Twitch");
    cell_name.appendChild(name);
  } else {
    const cell_name = row.insertCell(4);
    const name = document.createTextNode("Nombre EpicGames");
    cell_name.appendChild(name);
  }
  const cell_profileImg = row.insertCell(5);
  const profileImg = document.createTextNode("Borrar Perfil")
  cell_profileImg.appendChild(profileImg)

  parseData.forEach((profile, index) => {
    const row = table.insertRow(index + 1);
    if (type === "EpicGames") {
      const cell_name = row.insertCell(0);
      const name = document.createTextNode(profile.epicName);
      cell_name.appendChild(name);
    } else {
      const cell_name = row.insertCell(0);
      const name = document.createTextNode(profile.twitchProfile.displayName);
      cell_name.appendChild(name);
    }
    const cell_id = row.insertCell(1);
    const id = document.createTextNode(profile.display_name);
    cell_id.appendChild(id);
    const cell_crowns = row.insertCell(2);
    const crowns = document.createTextNode(profile.currency);
    cell_crowns.appendChild(crowns);
    const cell_wins = row.insertCell(3);
    const wins = document.createTextNode(profile.wins.length);
    cell_wins.appendChild(wins)
    if (type === "EpicGames") {
      const cell_name = row.insertCell(4);
      const name = document.createTextNode(
        profile.twitchProfile?.displayName?? "No conectado"
      );
      cell_name.appendChild(name);
    } else {
      const cell_name = row.insertCell(4);
      const name = document.createTextNode(profile.epicName);
      cell_name.appendChild(name);
    }
  const delete_cell = row.insertCell(5);
  const input = document.createElement("input")
  input.placeholder = "Añade la id del usuario"
  const button = document.createElement("button")
  button.innerHTML = "Confirmar"
  delete_cell.appendChild(input)
  delete_cell.appendChild(button)
  button.onclick = () => {
    ipcRenderer.send("deleteProfile", input.value)
  }

  if(profile.twitchProfile){
    const cell_vincule = row.insertCell(6);
    cell_vincule.innerHTML = '<button>Desvincular Twitch</button>'
    cell_vincule.onclick = () => {
      ipcRenderer.send("twitchDesvincule", profile.display_name)
    }
  }

  });
});

function fusionar() {
  const oldId = document.getElementById("oldId")
  const newId = document.getElementById("newId")
  ipcRenderer.send("joinProfiles", oldId.value, newId.value)
}

select.onchange = () => {
  if(select.value === "EpicGames") value.placeholder = "Ingrese el nombre de EpicGames"
  if(select.value === "Twitch") value.placeholder =  "Ingrese el nombre de Twitch"
}

order_select.onchange = () => {
  search()
}

ipcRenderer.on("desvinculed", () => {
  search()
})

ipcRenderer.on("deletedProfile", () => {
  search()
})

ipcRenderer.on("confirmJoin", (event, oldProfile, newProfile) => {
  const div = document.getElementById("confirm")
  const p = document.createElement("p")
  p.innerHTML = `Estas a punto de fusionar la cuenta de: ${JSON.parse(oldProfile).epicName} con ${JSON.parse(newProfile).epicName}`
  const button_accept = document.createElement("button")
  button_accept.innerHTML = "Acpetar"
  const button_decline = document.createElement("button")
  button_decline.innerHTML = "Cancelar"
  div.appendChild(p)
  div.appendChild(button_accept)
  div.appendChild(button_decline)

  button_accept.onclick = () => {
    ipcRenderer.send("join", JSON.parse(oldProfile).display_name, JSON.parse(newProfile).display_name)
  }

  button_decline.onclick = () => {
    div.innerHTML = ''
  }
})
ipcRenderer.on("joined", (event, data) => {
  const div = document.getElementById("confirm")
  div.innerHTML = ''
  search()
})