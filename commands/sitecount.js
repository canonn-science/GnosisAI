const moment = require('moment');

exports.run = async (client, message, args, level) => {
	// eslint-disable-line no-unused-vars

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

		msg.edit(
			`= All Site Counts =

• AP  :: ${counts.ap.total} 
• BM  :: ${counts.bm.total}
• BT  :: ${counts.bt.total}
• CS  :: ${counts.cs.total}
• FG  :: ${counts.fg.total}
• FM  :: ${counts.fm.total}
• GEN :: ${counts.gen.total}
• GB  :: ${counts.gb.total}
• GR  :: ${counts.gr.total}
• GS  :: ${counts.gs.total}
• GV  :: ${counts.gv.total}
• GY  :: ${counts.gy.total} 
• LS  :: ${counts.ls.total} 
• TB  :: ${counts.tb.total}  
• TS  :: ${counts.ts.total}
• TW  :: ${counts.tw.total}

Total Sites: ${siteTotal}
    `,
			{ code: 'asciidoc' }
		);
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
