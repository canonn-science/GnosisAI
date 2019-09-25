const moment = require('moment');

exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars

  approvedReportTypes = {
    'ap': 'Amphora Plant',
    'bm': 'Bark Mound',
    'bt': 'Brain Tree',
    'cs': 'Crystalline Shard',
    'fg': 'Fungal Gourd',
    'fm': 'Fumarole',
    'gv': 'Gas Vent',
    'gy': 'Geyser',
    'ls': 'Lava Spout',
    'tb': 'Thargoid Barnacle',
    'tw': 'Tube Worm'
  };

  reportKeys = Object.keys(approvedReportTypes);

  let request = args[0].match(/[a-zA-Z]+|[0-9]+(?:\.[0-9]+)?|\.[0-9]+/g);
  if (reportKeys.includes(request[0].toLowerCase()) === false) {
    message.channel.send('Sorry but I don\'t know what report type ' + request[0].toUpperCase() + ' is.');
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
      msg.edit(`= ${approvedReportTypes[request[0]]} Report: ${request[1]} =
• System  :: ${reportData.systemName.toUpperCase()}
• Body    :: ${reportData.bodyName.toUpperCase()}
• CMDR    :: ${reportData.cmdrName}
• Lat/Lon :: ${reportData.latitude.toFixed(2)}/${reportData.longitude.toFixed(2)}
• Status  :: ${reportData.reportStatus}
• Site ID :: ${siteID}
• Updated :: ${moment(reportData.updated_at).format('LLL')} UTC`, {code: "asciidoc"});
    }
  }
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [
    'rp',
    'rpt'
  ],
  permLevel: "User"
};

exports.help = {
  name: "report",
  category: "Canonn Reports",
  description: "Checking the status of a report by it\'s id",
  usage: "!report ap7"
};