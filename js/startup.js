window.onload = function(){

	var boxes = document.querySelectorAll('[data-box]');
	for(var i=0;i<boxes.length;i++){
		boxes[i].addEventListener('click', function(event){
			console.log(event.target);
			selectCurrency(event.target.getAttribute('data-box'))
		})
	}
	
	selectCurrency('BTC')
	connection = new WebSocket('wss://api.hitbtc.com/api/2/ws');
	connection.onopen = initializeSocket;
	connection.onmessage = receiveMessage;

	setTimeout(function(){
		el('graph').classList.remove('hidden');
		el('graph').classList.add('animated');
		el('graph').classList.add('fadeIn');
	},1500)
	
}

function receiveMessage(data){

	var data = JSON.parse(data.data);

	if(data.channel == "ticker"){
		canReceive = false;
		var to = "USD";
		var from = data.data.symbol.replace("USDT",'').replace("USD",'');
		var price = data.data.ask;
		var date = moment(data.data.timestamp);

		if(!tickers[from].canReceive){
			return;
		}

		tickers[from].canReceive = false;
		setTimeout(function(){
			tickers[from].canReceive = true;
		},2000)

		var changePercentage = ((price-data.data.open)/data.data.open)*100;
		tickers[from].buffer.push({
			x: date,
			y: price
		})

		var digitCount = tickers[from].digits || 2;
		var format = '0,0.'
		for(var i=0;i<digitCount;i++){
			format = format+"0";
		}
		el(from+'-price').innerHTML = numeral(parseFloat(price)).format(format);
		el(from+'-percentage').innerHTML = changePercentage.toFixed(2)+" %";
		if(changePercentage > 0){
			el(from+"-percentage").classList.remove('red')
			el(from+"-percentage").classList.add('green')
		}else{
			el(from+"-percentage").classList.remove('green')
			el(from+"-percentage").classList.add('red')
		}

	}
	
}