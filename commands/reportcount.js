const Discord = require('discord.js');
const delay = ms => new Promise(res => setTimeout(res, ms));

exports.run = async (client, message, args, level) => {
	// Define count object for data
	let counts = {
		ap: {},
		bm: {},
		bt: {},
		cs: {},
		fg: {},
		fm: {},
		gv: {},
		gy: {},
		ls: {},
		tb: {},
		tw: {},
	};

	// Grab array of keys
	let countKeys = Object.keys(counts);

	// Grab Report Status array
	let reportStatuses = client.reportStatus();

	// Grab Report Types Object and map keys
	let reportTypes = client.reportTypes();

	// Quick function to grab all data
	async function getAllCounts() {
		for (let i = 0; i < countKeys.length; i++) {
			counts[countKeys[i]].total = await client.capiGetReportCount(countKeys[i], 'total');

			for (let c = 0; c < reportStatuses.length; c++) {
				let reportKey = counts[countKeys[i]];
				let newCount = await client.capiGetReportCount(countKeys[i], reportStatuses[c]);
				if (newCount >= 1) {
					reportKey[reportStatuses[c]] = newCount;
				}
			}
			delay(250);
		}
	}

	// Grab all report Status data on a single type
	async function getTypeCount(reportType) {
		counts[reportType].total = await client.capiGetReportCount(reportType, 'total');

		for (let c = 0; c < reportStatuses.length; c++) {
			let reportKey = counts[reportType];
			reportKey[reportStatuses[c]] = await client.capiGetReportCount(reportType, reportStatuses[c]);
		}
	}

	let embedData = {
		title: '= Canonn Report Counts =',
		color: 14323987,
		footer: {
			icon_url: 'https://api.canonn.tech/uploads/40bfc7d870e54925ad0f769e7b0b1f9a.png',
			text: 'Provided by Canonn R&D - (canonn.science)',
		},
		fields: [],
	};

	let discordEmbed = new Discord.RichEmbed(embedData);

	function object2string(obj) {
		let string = '';

		function toTitleCase(str) {
			return str.toLowerCase().replace(/\.\s*([a-z])|^[a-z]/gm, s => s.toUpperCase());
		}

		Object.keys(obj).forEach(key => {
			string += `**${toTitleCase(key)}**: ${obj[key]}\n`;
		});
		return string;
	}

	if (args.length === 0) {
		const msg = await message.channel.send('Getting counts of all reports with all statuses...');

		await getAllCounts();

		let reportTotal = 0;
		for (let i = 0; i < countKeys.length; i++) {
			reportTotal = reportTotal + counts[countKeys[i]].total;
		}

		let reportPending = 0;
		for (let i = 0; i < countKeys.length; i++) {
			if (counts[countKeys[i]].pending) {
				reportPending = reportPending + counts[countKeys[i]].pending;
			}
		}

		embedData.fields.push({
			name: '-- **Total Reports** --',
			value: `**Total**: ${reportTotal}\n\
			**Pending**: ${reportPending}`,
			inline: false,
		});

		for (let i = 0; i < countKeys.length; i++) {
			embedData.fields.push({
				name: `-- **(${countKeys[i].toUpperCase()})** - ${reportTypes[countKeys[i].toLowerCase()]} Reports --`,
				value: object2string(counts[countKeys[i]]),
				inline: false,
			});
		}

		msg.edit(discordEmbed);
	} else if (args.length === 1 && countKeys.includes(args[0].toLowerCase()) === true) {
		const msg = await message.channel.send(`Getting counts of ${args[0].toUpperCase()} \
		reports with all statuses...`);

		await getTypeCount(args[0].toLowerCase());

		embedData.fields.push({
			name: `-- (${args[0].toUpperCase()}) - ${reportTypes[args[0].toLowerCase()]} Reports --`,
			value: object2string(counts[args[0].toLowerCase()]),
			inline: false,
		});

		msg.edit(discordEmbed);
	} else if (
		args.length === 2 &&
		countKeys.includes(args[0].toLowerCase()) === true &&
		(reportStatuses.includes(args[1].toLowerCase()) === true || args[1].toLowerCase() === 'total')
	) {
		const msg = await message.channel.send(`Getting counts of ${args[0].toUpperCase()} \
		reports with ${args[1].toLowerCase()} status...`);

		let reportKey = counts[args[0].toLowerCase()];
		if (args[0].toLowerCase() !== 'total') {
			reportKey[args[1].toLowerCase()] = await client.capiGetReportCount(
				args[0].toLowerCase(),
				args[1].toLowerCase()
			);
		} else {
			reportKey[args[1].toLowerCase()] = await client.capiGetReportCount(args[0].toLowerCase(), 'total');
		}

		embedData.fields.push({
			name: `-- (${args[0].toUpperCase()}) - ${reportTypes[args[0].toLowerCase()]} Reports --`,
			value: object2string(counts[args[0].toLowerCase()]),
			inline: false,
		});

		msg.edit(discordEmbed);
	} else if (countKeys.includes(args[0].toLowerCase()) === false) {
		message.channel.send(`The report type ${args[0].toUpperCase()} is not valid.`);
	} else if (reportStatuses.includes(args[1].toLowerCase()) === false) {
		message.channel.send(`The report status ${args[1].toLowerCase()} is not valid.`);
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
	usage: '!reportcount || !reportcount ap || !reportcount ap pending',
};
