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
  },

  client.capiGetReport = async () => {
    // Get a single report
  },

  client.capiGetReportCount = async () => {
    // Get a count of reports based on reportStatus
  },

  client.getTypes = async () => {
    // Get all types for a site type
  },

  client.capiGetSite = async () => {
    // Get a single site
  },

  client.capiGetSiteCount = async () => {
    // Get a count of sites based on types
  },

  client.capiGetCmdrCount = async() => {
    // Get a count of all CMDRs
  }
};