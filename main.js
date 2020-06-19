
function doStuff(data){

	console.log(data.length);
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

});


var table = new Tabulator("#fish-table", {
	reactiveData:true,
	index:"id",
	maxHeight:"90%",
	columns:[
		{title:"Status", field:"Status", cellClick:function(e, cell){
				var cellValue = cell.getValue();
				if (cellValue == "Caught") {
					cell.setValue("Donated");
					//cell.getElement().style.backgroundColor = "#0f0";
				};
				if (cellValue == "Not caught") {
					cell.setValue("Caught");
					//cell.getElement().style.backgroundColor = "#ff0";
				};
				if (cellValue == "Donated") {
					cell.setValue("Not caught");
					//cell.getElement().style.backgroundColor = "#FFF";
				};
			
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
		{title:"Type", field:"Type"},
		{title:"Name", field:"Name"},
		{title:"Location", field:"Location"},
		{title:"Price", field:"Price"},
		{title:"Time", field:"Time",},
		{title:"Availability", field:"HoursN",
			formatter:function(cell, formatterParams){
					var cellValue = cell.getValue().split(","),
						indexReturn = "",
						indexMonthReturn = "",
						currDate = new Date(),
						currHour = currDate.getHours(),
						currMonth = currDate.getMonth(),
						cellMonths = cell.getData().MonthsN.split(",");
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
		{title:"Favourite Color", field:"col"},
		{title:"Date Of Birth", field:"dob"},
		{title:"Cheese Preference", field:"cheese"},
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

function togglePrice(){
	table.toggleColumn("Price");
}

var elementsAll = [],
	elementType = ["Fish", "Bugs", "Fossils", "Art"],
	elementTypeFilter = [],
	elementStatus = ["Caught", "Not caught", "Donated"],
	elementStatusFilter = [];

function setUserState(element, option) {
		
	if (option == 'all') {
		document.getElementById('all').className = "btn btn-secondary";
		document.getElementById('Fish').className = "btn btn-outline-primary";
		document.getElementById('Bugs').className = "btn btn-outline-warning";
		document.getElementById('Fossils').className = "btn btn-outline-danger";
		document.getElementById('Art').className = "btn btn-outline-dark";
		table.removeFilter("Type", "in", (elementTypeFilter));
		elementTypeFilter = [];
		
	} else if (elementType.includes(option)) {
		
		//TYPE FILTER ("Fish", "Bugs", "Fossils", "Art")
		
		document.getElementById('all').className = "btn btn-outline-secondary";

		if (elementTypeFilter.includes(option)){
			var indexOption = elementTypeFilter.indexOf(option);
			elementTypeFilter.splice(indexOption, 1);
			var typeClass = element.className.replace("btn btn-", "btn btn-outline-");
			element.className = typeClass
		} else {
			elementTypeFilter.push(option);
			var typeClass = element.className.replace("btn btn-outline-", "btn btn-");
			element.className = typeClass
		};
		table.setFilter([{field:"Type", type:"in", value:elementTypeFilter}]);
	};

	if (option == "allStatus") {
		document.getElementById('allStatus').className = "btn btn-secondary";
		document.getElementById('Caught').className = "btn btn-outline-warning";
		document.getElementById('Not caught').className = "btn btn-outline-info";
		document.getElementById('Donated').className = "btn btn-outline-success";
		table.removeFilter("Status", "in", elementStatusFilter);
		elementStatusFilter = [];
		
	} else if (elementStatus.includes(option)){
		
		//STATUS FILTER ("Caught", "Not caught", "Donated")
		
		document.getElementById('allStatus').className = "btn btn-outline-secondary";

		
		if (elementStatusFilter.includes(option)){
			var indexOption = elementStatusFilter.indexOf(option);
			elementStatusFilter.splice(indexOption, 1);
			var StatusClass = element.className.replace("btn btn-", "btn btn-outline-");
			element.className = StatusClass
		} else {
			elementStatusFilter.push(option);
			var StatusClass = element.className.replace("btn btn-outline-", "btn btn-");
			element.className = StatusClass
		};
		table.setFilter([{field:"Status", type:"in", value:elementStatusFilter}]);
		
	};
		console.log(elementTypeFilter);
		console.log(elementStatusFilter);
		console.log(table.getFilters());
		//SET FILTERS
};
	

