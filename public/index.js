  var prices = [[1638246478210, 157.87],[1638246391810, 160.55],[1638246305410, 161.02],[1638246219010, 160.36],[1638246132610, 161.09],[1638246046210, 159.83],[1638245959810, 159.47]]; //demo purpose as the market might be closed
  // var prices = [];
  var currentStock;

  const ws = new WebSocket('ws://localhost:3000/');
  ws.onopen = function() {
    console.log('WebSocket Client Connected');
    // ws.send(currentStock);
  };
  ws.onmessage = function(e) {
    var data = JSON.parse(e.data);
    var temp = [];
    temp.push(Date.now());
    temp.push(data.c);
    prices.push(temp);

    // Create the chart
    Highcharts.stockChart('container', {

      rangeSelector: {
        selected: 5
      },

      title: {
        text: currentStock + ' Stock Price'
      },

      series: [{
        name: currentStock,
        data: prices,
        tooltip: {
          valueDecimals: 2
        }
      }]
    });
  };

  function tickerUpdate(e){
    currentStock = e.value;
    loadNews();
    // prices = []; //demo purpose as the market might be closed
    ws.send(currentStock);
  }


  function loadNews() {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        var news = JSON.parse(this.responseText);
        for(i=0; i<9; i++){
         var tile = '<div class="col-md-4">' +
          '<div class="card">' +
            '<div class="card-block">' +
              '<h4 class="card-title">' + news[i].source + '</h4>' +
              '<h6 class="card-subtitle text-muted">' + news[i].related + '</h6>' +
              '<p class="card-text p-y-1">' + news[i].headline + '</p>' +
              '<a href="'+ news[i].url +'" class="card-link">link</a>' +
            '</div>' +
          '</div>' +
        '</div>';
         document.getElementById("tilerow").insertAdjacentHTML('beforeend',tile);      
        }
    }
  };
  xhttp.open("GET", "http://localhost:3000/companyNews?symbol=" + currentStock, true);
  xhttp.send();
}