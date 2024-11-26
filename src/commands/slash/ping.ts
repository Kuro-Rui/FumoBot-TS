import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { SlashCommand } from "../../models/commands";

export class PingSlashCommand extends SlashCommand {
    constructor() {
        super({
            data: new SlashCommandBuilder().setName("ping").setDescription("Shows my latency."),
        });
    }

    public async execute(interaction: ChatInputCommandInteraction): Promise<void> {
        await interaction.reply(`Pong! Latency is ${interaction.client.ws.ping}ms.`);
    }
}
