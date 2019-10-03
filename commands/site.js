const moment = require('moment');
const Discord = require('discord.js');

exports.run = async (client, message, args, level) => {
	// eslint-disable-line no-unused-vars

	approvedSiteTypes = client.siteTypes();

	siteKeys = Object.keys(approvedSiteTypes);

	if (args[1]) {
		args[0] = args[0] + args[1];
		args[0] = args[0].replace(/\s/g, '');
	}
	let request = args[0].match(/[a-zA-Z]+|[0-9]+(?:\.[0-9]+)?|\.[0-9]+/g);
	if (siteKeys.includes(request[0].toLowerCase()) === false) {
		message.channel.send("Sorry but I don't know what site type " + request[0].toUpperCase() + ' is.');
	} else {
		const msg = await message.channel.send('Getting site...');

		let siteData = await client.capiGetSite(request[0], request[1]);

		if (siteData.statusCode && siteData.statusCode === 404) {
			msg.edit('Site not found');
		} else if (siteData.statusCode && siteData.statusCode > 404) {
			msg.edit('Server Error, unable to contact the Gnosis data stores');
		} else if (request[0].toLowerCase() === `gen` || request[0].toLowerCase() === 'gb') {
			console.log(request[0]);
			msg.edit('This site type isn\'t supported yet');
		} else {
			let siteImage = await client.siteImages();

			var thumbnail;
			if (siteImage[request[0]] === '') {
				thumbnail = 'https://api.canonn.tech/uploads/bb866ea7470648de88d09c125f8718c4.png'
			} else {
				thumbnail = siteImage[request[0].toLowerCase()];
			}

			discordEmbed = new Discord.RichEmbed({
				color: 14323987,
				thumbnail: {
					url: thumbnail,
				},
				footer: {
					icon_url: 'https://api.canonn.tech/uploads/40bfc7d870e54925ad0f769e7b0b1f9a.png',
					text: 'Provided by Canonn R&D (canonn.science)',
				},
				fields: [
					{
						name: `== **${approvedSiteTypes[request[0].toLowerCase()]}** Site: ${request[1]} ==`,
						value: `**Site ID**: ${request[0].toUpperCase()}${siteData[0].siteID}
						**System**: ${siteData[0].system.systemName.toUpperCase()}
            **Body**: ${siteData[0].body.bodyName.toUpperCase()}
            **Latitude**: ${siteData[0].latitude.toFixed(2)}
            **Longitude**: ${siteData[0].longitude.toFixed(2)}
            **Type**: ${siteData[0].type.type}
            **Frontier ID**: ${siteData[0].frontierID}`,
						inline: false,
					},
					{
						name: '---------------------------------------------------------------------------',
						value: `**Discovered By**: ${siteData[0].discoveredBy.cmdrName}
						**Verified**: ${siteData[0].verified}
						**Updated On**: ${moment(siteData[0].updated_at).format('LLL')} UTC`,
						inline: false,
					},
				],
			});
			msg.edit(discordEmbed);
		}
	}
};

exports.conf = {
	enabled: true,
	guildOnly: false,
	aliases: ['st', 's'],
	permLevel: 'User',
};

exports.help = {
	name: 'site',
	category: 'Canonn Sites',
	description: "Getting site data based on it's Site ID",
	usage: '!site BT144',
};
