const Discord = require('discord.js');

exports.run = async (client, message, args, level) => {

	// Define count object for data
	let counts = await client.capiGetCounts();

	// Grab Report Types Object and map keys
	let siteTypes = client.siteTypes();

	let images = client.siteImages();

	let embedData = {
		title: '= Canonn Site Counts =',
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
		// All site counts

		const msg = await message.channel.send('Getting counts of all sites');

		embedData.fields.push({
			name: '-- **Total Sites by Type** --',
			value: `**AP**: ${counts.data.ap.sites} 
			**BM**: ${counts.data.bm.sites}
			**BT**: ${counts.data.bt.sites}
			**CS**: ${counts.data.cs.sites}
			**FG**: ${counts.data.fg.sites}
			**FM**: ${counts.data.fm.sites}
			**GEN**: ${counts.data.gen.sites}
			**GB**: ${counts.data.gb.sites}
			**GR**: ${counts.data.gr.sites}
			**GS**: ${counts.data.gs.sites}
			**GV**: ${counts.data.gv.sites}
			**GY**: ${counts.data.gy.sites} 
			**LS**: ${counts.data.ls.sites} 
			**TB**: ${counts.data.tb.sites}  
			**TS**: ${counts.data.ts.sites}
			**TW**: ${counts.data.tw.sites}`,
			inline: false,
		}, {
			name: '-- **Total Sites** --',
			value: `**Total**: ${counts.total.sites}`,
			inline: false,
		});

		msg.edit(discordEmbed);
	} else if (
		args.length === 1 &&
		siteTypes.hasOwnProperty(args[0].toLowerCase()) === true
	) {
		const msg = await message.channel.send(`Getting counts of ${args[0].toUpperCase()} sites with all types...`);

		let currentData = counts.data[args[0].toLowerCase()];

		let sortedTypes = {};
		if (args[0].toLowerCase() === 'gen' || args[0].toLowerCase() === 'gb') {
			sortedTypes = {
				'These sites have no types': 'N/A'
			}
		} else if (!currentData.types) {
			Object.keys(currentData.status).sort().forEach(function(key) {
				sortedTypes[key] = currentData.status[key];
			});
		} else {
			Object.keys(currentData.types).sort().forEach(function(key) {
				sortedTypes[key] = currentData.types[key];
			});
		}

		embedData.fields.push({
			name: `-- (${args[0].toUpperCase()}) - ${siteTypes[args[0].toLowerCase()]} Sites --`,
			value: client.object2string(sortedTypes),
			inline: false,
		}, {
			name: '-- **Total FM Sites** --',
			value: `**Total**: ${currentData.sites}`,
			inline: false,
		});

		if (images[args[0].toLowerCase()] !== '') {
			embedData.thumbnail.url = images[args[0].toLowerCase()];
		} else {
			embedData.thumbnail.url = images.canonnGif;
		}

		msg.edit(discordEmbed);
	} else if (siteTypes.hasOwnProperty(args[0].toLowerCase()) === false) {
		message.channel.send(`The site type ${args[0].toUpperCase()} is not valid.`);
	} else {
		message.channel.send('An unknown error occured, this has been reported');
		client.logger('Reportcount command error: ' + args, 'error');
	}
};

exports.conf = {
	enabled: true,
	guildOnly: false,
	aliases: ['stct', 'sitec', 'sc'],
	permLevel: 'User',
};

exports.help = {
	name: 'sitecount',
	category: 'Canonn Sites',
	description: 'Grabbing a count of sites based on their type',
	usage: '!sitecount || !sitecount ap',
};
