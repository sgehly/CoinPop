var ctx = document.querySelector('canvas').getContext('2d');

var chart = new Chart(ctx, chartConfig);

var currentTicker;

for(var ticker in tickers){
	tickers[ticker].buffer = [];
	tickers[ticker].canReceive = true;
}

var connection;