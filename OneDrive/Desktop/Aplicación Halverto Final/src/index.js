const { app, BrowserWindow, ipcMain, Menu, shell } = require("electron");
const { Generator } = require("randomly-id-generator");
const path = require("path");
const Player = require("./models/Player");
const Shop = require("./models/Shop");
const Buys = require("./models/Buys");
const moment = require("moment");
const aplication = app;
let controllerWindow;
let searcherWindow;
let newProductWindow;
let buysWindow;
let acceptedBuysWindow;
let declinedBuysWindow;
let winsLog;

require("./connection");

aplication.on("ready", async () => {
  controllerWindow = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  var templateMenu = [
    {
      label: "Buscador",
      submenu: [
        {
          label: "Abrir",
          click() {
            openSearcher();
          },
        },
      ],
    },
    {
      label: "Productos",
      submenu: [
        {
          label: "Administrar",
          click() {
            openNewProduct();
          },
        },
      ],
    },
    {
      label: "Compras",
      submenu: [
        {
          label: "Abrir compras realizadas",
          click() {
            openBuysWindow();
          },
        },
        {
          label: "Abrir compras aceptadas",
          click() {
            openAcceptedBuysWindow();
          },
        },
        {
          label: "Abrir compras rechazadas",
          click() {
            openDeniedBuysWindow();
          },
        },
      ],
    },
    {
      label: "Win Log",
      submenu: [
        {
          label: "Abrir",
          click() {
            openWinsLog();
          },
        },
      ],
    },
  ];
  const menu = Menu.buildFromTemplate(templateMenu);
  Menu.setApplicationMenu(menu);
  ipcMain.on("load", () => {
    const extractData = require("./readLog");
    extractData(controllerWindow);
  });
  ipcMain.on("createProfile", async (event, value) => {
    const players = await Player.find();
    const player = players.find(
      (player) => player.epicName.toLowerCase() === value.toLowerCase()
    );
    if (player) {
      return event.reply("alreadyAProfile", value);
    }
    let id = new Generator({ type: "ONLY_NUMBERS" }).generate();

    while (await Player.findOne({ display_name: id })) {
      id = new Generator({ type: "ONLY_NUMBERS" }).generate();
    }

    new Player({
      epicName: value,
      wins: [],
      currency: 0,
      display_name: id,
    }).save();

    event.reply("profileCreated", value);
  });
  ipcMain.on("submit", async (event, data, type) => {
    moment.locale("es");
    switch (type) {
      case "id":
        {
          const player = await Player.findOne({ display_name: data });
          if (!player) return event.reply("notFound");
          player.wins.map((win) => {
            if (typeof win.date === "string") return;
            win.date = moment(win.date).format("LLLL");
          });
          event.reply("dataExchange", JSON.stringify(player));
        }
        break;
      case "epic":
        {
          const players = await Player.find();
          const player = players.find(
            (player) => player.epicName.toLowerCase() === data.toLowerCase()
          );
          if (!player) return event.reply("notFound");
          player.wins.map((win) => {
            if (typeof win.date === "string") return;
            win.date = moment(win.date).format("LLLL");
          });
          event.reply("dataExchange", JSON.stringify(player));
        }
        break;
      case "twitch": {
        const players = await Player.find();
        const player = players.find(
          (player) =>
            player.twitchProfile?.displayName.toLowerCase() ===
            data.toLowerCase()
        );
        if (!player) return event.reply("notFound");
        player.wins.map((win) => {
          if (typeof win.date === "string") return;
          win.date = moment(win.date).format("LLLL");
        });
        event.reply("dataExchange", JSON.stringify(player));
      }
    }
  });

  ipcMain.on("getProducts", async (event, data) => {
    const products = await Shop.findOne();
    event.reply("sendProducts", JSON.stringify(products.items));
  });
  ipcMain.on("search", async (event, type, value) => {
    const data = await Player.find();
    const players = data.filter((player) =>
      type === "EpicGames"
        ? player.epicName.toLowerCase().includes(value.toLowerCase())
        : player.twitchProfile?.displayName
            .toLowerCase()
            .includes(value.toLowerCase())
    );
    event.reply("searchFinish", JSON.stringify(players), type);
  });

  ipcMain.on(
    "createProduct",
    async (event, name, description, crowns, image, discount) => {
      const shop = await Shop.findOne({ _id: "62cd7c95dee4146573de4e20" });
      let duplicated = false;
      shop.items.forEach((item) => {
        if (item.name === name) duplicated = true;
      });

      if (duplicated) return event.reply("alreadyOne", name);
      const newItem = {
        name: name,
        description: description,
        price: crowns,
        image: image,
        discount: discount,
      };
      await shop.updateOne({
        $push: {
          items: newItem,
        },
      });
      controllerWindow.webContents.send("createdProduct", name);
      newProductWindow.close();
    }
  );

  ipcMain.on("acceptBuys", async (event, data) => {
    const buy = await Buys.findOne({
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
      epicName: data.epicName,
    });
    await buy.updateOne({ status: "accepted" });
    event.reply("buyAccepted");
  });

  ipcMain.on("deleteProfile", async (event, data) => {
    const profile = await Player.findOne({ display_name: data });
    if (!profile) return;
    await profile.delete();
    event.reply("deletedProfile");
  });

  ipcMain.on("joinProfiles", async (event, oldId, newId) => {
    const oldProfile = await Player.findOne({ display_name: oldId });
    const newProfile = await Player.findOne({ display_name: newId });
    if (!oldProfile || !newProfile) return;
    event.reply(
      "confirmJoin",
      JSON.stringify(oldProfile),
      JSON.stringify(newProfile)
    );
  });
  ipcMain.on("join", async (event, oldId, newId) => {
    const oldProfile = await Player.findOne({ display_name: oldId });
    const newProfile = await Player.findOne({ display_name: newId });

    const allWins = newProfile.wins;
    oldProfile.wins.forEach((win) => {
      allWins.push(win);
    });
    allWins.sort((a, b) => b.date - a.date);

    await newProfile.updateOne({
      wins: allWins,
      $inc: {
        currency: +oldProfile.currency,
      },
      twitchProfile: oldProfile.twitchProfile,
    });
    await oldProfile.delete();

    event.reply("joined");
  });

  ipcMain.on("declineBuys", async (event, data) => {
    const buy = await Buys.findOne({
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
      epicName: data.epicName,
    });
    await buy.updateOne({ status: "declined" });
    const player = await Player.findOne({
      display_name: data.player.display_name,
    });
    await player.updateOne({
      $inc: {
        currency: data.item.price,
      },
    });
    event.reply("buyDeclined");
  });

  ipcMain.on(
    "editProduct",
    async (event, name, description, crowns, image, discount) => {
      const items = await Shop.findOne();
      const index = items.items.findIndex((i) => i.name === name);
      if (index === -1) return newProductWindow.webContents.send("notFound");
      const item = items.items[index];

      item.description = description !== "" ? description : item.description;
      item.price = crowns !== 0 ? crowns : item.price;
      item.image = image !== "" ? image : item.image;
      item.discount = discount !== 0 ? discount : item.discount;

      await items.updateOne({
        items: items.items,
      });

      controllerWindow.webContents.send("productEdited", name);
      newProductWindow.close();
    }
  );
  ipcMain.on("deleteLog", (event, data) => {
    const deleteLog = require("./deleteLog");
    deleteLog();
    event.reply("logDeleted");
  });

  ipcMain.on("deleteProduct", async (event, data) => {
    const items = await Shop.findOne();
    const index = items.items.findIndex((item) => item.name === data);
    if (index === -1)
      return newProductWindow.webContents.send("notFound", data);
    items.items.splice(index, 1);
    await items.updateOne({
      items: items.items,
    });
    newProductWindow.close();
    controllerWindow.webContents.send("productDeleted", data);
  });
  ipcMain.on("getBuys", async (event, data) => {
    const buys = await Buys.find();
    moment.locale("es");
    buys.map((buy) => (buy._doc.date = moment(buy._doc.date).format("LLLL")));
    event.reply("reciveBuys", buys.reverse());
  });

  ipcMain.on("addCrown", async (event, data) => {
    const profile = await Player.findOne({ display_name: data });
    await profile.updateOne({
      $inc: {
        currency: +1,
      },
      $push: {
        wins: { date: Date.now() },
      },
    });

    event.reply("crownAdded", profile.epicName);
  });

  ipcMain.on("editCurrency", async (event, display_name, currency) => {
    const profile = await Player.findOne({ display_name: display_name });

    await profile.updateOne({ currency: currency });

    event.reply("currencyEdited", profile.epicName, currency);
  });

  ipcMain.on("twitchDesvincule", async (event, id, input) => {
    const profile = await Player.findOne({ display_name: id });

    await profile.updateOne({ twitchProfile: null, profileImage: null });

    event.reply("desvinculed");
  });

  ipcMain.on("getWinLog", async (event, type) => {
    moment.locale("es");
    const players = await Player.find();
    let Wins = [];

    for (let player of players) {
      for (let win of player.wins) {
        Wins.push({
          date: win.date,
          epicName: player.epicName,
        });
      }
    }
    if (type === "Más Antigua") Wins.sort((a, b) => a.date - b.date);
    if (type === "Más Reciente") Wins.sort((a, b) => b.date - a.date);

    Wins.map((win) => (win.date = moment(win.date).format("LLLL")));

    event.reply("giveWinsLog", JSON.stringify(Wins));
  });

  ipcMain.on("deleteWin", async (event, data) => {
    moment.locale("es");

    const value = data.split("/");
    const id = value[0];
    const date = Number(value[1]);

    const profile = await Player.findOne({ display_name: id });
    let index = -1;
    profile.wins.forEach((win, element) => {
      if (win.date === date) index = element;
    });
    profile.wins.splice(index, 1);
    profile.currency -= 1;
    await profile.updateOne({
      wins: profile.wins,
    });
    await profile.updateOne({
      $inc: {
        currency: -1,
      },
    });

    profile.wins.map((win) => {
      if (typeof win.date === "string") return;
      win.date = moment(win.date).format("LLLL");
    });

    event.reply("dataExchange", JSON.stringify(profile));
  });
  controllerWindow.loadFile(path.join(__dirname, "views", "controlador.html"));
});

function openSearcher() {
  searcherWindow = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  searcherWindow.loadFile(path.join(__dirname, "views", "searcher.html"));
}

function openNewProduct() {
  newProductWindow = new BrowserWindow({
    height: 500,
    width: 500,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  newProductWindow.loadFile(path.join(__dirname, "views", "newProduct.html"));
}

function openBuysWindow() {
  buysWindow = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  buysWindow.loadFile(path.join(__dirname, "views", "buys.html"));
}

function openAcceptedBuysWindow() {
  acceptedBuysWindow = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  acceptedBuysWindow.loadFile(
    path.join(__dirname, "views", "acceptedBuys.html")
  );
}

function openDeniedBuysWindow() {
  declinedBuysWindow = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  declinedBuysWindow.loadFile(
    path.join(__dirname, "views", "declinedBuys.html")
  );
}

function openWinsLog() {
  winsLog = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  winsLog.loadFile(path.join(__dirname, "views", "winLog.html"));
}
