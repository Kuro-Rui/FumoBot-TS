import { Client, ClientOptions, Collection, Routes, User } from "discord.js";
import { PrefixCommand, SlashCommand } from "./commands";
import { Logger } from "./logger";
import { allPrefixCommands, allSlashCommands } from "../commands";

export interface FumoOptions extends ClientOptions {
    mobile?: boolean;
}

export class FumoBot extends Client {
    public readonly logger = new Logger("FumoBot");
    public cooldowns: Collection<string, Collection<string, number>> = new Collection();
    public prefixCommands: Collection<string, PrefixCommand> = new Collection();
    public slashCommands: Collection<string, SlashCommand> = new Collection();

    constructor(options: FumoOptions) {
        super(options);
        if (options.mobile) {
            const { DefaultWebSocketManagerOptions } = require("@discordjs/ws");
            DefaultWebSocketManagerOptions.identifyProperties.browser = "Discord iOS";
        }
    }

    public async start(): Promise<void> {
        if (!this.token) throw new Error("The token is not provided.");

        this.logger.info("Starting FumoBot...");
        await this.login(this.token);
        this.logger.info(`${this.user?.username} is online! Fetching application...`);
        await this.application?.fetch();
        this.logger.info(`Application ${this.application?.name} fetched! Loading commands...`);
        this.loadCommands();
        await this.refreshAppCommands();
    }

    public loadPrefixCommand(command: PrefixCommand): void {
        this.prefixCommands.set(command.name.toLowerCase(), command);
    }

    public async refreshAppCommand(command: SlashCommand): Promise<void> {
        const appCommands = await this.application?.commands.fetch();
        const appCommand = appCommands?.find((c) => c.name === command.data.name);
        if (!appCommand) {
            this.logger.error(`Application command "${command.data.name}" not found.`);
            return;
        }
        if (!this.application?.id) return;
        this.rest.put(Routes.applicationCommand(this.application.id, appCommand.id), {
            body: command.data,
        });
    }

    public loadSlashCommand(command: SlashCommand, refresh: boolean = false): void {
        this.slashCommands.set(command.data.name.toLowerCase(), command);
        if (refresh) {
            const command = this.application?.commands.cache;
            this.logger.debug(command);
            // this.rest.put(Routes.applicationCommand(this.application.id), { body: this.slashCommands })
        }
    }

    public loadCommands(
        prefix: boolean = true,
        slash: boolean = true,
        refresh: boolean = false,
    ): void {
        if (prefix) allPrefixCommands.forEach((command) => this.loadPrefixCommand(command));
        if (slash) allSlashCommands.forEach((command) => this.loadSlashCommand(command, refresh));
    }

    public async refreshAppCommands(): Promise<void> {
        if (!this.application) {
            this.logger.info(
                "I can't refresh application commands because the application is not cached yet.",
            );
            return;
        }

        this.logger.info(`Refreshing ${this.slashCommands.size} application commands...`);
        this.rest
            .put(Routes.applicationCommands(this.application.id), {
                body: this.slashCommands.map((slashCommand) => slashCommand.data),
            })
            .then((data) => {
                this.logger.info(
                    `Successfully refreshed ${(data as any[]).length} application commands.`,
                );
            })
            .catch((error) => this.logger.error(error));
    }

    public isOwner(userID: string): boolean {
        const owner = this.application?.owner;
        if (!owner) return false;
        if (owner instanceof User) return owner.id === userID;
        else return owner.members.map((member) => member.id).includes(userID);
    }
}
