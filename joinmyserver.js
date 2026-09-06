const mineflayer = require("mineflayer");

const CONFIG = {
  host: "Torsmps1.aternos.me",
  port: 56747,

  // Change this to whatever username you want for the bot
  username: "AxelBot",

  version: "1.21.11",
  auth: "offline",

  reconnectDelay: 5000,
};

let bot;

function startBot() {
  console.log("🤖 Starting Minecraft bot...");

  bot = mineflayer.createBot({
    host: CONFIG.host,
    port: CONFIG.port,
    username: CONFIG.username,
    version: CONFIG.version,
    auth: CONFIG.auth,
  });

  // Successfully joined
  bot.once("spawn", () => {
    console.log("✅ Bot joined the server!");

    setTimeout(() => {
      bot.chat("Hello! I am AxelBot 👋");
      console.log("💬 Join message sent.");
    }, 2000);
  });

  // Kicked
  bot.on("kicked", (reason) => {
    console.log("⚠️ Bot was kicked.");
    console.log("Reason:", reason);
  });

  // Disconnected
  bot.on("end", () => {
    console.log(
      `🔄 Bot disconnected. Reconnecting in ${CONFIG.reconnectDelay / 1000} seconds...`
    );

    setTimeout(() => {
      startBot();
    }, CONFIG.reconnectDelay);
  });

  // Connection/error problems
  bot.on("error", (error) => {
    console.log("❌ Error:", error.message);
  });

  // Show server chat in terminal
  bot.on("messagestr", (message) => {
    console.log(`💬 ${message}`);
  });
}

startBot();