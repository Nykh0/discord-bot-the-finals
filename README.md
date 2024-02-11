# THE FINALS Leaderboard viewer
## _Bot to check the rank of a player in THE FINALS !_

## Adding the bot to your discord
To add the bot to your discord, please use the following invite link :

[Invite link](https://discord.com/api/oauth2/authorize?client_id=1205969039990587422&permissions=0&scope=applications.commands+bot)

## Features
The only command available is /rank, with an embark ID as input.

````/rank Username#0000````


## Deploy in local

A ````config.json```` file is required when trying to run the bot in local, please add one at the source of the project.

````
{
	"token": "DISCORD_TOKEN_HERE",
	"clientId": "CLIENT_ID_HERE"
}
````

## Installation

This bot requires the lastest version of [Node.js](https://nodejs.org/) to run.

Install the dependencies and devDependencies and start the bot with the following command.

```npm install
npm start
```

The file ```index.js``` retrieve all commands added in commands/utility. The file ```deploy-commands.js``` makes discord know what commands are available.

```npm start``` run both files one after another so you don't have to worry about it.
