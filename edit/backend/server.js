const TelegramBot = require("node-telegram-bot-api");

const TOKEN = "7917011846:AAFQq4_MPXh_SnI6qp-0jrLanwWcRHVv6Iw";
const bot = new TelegramBot(TOKEN, { polling: true });

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;

  const options = {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: "Открыть Web App",
            web_app: { url: "https://angel-voice.ru" },
          },
        ],
      ],
    },
  };

  bot.sendMessage(chatId, "Нажмите на кнопку ниже, чтобы открыть Web App:", options);
});
