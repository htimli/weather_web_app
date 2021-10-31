const days = document.querySelectorAll('.day');
const temperaturesMin = document.querySelectorAll('.tempMin');
const temperaturesMax = document.querySelectorAll('.tempMax');
const hoursInterval = 2;

const data_container = document.querySelector('#data_container');
const map = document.querySelector('#map');


const frLat = 46.603;
const frLng = 1.888 ;

const zoom = 6;
const zoomMin = 1;
const zoomMax = 20;


function getApiData(urlPath) {
    
    function onResponse(response) {
        return response.json();      
    }

    function onError(error) {
        console.log("Error :  " + error);  
    }

    function onStreamProcessed(json) {

        console.log(json);

        var keys = Object.keys(json)    
        if(keys[0] == "errors") {
            var error = json.errors[0];

            if(error .code == '11'){

                //case where the City or coordinate not found
                alert(error.text+"\n"+error.description);
            }  
        }else{

            setDomCurrentConditions(json); 

            setDomDailyConditionsData(json);     

            setDomHourlyConditionsData(json);

            displayMap(false);
    
        }

    }

    fetch('https://prevision-meteo.ch/services/json/'+urlPath)
        .then(onResponse, onError)
        .then(onStreamProcessed);
}

function setDomHourlyConditionsData(json) {
    let timeNow = json.current_condition.hour;

    const hours = document.querySelectorAll('.hour');
    const hourlyTemperatures = document.querySelectorAll('.temperature');


    for (let i = 1; i <= hours.length; i++) {
        let hour = parseInt(timeNow.substring(0, timeNow.length - 3)) + hoursInterval * i;
        let resTimeStr;
        let varJsonDay;

        if (hour <= 23) {
            resTimeStr = hour + "H00";
            varJsonDay = "fcst_day_0";
        } else {
            resTimeStr = hour - 24 + "H00";
            varJsonDay = "fcst_day_1";
        }
        hours[i - 1].innerHTML = resTimeStr.substring(0, resTimeStr.length - 2);
        let temp = json[varJsonDay].hourly_data[resTimeStr].TMP2m;
        hourlyTemperatures[i - 1].innerHTML = Math.round(temp) + '°';

    }
}

function setDomCurrentConditions(json) {
    setDomData(".city_name", json.city_info.name);
    setDomData(".city_country", json.city_info.country);
    setDomData(".current_condition", json.current_condition.condition);
    setDomData(".current_temperature", json.current_condition.tmp + "°");
    document.querySelector("#curret_condition_img").src = json.current_condition.icon_big;
}

function setDomDailyConditionsData(json) {

    for (let i = 0; i < days.length; i++) {
        let var_json_day = `fcst_day_${i + 1}`;
        days[i].innerHTML = json[var_json_day].day_short;
        temperaturesMin[i].innerHTML = json[var_json_day].tmin + "°";
        temperaturesMax[i].innerHTML = json[var_json_day].tmax + "°";

    }
}

function setDomData(DomElement,data) {
    document.querySelector(DomElement).innerHTML = data;
}

function onClickSearchButton(){
    city_name = document.querySelector("#form_button").value;
    getApiData(city_name);
}

function onClickMapButton(){
    console.log('map button clicked ');   
    displayMap(true);
}


function displayMap(showing){
    let state ;
    if(showing){
        state= 'visible';
    }
    else{
        state = 'hidden';
    }
    map.style.visibility = state;

}
// Initialize the map and set its view 
function initMap(lat,lng,zoom) {
    //2 46 4
    return L.map('map').setView([lat, lng], zoom);
}

function addTileLayer(mymap) {
    L.tileLayer('https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png', {
        attribution: 'données © <a href="//osm.org/copyright">OpenStreetMap</a>/ODbL - rendu <a href="//openstreetmap.fr">OSM France</a>',
        minZoom: zoomMin,
        maxZoom: zoomMax 
    }).addTo(mymap);
}
                 



function main() {
    const menu_button = document.querySelector('#menu_button');
    const map_button = document.querySelector('#map_button');


    menu_button.addEventListener('click',onClickSearchButton);

    map_button.addEventListener('click',onClickMapButton);
    
    var mymap = initMap(frLat,frLng,zoom);
    
    addTileLayer(mymap);
    
    
    mymap.on('click', function(e) {
        console.log("Lat, Lon : " + e.latlng.lat + ", " + e.latlng.lng);
        let urlPath = `lat=${e.latlng.lat}lng=${e.latlng.lng}`;
        getApiData(urlPath);
    });
}



main();





                   