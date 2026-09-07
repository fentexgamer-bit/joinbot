const mineflayer = require("mineflayer");
const { pathfinder, Movements, goals } = require("mineflayer-pathfinder");

const HOST = "Torsmps1.aternos.me";
const PORT = 56747;
const BOT_USERNAME = "AxelBot";

const RECONNECT_DELAY = 5000;

let reconnecting = false;
let movementTimer = null;

function startBot() {
  console.log(`🤖 Connecting to ${HOST}:${PORT}...`);

  const bot = mineflayer.createBot({
    host: HOST,
    port: PORT,
    username: BOT_USERNAME,
    version: "1.21.11",
    auth: "offline",
  });

  bot.loadPlugin(pathfinder);

  bot.once("spawn", () => {
    reconnecting = false;

    console.log("✅ Bot joined the server!");

    // Join message
    setTimeout(() => {
      bot.chat("Hello! I am AxelBot 👋");
    }, 2000);

    // Start random movement
    startRandomMovement(bot);
  });

  bot.on("kicked", (reason) => {
    console.log("⚠️ Bot was kicked:", reason);
  });

  bot.on("error", (error) => {
    console.log("❌ Error:", error.message);
  });

  bot.on("end", () => {
    stopMovement();

    if (reconnecting) return;

    reconnecting = true;

    console.log(
      `🔄 Disconnected. Reconnecting in ${RECONNECT_DELAY / 1000} seconds...`
    );

    setTimeout(() => {
      reconnecting = false;
      startBot();
    }, RECONNECT_DELAY);
  });

  bot.on("messagestr", (message) => {
    console.log(`💬 ${message}`);
  });
}

function startRandomMovement(bot) {
  stopMovement();

  const defaultMove = new Movements(bot);

  function move() {
    if (!bot.entity) return;

    const distance = 5 + Math.floor(Math.random() * 10);

    const x = bot.entity.position.x + (Math.random() * 2 - 1) * distance;
    const z = bot.entity.position.z + (Math.random() * 2 - 1) * distance;

    console.log(`🚶 Moving to ${Math.round(x)}, ${Math.round(z)}`);

    bot.pathfinder.setMovements(defaultMove);

    bot.pathfinder.setGoal(
      new goals.GoalNear(x, bot.entity.position.y, z, 2)
    );

    // Pick another destination after 10–20 seconds
    movementTimer = setTimeout(move, 10000 + Math.random() * 10000);
  }

  move();
}

function stopMovement() {
  if (movementTimer) {
    clearTimeout(movementTimer);
    movementTimer = null;
  }
}

startBot();
