const Discord = require('discord.js');
const delay = ms => new Promise(res => setTimeout(res, ms));

exports.run = async (client, message, args, level) => {
	// eslint-disable-line no-unused-vars

	let embedData = {
		title: '= Canonn Site Counts =',
		color: 14323987,
		footer: {
			icon_url: 'https://api.canonn.tech/uploads/40bfc7d870e54925ad0f769e7b0b1f9a.png',
			text: 'Provided by Canonn R&D - (canonn.science)',
		},
		fields: [],
	};

	let discordEmbed = new Discord.RichEmbed(embedData);

	let counts = {
		ap: {},
		bm: {},
		bt: {},
		cs: {},
		fg: {},
		fm: {},
		gen: {},
		gb: {},
		gr: {},
		gs: {},
		gv: {},
		gy: {},
		ls: {},
		tb: {},
		ts: {},
		tw: {},
	};

	let countKeys = Object.keys(counts);

	if (args.length === 0) {
		// All site counts

		const msg = await message.channel.send('Getting counts...');

		for (let i = 0; i < countKeys.length; i++) {
			counts[countKeys[i]].total = await client.capiGetSiteCount(countKeys[i], 'all');
		}

		let siteTotal = 0;
		for (let i = 0; i < countKeys.length; i++) {
			siteTotal = siteTotal + counts[countKeys[i]].total;
		}

		embedData.fields.push({
			name: '-- **Total Sites by Type** --',
			value: `**AP**: ${counts.ap.total} 
			**BM**: ${counts.bm.total}
			**BT**: ${counts.bt.total}
			**CS**: ${counts.cs.total}
			**FG**: ${counts.fg.total}
			**FM**: ${counts.fm.total}
			**GEN**: ${counts.gen.total}
			**GB**: ${counts.gb.total}
			**GR**: ${counts.gr.total}
			**GS**: ${counts.gs.total}
			**GV**: ${counts.gv.total}
			**GY**: ${counts.gy.total} 
			**LS**: ${counts.ls.total} 
			**TB**: ${counts.tb.total}  
			**TS**: ${counts.ts.total}
			**TW**: ${counts.tw.total}`,
			inline: false,
		}, {
			name: '-- **Total Sites** --',
			value: `**Total**: ${siteTotal}`,
			inline: false,
		});

		msg.edit(discordEmbed);
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
