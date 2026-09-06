const mineflayer = require("mineflayer");

const HOST = "Torsmps1.aternos.me";
const PORT = 56747;
const BOT_USERNAME = "AxelBot";

const RECONNECT_DELAY = 5000;

let reconnecting = false;

function startBot() {
  console.log(`🤖 Connecting to ${HOST}:${PORT}...`);

  const bot = mineflayer.createBot({
    host: HOST,
    port: PORT,
    username: BOT_USERNAME,
    version: "1.21.11",
    auth: "offline",
  });

  bot.once("spawn", () => {
    reconnecting = false;

    console.log("✅ Bot successfully joined the server!");

    setTimeout(() => {
      bot.chat("Hello! I am AxelBot 👋");
      console.log("💬 Join message sent.");
    }, 2000);
  });

  bot.on("kicked", (reason) => {
    console.log("⚠️ Bot was kicked:");
    console.log(reason);
  });

  bot.on("error", (error) => {
    console.log("❌ Connection error:", error.message);
  });

  bot.on("end", () => {
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

startBot();
