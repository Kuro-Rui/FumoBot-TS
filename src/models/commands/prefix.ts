import { Message } from "discord.js";
import { Command, CommandOptions } from ".";

export interface PrefixCommandOptions extends CommandOptions {
    name: string;
    aliases?: string[];
    description: string;
}

export abstract class PrefixCommand extends Command {
    public name: string;
    public aliases: string[];
    public description: string;

    constructor(options: PrefixCommandOptions) {
        super(options);
        this.name = options.name;
        this.aliases = options.aliases || [];
        this.description = options.description;
    }

    public abstract execute(message: Message, args: string[]): Promise<void>;
}
