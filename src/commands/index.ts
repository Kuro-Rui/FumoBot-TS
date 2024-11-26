import { EvalPrefixCommand } from "./prefix/eval";
import { PingPrefixCommand } from "./prefix/ping";
import { ShutdownPrefixCommand } from "./prefix/shutdown";
import { PingSlashCommand } from "./slash/ping";
import { PrefixCommand, SlashCommand } from "../models/commands";
import { UptimePrefixCommand } from "./prefix/uptime";
import { UptimeSlashCommand } from "./slash/uptime";

export const allPrefixCommands = [
    new EvalPrefixCommand(),
    new PingPrefixCommand(),
    new ShutdownPrefixCommand(),
    new UptimePrefixCommand(),
] as PrefixCommand[];

export const allSlashCommands = [
    new PingSlashCommand(),
    new UptimeSlashCommand(),
] as SlashCommand[];
