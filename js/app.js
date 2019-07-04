var map;
var markers = [];
var marker = [];

//Entra nesta função a partir da solicitação da API Google Maps
function initApp () {

    // Cria um mapa com o centro e o zoom no estado do Rio de Janeiro
    map = new google.maps.Map(document.getElementById('map'), {
		center: {lat: -22.092762, lng: -42.863707},
		zoom: 8,
		mapTypeControl: false
	});
	// Cria uma janela de informacao p cada ponto
	var infoWindow = new google.maps.InfoWindow();
	// Entra no Loop dentro de todas as posicoes das variavel localizacaoAreoporto
	for (var i = 0; i < localizacaoAreoporto.length; i++) {
			var position = localizacaoAreoporto[i].position;
			var title = localizacaoAreoporto[i].title;
			var icon = localizacaoAreoporto[i].icon;
			// Create a marker per location, and put into markers array.
      marker = new google.maps.Marker({
				map: map,
				position: position,
				title: title,
				animation: google.maps.Animation.DROP,
				icon: icon
			});
			// pushes all locations into markers array
			markers.push(marker);
			appViewModel.meusPontos()[i].marker = marker;
			// Create an onclick event to open an infowindow at each marker.
			marker.addListener("click", function() {
				// show info inside infowindow when clicked
				populateInfoWindow(this, infoWindow);
				// displays all data retrieved from foursquare api down below
			});
			//
	}
	function populateInfoWindow(marker, infoWindow) {
		// Check to make sure the infowindow is not already opened on this marker.
		if (infoWindow.marker != marker) {
			var contentString;
			var title_inside = marker.title;
			var lat = marker.position.lat();
			var lng = marker.position.lng();
			var APIKEY = "d16658df018fb4a287c3820f807c1be2";
			var url  = "https://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + lng + "&appid=" + APIKEY + "&units=metric";
			var newIcon = "";
			var result = "";
      //Call API openweathermap
      $.ajax({
				type: "POST",
				url: url,
				dataType: "json",
				success: function (result) {
					newIcon = "http://openweathermap.org/img/wn/" + result.weather[0].icon + ".png";
					//Atualiza o variavel contentString com as informacoes da API.
					contentString = "<span class='info'>" + title_inside + " </span> <br>" +
									"<span class='info'> Weather: "	+ result.weather[0].main + "</span> <br>" +
									"<img src= " + newIcon + "> <br>" +
									"<span class='info'> Visibility: " + result.visibility + " m </span> <br>" +
									"<span class='info'> Temperature: " + result.main.temp + "&deg;C </span> <br>" +
									"<span class='info'> Min temperature: " + result.main.temp_min + "&deg;C </span> <br>" +
									"<span class='info'> Max temperature: " + result.main.temp_max + "&deg;C </span> <br>" +
									"<span class='info'> Wind speed: " + result.wind.speed + " mps </span> <br>" +
									"<span class='info'> Wind direction: " + result.wind.deg + "&deg </span>";
					//Set infowindow data
					infoWindow.setContent('<div style= "text-align:left; ">' + contentString + '</div>');
				},
				error: function (error) {
						alert("Error na API Openweathermap.");
						contentString = '<div> A API Openweathermap não responde </div>'
				}
			});
			// sets animation to bounce 2 times when marker is clicked
			marker.setAnimation(google.maps.Animation.BOUNCE);
			//Set time to stop BOUNCE
			setTimeout(function() {
				marker.setAnimation(null);
			}, 5000);
			//Cria a marca.
			infoWindow.open(map, marker);
			// Make sure the marker property is cleared if the infowindow is closed.
			infoWindow.addListener("closeclick", function() {
				infoWindow.setMarker = null;
			});
		}
	}
}
//Se caiu aqui é pq deu erro no carregamento da API do Google Maps
function mapaError() {
	alert('Não foi possivel carregar o  Google Maps!! Por favor, tente novamente.');
}

function AppViewModel() {
	var self = this;
	// define Location observable array () // Observables and Observable Arrays are JS Functions
	this.meusPontos = ko.observableArray();
	this.filteredInput = ko.observable("");

	for (x = 0; x < localizacaoAreoporto.length; x++) {
		var place = new Location(localizacaoAreoporto[x]);
		self.meusPontos.push(place);
	}

    this.searchFilter = ko.computed(function() {
		var filter = self.filteredInput().toLowerCase(); // listens to what user types in to the input search bar
		// iterates through meusPontos observable array
		for (j = 0; j < self.meusPontos().length; j++) {
		// it filters meusPontos as user starts typing
			if (self.meusPontos()[j].title.toLowerCase().indexOf(filter) > -1) {
        // shows locations according to match with user key words
        self.meusPontos()[j].show(true);
				if (self.meusPontos()[j].marker) {
          // shows/filters map markers according to match with user key words
					self.meusPontos()[j].marker.setVisible(true);
				}
			} else {
        // hides locations according to match with user key words
				self.meusPontos()[j].show(false);
				if (self.meusPontos()[j].marker) {
					self.meusPontos()[j].marker.setVisible(false); // hides map markers according to match with user key words
				}
			}
		}
	});

	this.showLocation = function(locations) {
		google.maps.event.trigger(locations.marker, "click");
	}
}
// Location Constructor
var Location = function(data) {
  var self = this;
  this.title = data.title;
  this.location = data.location;
  this.show = ko.observable(true);
};

// instantiate the ViewModel using the new operator and apply the bindings (activate KO)
appViewModel = new AppViewModel();
// activate knockout apply binding
ko.applyBindings(appViewModel);
