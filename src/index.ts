import "dotenv/config";
import { Events, IntentsBitField, Partials } from "discord.js";
import { FumoBot } from "./models/bot";
import config from "../config.json";

export const fumo = new FumoBot({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.DirectMessages,
        IntentsBitField.Flags.MessageContent,
    ],
    partials: [Partials.Channel, Partials.GuildMember, Partials.Message, Partials.User],
    mobile: true,
});

// TODO: Add events handler

fumo.on(Events.MessageCreate, async (message) => {
    if (message.author.bot) return;

    const prefixes = [config.prefix, String(fumo.user)];
    let usedPrefix = "";
    for (const prefix of prefixes) {
        if (!message.content.toLowerCase().startsWith(prefix.toLowerCase())) continue;
        usedPrefix = prefix;
    }
    if (!usedPrefix) return;

    const args = message.content.slice(usedPrefix.length).trim().split(/\s+/g);
    const commandName = args.shift()?.toLowerCase();
    if (!commandName) return;

    await fumo.handlers.commands.handlePrefixCommand(message, commandName, args);
});

fumo.on(Events.InteractionCreate, async (interaction) => {
    if (interaction.isChatInputCommand()) {
        await fumo.handlers.commands.handleSlashCommand(interaction);
    }
});

console.clear();
fumo.start();

process.on("SIGINT", () => fumo.destroy());
