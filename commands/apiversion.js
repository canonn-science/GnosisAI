const Discord = require('discord.js');

exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars
  const msg = await message.channel.send('Fetching CAPIv2 Version...');

  console.log(message);

	let embedData = {
		color: 14323987,
    thumbnail: {
      url: 'https://api.canonn.tech/uploads/bb866ea7470648de88d09c125f8718c4.png',
    },
		footer: {
			icon_url: 'https://api.canonn.tech/uploads/40bfc7d870e54925ad0f769e7b0b1f9a.png',
			text: 'Provided by Canonn R&D - (canonn.science)',
		},
		fields: [],
	};

  const version = await client.capiVersion();
  embedData.fields.push({
    name: '= CAPIv2 Version =',
    value: `**Name**: ${version.description}\n \
    **Strapi**: ${version.strapiVersion}\n \
    **CAPIv2**: ${version.capiVersion}`,
    inline: false,
  });

	let discordEmbed = new Discord.RichEmbed(embedData);

  msg.edit(discordEmbed);
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: "Administrator"
};

exports.help = {
  name: "apiversion",
  category: "Canonn API",
  description: "Checking the Canonn APIv2 Version",
  usage: "apiversion"
};
