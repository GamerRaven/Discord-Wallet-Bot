import { RavenClient } from "../../client";
import { Command } from "../../types/types";
import { SlashCommandBuilder } from "@discordjs/builders";
import { ChatInputCommandInteraction, GuildMember } from "discord.js";
import { hasRole } from "../../util/roles";
import { getOrCreateUser, getUser } from "../../util/user";

export default class PayoutCommand implements Command {
  public client: RavenClient;

  constructor(client: RavenClient) {
    this.client = client;
  }

  get() {
    return new SlashCommandBuilder()
      .setName("wallet")
      .setDescription("The command for managing your wallet.")
      .addSubcommand((view) =>
        view.setName("view").setDescription("View your wallet amount.")
      )
      .addSubcommand((add) =>
        add
          .setName("add")
          .setDescription("Add money to a user's wallet.")
          .addUserOption((user) =>
            user
              .setName("user")
              .setDescription("The user to add money to.")
              .setRequired(true)
          )
          .addNumberOption((amount) =>
            amount
              .setName("amount")
              .setDescription("The amount to add.")
              .setRequired(true)
          )
      )
      .addSubcommand((remove) =>
        remove
          .setName("remove")
          .setDescription("Remove money from a user's wallet.")
          .addUserOption((user) =>
            user
              .setName("user")
              .setDescription("The user to remove money from.")
              .setRequired(true)
          )
          .addNumberOption((amount) =>
            amount
              .setName("amount")
              .setDescription("The amount to remove.")
              .setRequired(true)
          )
      )
      .addSubcommand((clear) =>
        clear
          .setName("clear")
          .setDescription("Add money to a user's wallet.")
          .addUserOption((user) =>
            user
              .setName("user")
              .setDescription("The user to clear.")
              .setRequired(true)
          )
      );
  }

  async execute(interaction: ChatInputCommandInteraction) {
    const subcommand = interaction.options.getSubcommand(true);

    if (subcommand == "view") {
      const user = await getUser(this.client, interaction.user.id);

      if (user == null)
        return interaction.reply({
          content: "You do not have a wallet.",
          ephemeral: true,
        });

      const wallet = user.get("balance") as number;
      return interaction.reply({
        content: `You have $${wallet.toFixed(2)} in your wallet.`,
        ephemeral: true,
      });
    }

    const user = interaction.options.getUser("user", true);

    if (
      !hasRole(
        interaction.member as GuildMember,
        this.client.config.roles.walletAdmin
      )
    )
      return interaction.reply({
        content: "You do not have permission to run this action.",
        ephemeral: true,
      });

    const dbUser = await getOrCreateUser(this.client, user.id);
    const balance = dbUser.get("balance") as number;
    if (subcommand == "clear") {
      dbUser.set("balance", 0);
      await dbUser.save();

      return interaction.reply({
        content: `Cleared <@${user.id}>'s wallet.`,
        ephemeral: true,
      });
    }

    const amount = interaction.options.getNumber("amount", true);
    if (subcommand == "add") {
      dbUser.set("balance", balance + amount);
      await dbUser.save();

      return interaction.reply({
        content: `Added $${amount.toFixed(2)} to <@${user.id}>'s wallet.`,
        ephemeral: true,
      });
    }

    if (subcommand == "remove") {
      dbUser.set("balance", balance - amount);
      await dbUser.save();

      return interaction.reply({
        content: `Removed $${amount.toFixed(2)} from <@${user.id}>'s wallet.`,
        ephemeral: true,
      });
    }

    interaction.reply({
      content: "How'd we get here?",
      ephemeral: true,
    });
  }
}
