const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('rankseason2')
		.setDescription('Check THE FINALS player rank in season 2')
		.addStringOption(option =>
			option.setName("embark-id")
				.setDescription('Embark ID of the player (Format : Username#9999)').setRequired(true)),
	async execute(interaction) {
		await interaction.deferReply();
		fetch('https://storage.googleapis.com/embark-discovery-leaderboard/s2-leaderboard-crossplay-discovery-live.json')
        .then(response => response.json())
        .then(data => {
            let player = data.find((elmt) => elmt.name.toLowerCase() === interaction.options.getString('embark-id').toLowerCase());
            if (player){
				const diff = player.r - player.or;
                if (diff < 0){
                    player.classDiff = "positive";
                    player.diff = diff.toString().replace("-","+");
                } else if (diff > 0) {
                    player.classDiff = "negative";
                    player.diff = "-" + diff;
                } else {
                    player.classDiff = "zero";
                    player.diff = "0";
                }
                player.nameRank = getFame(player);
                player.imgRankName = player.nameRank.toLowerCase().replace(" ", "-").concat("-thumb.png");

				const fields = [{ name: 'Rank', value: player.r.toString(), inline: true },
				{ name: 'League', value: player.nameRank, inline: true },
				{ name: '24h', value: player.diff, inline: true }];

				const embed = new EmbedBuilder()
				.setColor(0xd31f3c)
				.setTitle(getName(player))
				.setThumbnail("https://storage.googleapis.com/embark-discovery-leaderboard/img/thumbs/" + player.imgRankName)
				.addFields(fields);

				return interaction.editReply({ embeds: [embed] });
            } else {
				return interaction.editReply("This player does not exist or is not at least 10000th in the leaderboard.");
			}
        });
	},
};

function getFame(player) {
	switch (player.ri) {
		case 0:
			return "Unranked";
		case 1:
			return "Bronze 4";
		case 2:
			return "Bronze 3";
		case 3:
			return "Bronze 2";
		case 4:
			return "Bronze 1";
		case 5:
			return "Silver 4";
		case 6:
			return "Silver 3";
		case 7:
			return "Silver 2";
		case 8:
			return "Silver 1";
		case 9:
			return "Gold 4";
		case 10:
			return "Gold 3";
		case 11:
			return "Gold 2";
		case 12:
			return "Gold 1";
		case 13:
			return "Platinum 4";
		case 14:
			return "Platinum 3";
		case 15:
			return "Platinum 2";
		case 16:
			return "Platinum 1";
		case 17:
			return "Diamond 4";
		case 18:
			return "Diamond 3";
		case 19:
			return "Diamond 2";
		case 20:
			return "Diamond 1";
		default:
			return "Unknown Rank";
		}
}

function getName(player){
	if (player.steam) {
		return player.steam;
	}
	else if (player.psn) {
		return player.psn;
	}
	else if (player.xbox) {
		return player.xbox;
	}
	else return player.name;
}