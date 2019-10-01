const fetch = require('node-fetch');
const delay = ms => new Promise(res => setTimeout(res, ms));

module.exports = client => {
	// Set CAPIv2 Server
	var url;
	if (process.env.NODE_ENV === 'development') {
		url = 'https://api.canonn.tech:2083';
	} else if (process.env.NODE_ENV === 'staging') {
		url = 'https://api.canonn.tech:2053';
	} else {
		url = 'https://api.canonn.tech';
	}

	// Script Function to fetch and retry x times if error
	fetch_retry = async (retryCount, url, options = {}) => {
		try {
      let data = await fetch(url, options);
				return data;
		} catch (error) {
			if (retryCount <= 1) console.log(error);
			await delay(500);
			return await fetch_retry(url, options, retryCount - 1);
		}
	};

	(client.reportTypes = () => {
		let types = {
			ap: 'Amphora Plant',
			bm: 'Bark Mound',
			bt: 'Brain Tree',
			cs: 'Crystalline Shard',
			fg: 'Fungal Gourd',
			fm: 'Fumarole',
			gv: 'Gas Vent',
			gy: 'Geyser',
			ls: 'Lava Spout',
			tb: 'Thargoid Barnacle',
			tw: 'Tube Worm',
		};

		return types;
	}),
		(additionalTypes = {
			gen: 'Generation Ship',
			gb: 'Guardian Beacon',
			gr: 'Guardian Ruin',
			gs: 'Guardian Structure',
			ts: 'Thargoid Structure',
		}),
		(client.siteTypes = () => {
			let types = {
				...client.reportTypes(),
				...additionalTypes,
			};

			return types;
		}),
		(client.reportStatus = () => {
			let status = ['pending', 'updated', 'accepted', 'declined', 'issue', 'duplicate'];

			return status;
		});
	// CAPIv2 Basic commands
	(client.capiVersion = async () => {
		try {
			const response = await fetch_retry(5, url + '/info', {});
			const json = await response.json();
			return json;
		} catch (error) {
			client.logger.error('Fetch Error: ' + error);
			console.log(error);
		}
	}),
		// Get a single report
		(client.capiGetReport = async (reportType, reportID) => {
			try {
				const response = await fetch_retry(5, url + `/${reportType}reports/${reportID}`, {});
				const json = await response.json();
				return json;
			} catch (error) {
				client.logger.error('Fetch Error: ' + error);
				console.log(error);
			}
		}),
		(client.capiGetReportCount = async (reportType, reportStatus = null) => {
			// Get a count of reports based on reportStatus

			var reportUrl;
			if (reportStatus === 'total') {
				reportUrl = url + `/${reportType}reports/count`;
			} else {
				reportUrl = url + `/${reportType}reports/count?reportStatus=` + encodeURIComponent(reportStatus);
			}

			try {
				const response = await fetch_retry(5, reportUrl, {});
        const count = await response.text();
				return await Number(count);
			} catch (error) {
				client.logger.error('Fetch Error: ' + error);
				console.log(error);
			}
		}),
		(client.getTypes = async siteType => {
			// Get all types for a site type
		}),
		(client.capiGetSite = async (siteType, siteID, rawSiteID = null) => {
			// Get a single site
		}),
		(client.capiGetSiteCount = async (siteType, type = null) => {
			// Get a count of sites based on types

			var siteUrl;
			if (type === 'all') {
				siteUrl = url + `/${siteType}sites/count`;
			} else {
				siteUrl = url + `/${siteType}sites/count?type.type=` + encodeURIComponent(type);
			}

			try {
				const response = await fetch_retry(5, siteUrl, {});
				const count = await response.text();
				return Number(count);
			} catch (error) {
				client.logger.error('Fetch Error: ' + error);
				console.log(error);
			}
		}),
		(client.capiGetCmdrCount = async () => {
			// Get a count of all CMDRs
		});
};
