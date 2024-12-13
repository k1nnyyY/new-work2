const TelegramBot = require("node-telegram-bot-api");

const TOKEN = "8020257687:AAFTfQoThU4qI_DJjE8S4TEnzGBm-AKgVhw";
const bot = new TelegramBot(TOKEN, { polling: true });

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;

  const options = {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: "Открыть Web App",
            web_app: { url: "https://new-work-kohl.vercel.app" },
          },
        ],
      ],
    },
  };

  bot.sendMessage(chatId, "Нажмите на кнопку ниже, чтобы открыть Web App:", options);
});
