import { Message } from "discord.js";
import { PrefixCommand } from "../../models/commands";
import { formatDuration } from "../../utils/time";

export class UptimePrefixCommand extends PrefixCommand {
    constructor() {
        super({ name: "uptime", description: "Shows my uptime." });
    }

    public async execute(message: Message): Promise<void> {
        const duration = formatDuration(Math.floor(message.client.uptime / 1000));
        const since = Math.floor(message.client.readyTimestamp / 1000);
        await message.reply({
            content: `I have been up for **${duration}** (since <t:${since}:R>)`,
            allowedMentions: { repliedUser: false },
        });
    }
}
