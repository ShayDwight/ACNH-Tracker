var currDate = new Date(),
	currHour = currDate.getHours(),
	currMonth = currDate.getMonth();



function doStuff(data){
	console.log(data.length);
	//table.setData(data);
	for (i = 0; i < data.length; i++) {

		//console.log(data[i].Name);
		console.log(data[i]);
		var critterName = '"' + data[i].Name + '"',
			critterType = '"' + data[i].Type + '"',
			critterTime = '"' + data[i].Time + '"',
			critterHoursN = '"' + data[i].HoursN + '"',
			critterMonthsN = '"' + data[i].MonthsN + '"',
			critterMonthsS = '"' + data[i].MonthsS + '"',
			critterIconFilenameN = '"' + data[i].IconFilenameN + '"',
			critterLocation = '"' + data[i].Location + '"';
		var critter = critterName + ', ' + critterType + ', ' + critterTime + ', ' + critterHoursN + ', ' + critterMonthsN + ', ' + critterMonthsS + ', ' + critterIconFilenameN + ', ' + critterLocation;
		document.getElementById("grid").innerHTML += "<div id='" + data[i].IconFilenameN + "' style='float: left; border: 1px solid; width: 150px; height: 150px; text-align: center; margin: auto;' onclick='openNav(this, " + critter + ")'><img src='https://acnhcdn.com/latest/MenuIcon/" + data[i].IconFilenameN + ".png' style='max-width: 50%;'></br> " + data[i].Name + "</div>"
	}
};

/*
<span class='tooltiptext'>This is a test of the tooltip.</span>

AvailableN: "No"
AvailableS: "Yes"
HoursN: "1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1"
HoursS: "1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1"
IconFilenameN: "Fish0"
IconFilenameS: "Fish0"
Location: "River"
MonthsN: "1,1,1,0,0,0,0,0,0,0,1,1"
MonthsS: "0,0,0,0,1,1,1,1,1,0,0,0"
-Name: "Bitterling"
Price: "900"
Row: "1"
Status: "Not caught"
Time: "All day"
-Type: "Fish"
id: "1"
*/


function parseData (url, callBack){
	Papa.parse (url, {
		header:true,
		download:true,
		dyanmicTyping:false,
		complete: function(results) {
			callBack(results.data);
		}
	});	
}


$(document).ready(function() {
	//Load any saved data from localStorage
	var data =  localStorage.getItem("tabulator-data");

	//If data is present fill the table with it
	if(data){
		doStuff(JSON.parse(data));
	} else { 
		parseData("src/fish.csv", doStuff);
	};
	var x = document.cookie;
//	console.log(localStorage);
//	console.log("this is the last line");
	for (i = 0; i < localStorage.length; i++){
		var localStorageKeyName = localStorage.key(i),
			localStorageKeyValue = localStorage.getItem(localStorageKeyName);
		//console.log(localStorage.key(i) + ": " + localStorage.getItem(localStorageKeyName));
		//Check Hemisphere
		//console.log("localStorageKeyValue: " + localStorageKeyValue);
		if (localStorageKeyName.includes("hemisphere")) {
			if (localStorageKeyValue == "true") {
				toggleHemi();
			}
		}
		
	}

});

// Fields:
// Status - Status
// Icon - IconFilename
// Name - Name
// Location - Location
// Price - Price
// Time - Time
// Availability (Northern Hemisphere) - HoursN)
// Availability (Southern Hemisphere) - HoursS)
// MonthsN - MonthsN
// MonthsS - MonthsS
// Extra
// Extra
// Extra


function removelocalStorage() {
	//localStorage.setItem("tabulator-data", "");
	var txt;
	var r = confirm("Are you sure you want to clear your caught fish and bugs?");
	if (r == true) {
			localStorage.clear();
			location.reload();
	}
}

function removeTableData(){
	var r = confirm("Are you sure you want to reset the Table Data?\nUse this if you're experiencing problems with Rows not displaying properly.\n\nYou will lose all progress including which Critters you've marked as Donated or Caught!\n\nClick Download CSV to download a copy of all your Caught or Donated Critters so that you can quickly mark them off again!");
	if (r == true) {

		localStorage.removeItem("tabulator-data");
		location.reload();
	}
}


function togglePrice(){
	table.toggleColumn("Price");
}

function statusClick(cell){
	var cellValue = cell.getValue(),
		critterID = cell.getData().IconFilename;
	if (cellValue == "Caught") {
		cell.setValue("Donated");
	};
	if (cellValue == "Not caught") {
		cell.setValue("Caught");
	};
	if (cellValue == "Donated") {
		cell.setValue("Not caught");
	};
	cellValue = cell.getValue();
};

