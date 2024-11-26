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
    const command = commandName ? fumo.prefixCommands.get(commandName) : undefined;
    if (!command) {
        fumo.logger.error(`Unknown prefix command: ${commandName}`);
        return;
    }
    if (command.devOnly && !fumo.isOwner(message.author.id)) return;

    try {
        await command.execute(message, args);
    } catch (error) {
        fumo.logger.error(error as string);
        await message.reply({
            content: "An error occured while running this command.",
            allowedMentions: { repliedUser: false },
            failIfNotExists: false,
        });
    }
});

fumo.on(Events.InteractionCreate, async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    const command = fumo.slashCommands.get(interaction.commandName);
    if (!command) {
        fumo.logger.error(`Slash command "${interaction.commandName}" not found.`);
        return;
    }

    try {
        await command.execute(interaction);
    } catch (error) {
        fumo.logger.error(error as string);
        const options = {
            content: "An error occured while running this command.",
            ephemeral: true,
        };
        if (interaction.replied || interaction.deferred) await interaction.followUp(options);
        else await interaction.reply(options);
    }
});

fumo.start();

process.on("SIGINT", async () => await fumo.destroy());
