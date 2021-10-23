const days = document.querySelectorAll('.day');
const temperaturesMin = document.querySelectorAll('.tempMin');
const temperaturesMax = document.querySelectorAll('.tempMax');




function getApiData(city_name) {
    
    function onResponse(response) {
        return response.json();
    }
    function onError(error) {
        console.log("Error :  " + error);
    }
    function onStreamProcessed(json) {
        console.log(json);

        setDomCurrentConditions(json); 

        setDomDailyConditionsData(json);     

    }

    fetch('https://prevision-meteo.ch/services/json/'+city_name)
        .then(onResponse, onError)
        .then(onStreamProcessed);
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

function onClick(){
    console.log("button clicked");
    
    city_name = document.querySelector("#form_button").value;

    getApiData(city_name);

    const data_container = document.querySelector('#data_container');
    
    data_container.style.visibility  = 'visible';
}


function main() {
    const menu_button = document.querySelector('#menu_button');
    menu_button.addEventListener('click',onClick);
}




main();