const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('rank')
		.setDescription('Check THE FINALS player rank')
		.addStringOption(option =>
			option.setName("embark-id")
				.setDescription('Embark ID of the player (Format : Username#9999)').setRequired(true)),
	async execute(interaction) {
		await interaction.deferReply();
		fetch('https://storage.googleapis.com/embark-discovery-leaderboard/leaderboard-crossplay-discovery-live.json')
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
                    player.diff = 0;
                }
                player.nameRank = getFame(player);
                player.imgRankName = player.nameRank.toLowerCase().replace(" ", "-").concat("-thumb.png");

				let USDollar = new Intl.NumberFormat('en-US', {
					style: 'currency',
					currency: 'USD',
					minimumFractionDigits: 0,
					maximumFractionDigits: 0
				});
				const cash = USDollar.format(player.c);

				const embed = new EmbedBuilder()
				.setColor(0xd31f3c)
				.setTitle(getName(player))
				.setThumbnail("https://storage.googleapis.com/embark-discovery-leaderboard/img/thumbs/" + player.imgRankName)
				.addFields({ name: 'Rank', value: player.r.toString(), inline: true },
				{ name: 'League', value: player.nameRank, inline: true },
				{ name: 'Fame', value: player.f.toString(), inline: true },
				{ name: '24h', value: player.diff, inline: true },
				{ name: 'Cashouts', value: cash, inline: true }, 
				);

				return interaction.editReply({ embeds: [embed] });
            } else {
				return interaction.editReply("This player does not exist or is not at least 10000th in the leaderboard.");
			}
        });
	},
}; //"https://storage.googleapis.com/embark-discovery-leaderboard/img/thumbs/" + player.imgRankName

function getFame(player) {
	var rankName = "Bronze 4";
	return player.f >= 28500 ? (rankName = "Diamond 4",
		player.f >= 32750 && (rankName = "Diamond 3"),
		player.f >= 37250 && (rankName = "Diamond 2"),
		player.f >= 42250 && (rankName = "Diamond 1")) : player.f >= 15500 ? (rankName = "Platinum 4",
			player.f >= 18500 && (rankName = "Platinum 3"),
			player.f >= 21500 && (rankName = "Platinum 2"),
			player.f >= 24500 && (rankName = "Platinum 1")) : player.f >= 6500 ? (rankName = "Gold 4",
				player.f >= 8500 && (rankName = "Gold 3"),
				player.f >= 10500 && (rankName = "Gold 2"),
				player.f >= 12500 && (rankName = "Gold 1")) : player.f > 1750 ? (rankName = "Silver 4",
					player.f >= 2500 && (rankName = "Silver 3"),
					player.f >= 3500 && (rankName = "Silver 2"),
					player.f >= 4500 && (rankName = "Silver 1")) : (player.f >= 250 && (rankName = "Bronze 3"),
						player.f >= 500 && (rankName = "Bronze 2"),
						player.f >= 1000 && (rankName = "Bronze 1")), rankName;
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