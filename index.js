//Styling parameters to remove default map styling such as labels, landmarks, etc.
var myStyles =[
    {
        "elementType": "labels",
        "stylers": [
        {
            "visibility": "off"
        }
        ]
    },
    {
        "featureType": "administrative",
        "elementType": "geometry",
        "stylers": [
        {
            "visibility": "off"
        }
        ]
    },
    {
        "featureType": "administrative.land_parcel",
        "stylers": [
        {
            "visibility": "off"
        }
        ]
    },
    {
        "featureType": "administrative.neighborhood",
        "stylers": [
        {
            "visibility": "off"
        }
        ]
    },
    {
        "featureType": "poi",
        "stylers": [
        {
            "visibility": "off"
        }
        ]
    },
    {
        "featureType": "road",
        "elementType": "labels.icon",
        "stylers": [
        {
            "visibility": "off"
        }
        ]
    },
    {
        "featureType": "transit",
        "stylers": [
        {
            "visibility": "off"
        }
        ]
    },
    {
        featureType: "landscape.man_made.building",
        elementType: "geometry.fill",
        stylers: [ 
          { color: "#ffff00"} ]
      }
];

function myMap() {
    var zoomAmt = 16.7;
    var mapProp= {
        center: new google.maps.LatLng(34.241713,-118.529319),
        zoom: zoomAmt,
        maxZoom: zoomAmt,
        minZoom: zoomAmt,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        styles: myStyles,
        disableDefaultUI: true,
        disableDoubleClickZoom: true,
        draggable: false,
        scrollwheel: false,
        panControl: false,
        
    };

    var marker;
    var infoWindow;

    const map = new google.maps.Map(document.getElementById("googleMap"), mapProp);
    const geocoder = new google.maps.Geocoder();
    const places = new google.maps.places.PlacesService(map);

    var markers = [];
    var infoWindows = [];

    const guessesLeftText = document.getElementById("guesses-left");

    const titles = [
        ["Baseball Field", [34.244787,-118.526357]],
        ["Oviatt Library", [34.240113,-118.529319]],
        ["Jacaranda Hall", [34.241514,-118.528482]],
        ["Sequoia Hall", [34.240468,-118.528278]],
        ["Redwood Hall", [34.241754,-118.526519]],
        ["Citrus Hall", [34.239024,-118.527998]],
        ["Eucalyptus Hall", [34.238648,-118.528234]],
        ["Sierra Center", [34.238887,-118.531208]],
        ["Jerome Richfield", [34.238852,-118.530632]],
        ["Bayramian Hall", [34.240395,-118.530831]],
        ["Education Building", [34.241328,-118.531103]],
        ["Bookstein Hall", [34.241958,-118.530619]],
    ];

    var currentGuess = 0;
    var guessesLeft = 5;
    var correct = 0;
    var alreadyAsked = [];

    var highscore = 0;

    alreadyAsked.push(currentGuess);

    infoWindow = new google.maps.InfoWindow({
        content: "Double click a marker to guess a building!",
        position: new google.maps.LatLng(34.241713,-118.529319),
    });

    infoWindow.open(map);

    placeAllMarkers(map);

    function placeAllMarkers(map){
        for (var i = 0 ; i < titles.length; i++) {
            var pos = new google.maps.LatLng(titles[i][1][0], titles[i][1][1])

            markers[i] = new google.maps.Marker({
                position: pos,
                map,
                description: titles[i][0],
                id: i
            });

            google.maps.event.addListener(markers[i], 'dblclick', function () {
                infoWindow.setContent(generateContent("Guess me!", this.id));
                infoWindow.open(map, this);
            });
        }
    }

    google.maps.event.addListener(infoWindow, 'domready', () => {
        const myButton = document.getElementById('add-button');
        const resetButton = document.getElementById('reset');
        if (myButton) {
          google.maps.event.addDomListener(myButton, 'click',    
          () => {
                    if(guessesLeft > 0) {
                        if(myButton.name == currentGuess) {
                            var pos = new google.maps.LatLng(titles[parseInt(myButton.name)][1][0], titles[parseInt(myButton.name)][1][1])
                            addRow("Correct! That is the " + titles[parseInt(myButton.name)][0])
                            correct += 1;
                            document.getElementById("score").innerHTML = correct;
                            guessesLeft -= 1;
                            document.getElementById("guesses-left").innerHTML = guessesLeft+" guesses";
                            const rightCircle = new google.maps.Circle({
                                strokeColor: "#00FF00",
                                strokeOpacity: 0.8,
                                strokeWeight: 2,
                                fillColor: "#00FF00",
                                fillOpacity: 0.35,
                                map,
                                center: pos,
                                radius: 75,
                              });
                        } else {
                            var pos = new google.maps.LatLng(titles[parseInt(myButton.name)][1][0], titles[parseInt(myButton.name)][1][1])
                            guessesLeft -= 1;
                            addRow("Wrong! You have "+guessesLeft+" guesses left!")
                            document.getElementById("guesses-left").innerHTML = guessesLeft+" guesses"
                            const wrongCircle = new google.maps.Circle({
                                strokeColor: "#FF0000",
                                strokeOpacity: 0.8,
                                strokeWeight: 2,
                                fillColor: "#FF0000",
                                fillOpacity: 0.35,
                                map,
                                center: pos,
                                radius: 75,
                              });
                        }
                    }

                    if(guessesLeft == 0) {
                        switch(correct){
                            case 0:
                                addRow("You got " + correct + " locations correct! Try again and see if you can do better.")
                                break;
                            case 5:
                                addRow("You got " + correct + " locations correct! Amazing! You really know CSUN well.")
                                break;
                                
                        }

                        if(correct > highscore) highscore = correct;
                        document.getElementById("highscore").innerHTML = "Highscore: " + highscore;
                    } else {
                        do {
                            currentGuess = randomGuess()
                        } while(alreadyAsked.includes(currentGuess))
                        alreadyAsked.push(currentGuess)
                        addRow("Find: " + titles[currentGuess][0]);
                    }

                    
                    
                })
        } else if(resetButton) {
            google.maps.event.addDomListener(resetButton, 'click',    
            () => {
                correct = 0;
                document.getElementById("score").innerHTML = 0;
                while (document.getElementById("game").firstChild) {
                    document.getElementById("game").removeChild(document.getElementById("game").firstChild);
                }
                guessesLeft = 5;
                document.getElementById("guesses-left").innerHTML = guessesLeft+" guesses";
                alreadyAsked = [];
                myMap()
            })
        }
    });

    addRow("Find: " + titles[currentGuess][0]);

    function generateContent(bText, id){
        const contentString = 
            '<button type="button" id="add-button" name="'+id+'">'+bText+'</button>'
        return contentString;
    }

    function addRow(text) {
        const div = document.createElement('div');

        div.innerHTML = text;
        div.className = "list";

        document.getElementById('game').appendChild(div);
    }

    function randomGuess() {
        return Math.floor(Math.random() * ((titles.length - 1) - 0));
    }

    function reset() {
        addRow("hello")
    }
}