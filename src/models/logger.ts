import colors from "colors";

export class Logger {
    private name: string;

    constructor(name: string) {
        this.name = name;
    }

    private getTimestamp(): string {
        return new Date()
            .toLocaleString("en-US", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                hour12: false,
            })
            .replace(",", "");
    }

    public debug(message: any): void {
        console.debug(
            `[${colors.dim(this.getTimestamp())}] ` +
                colors.green.bold("DEBUG") +
                `   [${colors.magenta(this.name)}] ${message}`,
        );
    }

    public info(message: any): void {
        console.info(
            `[${colors.dim(this.getTimestamp())}] ` +
                colors.blue.bold("INFO") +
                `    [${colors.magenta(this.name)}] ${message}`,
        );
    }

    public warning(message: any): void {
        console.info(
            `[${colors.dim(this.getTimestamp())}] ` +
                colors.yellow.bold("WARNING") +
                ` [${colors.magenta(this.name)}] ${message}`,
        );
    }

    public error(message: string, error?: any): void {
        console.error(
            colors.white(`[${colors.dim(this.getTimestamp())}]`) +
                " " +
                colors.red.bold("ERROR") +
                `   [${colors.magenta(this.name)}] ${message}`,
        );
        if (error) console.error(error);
    }
}
