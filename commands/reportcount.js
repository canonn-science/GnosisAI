const moment = require('moment');

exports.run = async (client, message, args, level) => {
	// eslint-disable-line no-unused-vars

	acceptedReportTypes = ['ap', 'bm', 'bt', 'cs', 'fg', 'fm', 'gv', 'gy', 'ls', 'tb', 'tw'];

	const msg = await message.channel.send('Getting counts...');

	if (args.length === 0) {
		// All site counts

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
    
    let countKeys = Object.keys(counts);

    for (let i = 0; i < countKeys.length; i++) {
      counts[countKeys[i]].total = await client.capiGetReportCount(countKeys[i], 'total');
      counts[countKeys[i]].pending = await client.capiGetReportCount(countKeys[i], 'pending');
      counts[countKeys[i]].accepted = await client.capiGetReportCount(countKeys[i], 'accepted');
      counts[countKeys[i]].duplicate = await client.capiGetReportCount(countKeys[i], 'duplicate');
    };

    let reportTotal = 0;
    for (let i = 0; i < countKeys.length; i++) {
      reportTotal = (reportTotal + counts[countKeys[i]].total);
    };

		msg.edit(
      `= All Report Counts by Status =
Total | Pending | Accepted | Duplicate\n
• AP :: ${counts.ap.total}, ${counts.ap.pending}, ${counts.ap.accepted}, ${counts.ap.duplicate} 
• BM :: ${counts.bm.total}, ${counts.bm.pending}, ${counts.bm.accepted}, ${counts.bm.duplicate}
• BT :: ${counts.bt.total}, ${counts.bt.pending}, ${counts.bt.accepted}, ${counts.bt.duplicate} 
• CS :: ${counts.cs.total}, ${counts.cs.pending}, ${counts.cs.accepted}, ${counts.cs.duplicate} 
• FG :: ${counts.fg.total}, ${counts.fg.pending}, ${counts.fg.accepted}, ${counts.fg.duplicate} 
• FM :: ${counts.fm.total}, ${counts.fm.pending}, ${counts.fm.accepted}, ${counts.fm.duplicate} 
• GV :: ${counts.gv.total}, ${counts.gv.pending}, ${counts.gv.accepted}, ${counts.gv.duplicate} 
• GY :: ${counts.gy.total}, ${counts.gy.pending}, ${counts.gy.accepted}, ${counts.gy.duplicate} 
• LS :: ${counts.ls.total}, ${counts.ls.pending}, ${counts.ls.accepted}, ${counts.ls.duplicate} 
• TB :: ${counts.tb.total}, ${counts.tb.pending}, ${counts.tb.accepted}, ${counts.tb.duplicate} 
• TW :: ${counts.tw.total}, ${counts.tw.pending}, ${counts.tw.accepted}, ${counts.tw.duplicate}

Total Reports: ${reportTotal}
    `, { code: 'asciidoc' }
		);
	}
};

exports.conf = {
	enabled: true,
	guildOnly: false,
	aliases: ['rpct', 'rptct'],
	permLevel: 'User',
};

exports.help = {
	name: 'reportcount',
	category: 'Canonn Reports',
	description: 'Grabbing a count of reports based on their status',
	usage: '!reportcount || !reportcount ap [pending]',
};
