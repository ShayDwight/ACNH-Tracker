
function doStuff(data){

//	console.log(data)
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
		{title:"Time", field:"Time"},
		{title:"Hours", field:"HoursN",},
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
	}
}

function togglePrice(){
	table.toggleColumn("Price");
}

var toggleRows = ["Not caught!", "Caught!", "Donated!"];


function toggleCaught(rows){
	
	var btnClass = document.getElementById(rows),
		indexRows = toggleRows.indexOf(rows);

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