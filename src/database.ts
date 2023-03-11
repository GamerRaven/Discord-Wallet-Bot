import { Sequelize, DataTypes, Model } from "sequelize";
import { RavenClient } from "./client";

export class Database {
  private client: RavenClient;
  private database: Sequelize;

  public Payout;
  public User;

  model_base = {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    rid: { type: DataTypes.TEXT },
  };

  PAYOUT_MODEL = {
    ...this.model_base,
    email: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    amount: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    paidAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  };

  USER_MODEL = {
    ...this.model_base,
    userId: { type: DataTypes.TEXT, allowNull: false },
    balance: { type: DataTypes.FLOAT, defaultValue: 0 },
  };

  constructor(client: RavenClient) {
    this.client = client;
    this.database = new Sequelize(this.client.config.database, {
      logging: false,
    });

    this.Payout = this.database.define("payout", this.PAYOUT_MODEL);
    this.User = this.database.define("user", this.USER_MODEL);
    this.database.sync({ alter: true });
  }
}
