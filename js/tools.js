var el = function(id){ return document.getElementById(id) };

function apiRequest(url, raw){
	var request = new XMLHttpRequest();

	return new Promise(function(res,rej){
		request.open('GET', url, true);

		request.onload = function() {
			if (request.status >= 200 && request.status < 400) {
				if(raw){
					return res(request.responseText)
				}
				res(JSON.parse(request.responseText));
			} else {
				alert("HTTP Error");
			}
		};

		request.onerror = function() {
			alert("HTTP Error");
		};

		request.send();
	})

}

function selectCurrency(ticker){
	el('graph').classList.add('hidden')
	chart.data.datasets[0].data = [];
	chart.update();

	currentTicker = ticker;
	var boxes = document.querySelectorAll('[data-box]');
	for(var i=0;i<boxes.length;i++){
		boxes[i].querySelector('.header').classList.remove('bg-green');
		boxes[i].classList.remove('selectedBox');
	}

	var box = document.querySelector('[data-box="'+ticker+'"]');
	box.querySelector('.header').classList.add('bg-green');
	box.classList.add('selectedBox');

	apiRequest("https://min-api.cryptocompare.com/data/histominute?fsym="+ticker+"&tsym=USD&limit=20&e=HitBTC")
	.then(function(res){
		for(var j=0;j<res.Data.length;j++){
			tickers[currentTicker].buffer.push({
				x: moment(res.Data[j].time*1000),
				y: res.Data[j].close
			})
		}
		Array.prototype.push.apply(chart.data.datasets[0].data, tickers[currentTicker].buffer);
		chart.data.datasets[0].data.sort(function(a, b) {
			return a.x - b.x;
		});
		tickers[currentTicker].buffer = [];
	})
}

function refreshFunction(chart) {
	if(!currentTicker){
		return;
	}
	Array.prototype.push.apply(chart.data.datasets[0].data, tickers[currentTicker].buffer);
	chart.data.datasets[0].data.sort(function(a, b) {
		return a.x - b.x;
	});
	el('graph').classList.remove('hidden')

	tickers[currentTicker].buffer = [];
}

function initializeSocket(){
	for(var ticker in tickers){
		connection.send(JSON.stringify({
		  "method": "subscribeTicker",
		  "params": {
		    "symbol": (tickers[ticker].channel || tickers[ticker].ticker+"USD")
		  },
		  "id": (Math.random()%1000000)+10000
		}))
	}
}