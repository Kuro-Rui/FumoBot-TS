// import { PermissionsBitField } from "discord.js";

export interface CommandOptions {
    // permissions?: PermissionsBitField[];
    cooldown?: number;
    devOnly?: boolean;
}

export abstract class Command {
    // public permissions: PermissionsBitField[];
    public cooldown: number;
    public devOnly: boolean;

    constructor(options: CommandOptions) {
        // this.permissions = options.permissions || [];
        this.cooldown = options.cooldown || 0;
        this.devOnly = options.devOnly || false;
    }

    public abstract execute(...args: any[]): Promise<void>;
}
