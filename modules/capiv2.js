const fetch = require('node-fetch');

module.exports = (client) => {

  // Set CAPIv2 Server
  var url;
  if (process.env.NODE_ENV === 'development') {
    url = 'https://api.canonn.tech:2083'
  } else if (process.env.NODE_ENV === 'staging') {
    url = 'https://api.canonn.tech:2053'
  } else {
    url = 'https://api.canonn.tech'
  }


  // CAPIv2 Basic commands
  client.capiVersion = async () => {
    try {
      const response = await fetch(url + '/info')
      const json = await response.json();
      return json;
    } catch (error) {
      console.log(error);
    }
  }
};