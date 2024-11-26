import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { SlashCommand } from "../../models/commands";
import { formatDuration } from "../../utils/time";

export class UptimeSlashCommand extends SlashCommand {
    constructor() {
        super({
            data: new SlashCommandBuilder().setName("uptime").setDescription("Shows my uptime."),
        });
    }

    public async execute(interaction: ChatInputCommandInteraction): Promise<void> {
        const duration = formatDuration(Math.floor(interaction.client.uptime / 1000));
        const since = Math.floor(interaction.client.readyTimestamp / 1000);
        await interaction.reply(`I have been up for **${duration}** (since <t:${since}:F>)`);
    }
}
