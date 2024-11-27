import {
    ChatInputCommandInteraction,
    Collection,
    InteractionReplyOptions,
    Message,
    Routes,
} from "discord.js";
import { FumoBot } from "../bot";
import { PrefixCommand, SlashCommand } from "../commands";
import { Logger } from "../logger";
import { allPrefixCommands, allSlashCommands } from "../../commands";

export class CommandsHandler {
    public bot: FumoBot;
    private readonly logger = new Logger("CommandsHandler");
    // TODO: Cooldowns handling
    // private cooldowns: Collection<string, Collection<string, number>> = new Collection();
    private prefixCommands: Collection<string, PrefixCommand> = new Collection();
    private slashCommands: Collection<string, SlashCommand> = new Collection();

    constructor(bot: FumoBot) {
        this.bot = bot;
    }

    public async initializeCommands(): Promise<void> {
        this.logger.info("Initializing commands...");
        this.loadPrefixCommands();
        this.loadSlashCommands();
        await this.refreshSlashCommands();
    }

    public loadPrefixCommand(command: PrefixCommand): void {
        this.prefixCommands.set(command.name.toLowerCase(), command);
    }

    public loadPrefixCommands(commands: PrefixCommand[] = allPrefixCommands): void {
        commands.forEach((command) => this.loadPrefixCommand(command));
    }

    public loadSlashCommand(command: SlashCommand): void {
        this.slashCommands.set(command.data.name.toLowerCase(), command);
    }

    public loadSlashCommands(commands: SlashCommand[] = allSlashCommands): void {
        commands.forEach((command) => this.loadSlashCommand(command));
    }

    public async refreshSlashCommand(command: SlashCommand): Promise<void> {
        const appCommands = await this.bot.application?.commands.fetch();
        const slashCommand = appCommands?.find((c) => c.name === command.data.name);
        if (!slashCommand) {
            this.logger.error(`Slash command "${command.data.name}" not found.`);
            return;
        }
        if (!this.bot.application?.id) return;
        this.bot.rest.put(Routes.applicationCommand(this.bot.application.id, slashCommand.id), {
            body: command.data,
        });
    }

    public async refreshSlashCommands(commands: SlashCommand[] = allSlashCommands): Promise<void> {
        if (!this.bot.application) {
            this.logger.info(
                "I can't refresh slash commands because the application is not cached yet.",
            );
            return;
        }

        this.logger.info(`Refreshing ${commands.length} application commands...`);
        this.bot.rest
            .put(Routes.applicationCommands(this.bot.application.id), {
                body: commands.map((slashCommand) => slashCommand.data),
            })
            .then((data) => {
                this.logger.info(
                    `Successfully refreshed ${(data as any[]).length} slash commands.`,
                );
            })
            .catch((error) => {
                this.logger.error(`An error occured when refreshing slash commands:`, error);
            });
    }

    public getPrefixCommand(name: string): PrefixCommand | undefined {
        return this.prefixCommands.get(name.toLowerCase());
    }

    public getSlashCommand(name: string): SlashCommand | undefined {
        return this.slashCommands.get(name.toLowerCase());
    }

    public async handlePrefixCommand(
        message: Message,
        name: string,
        args: string[],
    ): Promise<void> {
        const command = this.getPrefixCommand(name);
        if (!command) {
            this.logger.error(`Prefix command "${name}" not found.`);
            return;
        }
        if (command.devOnly && !(await this.bot.isOwner(message.author.id))) return;

        try {
            await command.execute(message, args);
        } catch (error) {
            this.logger.error(
                `An error occured while running prefix command "${command.name}":`,
                error,
            );
            await message.reply({
                content: "An error occured while running this command.",
                allowedMentions: { repliedUser: false },
            });
        }
    }

    public async handleSlashCommand(interaction: ChatInputCommandInteraction): Promise<void> {
        if (!interaction.isChatInputCommand()) return;

        const command = this.getSlashCommand(interaction.commandName);
        if (!command) {
            this.logger.error(`Slash command "${interaction.commandName}" not found.`);
            return;
        }

        try {
            await command.execute(interaction);
        } catch (error) {
            this.logger.error(
                `An error occured while running slash command "${command.data.name}":`,
                error,
            );
            const options: InteractionReplyOptions = {
                content: "An error occured while running this command.",
                ephemeral: true,
            };
            if (interaction.replied || interaction.deferred) await interaction.followUp(options);
            else await interaction.reply(options);
        }
    }
}
