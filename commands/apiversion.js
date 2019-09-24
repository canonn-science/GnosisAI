exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars

  const version = await client.capiVersion();
  message.channel.send(`= CAPIv2 Version =
  • Name   :: ${version.description}
  • Strapi :: ${version.strapiVersion}
  • CAPIv2 :: ${version.capiVersion}`, {code: "asciidoc"});
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
