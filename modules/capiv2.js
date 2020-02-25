const fetch = require('node-fetch');
const delay = ms => new Promise(res => setTimeout(res, ms));

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
		await delay(250);
		return await fetch_retry(url, options, retryCount - 1);
	}
};

// Additonal types for siteTypes
additionalTypes = {
	gen: 'Generation Ship',
	gb: 'Guardian Beacon',
	gr: 'Guardian Ruin',
	gs: 'Guardian Structure',
	ts: 'Thargoid Structure',
};

module.exports = client => {
	// Set site images from API as preview icons
	client.siteImages = () => {
		let links = {
			ap: '',
			bm: 'https://api.canonn.tech/uploads/221a6ffe20dc4f599664577baf1bdf55.png',
			bt: 'https://api.canonn.tech/uploads/81aa7020203e40f8afac03a68123bda7.png',
			cs: 'https://api.canonn.tech/uploads/d357be01d11e451f9889adfc44705599.png',
			fg: 'https://api.canonn.tech/uploads/740d3101e889425894fcf64d5e318d8c.png',
			fm: '',
			gen: '',
			gb: '',
			gr: 'https://api.canonn.tech/uploads/ad81d7541e40465db8fbb59470d9dc89.png',
			gs: 'https://api.canonn.tech/uploads/ad81d7541e40465db8fbb59470d9dc89.png',
			gv: '',
			gy: 'https://api.canonn.tech/uploads/eb6892af31104dce9c32a98448912cc7.png',
			ls: 'https://api.canonn.tech/uploads/4ef6d4595c894550bdd59b0e85130f6b.png',
			tb: 'https://api.canonn.tech/uploads/71132d2b3056491cb984aa1fd318c27d.png',
			ts: 'https://api.canonn.tech/uploads/3f7d82d00c044c6f9953c7ab572ece60.png',
			tw: '',
		};
		return links;
	};

	// Map report Types
	client.reportTypes = () => {
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
	};

	// Map possible site types (report + some extra)
	client.siteTypes = () => {
		let types = {
			...client.reportTypes(),
			...additionalTypes,
		};
		return types;
	};

	// Map report Statuses from CAPIv2
	client.reportStatus = () => {
		let status = ['pending', 'updated', 'accepted', 'declined', 'issue', 'duplicate'];
		return status;
	};

	// CAPIv2 Basic commands
	client.capiVersion = async () => {
		try {
			const response = await fetch_retry(5, url + '/info', {});
			const json = await response.json();
			return json;
		} catch (error) {
			client.logger.error('Fetch Error: ' + error);
			console.log(error);
		}
	};

	// Get counts of sites and reports
	client.capiGetCounts = async () => {
		try {
			const response = await fetch_retry(5, url + `/totalcount`, {});
			return await response.json();
		} catch (error) {
			client.logger.error('Fetch Error: ' + error);
			console.log(error);
		}
	};

	// Get a single report
	client.capiGetReport = async (reportType, reportID) => {
		try {
			const response = await fetch_retry(5, url + `/${reportType}reports/${reportID}`, {});
			const json = await response.json();
			return json;
		} catch (error) {
			client.logger.error('Fetch Error: ' + error);
			console.log(error);
		}
	};

	// Get a single site
	client.capiGetSite = async (siteType, siteID, rawSiteID = null) => {
		var siteUrl;
		if (siteType === 'raw' && rawSiteID) {
			siteURL = url + `/${siteType}sites/${rawSiteID}`
		} else {
			siteUrl = url + `/${siteType}sites?siteID=${siteID}`
		}

		try {
			const response = await fetch_retry(5, siteUrl, {});
			const json = await response.json();
			if (!json[0].discoveredBy) { json[0].discoveredBy = { cmdrName: 'Unknown' } };
			if (!json[0].frontierID) { json[0].frontierID = 'Unknown' };
			return json;
		} catch (error) {
			client.logger.error('Fetch Error: ' + error);
			console.log(error);
		}
	};

	client.capiGetCmdrCount = async () => {
		// Get a count of all CMDRs
	};
};
