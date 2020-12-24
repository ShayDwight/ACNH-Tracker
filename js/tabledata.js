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
