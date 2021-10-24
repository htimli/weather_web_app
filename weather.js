const days = document.querySelectorAll('.day');
const temperaturesMin = document.querySelectorAll('.tempMin');
const temperaturesMax = document.querySelectorAll('.tempMax');
const hoursInterval = 2;




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

        setDomHourlyConditionsData(json);


    }

    fetch('https://prevision-meteo.ch/services/json/'+city_name)
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