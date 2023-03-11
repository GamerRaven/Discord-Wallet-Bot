import { RavenClient } from "../../client";
import { Command } from "../../types/types";
import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, GuildMember } from "discord.js";
import { validateEmail } from "../../util/email";
import { hasRole } from "../../util/roles";
import { getOrCreateUser } from "../../util/user";

export default class PayoutCommand implements Command {
  public client: RavenClient;

  constructor(client: RavenClient) {
    this.client = client;
  }

  get() {
    return new SlashCommandBuilder()
      .setName("payouts")
      .setDescription("The command for issuing payouts.")
      .addSubcommand((create) =>
        create
          .setName("create")
          .setDescription("Create a payout.")
          .addStringOption((email) =>
            email
              .setName("email")
              .setDescription("The email to send the payout to.")
              .setRequired(true)
          )
          .addNumberOption((amount) =>
            amount
              .setName("amount")
              .setDescription("The amount to send.")
              .setRequired(true)
          )
      );
  }

  async execute(interaction: CommandInteraction) {
    const email = interaction.options.get("email")!.value as string;
    const amount = interaction.options.get("amount")!.value as number;

    if (
      !hasRole(
        interaction.member as GuildMember,
        this.client.config.roles.payouts
      )
    )
      return interaction.reply({
        content: "You do not have permission to run this action.",
        ephemeral: true,
      });

    await interaction.deferReply({ ephemeral: true });

    if (!validateEmail(email))
      return interaction.editReply({
        content: "Enter a valid email address to issue the Payout to.",
      });

    const dbUser = await getOrCreateUser(this.client, interaction.user.id);
    const userBalance = dbUser.get("balance") as number;

    if (amount > userBalance)
      return interaction.editReply({
        content: `You do not have enough money to issue this withdraw. (Balance: $${userBalance.toFixed(
          2
        )})`,
      });

    this.client
      .createPayout(interaction.user, email, amount)
      .then(async () => {
        await dbUser.set("balance", amount - userBalance);
        await dbUser.save();
        interaction.editReply({
          content: `We have sent your payout of \`$${amount.toFixed(
            2
          )}\` to \`${email}\`.`,
        });
      })
      .catch((e) =>
        interaction.editReply({
          content:
            "A error has occurred. \n\n```" + e.response.message + "\n```",
        })
      );
  }
}
