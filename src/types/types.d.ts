import { RavenClient } from "../client";
import { SlashCommandBuilder } from "@discordjs/builders";
import { ChatInputCommandInteraction } from "discord.js";

interface Command {
  client: RavenClient;
  get: () => SlashCommandBuilder | any;
  execute: (interaction: ChatInputCommandInteraction) => Promise<any>;
}
