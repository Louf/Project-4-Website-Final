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

//Map initialization with options for disallowing panning and zooming etc.
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

    var infoWindow;

    //Initializing the google maps api through a map variable.
    const map = new google.maps.Map(document.getElementById("googleMap"), mapProp);

    //An array for all of the markers 
    var markers = [];

    //Coordinates for each of the locations on the map
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

    //Counting and tracking variables
    var currentGuess = 0;
    var guessesLeft = 5;
    var correct = 0;
    var alreadyAsked = [];
    var highscore = 0;

    //Push the first location to the already guessed array 
    alreadyAsked.push(currentGuess);

    //Display the default and first infoWindow on the map
    infoWindow = new google.maps.InfoWindow({
        content: "Double click a marker to guess a building!",
        position: new google.maps.LatLng(34.241713,-118.529319),
    });
    infoWindow.open(map);

    //Call the function that will place all of the markers on the map
    placeAllMarkers(map);

    function placeAllMarkers(map){
        //Loop through all the locations
        for (var i = 0 ; i < titles.length; i++) {
            var pos = new google.maps.LatLng(titles[i][1][0], titles[i][1][1])

            //Create a new marker on the map with the correct position for the location, a description and an id.
            markers[i] = new google.maps.Marker({
                position: pos,
                map,
                description: titles[i][0],
                id: i
            });

            //Add a double click listener to each of the markers, making sure that the map does not pan at all when the infoWindow appears.
            google.maps.event.addListener(markers[i], 'dblclick', function () {
                infoWindow.setContent(generateContent("Guess", this.id));
                infoWindow.setOptions({
                    disableAutoPan: true
                })
                infoWindow.open(map, this);
            });
        }
    }

    //Add a new listener to the map that fires when the DOM of the infoWindow is fully attached to the page's DOM.
    google.maps.event.addListener(infoWindow, 'domready', () => {
        //Declaring two buttons, one for the infoWindow button and one for the reset button.
        const myButton = document.getElementById('add-button');
        const resetButton = document.getElementById('reset');
        //If we click a button that's inside the infoWindow...
        if (myButton) {
          google.maps.event.addDomListener(myButton, 'click',    
          () => {
                    //Check we still have some guesses left.
                    if(guessesLeft > 0) {
                        //If the button's name (the id of the added button) is the same as the currentGuess loaded, update all of the appropriate information such as increasing score, adding a row to the game div and decrease the guesses left. 
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
                        //If we were clicking on the wrong button, decrease guesses left and add a red circle.
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
                    //If we are all out of guesses left, add the final row to the game div that let's us know how well we did.
                    if(guessesLeft == 0) {
                        switch(correct){
                            case 0:
                                addRow("You got " + correct + " locations correct! Try again and see if you can do better.")
                                break;
                            case 5:
                                addRow("You got " + correct + " locations correct! Amazing! You really know CSUN well.")
                                break;
                                
                        }
                        //If our score is higher than our previous highscore, update the highscore and the HTML for the highscore.
                        if(correct > highscore) highscore = correct;
                        document.getElementById("highscore").innerHTML = "Highscore: " + highscore;
                    } else {
                        do {
                            //A do-while loop that will generate a new random location until we get one that we haven't had before.
                            currentGuess = randomGuess()
                        } while(alreadyAsked.includes(currentGuess))
                        //Add the new building to the array of already asked buildings
                        alreadyAsked.push(currentGuess)
                        addRow("Find: " + titles[currentGuess][0]);
                    }

                    
                    
                })
        //If we actually click the reset button instead...
        } else if(resetButton) {
            google.maps.event.addDomListener(resetButton, 'click',    
            () => {
                //Reset all of the counting variables to their default values and then reload the map to remove all of the circles etc.
                correct = 0;
                document.getElementById("score").innerHTML = 0;
                //Loop through all of the rows in the game div and remove each of them
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

    //Add the first row to the game div
    addRow("Find: " + titles[currentGuess][0]);

    //A function to generate a button with the correct id of the location it's at.
    function generateContent(bText, id){
        const contentString = 
            '<button type="button" id="add-button" name="'+id+'">'+bText+'</button>'
        return contentString;
    }

    //A function to add a new row to the game div with whatever text we pass in.
    function addRow(text) {
        const div = document.createElement('div');

        div.innerHTML = text;
        div.className = "list";

        document.getElementById('game').appendChild(div);
    }

    //Generate and return a random number between 0 and the amount of buildings we current have in our list. 
    function randomGuess() {
        return Math.floor(Math.random() * ((titles.length - 1) - 0));
    }
}