function toggleHemi(){
	var colN = table.getColumn("HoursN"),
		colS = table.getColumn("HoursS"),
		colIconN = table.getColumn("IconFilenameN"),
		colIconS = table.getColumn("IconFilenameS"),
		
		colNVis = colN.getVisibility();
		colN.toggle();
		colS.toggle();
		colIconN.toggle();
		colIconS.toggle();
		
		//console.log(colNVis);
		if (!colNVis) {
			document.getElementById("toggleHemi").innerHTML = "Northern Hemisphere";
			localStorage.setItem("hemisphere", false);
		} else {
			document.getElementById("toggleHemi").innerHTML = "Southern Hemisphere";
			localStorage.setItem("hemisphere", true);
		};
		console.log("hemisphere state (true = south): " + localStorage.getItem("hemisphere"));

};

function toggleAvail(){
	var colN = table.getColumn("HoursN"),		
		colNVis = colN.getVisibility();
		console.log(colNVis)
		table.removeFilter("AvailableN", "like", "Yes");
		table.removeFilter("AvailableS", "like", "Yes");
	//
	if (colNVis) {
		table.addFilter("AvailableN", "like", "Yes");

	} else {
		table.addFilter("AvailableS", "like", "Yes");
	}
};

var elementType = ["Fish", "Bugs", "Underwater", "Fossils", "Art"],
	elementStatus = ["Caught", "Not caught", "Donated"],
	lastTypeOption,
	lastStatusOption,
	lastLocationOption;
	
function setUserType(element, option) {
		
		
	//TYPE FILTER BLOCK ("Fish", "Bugs", "Underwater", "Fossils", "Art")
	
	table.removeFilter("Type", "like", lastTypeOption);
	
	if (option == 'all') {
		document.getElementById('all').className = "btn btn-secondary";
		document.getElementById('Fish').className = "btn btn-outline-primary";
		document.getElementById('Bugs').className = "btn btn-outline-primary";
		document.getElementById('Underwater').className = "btn btn-outline-primary";
		document.getElementById('Fossils').className = "btn btn-outline-danger";
		document.getElementById('Art').className = "btn btn-outline-dark";
		
		
	} else if (elementType.includes(option)) {
		document.getElementById('all').className = "btn btn-outline-secondary";
		document.getElementById('Fish').className = "btn btn-outline-primary";
		document.getElementById('Bugs').className = "btn btn-outline-primary";
		document.getElementById('Underwater').className = "btn btn-outline-primary";
		document.getElementById('Fossils').className = "btn btn-outline-danger";
		document.getElementById('Art').className = "btn btn-outline-dark";
		
		
		var typeClass = element.className.replace("btn btn-outline-", "btn btn-");
		element.className = typeClass;
		table.addFilter("Type", "like", option)
		lastTypeOption = option;
	};
		
};

function setUserStatus(element, option){


	//STATUS FILTER BLOCK ("Caught", "Not caught", "Donated")

	table.removeFilter("Status", "=", lastStatusOption);

	if (option == "allStatus") {
		document.getElementById('allStatus').className = "btn btn-secondary";
		document.getElementById('Caught').className = "btn btn-outline-warning";
		document.getElementById('Not caught').className = "btn btn-outline-info";
		document.getElementById('Donated').className = "btn btn-outline-success";

	} else if (elementStatus.includes(option)){
		document.getElementById('allStatus').className = "btn btn-outline-secondary";
		document.getElementById('Caught').className = "btn btn-outline-warning";
		document.getElementById('Not caught').className = "btn btn-outline-info";
		document.getElementById('Donated').className = "btn btn-outline-success";
		
		var typeClass = element.className.replace("btn btn-outline-", "btn btn-");
		element.className = typeClass;
		table.addFilter("Status", "=", option);
		lastStatusOption = option;

	};
};

function setLocationType(element, option){
	
	if (lastLocationOption) {
		table.removeFilter("Location", "=", lastLocationOption);
		document.getElementById(lastLocationOption).className = "dropdown-item";
	}
	
	if (option == "All"){
		table.removeFilter("Location", "=", lastLocationOption);
	} else {
		table.addFilter("Location", "=", option);
		document.getElementById(option).className = "dropdown-item active";
		lastLocationOption = option;
	};
}

function downloadData(){
	table.download("csv", "YAACNHT.csv");
}

function openNav(id, name, type, time, hoursN, monthsN, monthsS, iconFileNameN, location) {
	document.getElementById("mySidenav").style.width = "350px";
	//document.getElementById("main").style.marginRight = "350px";
	console.log(id);
	console.log(name);
	console.log(type);
	console.log(time);
	console.log(hoursN);
	console.log(monthsN);
	console.log(iconFileNameN);
	
	document.getElementById("crittericon").src = 'https://acnhcdn.com/latest/MenuIcon/' + iconFileNameN + '.png';
	document.getElementById("crittername").innerHTML = name;
	document.getElementById("crittertime").innerHTML = time;
	document.getElementById("critterhoursN").innerHTML = hoursN;
	document.getElementById("crittermonthsN").innerHTML = monthsN;


	//document.getElementById("fishname").innerHTML = data;
	console.log(id);
	//console.log(data);
}

/* Set the width of the side navigation to 0 and the left margin of the page content to 0 */
function closeNav() {
  document.getElementById("mySidenav").style.width = "0";
  //document.getElementById("main").style.text-align = "center";
}
