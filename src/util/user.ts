import { RavenClient } from "../client";
import { Model } from "sequelize";

export const getOrCreateUser = async (client: RavenClient, userId: string) => {
  const user = await getUser(client, userId);
  if (user != null) return user;

  return await client.database.User.create({
    userId,
    balance: 0,
  });
};

export const getUser = async (client: RavenClient, userId: string) => {
  return await client.database.User.findOne({
    where: {
      userId,
    },
  });
};
