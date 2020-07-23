var currDate = new Date(),
	currHour = currDate.getHours(),
	currMonth = currDate.getMonth();



function doStuff(data){

	//console.log(data.length);
	table.setData(data);
};

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
		console.log(localStorage.key(i) + ": " + localStorage.getItem(localStorageKeyName));
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

var customMutatorN = function(value, data, type, params, component){
	var activeHours = data.HoursN.split(","),
		activeHourNow = activeHours[currHour],
		activeMonths = data.MonthsN.split(","),
		activeMonthNow = activeMonths[currMonth];
	if (activeHourNow == 1 && activeMonthNow == 1){
		value = "Yes";
	} else {
		value = "No";
	};			

	return value;
}

var customMutatorS = function(value, data, type, params, component){
	var activeHours = data.HoursS.split(","),
		activeHourNow = activeHours[currHour],
		activeMonths = data.MonthsS.split(","),
		activeMonthNow = activeMonths[currMonth];
	if (activeHourNow == 1 && activeMonthNow == 1){
		value = "Yes";
	} else {
		value = "No";
	};	
		return value;
}

var table = new Tabulator("#fish-table", {
	reactiveData:true,
	index:"id",
	maxHeight:"90%",
	columns:[
		{title:"Status", field:"Status", cellClick:function(e, cell){
			statusClick(cell);
		},
		formatter:function(cell, formatterParams){
			var value = cell.getValue();
			if(value == "Caught"){
				return '<button type="button" class="btn btn-warning btn-sm btn-block">' + value + '</button>';
			} else if (value == "Donated"){
				return '<button type="button" class="btn btn-success btn-sm btn-block">' + value + '</button>';
			} else {
				return '<button type="button" class="btn btn-outline-secondary btn-sm btn-block">' + value + '</button>';
			}
		}
		},
		{title:"Icon", field:"IconFilenameN", download:false, formatter:function(cell, formatterParams){
			var cellValue = cell.getValue(),
				cellClass,
				cellCheckCross,
				activeHours = cell.getData().HoursN.split(","),
				activeHourNow = activeHours[currHour], 
				colN = table.getColumn("HoursN"),
				activeMonths = cell.getData().MonthsN.split(","),
				activeMonthNow = activeMonths[currMonth];
			if (activeHourNow == 1 && activeMonthNow == 1){
				cellClass = "alert alert-success";
				cellCheckCross = "fa fa-check"
			} else {
				cellClass = "alert alert-danger";
				cellCheckCross = "fa fa-times";
			};
			return '<div id="' + cellValue + '" class="' + cellClass + '"><img width="50" height="50" src="https://acnhcdn.com/latest/MenuIcon/' + cellValue + '.png"></br><div class="' + cellCheckCross + '" style="text-align: center; width:100%"></div></div>'
		}},
		{title:"Icon", field:"IconFilenameS", download:false, visible:false, formatter:function(cell, formatterParams){
			var cellValue = cell.getValue(),
				cellClass,
				cellCheckCross,
				availStatus,
				activeHours = cell.getData().HoursS.split(","),
				activeHourNow = activeHours[currHour], 
				colS = table.getColumn("HoursS"),
				activeMonths = cell.getData().MonthsS.split(","),
				activeMonthNow = activeMonths[currMonth],
				fishName = cell.getData().Name;
			if (activeHourNow == 1 && activeMonthNow == 1){
				cellClass = "alert alert-success";
				cellCheckCross = "fa fa-check"
			} else {
				cellClass = "alert alert-danger";
				cellCheckCross = "fa fa-times"
				availStatus = "Not Available"
			};
			return '<div id="' + cellValue + '" class="' + cellClass + '" style="text-align: center; width:100%"><img width="50" height="50" src="https://acnhcdn.com/latest/MenuIcon/' + cellValue + '.png"></br><div class="' + cellCheckCross + '" style="text-align: center; width:100%"></div></div>'
		}},

		{title:"Name", field:"Name"},
		{title:"Location", field:"Location"},
		{title:"Price", field:"Price"},
		{title:"Time", field:"Time",},
		{title:"Availability (Northern Hemisphere)", field:"HoursN", download:false,
			formatter:function(cell, formatterParams){
				var cellValue = cell.getValue().split(","),
					indexReturn = "",
					indexMonthReturn = "",
					cellMonths = cell.getData().MonthsN.split(",")
					selectHemi = cellMonths;
				for (i = 0; i < cellValue.length; i++) {
					if (i == currHour){
						cellValue[i] += "2";
					};
					if (cellValue[i] == "1") {
						indexReturn += '<div class="boxhouryes fa fa-check"></div>';
					} else if (cellValue[i] == "0") {
						indexReturn += '<div class="boxhourno fa fa-times"></div>';
					} else if (cellValue[i] == "12") {
						indexReturn += '<div class="boxhouryesclock fas fa-clock"></div>';
					} else if (cellValue[i] == "02") {
						indexReturn += '<div class="boxhournoclock fas fa-clock"></div>';
					};
				};	
					//console.log(cellMonths.length)
				for (i = 0; i < cellMonths.length; i++){
					if (i == currMonth){
						cellMonths[i] += "2";
					};
					if (cellMonths[i] == "1") {
						indexMonthReturn += '<div class="boxmonthyes fa fa-check"></div>';
					} else if (cellMonths[i] == "0") {
						indexMonthReturn += '<div class="boxmonthno fa fa-times"></div>';
					} else if (cellMonths[i] == "12") {
						indexMonthReturn += '<div class="boxmonthyesclock fas fa-clock"></div>';
					} else if (cellMonths[i] == "02") {
						indexMonthReturn += '<div class="boxmonthnoclock fas fa-clock"></div>';
					};
				};
				return '<div class="boxer"><div class="box-row-hours">' + indexReturn + '</div></div><div class="boxer"><div class="box-row-month">' + indexMonthReturn + '</div></div>'
			}
		},
		{title:"Availability (Southern Hemisphere)", field:"HoursS", visible:false, download:false,
			formatter:function(cell, formatterParams){
				var cellValue = cell.getValue().split(","),
					indexReturn = "",
					indexMonthReturn = "",
					cellMonths = cell.getData().MonthsS.split(",")
					selectHemi = cellMonths;
				for (i = 0; i < cellValue.length; i++) {
					if (i == currHour){
						cellValue[i] += "2";
					};
					if (cellValue[i] == "1") {
						indexReturn += '<div class="boxhouryes fa fa-check"></div>';
					} else if (cellValue[i] == "0") {
						indexReturn += '<div class="boxhourno fa fa-times"></div>';
					} else if (cellValue[i] == "12") {
						indexReturn += '<div class="boxhouryesclock fas fa-clock"></div>';
					} else if (cellValue[i] == "02") {
						indexReturn += '<div class="boxhournoclock fas fa-clock"></div>';
					};
				};	
					//console.log(cellMonths.length)
				for (i = 0; i < cellMonths.length; i++){
					if (i == currMonth){
						cellMonths[i] += "2";
					};
					if (cellMonths[i] == "1") {
						indexMonthReturn += '<div class="boxmonthyes fa fa-check"></div>';
					} else if (cellMonths[i] == "0") {
						indexMonthReturn += '<div class="boxmonthno fa fa-times"></div>';
					} else if (cellMonths[i] == "12") {
						indexMonthReturn += '<div class="boxmonthyesclock fas fa-clock"></div>';
					} else if (cellMonths[i] == "02") {
						indexMonthReturn += '<div class="boxmonthnoclock fas fa-clock"></div>';
					};
				};
				return '<div class="boxer"><div class="box-row-hours">' + indexReturn + '</div></div><div class="boxer"><div class="box-row-month">' + indexMonthReturn + '</div></div>'
			}
		},
		{title:"MonthsN", field:"MonthsN", visible:false},
		{title:"MonthsS", field:"MonthsS", visible:false},

		{title:"Available Now N", field:"AvailableN", mutator:customMutatorN, visible:false},
		{title:"Available Now S", field:"AvailableS", mutator:customMutatorS, visible:false},
	],
	dataEdited:function(data){
		//JSON encode data and store in local storage.
		localStorage.setItem("tabulator-data", JSON.stringify(data));
	},
});

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
		
		document.getElementById('location').innerHTML = "";
		
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
s