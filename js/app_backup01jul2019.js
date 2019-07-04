
function AppViewModel() {
    'use strict';
		console.log("Inicio");
    //Delaracao das variaveis
	this.condicao = ko.observable('TEMALGO');
	this.name = ko.observable('Tabby');
	var self = this;
	var map;
	var largeInfowindow = new google.maps.InfoWindow();
	self.filtroAero = ko.observable();
    var marker = ko.observableArray([]);
    // Create a new blank array for all the listing markers.
    var markers = [];
	//FIm das declaracoes das variaveis
    //Inicializacao do Mapa
    this.initMap = function() {
    // Cria um mapa com o centro e o Zoom
      map = new google.maps.Map(document.getElementById('map'), {
      center: {lat: -22.092762, lng: -42.863707},
      zoom: 9,
	  mapTypeControl: false
      });
    }
    //Popula o mapa com as marcas
    this.inicioPlaceMarks = function(){
		for (var i = 0; i < localizacaoAreoporto.length; i++) {
			//Faz a impressao dos pontos com os nomes da matriz (localizacaoAreoporto)
			var contentString;
			// Get the position from the location array.
			var position = localizacaoAreoporto[i].position;
			console.info("position:" + position);
			var title = localizacaoAreoporto[i].title;
			console.log("title:" + title);
			var icon = localizacaoAreoporto[i].icon;
			// Create a marker per location, and put into markers array.
            marker = new google.maps.Marker({
				map: map,
				position: position,
				title: title,
				animation: google.maps.Animation.DROP,
				icon: icon
			});
			// Push the marker to our array of markers.
			markers.push(marker);
			// Create an onclick event to open an infowindow at each marker.
			marker.addListener('click', function() {
				populateInfoWindow(this, largeInfowindow);
				largeInfowindow.setContent(marker.contentString);
			});
			//chama a API para preencher o estado da condição metere.
			//apiOpenWeather(marker.position.lat(), marker.position.lng());
			var lat = marker.position.lat();
			var lng = marker.position.lng();
			var APIKEY = "d16658df018fb4a287c3820f807c1be2";
			var url  = "https://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + lng + "&appid=" + APIKEY + "&units=metric";
			var newIcon = "";
			var result = "";
			console.log(url);
			$.ajax({
				type: "POST",
				url: url,
				dataType: "json",
				success: function (result) {
					//Existe um delay entre as marcas da matriz e a resposta da API.
					//A cada resposta da API faz a atualizacao do Link do Icon e faz o print no mapa
					console.log("Dentro da API");
					console.log(result);
					console.log(result.weather[0].main);
					console.log(result.weather[0].icon);
					newIcon = "http://openweathermap.org/img/wn/" + result.weather[0].icon + ".png";
					//Atualiza a matric com o Icone vindo da API:
					contentString = '<div>'  +
									'<img src= ' + newIcon + ' > </div>';
									//'<img src="http://openweathermap.org/img/wn/" ' + result.weather[0].icon + ' .png" > </div>';
					marker.contentString = contentString;
					console.log("Saindo da API: " + marker.contentString + contentString);
				},
				error: function (error) {
					alert("Error na API Openweathermap." )
				}
			});	  
			//console.log("MARKER:" + marker.title);
			console.log("MARKER:" + marker.contentString);
			
		}
	}
	function populateInfoWindow (marker, infowindow){
    // Check to make sure the infowindow is not already opened on this marker.
    if (largeInfowindow.marker != marker) {
		infowindow.marker = marker;
		infowindow.setContent('<div>' + marker.title + '</div>' + marker.contentString );
		console.log("marker.title: " + marker.title);
		console.log("marker.contentString: " + marker.contentString);
		console.log("marker.position.lat(): " + marker.position.lat());
		console.log("marker.position.lng(): " + marker.position.lng());
		// sets animation to bounce 2 times when marker is clicked
		marker.setAnimation(google.maps.Animation.BOUNCE);
		setTimeout(function() {
			marker.setAnimation(null);
		}, 2130);
		infowindow.open(map, marker);
		// Make sure the marker property is cleared if the infowindow is closed.
		infowindow.addListener('closeclick', function() {
			infowindow.marker = null;
		});
    }
  }
	this.showListings = function() {
        var bounds = new google.maps.LatLngBounds();
        // Extend the boundaries of the map for each marker and display the marker
        for (var i = 0; i < markers.length; i++) {
          markers[i].setMap(map);
          bounds.extend(markers[i].position);
        }
        map.fitBounds(bounds);
    }
  //API
  function apiOpenWeather (lat, lng) {
    console.log("entrou" );
    //console.log("markers.position.lng(): " + markers.position.lat());
    //console.log("markers.position.lng(): " + markers.position.lng());
    //var lat = markers.position.lat();
    //var lng = markers.position.lng();

  };

	//Chama a função de inicialização do Mapa
	this.initMap();
	//Chama a função p popular o Map com as marcas
	this.inicioPlaceMarks();
	//Chama a API para atualizar os Icons.
	this.showListings();
	//Cria a Marca - Esperado @param {ponto}
	//this.apiOpenWeather();
	console.log("Fim");
}
//Chama a funcao initApp junto a API do Coogle
function initApp() {
    ko.applyBindings(new AppViewModel());
}
