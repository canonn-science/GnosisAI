const Discord = require('discord.js');

exports.run = async (client, message, args, level) => {
	// Define count object for data
	let counts = await client.capiGetCounts();
	let dataKeys = Object.keys(counts.data)

	// Grab Report Types Object and map keys
	let reportTypes = client.reportTypes();

	let images = client.siteImages();

	let embedData = {
		title: '= Canonn Report Counts =',
		color: 14323987,
		thumbnail: {
			url: ''
		},
		footer: {
			icon_url: images.canonn,
			text: 'Provided by Canonn R&D - (canonn.science)',
		},
		fields: [],
	};

	let discordEmbed = new Discord.RichEmbed(embedData);

	if (args.length === 0) {
		const msg = await message.channel.send('Getting counts of all reports with all statuses...');

		embedData.fields.push({
			name: '-- **Total Reports** --',
			value: client.object2string(counts.total.reports),
			inline: false,
		});

		for (let i=0; i < dataKeys.length; i++) {
			if (reportTypes.hasOwnProperty(dataKeys[i])) {
				let currentData = counts.data[dataKeys[i]]
				embedData.fields.push({
					name: `-- **(${dataKeys[i].toUpperCase()})** - ${reportTypes[dataKeys[i].toLowerCase()]} Reports --`,
					value: client.object2string(currentData.reports),
					inline: false,
				});
			}
		}
		msg.edit(discordEmbed);

	} else if (args.length === 1 && reportTypes.hasOwnProperty(args[0].toLowerCase()) === true) {
		const msg = await message.channel.send(`Getting counts of ${args[0].toUpperCase()} reports with all statuses...`);

		let currentData = counts.data[args[0].toLowerCase()];

		embedData.fields.push({
			name: `-- (${args[0].toUpperCase()}) - ${reportTypes[args[0].toLowerCase()]} Reports --`,
			value: client.object2string(currentData.reports),
			inline: false,
		});

		if (images[args[0].toLowerCase()] !== '') {
			embedData.thumbnail.url = images[args[0].toLowerCase()];
		} else {
			embedData.thumbnail.url = images.canonnGif;
		}

		msg.edit(discordEmbed);
	} else if (args.length === 1 && args[0] === 'total') {
		const msg = await message.channel.send('Getting Total Counts...');

		embedData.thumbnail.url = images.canonnGif;

		embedData.fields.push({
			name: '-- **Total Reports** --',
			value: client.object2string(counts.total.reports),
			inline: false,
		});

		msg.edit(discordEmbed);
	} else if (reportTypes.hasOwnProperty(args[0].toLowerCase()) === false) {
		message.channel.send(`The report type ${args[0].toUpperCase()} is not valid.`);
	} else {
		message.channel.send('An unknown error occured, this has been reported');
		client.logger('Reportcount command error: ' + args, 'error');
	}
};

exports.conf = {
	enabled: true,
	guildOnly: false,
	aliases: ['rpct', 'rptct', 'reportc', 'rc'],
	permLevel: 'User',
};

exports.help = {
	name: 'reportcount',
	category: 'Canonn Reports',
	description: 'Grabbing a count of reports based on their status',
	usage: '!reportcount || !reportcount ap || !reportcount total',
};
