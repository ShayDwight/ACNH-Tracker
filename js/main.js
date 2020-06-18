
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
		{title:"Caught?", field:"Caught", cellClick:function(e, cell){
				var cellValue = cell.getValue();
				if (cellValue == "Caught!") {
					cell.setValue("Donated!");
					//cell.getElement().style.backgroundColor = "#0f0";
				};
				if (cellValue == "Not caught!") {
					cell.setValue("Caught!");
					//cell.getElement().style.backgroundColor = "#ff0";
				};
				if (cellValue == "Donated!") {
					cell.setValue("Not caught!");
					//cell.getElement().style.backgroundColor = "#FFF";
				};
			
			},
			formatter:function(cell, formatterParams){
				var value = cell.getValue();
				if(value == "Caught!"){
					return '<button type="button" class="btn btn-warning btn-sm btn-block">' + value + '</button>';
				} else if (value == "Donated!"){
					return '<button type="button" class="btn btn-success btn-sm btn-block">' + value + '</button>';
				} else {
					return '<button type="button" class="btn btn-outline-secondary btn-sm btn-block">' + value + '</button>';
				}
			}
		},
		{title:"Name", field:"Name"},
		{title:"Location", field:"Location"},
		{title:"Price", field:"Price"},
		{title:"Time", field:"Time",},
		{title:"Hours", field:"HoursN",
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
							cellValue[i] = "2";
						};
						if (cellValue[i] == "1") {
							indexReturn += '<div class="boxhouryes fa fa-check"></div>';
						} else if (cellValue[i] == "0") {
							indexReturn += '<div class="boxhourno fa fa-times"></div>';
						} else if (cellValue[i] == "2") {
							indexReturn += '<div class="boxhourclock fas fa-clock"></div>';
						}
					};	
						//console.log(cellMonths.length)
					for (i = 0; i < cellMonths.length; i++){
						if (i == currMonth){
							cellMonths[i] = "2";
						};
						if (cellMonths[i] == "1") {
							indexMonthReturn += '<div class="boxmonthyes fa fa-check"></div>';
						} else if (cellMonths[i] == "0") {
							indexMonthReturn += '<div class="boxmonthno fa fa-times"></div>';
						} else if (cellMonths[i] == "2") {
							indexMonthReturn += '<div class="boxmonthclock fas fa-clock"></div>';
						}
					}
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

var toggleRows = ["Not caught!", "Caught!", "Donated!"];


function toggleCaught(rows){
	
	var btnClass = document.getElementById(rows),
		indexRows = toggleRows.indexOf(rows),
		innerHTMLvar = document.getElementById(rows).innerHTML;

	if (indexRows > -1){
		toggleRows.splice(indexRows, 1);
		if (rows == "Not caught!") {
			btnClass.className = "btn btn-outline-secondary";
		} else if (rows == "Caught!") {
			btnClass.className = "btn btn-outline-warning";
		} else if (rows == "Donated!") {
			btnClass.className = "btn btn-outline-success";
		}
		
	} else {
		toggleRows.push(rows);		
		if (rows == "Not caught!") {
			btnClass.className = "btn btn-secondary";
		} else if (rows == "Caught!") {
			btnClass.className = "btn btn-warning";
		} else if (rows == "Donated!") {
			btnClass.className = "btn btn-success";
		}
	};
	
	table.setFilter("Caught", "in", toggleRows);

};