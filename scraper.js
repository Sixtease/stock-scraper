'use strict';

var fs = require('fs');
var request = require('request-promise');
var cheerio = require('cheerio');

// Načtení seznamu Tickerů ze souboru
var tickers = JSON.parse(fs.readFileSync('tickers_map_sample.json'));
var list_of_tickers = Object.keys(tickers);

var requests = [];

// Stažení PE_RATIO-value hodnot pro dné tickery
list_of_tickers.forEach(function (index) { 
    var request_options = {
        uri: 'http://finance.yahoo.com/quote/'+index+'?p='+index,
        headers: {'User-Agent': 'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2228.0 Safari/537.36',},
    };
      
    requests.push(
        request(request_options).then(function (html) {
            var $ = cheerio.load(html);
            var p = $("td[data-test='PE_RATIO-value']").text();
            tickers[index].pe = p;
        })
    );
});

Promise.all(requests).then(function () {
    var dateFormat = require('dateformat');
    var now = new Date();
    var d = dateFormat(now, "yyyy-mm-dd");
    var csv_lines = [];

    // ADD TO EXISTING CSV FILEs ROW BY ROW   node test_2.js
    list_of_tickers.forEach(function (i) {
        var ticker = tickers[i];
        fs.appendFileSync(i+".csv", [d, i, ticker.name, ticker.pe].join(';')  + '\r\n');
    })
});
