'use strict';

var request = require('request');
var cheerio = require('cheerio');

var tickers = [];

var get_tickers_page_url = 'http://finviz.com/screener.ashx?v=111';

var request_options = {
    url: get_tickers_page_url,
    headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2228.0 Safari/537.36',
    },
};

function request_tickers_page (url) {
    request_options.url = url;
    request(request_options, function (error, response, html) {
        var $ = cheerio.load(html);
        extract_tickers($, tickers);
        maybe_load_next_tickers_page($);
    });
}

function extract_tickers($, tickers) {
    $('.screener-link-primary').each(function () {
        var ticker = $(this).text();
        tickers.push(ticker);
        console.log(ticker);
    });
}

function maybe_load_next_tickers_page($) {
    var $next_page_option = $('#pageSelect>[selected]+option');
    var next_page_number;
    if ($next_page_option && (next_page_number = $next_page_option.val())) {
        request_tickers_page(get_tickers_page_url + '&r=' + next_page_number);
    }
    else {
        tickers_loaded();
    }
}

function tickers_loaded() {
    console.log('done');
}

request_tickers_page(get_tickers_page_url);
