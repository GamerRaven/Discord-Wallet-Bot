# Discord Wallet Bot

Customizable discord wallet bot built with TypeScript

## Requirements
1. Typescript & Node.js Installed
2. Discord Bot Token
3. PayPal Business Account with Payouts enabled (optional) 

## Configuration
Open config.json and fill out the values:
```python
{
  "database": "sqlite://database.db",
  "serverId": "", #Server ID of the server you want the bot to work at
  "token": "", #Bot Token
  "paypalOptions": {
    "mode": "", #Enter "live" or "sandbox" that corresponds to your PayPal API credentials
    "client_id": "", #Client ID of your API credentials
    "client_secret": "" #Client Secret of your API credentials
  },
  "roles": {
    "payouts": "", #ID of roles that are allowed to run payouts command
    "walletAdmin": "" #ID of the role that can manage a user's balance
  }
}
```  
You can leave the fields in ```paypalOptions``` blank if you don't want to use the payouts
## Installation

Download the files and run the following commands.

```bash
cd Discord-Wallet-Bot-main #You can rename the folder
npm install typescript@latest -g
npm install
npm run start
```

## Features and Commands
>/wallet view <user>

View the balance of a user's wallet
>/wallet add <user> <amount>

Add money to a user's wallet
>/wallet remove <user> <amount>

Remove money from a user's wallet
>/wallet clear <user> 

Resets a user's wallet
>/payouts create <email> <amount>

Process a payout to a PayPal account.

## How it Works
This bot is created for the discord server owner to pay their staff/users and process PayPal payouts automatically. 

Users with the Administrator role ```walletAdmin``` can add money to a user's wallet using /wallet add. Then, the user can withdrawl the money to PayPal by running /payouts create <their PayPal email> <amount>. Then, when the money is successfully paid out, that amount of money will be deducted from the user's wallet.
