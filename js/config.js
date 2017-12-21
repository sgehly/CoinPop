var tickers = {
	'BTC': {
		ticker: 'BTC',
	},
	'ETH': {
		ticker: 'ETH',
	},
	'LTC': {
		ticker: 'LTC',
	},
	'XRP': {
		ticker: 'XRP',
		channel: 'XRPUSDT',
		digits: 4,
	},
	'BCH': {
		ticker: 'BCH',
	}
}
var chartConfig = {

	type: 'line',
	data: {
		datasets: [{
			data: [],
			type: "line",
			borderColor: 'rgb(60, 220, 173)', // line color
			backgroundColor: 'rgba(60, 220, 173, 0.5)', // fill color
			fill: true,                      // no fill
			lineTension: 0
		}]
	},
	options: {
		layout: {
            padding: {
                left: 0,
                right: 10,
                top: 0,
                bottom: 0
            }
        },
		scaleShowLabels : true,
		scaleFontSize: 12,
    	responsive: true,
    	maintainAspectRatio: false,
    	legend: {
    		display: false
    	},
    	tooltips: {
    		enabled: true
    	},
    	title: {
            text: '', // chart title
            display: false
        },
        scales: {
        	xAxes: [{
                type: 'realtime', // auto-scroll on X axis
                display: true
            }],
            yAxes: [{
            	position: 'right',
            	ticks: {
	                userCallback: function(label, index, labels) {
	                    var split = label.toString().split('.');
	                    if(split[1] && split[1].length == 1) {
	                       	return parseFloat(split[0]+'.'+split[1]+'0').toFixed(2);
	                    }else{
	                    	return parseFloat(label).toFixed(2);
	                    }
	                },
	             }
            }]
        },
        tooltips: {
        	intersect: false
        },
        hover: {
        	mode: 'nearest',
        	intersect: false
        },
        elements: {
        	point: {
        		radius: 1
        	} 
        },
        plugins: {
        	streaming: {
                duration: 5*60*1000, // display data for the latest 300000ms (5 mins)
                delay: 0,

                onRefresh: function(chart) { // callback on chart update interval
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
            }
        }
    }
}