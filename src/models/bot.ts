import { Client, ClientOptions, User } from "discord.js";
import { Logger } from "./logger";
import { CommandsHandler } from "./handlers/commands";

export interface FumoOptions extends ClientOptions {
    mobile?: boolean;
}

export class FumoBot extends Client {
    private readonly logger = new Logger("FumoBot");
    public readonly handlers: { commands: CommandsHandler };

    constructor(options: FumoOptions) {
        super(options);
        if (options.mobile) {
            const { DefaultWebSocketManagerOptions } = require("@discordjs/ws");
            DefaultWebSocketManagerOptions.identifyProperties.browser = "Discord iOS";
        }
        this.handlers = { commands: new CommandsHandler(this) };
    }

    public async start(): Promise<void> {
        if (!this.token) throw new Error("The token is not provided.");

        this.logger.info("Starting FumoBot...");
        await this.login(this.token);
        this.logger.info(`${this.user?.username} is online! Initializing commands...`);
        await this.handlers.commands.initializeCommands();
    }

    public async isOwner(userID: string): Promise<boolean> {
        if (!this.application) return false;

        const application = await this.application.fetch();
        if (!application.owner) return false;
        if (application.owner instanceof User) return application.owner.id === userID;
        else return application.owner.members.map((member) => member.id).includes(userID);
    }
}
