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
      document.getElementById("myselectdir").onchange = onChangeDirMenu;
      document.getElementById("myselectrows").onchange = onChangeRowsMenu;
      document.getElementById("pending").onchange = onStatusCheck;
      document.getElementById("flightnum").onkeyup = onSearchBox;
    },
    false
  );

  loadJSON("scheduleArr.json", function(data) {
    jsonresponseArr = data;

    loadJSON("scheduleDep.json", function(data) {
      jsonresponseDep = data;

      drawTable(direction, rows);
    });
  });
}

var jsonresponseDep, jsonresponseArr, jsonResponseType;

function loadJSON(url, callback) {
  var request = new XMLHttpRequest();
  request.overrideMimeType("application/json");
  request.open("GET", url, true);
  request.onreadystatechange = function() {
    if (request.readyState == 4 && request.status == "200") {
      callback(request.response);
    }
  };
  request.responseType = "json";
  request.send(null);
}

var direction = "departure"; // значения по умолчанию
var rows = 10;
var status = "all";
var value;

function drawTable(direction, rows, status, value) {
  if (value) {
    // если введено значение в окно поиска
    document.getElementById("myselectrows").value = "allRows"; // показываем поиск во всей выборке
  } else {
    document.getElementById("myselectrows").value = rows; // если нет, то показываем заданное кол-во рядов
  }
  var flightInfoArr = searchEngine(direction, status, value); // массив значений после обработки поиском и сортировкой
  var tbl = document.getElementById("table");
  tbl.style.border = "1px solid black";
  var actualRows; // проверяем, если количество рядов меньше выбранного, то используем его
  if (flightInfoArr.length < rows) {
    actualRows = flightInfoArr.length;
  } else {
    actualRows = rows;
  }
  for (var k = 0; k < actualRows; k++) {
    var arr = [];
    var f = flightInfoArr[k];
    arr.push(f.time, f.city, f.num, f.aviaCompany, f.planeModel, f.statusMsg); // создаём короткий массив из свойств объекта
    var tr = tbl.insertRow(); // рисуем ряды
    for (var j = 0; j < 6; j++) {
      var td = tr.insertCell(); // добавляем ячейки
      td.style.border = "1px solid black";
      td.appendChild(document.createTextNode(arr[j])); // заполняем ячейки из массива
    }
  }
  if (tr) tbl.appendChild(tr);
} // рисуем таблицу

function clearTable(oldRows) {
  var tbl = document.getElementById("table");
  for (var i = oldRows; i > 1; i--) {
    tbl.deleteRow(i);
  }
} // полностью очищаем таблицу

function sorting(direction, status) {
  var flightInfoArr = [];
  var r = getNumberOfFlights(direction);
  if (status == "pending") {
    // сортировка в случае если поставлена галочка только задержанные
    for (i = 0; i < r; i++) {
      var index = i;
      var pendingFlight = getFlightInfo(direction, index);
      if (pendingFlight.statusMsg == "Рейс задерживается") {
        flightInfoArr.push(pendingFlight);
      }
    }
    return flightInfoArr;
  } else {
    // если нет, то возвращаем все
    for (i = 0; i < r; i++) {
      var index = i;
      flightInfoArr.push(getFlightInfo(direction, index));
    }
    return flightInfoArr;
  }
}

function searchEngine(direction, status, value) {
  var flightInfoArr = [];
  var flightNum = sorting(direction, status); // ищем по тому что отсортировали
  if (value) {
    // если что-то введено в поисковое окно
    var r = flightNum.length;
    value = value.toLowerCase(); // делаем поиск нечуствительным к регистру
    for (i = 0; i < r; i++) {
      var str = flightNum[i].num.toLowerCase(); // делаем поиск нечуствительным к регистру
      if (str.includes(value)) {
        flightInfoArr.push(flightNum[i]);
      }
    }
    return flightInfoArr; // возвращаем массив с финальным результатом
  } else {
    flightInfoArr = flightNum;
    return flightInfoArr;
  }
}

function onSearchBox(e) {
  if (e.which || e.keyCode || e.keyCode == 8 || e.keyCode == 46) {
    // это ещё надо проверить, чтобы поиск шёл
    value = this.value; // только после нажатий букв цифр, backspace и delete
    oldRows =
      document.getElementById("table").getElementsByTagName("tr").length - 1;
    clearTable(oldRows);
    drawTable(direction, rows, status, value);
  }
}

function onChangeDirMenu(e) {
  direction = this.value; // меняем направление
  oldRows =
    document.getElementById("table").getElementsByTagName("tr").length - 1;
  clearTable(oldRows);
  drawTable(direction, rows, status, value);
}

function onChangeRowsMenu(e) {
  var allRows = getNumberOfFlights(direction);
  if (this.value == "allRows") {
    // количество строк
    rows = allRows;
  } else {
    rows = this.value;
  }
  oldRows =
    document.getElementById("table").getElementsByTagName("tr").length - 1;
  clearTable(oldRows);
  drawTable(direction, rows, status, value);
}

function onStatusCheck(e) {
  var checkBox = document.getElementById("pending"); // проверяем статус
  if (checkBox.checked) {
    status = "pending";
  } else {
    status = "all";
  }
  oldRows =
    document.getElementById("table").getElementsByTagName("tr").length - 1;
  clearTable(oldRows);
  drawTable(direction, rows, status, value);
}

function getFlightInfo(direction, index) {
  var time;
  if (direction == "departure") {
    jsonResponseType = jsonresponseDep;
    time = jsonResponseType.schedule[index].departure;
  } else {
    jsonResponseType = jsonresponseArr;
    time = jsonResponseType.schedule[index].arrival;
  }
  var statusMsg;
  if (!jsonResponseType.schedule[index].is_fuzzy) {
    // если параметр is_fuzzy = false значит рейс без задержки
    statusMsg = "По расписанию";
  } else {
    statusMsg = "Рейс задерживается";
  }
  var flightInfo = {};
  flightInfo.time = time;
  flightInfo.city = jsonResponseType.schedule[index].thread.title;
  flightInfo.num = jsonResponseType.schedule[index].thread.number;
  flightInfo.aviaCompany =
    jsonResponseType.schedule[index].thread.carrier.title;
  flightInfo.planeModel = jsonResponseType.schedule[index].thread.vehicle;
  flightInfo.statusMsg = statusMsg;
  return flightInfo;
} // creating flightInfo object

function getNumberOfFlights(direction) {
  // вычисляем полное количество записей в исходном json
  if (direction == "departure") {
    jsonResponseType = jsonresponseDep;
  } else {
    jsonResponseType = jsonresponseArr;
  }
  return jsonResponseType.schedule.length;
}

init(); // поехали
