
function AppViewModel() {
    'use strict';
    var map;
    var self = this;
    //Inicializacao do Mapa
    this.initMap = function() {
    // Cria um mapa com o centro e o Zoom
      map = new google.maps.Map(document.getElementById('map'), {
      center: {lat: -22.092762, lng: -42.863707},
      zoom: 9
      });
    }
    //Popula o mapa com as marcas
    this.inicioPlaceMarks = function(){
		localizacaoAreoporto.forEach(function(ponto) {
			//Faz a impressao dos pontos com os nomes da matriz (localizacaoAreoporto)
			criaIcon(ponto);
		});
			
	}
	//Popula o mapa com o resultado das requisições da API
    this.inicioPlaceAPI = function(){
		localizacaoAreoporto.forEach(function(ponto) {
			//Faz a impressao dos pontos com os nomes da matriz (localizacaoAreoporto)
			estado = estadoMeteorologico(ponto.id, ponto.position.lat, ponto.position.lng);
		});
	}	
	// Cria o ponto no Mapa, utiliza a variavel ponto com as infos do ponto
	// Input: ponto (ponto.title) (ponto.position.lat) (ponto.position.lng) .
	function criaIcon(ponto) {
      	//Importa p variaveis os valores do Aeroporto, Lat e Long.
		myLatLng = {lat: ponto.position.lat, lng: ponto.position.lng};
		title = ponto.title;
		icons = ponto.icon;
		//Cria a janela de Informação.
        var infowindow = new google.maps.InfoWindow({
          content: title
        });
		//Cria a marca no Mapa.		
		marker = new google.maps.Marker({
          position: myLatLng,
          map: map,
          title: title,
		  icon: icons
        });
		//Abre uma janela em função do click, para mostrar o valor do Infowindows.
		marker.addListener('click', function() {
          infowindow.open(map, marker);
        });
		
		markers.push(marker);
	}
	// Valor esperado (lat)=Latitude em decimal e (lng)=Longitude em formato decimal
	// Retorna a Url do Estado do Icone.
	function estadoMeteorologico(ida, lat, lng) {
		console.log(lat);
		console.log(lng);
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
					console.log(ida);
					console.log(result);
					console.log(result.weather[0].main);
					console.log(result.weather[0].icon);
					//Atualiza a matric com o Icone vindo da API:
					newIcon = "http://openweathermap.org/img/wn/" + result.weather[0].icon + ".png";
					console.log(newIcon);
					//Find index of specific object using findIndex method.    
					var objIndex = localizacaoAreoporto.findIndex((obj => obj.id == ida));
					//Log object to Console.
					console.log("Before update: ", localizacaoAreoporto[objIndex])
					//Update object's name property.
					localizacaoAreoporto[objIndex].icon = newIcon;
					//Log object to console again.
					console.log("After update: ", localizacaoAreoporto[objIndex]);
					self.inicioPlaceMarks();
                },
                error: function (error) {
                    alert("Error na API Openweathermap." )
                }
            });
	}
	// This function will loop through the listings and hide them all.
    function hideListings() {
        for (var i = 0; i < localizacaoAreoporto.length; i++) {
          marker[i].setMap(null);
		}
	}
	console.log("Inicio");
    //Delaracao das variaveis
	var myLatLng = ""; 
	var title = "";
	var estado = "";
	var icons = "";
	var marker = [];
	var markers = [];
	self.filtroAero = ko.observable();
	self.filtradosAero = ko.observableArray([]);
	//Chama a função de inicialização do Mapa
    this.initMap();
    //Chama a função p popular o Map com as marcas
	this.inicioPlaceMarks();
	//Chama a API para atualizar os Icons.
	this.inicioPlaceAPI();
	//Cria a Marca - Esperado @param {ponto}
	console.log("Fim");
}

//Chama a funcao initApp junto a API do Coogle
function initApp() {
    ko.applyBindings(new AppViewModel());
}
