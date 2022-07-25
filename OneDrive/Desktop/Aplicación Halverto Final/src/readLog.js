const Player = require("./models/Player");
const { Generator } = require("randomly-id-generator");
const { ipcMain } = require("electron");
const moment = require("moment");
async function extractData(controllerWindow) {
  const Constants = require("./Constants");
  const { readFileSync, writeFileSync } = require("fs");
  let LOG = Constants.LOG_FILE_PATH;
  let file = await readFileSync(LOG, "utf8");
  let lines = file.split("\n");
  let playerLines = lines.filter(
    (line) =>
      line.match(Constants.PLAYER_TARGET_STRING) &&
      line.match(/(win_|ps4_|xb1_|ps5_|switch_|xsx_)/g)
  );
  let players = {};
  for (let line of playerLines) {
    let splitter = "";
    if (line.match(/win_/g)) splitter = "win_"; // PC
    if (line.match(/ps4_/g)) splitter = "ps4_"; // PS4
    if (line.match(/xb1_/g)) splitter = "xb1_"; // Xbox One
    if (line.match(/ps5_/g)) splitter = "ps5_"; // PS5
    if (line.match(/switch_/g)) splitter = "switch_"; // Switch
    if (line.match(/xsx_/g)) splitter = "xsx_"; // Xbox Series X y Series S

    let player = line.split(splitter)[1].split(/ \(/g)[0].toLowerCase();
    if (!players[player]) {
      players[player] = 1;
    } else {
      players[player] += 1;
    }
  }

  let winLine = lines.filter((line) =>
    line.match(Constants.WINNER_TARGET_STRING)
  )[0];
  let winner;
  if (winLine) {
    let splitter = winLine.match(/win_/g)
      ? "win_"
      : winLine.match(/ps4_/g)
      ? "ps4_"
      : winLine.match(/xb1_/g)
      ? "xb1_"
      : winLine.match(/ps5_/g)
      ? "ps5_"
      : winLine.match(/switch_/g)
      ? "switch_"
      : winLine.match(/xsx_/g)
      ? "xsx_"
      : null;
    if (splitter) {
      winner = winLine.split(splitter)[1].split(/ squadId/g)[0];
    }
  }

  if (!winner) return controllerWindow.webContents.send("emptyLog");

  await writeFileSync(LOG, "", "utf-8");

  moment.locale("es");

  const data = await Player.findOne({ epicName: winner });

  if (data) {
    const object = {
      date: Date.now(),
    };
    await data.updateOne({ $push: { wins: object } });
    await data.updateOne({ $inc: { currency: +1 } });
  } else {
    let id = new Generator({ type: "ONLY_NUMBERS" }).generate();

    while (await Player.findOne({ display_name: id })) {
      id = new Generator({ type: "ONLY_NUMBERS" }).generate();
    }
    const object = {
      date: Date.now(),
    };
    new Player({
      epicName: winner,
      display_name: id,
      wins: [object],
    }).save();
  }

  controllerWindow.webContents.send("newWin", winner);
}

module.exports = extractData;
