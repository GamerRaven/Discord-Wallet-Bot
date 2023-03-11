import { Client, Collection, User } from "discord.js";
import { Database } from "./database";
import { Command } from "./types/types";
import Paypal from "paypal-rest-sdk";

export class RavenClient extends Client {
  config: any;
  database: Database;
  commands: Collection<string, Command>;

  constructor() {
    super({
      intents: ["Guilds"],
    });

    this.config = require("../config.json");
    this.database = new Database(this);
    this.commands = new Collection();

    Paypal.configure(this.config.paypalOptions);
  }

  createPayout(user: User, email: string, amount: number, note?: string) {
    return new Promise((res, rej) => {
      const create_payout_json = {
        sender_batch_header: {
          sender_batch_id: Math.random().toString(36).substring(9),
          email_subject: `Hey ${user.username}, you have a payout!`,
          email_message: `Hey ${user.username}, you have a payout of ${amount}, make sure to claim this payout so you can use it!`,
        },
        items: [
          {
            note,
            recipient_type: "EMAIL",
            amount: {
              value: amount.toFixed(2),
              currency: "USD",
            },
            receiver: email,
            notification_language: "en-US",
          },
        ],
      };
      Paypal.payout.create(create_payout_json, (e: any, payout: any) =>
        e ? rej(e) : res(payout)
      );
    });
  }
}
