/* const apiKey = "3f73e94e-d250-4d23-9d6e-5b5a798cf6d1";
const url = "https://api.rasp.yandex.net/v3.0/schedule/?";

const transportType = "plane";
const station = "LED";
const system = "iata";
const eventDep = "departure";
const eventArr = "arrival";

const getTableDep = async () => {
  //const urlToFetch = `${url}apikey=${apiKey}&station=${station}&transport_types=${transportType}&event=${eventDep}&system=${system}`;
  
  try {
    const response = await fetch(urlToFetch);
    if (response.ok) {
      const jsonResponse = await response.json();
      console.log(jsonResponse);
    } else {
      throw new Error("Request failed!");
    }
  } catch (error) {
    console.log(error.message);
  }
};

const getTableArr = async () => {
  //const urlToFetch = `${url}apikey=${apiKey}&station=${station}&transport_types=${transportType}&event=${eventArr}&system=${system}`;
  
  try {
    const response = await fetch(urlToFetch);
    if (response.ok) {
      const jsonResponse = await response.json();
      console.log(jsonResponse);
    } else {
      throw new Error("Request failed!");
    }
  } catch (error) {
    console.log(error.message);
  }
};
getTableDep();
getTableArr(); */ // part of the app for using real API

function init() {
  document.addEventListener(
    "DOMContentLoaded",
    function() {
      document.querySelector('select[name="myselect"]').onchange = onChangeMenu;
    },
    false
  );

  loadJSON("scheduleArr.json", function(data) {
    jsonresponseArr = data;
    //console.log(jsonresponseArr);

    loadJSON("scheduleDep.json", function(data) {
      jsonresponseDep = data;
      //console.log(jsonresponseDep);

      drawTable();
    });
  }); //console.log(jsonResponseType);
  console.log(direction);
}

var jsonresponseDep, jsonresponseArr, jsonResponseType;

function loadJSON(url, callback) {
  var request = new XMLHttpRequest();
  request.overrideMimeType("application/json");
  request.open("GET", url, true);
  request.onreadystatechange = function() {
    if (request.readyState == 4 && request.status == "200") {
      // .open will NOT return a value but simply returns undefined in async mode so use a callback
      callback(request.response);
    }
  };
  request.responseType = "json";
  request.send(null);
}

function drawTable() {
  //var direction = "departure";
  var tbl = document.getElementById("table");
  tbl.style.border = "1px solid black";
  for (var i = 0; i < 10; i++) {
    var tr = tbl.insertRow();
    var index = i;
    var arr = getInfo(direction, index);
    for (var j = 0; j < 5; j++) {
      var td = tr.insertCell();
      td.style.border = "1px solid black";
      td.appendChild(document.createTextNode(arr[j]));
    }
  }
  tbl.appendChild(tr);
}

function onChangeMenu(e) {
  this.value;
}

var direction = onChangeMenu;

function getInfo(direction, index) {
  var time;
  if (direction == "departure") {
    jsonResponseType = jsonresponseDep;
    time = jsonResponseType.schedule[index].departure;
  } else {
    jsonResponseType = jsonresponseArr;
    time = jsonResponseType.schedule[index].arrival;
  }
  var flightInfoArr = [];
  var city = jsonResponseType.schedule[index].thread.title;
  var num = jsonResponseType.schedule[index].thread.number;
  var aviaCompany = jsonResponseType.schedule[index].thread.carrier.title;
  var planeModel = jsonResponseType.schedule[index].thread.vehicle;
  flightInfoArr.push(time, city, num, aviaCompany, planeModel);
  return flightInfoArr;
}

init();
