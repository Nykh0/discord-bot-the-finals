const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('rank')
		.setDescription('Check THE FINALS player rank in season 3')
		.addStringOption(option =>
			option.setName("embark-id")
				.setDescription('Embark ID of the player (Format : Username#9999)').setRequired(true)),
	async execute(interaction) {
		await interaction.deferReply();
		//const url = 'https://corsproxy.io/?' + encodeURIComponent('https://id.embark.games/_next/data/B-lkaPSkbNrJQwY3fq9CX/en/leaderboards/ranked.json?slug=ranked');
		fetch('https://id.embark.games/_next/data/B-lkaPSkbNrJQwY3fq9CX/en/leaderboards/ranked.json?slug=ranked')
        .then(response => response.json())
        .then(fullJson => {
			const data = fullJson.pageProps.entries;
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
				player.nameRank = fullJson.pageProps.metadata.rankToLeagueMap[player.ri].label;
				player.imgRankName = fullJson.pageProps.metadata.rankToLeagueMap[player.ri].imagePath;

				const fields = [{ name: 'Rank', value: player.r.toString(), inline: true },
				{ name: 'League', value: player.nameRank, inline: true },
				{ name: '24h', value: player.diff, inline: true }];

				const embed = new EmbedBuilder()
				.setColor(0xd31f3c)
				.setTitle(getName(player))
				.setThumbnail("https://id.embark.games" + player.imgRankName)
				.addFields(fields);

				return interaction.editReply({ embeds: [embed] });
            } else {
				return interaction.editReply("This player does not exist or is not at least 10000th in the leaderboard.");
			}
        });
	},
};


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