require('dotenv').config({ path: require('find-config')('.env') });

const config = {
  // Bot Owner - Level 10
  "ownerID": "211722558385553408", // DMehaffy

  // Bot Admins - Level 9
  "admins": [
    "298594247454490624", // LCU No Fool Like One
  ],

  // Bot Support - Level 8
  "support": [],

  // Bot's Token
  "token": process.env.BOT_TOKEN, 

  // PERMISSION LEVEL DEFINITIONS.
  permLevels: [
    { level: 0,
      name: "User",
      check: () => true
    },

    { level: 2,
      name: "Moderator",
      check: (message) => {
        try {
          const modRole = message.guild.roles.find(r => r.name.toLowerCase() === message.settings.modRole.toLowerCase());
          if (modRole && message.member.roles.has(modRole.id)) return true;
        } catch (e) {
          return false;
        }
      }
    },

    { level: 3,
      name: "Administrator", 
      check: (message) => {
        try {
          const adminRole = message.guild.roles.find(r => r.name.toLowerCase() === message.settings.adminRole.toLowerCase());
          return (adminRole && message.member.roles.has(adminRole.id));
        } catch (e) {
          return false;
        }
      }
    },

    { level: 4,
      name: "Server Owner", 
      check: (message) => message.channel.type === "text" ? (message.guild.ownerID === message.author.id ? true : false) : false
    },

    { level: 8,
      name: "Bot Support",
      check: (message) => config.support.includes(message.author.id)
    },

    { level: 9,
      name: "Bot Admin",
      check: (message) => config.admins.includes(message.author.id)
    },

    { level: 10,
      name: "Bot Owner", 
      check: (message) => message.client.config.ownerID === message.author.id
    }
  ]
};

module.exports = config;
