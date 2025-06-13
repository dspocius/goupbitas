const express = require('express');
const axios = require('axios');
 
const app = express();
const PORT = 3008;
const HOST = '0.0.0.0';
 
const mybrowser = {};
function loadPupeteer() {
	const puppeteer = require('puppeteer');
 	(async () => {
	  mybrowser.browser = await puppeteer.connect({
		browserURL: 'http://127.0.0.1:9222'
	  });
	  const pages = await mybrowser.browser.pages();
	  const upbitpage = pages.find(page => page.url().includes("upbit.com"));
	  const bithumb = pages.find(page => page.url().includes("bithumb.com"));

	  if (!upbitpage) {
		mybrowser.upbit = await mybrowser.browser.newPage();
		await mybrowser.upbit.goto('https://upbit.com/service_center/notice');
	  } else {
		  mybrowser.upbit = upbitpage;
	  }
	  if (!bithumb) {
		mybrowser.bithumb = await mybrowser.browser.newPage();
		await mybrowser.bithumb.goto('https://feed.bithumb.com/notice?category=9&page=1');
	  } else {
		  mybrowser.bithumb = bithumb;
	  }
		console.log("PUPETEER OK", mybrowser.upbit, mybrowser.bithumb);
	})();
}
 
app.get('/upbitt', async function (req, res) {
    try {
        const response = await app.getupbitbr();
        res.json({ response: response.data });
    } catch (error) {
        console.error('Error fetching from Solscan:', error.message);
        res.status(500).json({ error: 'Failed to fetch data' });
    }
});
app.get('/bithumbb', async function (req, res) {
    try {
        const response = await app.getbithumbbr();
        res.json(response);
    } catch (error) {
        console.error('Error fetching from Solscan:', error.message);
        res.status(500).json({ error: 'Failed to fetch data' });
    }
});
app.getupbitbr = async function() {
	if (mybrowser && mybrowser.upbit) {
		 const opa = await mybrowser.upbit.evaluate(() => {
			var xmlHttp = new XMLHttpRequest();
			xmlHttp.open( "GET", "https://api-manager.upbit.com/api/v1/announcements?os=web&page=1&per_page=1&category=trade&nocache=true&timestamp="+new Date().getTime(), false );
			xmlHttp.send( null );
				if (xmlHttp.status === 200) {
				let dt = JSON.parse(xmlHttp.responseText);
				return dt;
			}
			return null;
		});
		return opa;
	}
};
app.getbithumbbr = async function() {
	if (mybrowser && mybrowser.bithumb) {
		 const opa = await mybrowser.bithumb.evaluate(() => {
			var xmlHttp = new XMLHttpRequest();
			let dt = window.__NEXT_DATA__;
			
			xmlHttp.open( "GET", "https://feed.bithumb.com/_next/data/"+dt.buildId+"/notice.json?category=9&page=1", false );
			xmlHttp.send( null );
				if (xmlHttp.status === 200) {
				let dt = JSON.parse(xmlHttp.responseText);
				return dt;
			}
			return null;
		});
		return opa;
	}
};
app.get('/upbittold', async function (req, res) {
    try {
        const response = await axios.get("https://api-manager.upbit.com/api/v1/announcements?os=web&page=1&per_page=1&category=trade&nocache=true&timestamp="+new Date().getTime());
        res.json({ response: response.data });
    } catch (error) {
        console.error('Error fetching from Solscan:', error.message);
        res.status(500).json({ error: 'Failed to fetch data' });
    }
});
app.get('/binanceall', async function (req, res) {
    try {
        const response = await axios.get("https://www.binance.com/bapi/apex/v1/public/apex/cms/article/list/query?type=1&pageNo=1&pageSize=10");		
        res.json({response: response.data });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch data' });
    }
});
app.get('/binancealpha', async function (req, res) {
    try {
        const response = await axios.get("https://www.binance.com/bapi/defi/v1/public/wallet-direct/buw/wallet/cex/alpha/all/token/list");		
        res.json({response: response.data });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch data' });
    }
});
app.listen(PORT, HOST, () => {
	//loadPupeteer();
    console.log(`Server is running at http://${HOST}:${PORT}/`);
});
/*
https://feed.bithumb.com/notice?category=9&page=1
function bithumb() {
		var xmlHttp = new XMLHttpRequest();
		xmlHttp.open( "GET", "https://feed.bithumb.com/notice?category=9&page=1", false );
		xmlHttp.send( null );
 		    if (xmlHttp.status === 200) {
			let dt = xmlHttp.responseText;
			let not = "";
			let ook = dt.split('class="NoticeContentList_notice-list__i337r">')[1];
			let GOK = ook.split('<li>');
			let found = [];
			for (let i=1; i < 3; i++) {
				let one = GOK[i].split("NoticeContentList_notice-list__link-title__nlmSC")[1].split("</font>")[0].split(">")[1];
				if (one.split("(").length > 1) {
					found.push(one);
				}
			}
			return found;
		}
}
//
https://feed.bithumb.com/notice?category=9&page=1
https://upbit.com/service_center/notice


function bithumb() {
		var xmlHttp = new XMLHttpRequest();
		let dt = window.__NEXT_DATA__;
		
		xmlHttp.open( "GET", "https://feed.bithumb.com/_next/data/"+dt.buildId+"/notice.json?category=9&page=1", false );
		xmlHttp.send( null );
 		    if (xmlHttp.status === 200) {
			let dt = JSON.parse(xmlHttp.responseText);
			return dt;
		}
}

 function upbit() {
		var xmlHttp = new XMLHttpRequest();
		xmlHttp.open( "GET", "https://api-manager.upbit.com/api/v1/announcements?os=web&page=1&per_page=20&category=trade", false );
		xmlHttp.send( null );
 		    if (xmlHttp.status === 200) {
			let dt = JSON.parse(xmlHttp.responseText);
			return dt;
		}
}
*/