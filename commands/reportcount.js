const moment = require('moment');

exports.run = async (client, message, args, level) => {
	// eslint-disable-line no-unused-vars

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

	// Quick function to grab all data
	async function getAllCounts() {
		for (let i = 0; i < countKeys.length; i++) {
			counts[countKeys[i]].total = await client.capiGetReportCount(countKeys[i], 'total');

			for (let c = 0; c < reportStatuses.length; c++) {
				let reportKey = counts[countKeys[i]];
				reportKey[reportStatuses[c]] = await client.capiGetReportCount(countKeys[i], reportStatuses[c]);
			}
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

	console.log(args);
	if (args.length === 0) {
		await getAllCounts();
		console.log(counts);
	} else if (args.length === 1 && countKeys.includes(args[0].toLowerCase()) === true) {
		await getTypeCount(args[0].toLowerCase());
		console.log(counts);
	} else if (
		args.length === 2 &&
		countKeys.includes(args[0].toLowerCase()) === true &&
		reportStatuses.includes(args[1].toLowerCase() === true)
	) {
	} else if (countKeys.includes(args[0].toLowerCase()) === false) {
	} else if (reportStatuses.includes(args[1].toLowerCase()) === false) {
	} else {
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
