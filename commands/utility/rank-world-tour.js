const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('rankwt')
		.setDescription('Check THE FINALS player rank in World Tour')
		.addStringOption(option =>
			option.setName("embark-id")
				.setDescription('Embark ID of the player (Format : Username#9999)').setRequired(true)),
	async execute(interaction) {
		await interaction.deferReply();
		fetch('https://id.embark.games/_next/data/B-lkaPSkbNrJQwY3fq9CX/en/leaderboards/world-tour.json?slug=world-tour')
        .then(response => response.json())
        .then(fullJson => {
			const data = fullJson.pageProps.entries;
            let player = data.find((elmt) => elmt.name.toLowerCase() === interaction.options.getString('embark-id').toLowerCase());
            if (player){
				const formatter = new Intl.NumberFormat('en-US', {
					style: 'currency',
					currency: 'USD',
				});
				const fields = [{ name: 'Rank', value: player.r.toString(), inline: true },
				{ name: 'Cash', value: formatter.format(player.p), inline: true }];

				const embed = new EmbedBuilder()
				.setColor(0xd31f3c)
				.setTitle(getName(player))
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