var fields = [];
var url_field = "fields.csv";
var url = '01hokkaido.csv'; // default csv file
var url_files = "files.csv"

//Draw Bar Chart
function init_fields() {
  // CSV Configuration
  var field_label = {
      datatype: "csv",
      datafields: [
      	  { name: 'field_name', type: 'text' },
      	  { name: 'field_type', type: 'text' }
      ], url: "csv/" + url_field,
      async: false // Asyncronous Reading
  };
  	  
  // CSV load
  var dataAdapter_fld = new $.jqx.dataAdapter(field_label, {
    autoBind: true,
    beforeLoadComplete: function (records) {
      for (var i = 0; i < records.length; i++) {
        var obj = { name: records[i].field_name, type: records[i].field_type };
        fields.push( obj );
      }
    }
  });
}

function draw_chart() {
  // Configure Grid fields to "fields[]"
  var source =
  {
      datatype: "csv",
      datafields: fields,
      url: "csv/" + url,
      async: false // Asyncronous Reading
  };

  // Configure grid table fields
  var grid_fields = [];
  for (var i = 0; i < fields.length; i++) {
    var obj = { text: fields[i].name, datafield: fields[i].name, cellsformat: fields[i].type };
    grid_fields.push( obj );
  } 
  // Draw DataGrid
  var dataAdapter = new $.jqx.dataAdapter(source);
  $("#jqxgrid").jqxGrid(
  {
//      width: 850,
      source: dataAdapter,
      sortable: false,
      theme: 'energyblue',
      columnsresize: true,
      columns: grid_fields
  });
}

// Draw chart from data grid
// "col" is the column of data grid
function grid2chart( col ) {
    var source = { 
    	datafields: fields,
        datatype: "csv",
        url: "csv/" + url
    }
  var dataAdapter = new $.jqx.dataAdapter(source);

  if ( col == '' ) { col = fields[1].name; }

  // prepare jqxChart settings
  var settings = {
    title: "Rates of age 65 over people",
    showLegend: true,
    source: dataAdapter,
    enableAnimations: true,
    description: '高齢化率 平成17年＝100とした場合',
    xAxis: {
      dataField: 'city',
  	  unitInterval: 1,
      textRotationAngle: -90,
      textRotationPoint: 'top',
      showGridLines: true
    },
    colorScheme: 'scheme01',
    seriesGroups:[{
      type: 'column',
//      orientation: 'horizontal',
      columnsGapPercent: 30,
      seriesGapPercent: 0,      	  
      valueAxis:{
//      	flip: true,
        description: 'Rate(%)',
        minValue: 0,
        maxValue: 280,
        unitInterval: 20,
        displayValueAxis: true,
//        axisSize: 'auto',
        tickMarksColor: '#888888'
      },
      click: chartClickEventHandle,
      series: [{ dataField: col, displayText: col }]
    }]
  };
    
      // setup the chart
    $('#jqxchart').jqxChart(settings);
}

// Event handler
$("#jqxgrid").on("columnclick", function (event) 
{
    var column = event.args.column;
    grid2chart(column.text);
//    var rows = $('#jqxgrid').jqxGrid('getrows');
//    heatmapLayer( rows, column.text );

});

// bar chart click
function chartClickEventHandle(e) {
	var data = $('#jqxgrid').jqxGrid('getrowdata', e.elementIndex);
	createWindow(data.city);
    
    var plotdata = new Array;
    for( key in data ) 
      if( key != 'city' && key != 'uid' ) 
        plotdata.push( {year: key, value: data[key] } );
	
    // city line chart
    var settings = {
      title: data.city,
      description: "",
      padding: { left: 5, top: 5, right: 5, bottom: 5 },
      source: plotdata,
      categoryAxis: { dataField: 'year', showGridLines: false },
      colorScheme: 'scheme01',
      seriesGroups: [
        {
          type: 'line',
          valueAxis: {
            minValue: 0,
            maxValue: 280,
            unitInterval: 10,
            description: 'Rates'
          },
          series: [
            { dataField: 'value', displayText: 'value'}
          ]
        }
      ]
    };
    $('#linechart').jqxChart(settings);
}

// Create dropdown list
function init_dropdown() {

  // items form file
  var source =
  {
      datatype: "csv",
      datafields: [{ name: 'pref'}, { name: 'url'} ],
      url: "csv/" + url_files,
      async: false // Asyncronous Reading
  };
  var dataAdapter = new $.jqx.dataAdapter(source);
  // Create a jqxDropDownList
  $("#jqxdropdown").jqxDropDownList(
    { source: dataAdapter,
      displayMember: "pref",
      valueMember: "url",
	  selectedIndex: 0,
      width: '120px',
      height: '25px'
  });
}

// bind to 'change' event of dropdown.
$('#jqxdropdown').bind('change', function (event) {
  var args = event.args;
  if (args) {
    var item = $('#jqxdropdown').jqxDropDownList('getItem', args.index);
    url = item.value;
    draw_chart();
    grid2chart('');
  }
  // set default index
  $('#jqxdropdown_year').jqxDropDownList('selectIndex', 0);
  
  // google map
  changeCenter( item.label );
});

// bind to 'change' event of dropdown.
$('#jqxdropdown_year').bind('change', function (event) {
	
  var args = event.args;
  if (args) {
    var item = $('#jqxdropdown_year').jqxDropDownList('getItem', args.index);
    grid2chart(item.label);
  }

});


$(document).ready(function () {
  // Create jqxTabs.
  $('#jqxTabs').jqxTabs({ width: '100%', height: 400, position: 'top', theme: 'summer' });
  $('#settings div').css('margin-top', '10px');
});

//
function init_dropdown_year() {
  // items form grid label
  var source =
  {
      datatype: "csv",
      datafields: [{ name: 'city'}, { name: 'text'} ],
      url: "csv/" + url_field,
      async: false // Asyncronous Reading
  };
  var dataAdapter = new $.jqx.dataAdapter(source);
  // Create a jqxDropDownList
  $("#jqxdropdown_year").jqxDropDownList(
    { source: dataAdapter,
      displayMember: "city",
//      valueMember: "url",
	  selectedIndex: 0,
      width: '120px',
      height: '25px'
  });
  // regulation
  $("#jqxdropdown_year").jqxDropDownList('removeAt', 0 ); 
}

// show tooltips
function tooltips() {
  $("#jqxgrid").jqxTooltip({ position: 'top', content: '年カラムラベルをクリックするとグラフが変わります' });
  $("#jqxchart").jqxTooltip({ position: 'right', content: 'クリックすると時系列グラフを表示します' });
  $("#jqxdropdown").jqxTooltip({ position: 'top', content: '地域を選択' });
  $("#jqxdropdown_year").jqxTooltip({ position: 'top', content: '時系列を選択' });
}


// main function
init_dropdown();
init_fields();
draw_chart();
grid2chart('');
init_dropdown_year();
tooltips();
