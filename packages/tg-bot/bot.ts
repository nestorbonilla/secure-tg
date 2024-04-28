import { Bot } from "grammy";
import dotenv from 'dotenv';

dotenv.config();

//Create a new bot
const bot = new Bot(process.env.TG_BOT_TOKEN as string);

bot.command('start', async (ctx) => {
  const id = ctx.chat.id;
  const username = ctx.from?.username || 'anon';
  const url = `${process.env.WEBSITE_URL}?id=${id}&username=${username}`;
var introMessage = `Welcome to our secure Telegram system! We respect your privacy and don't store any of your data. To get started, head over to our [iExec Data Protector Website](${url}). It'll securely protect your Telegram ID and username via an iExec app. Once protected, all data is promptly destroyed. Your data is SAFU with us!`;
await ctx.reply(introMessage, { parse_mode: 'Markdown' });
});

async function sendCustomMessage(chatId: number | string, mensaje: string) {
  try {
    await bot.api.sendMessage(chatId, mensaje);
    console.log(`Mensaje enviado a ${chatId}`);
  } catch (error) {
    console.error(`Error al enviar mensaje a ${chatId}:`, error);
  }
}

bot.start();