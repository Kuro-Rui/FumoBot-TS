import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { Command, CommandOptions } from "./command";

export interface SlashCommandOptions extends CommandOptions {
    data: SlashCommandBuilder;
}

export abstract class SlashCommand extends Command {
    public data: SlashCommandBuilder;

    constructor(options: SlashCommandOptions) {
        super(options);
        this.data = options.data;
    }

    public abstract execute(interaction: ChatInputCommandInteraction): Promise<void>;
}
