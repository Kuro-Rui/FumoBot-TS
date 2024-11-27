import { Message } from "discord.js";
import { inspect } from "util";
import { FumoBot } from "../../models/bot";
import { PrefixCommand } from "../../models/commands";

export class EvalPrefixCommand extends PrefixCommand {
    constructor() {
        super({ name: "eval", description: "Execute asynchronous code.", devOnly: true });
    }

    private clean(bot: FumoBot, result: string): string {
        let cleaned = bot.token ? result.replace(bot.token, "[REDACTED]") : result;
        return cleaned;
    }

    public async execute(message: Message, args: string[]): Promise<void> {
        if (!args.length) return;
        if (
            (args[0] === "```js" || args[0] === "```javascript") &&
            args[args.length - 1] === "```"
        ) {
            args = args.slice(1, args.length - 1);
        }

        try {
            const result = this.clean(
                message.client as FumoBot,
                inspect(eval(args.join(" ")), {
                    breakLength: 40,
                    maxStringLength: 1900,
                    compact: false,
                }),
            );
            await message.reply(`\`\`\`js\n${result}\n\`\`\``);
        } catch (error) {
            await message.reply(`\`\`\`xl\n${error}\n\`\`\``);
        }
    }
}
