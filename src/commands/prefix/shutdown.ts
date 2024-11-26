import { Message } from "discord.js";
import { PrefixCommand } from "../../models/commands/prefix";

export class ShutdownPrefixCommand extends PrefixCommand {
    constructor() {
        super({ name: "shutdown", description: "Shuts down the bot.", devOnly: true });
    }

    public async execute(message: Message): Promise<void> {
        await message.reply("Shutting down...");
        await message.client.destroy();
    }
}
