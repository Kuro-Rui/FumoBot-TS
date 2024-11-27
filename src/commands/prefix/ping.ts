import { Message } from "discord.js";
import { PrefixCommand } from "../../models/commands";

export class PingPrefixCommand extends PrefixCommand {
    constructor() {
        super({ name: "ping", description: "Shows my latency." });
    }

    public async execute(message: Message): Promise<void> {
        await message.reply({
            content: `Pong! Latency is ${message.client.ws.ping}ms.`,
            allowedMentions: { repliedUser: false },
        });
    }
}
