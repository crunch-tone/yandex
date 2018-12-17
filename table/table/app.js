function init() {
  loadJSON("scheduleArr.json", function(data) {
    jsonResponseArr = data;

    loadJSON("scheduleDep.json", function(data) {
      jsonResponseDep = data;

      drawTable(direction, rows, flightStatus, searchValue);
    });
  });

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
}

// default values
var direction = "departure";
var rows = 10;
var flightStatus = false;
var searchValue;

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

function drawTable(direction, rows, flightStatus, searchValue) {
  clearTable(); // always delete old table before adding new
  if (searchValue) {
    // if there is something in the searchbox
    document.getElementById("myselectrows").value = "allRows"; // indicate results for all rows
  } else {
    // if no indicate current rows value
    document.getElementById("myselectrows").value =
      rows <= 50 ? rows : "allRows";
  }
  var flightInfoArr = searchEngine(direction, flightStatus, searchValue); // array after sorting and searching
  var tbl = document.getElementById("table");
  //tbl.style.border = "1px solid black";
  var actualRows = flightInfoArr.length < rows ? flightInfoArr.length : rows; // checking an actual rows value. if it's less than rows from input using counted value
  for (var k = 0; k < actualRows; k++) {
    var arr = [];
    var f = flightInfoArr[k];
    arr.push(f.time, f.city, f.num, f.aviaCompany, f.planeModel, f.statusMsg); // creating small array from object properties
    var tr = tbl.insertRow(); // adding rows
    tr.className = k % 2 == 0 ? "even" : "odd";
    for (var j = 0; j < 6; j++) {
      var td = tr.insertCell(); // adding cells
      td.className = `col${j + 1}`;
      td.style.border = "1px dotted gray";
      td.appendChild(document.createTextNode(arr[j])); // filling the cells from the small array
    }
  }
}

// we have one predefined row in table so, we have to always exclude one row from the count
function clearTable() {
  var oldRows =
    document.getElementById("table").getElementsByTagName("tr").length - 1;
  var tbl = document.getElementById("table");
  for (var i = oldRows; i > 1; i--) {
    tbl.deleteRow(i);
  }
}

function sorting(direction, flightStatus) {
  var flightInfoArr = [];
  var r = getNumberOfFlights(direction);
  for (i = 0; i < r; i++) {
    var flight = getFlightInfo(direction, i);
    if (flightStatus) {
      if (flight.statusMsg == "Рейс задерживается") {
        flightInfoArr.push(flight);
      }
    } else {
      flightInfoArr.push(flight);
    }
  }
  return flightInfoArr;
}

function searchEngine(direction, flightStatus, searchValue) {
  var flightInfoArr = [];
  var flightTempArr = sorting(direction, flightStatus); // find the match in the sorted array
  if (searchValue) {
    // if there is something input in searchbox
    var r = flightTempArr.length;
    searchValue = searchValue.toLowerCase(); // case insensitive search
    for (i = 0; i < r; i++) {
      var str = flightTempArr[i].num.toLowerCase(); // case insensitive search
      if (str.includes(searchValue)) {
        flightInfoArr.push(flightTempArr[i]);
      }
    }
  } else {
    flightInfoArr = flightTempArr;
  }
  return flightInfoArr;
}

function onSearchBox(e) {
  document.getElementById("pending").checked = false;
  if (e.which || e.keyCode) {
    searchValue = this.value;
    drawTable(direction, rows, flightStatus, searchValue);
  }
}

function onChangeDirMenu(e) {
  document.getElementById("pending").checked = false;
  direction = this.value;
  drawTable(direction, rows, flightStatus, searchValue);
}

function onChangeRowsMenu(e) {
  document.getElementById("pending").checked = false;
  var allRows = getNumberOfFlights(direction);
  rows = this.value == "allRows" ? allRows : parseInt(this.value, 10);
  drawTable(direction, rows, flightStatus, searchValue);
}

function onStatusCheck(e) {
  var checkBox = document.getElementById("pending");
  var flightStatus = checkBox.checked ? true : false;
  drawTable(direction, rows, flightStatus, searchValue);
}

// creating flightInfo object
function getFlightInfo(direction, index) {
  var jsonResponseType =
    direction == "departure" ? jsonResponseDep : jsonResponseArr;
  var time = jsonResponseType.schedule[index][direction];
  var statusMsg = !jsonResponseType.schedule[index].is_fuzzy
    ? "По расписанию"
    : "Рейс задерживается";
  var flightInfo = {};
  flightInfo.time = time;
  flightInfo.city = jsonResponseType.schedule[index].thread.title;
  flightInfo.num = jsonResponseType.schedule[index].thread.number;
  flightInfo.aviaCompany =
    jsonResponseType.schedule[index].thread.carrier.title;
  flightInfo.planeModel = jsonResponseType.schedule[index].thread.vehicle;
  flightInfo.statusMsg = statusMsg;
  return flightInfo;
}

// calculating overall number of flight objects in original json
function getNumberOfFlights(direction) {
  return (direction == "departure" ? jsonResponseDep : jsonResponseArr).schedule
    .length;
}

// let's go!
init();
