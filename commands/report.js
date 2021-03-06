const moment = require('moment');
const Discord = require('discord.js');

exports.run = async (client, message, args, level) => {
	// eslint-disable-line no-unused-vars

	approvedReportTypes = client.reportTypes();

	reportKeys = Object.keys(approvedReportTypes);

	if (args[1]) {
		args[0] = args[0] + args[1];
		args[0] = args[0].replace(/\s/g, '');
	}
	let request = args[0].match(/[a-zA-Z]+|[0-9]+(?:\.[0-9]+)?|\.[0-9]+/g);
	if (reportKeys.includes(request[0].toLowerCase()) === false) {
		message.channel.send("Sorry but I don't know what report type " + request[0].toUpperCase() + ' is.');
	} else {
		let reportData = await client.capiGetReport(request[0], request[1]);

		var siteID;
		if (reportData.site) {
			siteID = request[0].toUpperCase() + reportData.site.siteID;
		} else {
			siteID = 'N/A';
		}

		const msg = await message.channel.send('Checking report...');

		if (reportData.statusCode && reportData.statusCode === 404) {
			msg.edit('Report not found');
		} else if (reportData.statusCode && reportData.statusCode > 404) {
			msg.edit('Server Error, unable to contact the Gnosis data stores');
		} else {

			let reportImage = await client.siteImages();

			var thumbnail;
			if (reportImage[request[0]] === '') {
				thumbnail = 'https://api.canonn.tech/uploads/bb866ea7470648de88d09c125f8718c4.png'
			} else {
				thumbnail = reportImage[request[0]];
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
						name: `== **${approvedReportTypes[request[0]]}** Report: ${request[1]} ==`,
						value: `**System**: ${reportData.systemName.toUpperCase()}
            **Body**: ${reportData.bodyName.toUpperCase()}
            **Latitude**: ${reportData.latitude.toFixed(2)}
            **Longitude**: ${reportData.longitude.toFixed(2)}`,
						inline: false,
					},
					{
						name: '---------------------------------------------------------------------------',
						value: `**Reported By**: ${escape(reportData.cmdrName)}
          **Report Status**: ${reportData.reportStatus}
          **Site ID**: ${siteID}
          **Updated On**: ${moment(reportData.updated_at).format('LLL')} UTC`,
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
	aliases: ['rp', 'rpt'],
	permLevel: 'User',
};

exports.help = {
	name: 'report',
	category: 'Canonn Reports',
	description: "Checking the status of a report by it's id",
	usage: '!report ap7',
};
