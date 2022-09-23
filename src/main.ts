import { MdClient } from "./services/md-client";
import { LocalStorage } from "node-localstorage";
global.localStorage = new LocalStorage("./scratch");
import * as cron from "node-cron";
import * as dotenv from "dotenv";
dotenv.config();
import sqlite from "sqlite3";

import { REST, Routes, TextChannel } from "discord.js";

const commands = [
  {
    name: "ping",
    description: "Replies with Pong!",
  },
];

const rest = new REST({ version: "10" }).setToken(process.env.TOKEN ?? "");

(async () => {
  try {
    console.log("Started refreshing application (/) commands.");

    await rest.put(Routes.applicationCommands(process.env.CLIENT_ID ?? ""), {
      body: commands,
    });

    console.log("Successfully reloaded application (/) commands.");
  } catch (error) {
    console.error(error);
  }
})();

import { Client, GatewayIntentBits } from "discord.js";
import { ChapterDb } from "./db/chapter_db";

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.on("ready", () => {
  let mdCient = new MdClient(process.env.USERNAME ?? "", process.env.PASSWORD);

  if (
    mdCient.local.getRefresh() == null &&
    mdCient.local.getRefresh() == null
  ) {
    mdCient.login();
  }
  let channel = client.channels.cache.find((channel) => {
    return channel.id == process.env.CHANNEL_ID;
  });

  cron.schedule("* * * * *", () => {
    const sqlite3 = sqlite.verbose();

    const db = new sqlite3.Database("./md.db");

    let dbClient = new ChapterDb(db);

    dbClient.findOne((_, res) => {
      let latestid = res.length > 0 ? res[0].chapter_id : "";

      mdCient
        .feed()
        .then((v) => {
          for (let index = 0; index < v.length; index++) {
            const element = v[index];

            if (element.id == latestid) {
              break;
            }

            dbClient.insert(element.id);

            (channel as TextChannel).send(
              `${element.manga_title} ${element.chapter} \n https://mangadex.org/chapter/${element.id}/1`
            );
          }
        })
        .catch((err) => {});
    });
  });
});

client.login(process.env.TOKEN ?? "");
