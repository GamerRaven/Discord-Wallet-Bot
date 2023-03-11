import { RavenClient } from "./client";
import { EmbedBuilder } from "discord.js";
import walk from "./util/walk";

const client = new RavenClient();
const config = require("../config.json");

client.once("ready", async () => {
  console.log("Ready!");

  const files = await walk(`${__dirname}/commands`);
  const data = [];

  for (const file of files) {
    const clazz = await import(file).then((_) => _.default);
    const construct = new clazz(client);
    const cmd = construct.get();

    client.commands.set(cmd.name, construct);
    data.push(cmd);
  }

  await client.application?.commands.set(data, config.serverId);
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const { commandName } = interaction;
  const foundCommand = client.commands.get(commandName);
  if (!foundCommand) return;

  try {
    // if (!checkPermissions(foundCommand, interaction))
    //   return interaction.reply({
    //     embeds: [
    //       new MessageEmbed()
    //         .setTitle("No Permission")
    //         .setColor("#FF0000")
    //         .setDescription(`You do not have permission to run this command.`),
    //     ],
    //     ephemeral: true,
    //   });

    foundCommand.execute(interaction);
  } catch (error) {
    const errorInformation = new EmbedBuilder()
      .setTitle("This command failed to execute.")
      .setColor("#FF0000")
      .setDescription(`This interaction has failed to complete.`);

    console.log(`[${commandName}] Could not execute command. ${error}`);
    if (await interaction.fetchReply())
      await interaction.editReply({ embeds: [errorInformation] });
    else await interaction.reply({ embeds: [errorInformation] });
  }
});
client.login(config.token);
