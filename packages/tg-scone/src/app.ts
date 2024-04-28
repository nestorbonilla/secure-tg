import * as fs from "fs/promises";
import { Bot } from 'grammy'; // Import Bot from 'grammy' module using ES module syntax
import { IExecDataProtector } from '@iexec/dataprotector';

import { TelegramData, extractDataFromZipFile } from "./utils";

const iexecOut: string | undefined = process.env.IEXEC_OUT || "/tmp/iexec_out";
const iexecIn: string | undefined = process.env.IEXEC_IN || "/tmp/iexec_in";
const dataFileName: string | undefined =
    process.env.IEXEC_DATASET_FILENAME || "protectedData.zip";

(async () => {
    try {
        // args
        // 2: bot token
        let botToken = process.argv[2];
        // 3: recipient address
        let recipientAddress = process.argv[3];
        // 4: message to send via telegram
        let message = process.argv[4];
        
        // Start the bot
        const bot = new Bot(botToken);
        bot.start();

        // The following line is temporary to try access a dataset, given scone registry access has not been granted yet
        const data: TelegramData = await extractDataFromZipFile(`${iexecIn}/${dataFileName}`);
        let text: string = `Hello ${data.username}!, ${message}`;
        await sendMessage(bot, data.id, text);
        
        bot.stop();

        // Append some results
        if (!iexecOut) {
            throw new Error("Environment variable IEXEC_OUT is not set.");
        }

        await fs.writeFile(`${iexecOut}/result.txt`, text);
        console.log(text);
        // Declare everything is computed
        const computedJsonObj = {
            "deterministic-output-path": `${iexecOut}/result.txt`,
        };
        await fs.writeFile(
            `${iexecOut}/computed.json`,
            JSON.stringify(computedJsonObj)
        );
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
})();

// Function to send a custom message to a specific chat
async function sendMessage(bot: Bot, tgId: number, message: string) {
    try {
      await bot.api.sendMessage(tgId, message);
    } catch (error) {
      console.error(`Error sending message to ${tgId}:`, error);
    }
  }