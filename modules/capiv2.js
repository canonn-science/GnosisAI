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
      const response = await fetch(url + '/info');
      const json = await response.json();
      return json;
    } catch (error) {
      client.logger.error('Fetch Error: ' + error );
      console.log(error);
    }
  },

  // Get a single report
  client.capiGetReport = async (reportType, reportID) => {
    try {
      const response = await fetch(url + `/${reportType}reports/${reportID}`);
      const json = await response.json();
      return json;
    } catch (error) {
      client.logger.error('Fetch Error: ' + error );
      console.log(error);
    }
  },

  client.capiGetReportCount = async (reportType) => {
    // Get a count of reports based on reportStatus
  },

  client.getTypes = async (siteType) => {
    // Get all types for a site type
  },

  client.capiGetSite = async (siteType, siteID, rawSiteID = null) => {
    // Get a single site
  },

  client.capiGetSiteCount = async (siteType) => {
    // Get a count of sites based on types
  },

  client.capiGetCmdrCount = async() => {
    // Get a count of all CMDRs
  }
};