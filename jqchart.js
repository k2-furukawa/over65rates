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
      ], url: url_field,
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
      url: url,
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
        url: url
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
    var rows = $('#jqxgrid').jqxGrid('getrows');
    heatmapLayer( rows, column.text );

});

// Create dropdown list
function init_dropdown() {

  // items form file
  var source =
  {
      datatype: "csv",
      datafields: [{ name: 'pref'}, { name: 'url'} ],
      url: url_files,
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
//    if ( args.index != 0 ) {
//      alert('Selected: ' + item.value);
      url = item.value;
      draw_chart();
      grid2chart('');
//    }
  }
  // google map
  changeCenter( item.label );

  
});

function city_heat_wights( text ) {
  var rows = $('#jqxgrid').jqxGrid('getrows');
  haetmapLayer( rows, text );

}


// main function
init_dropdown();
init_fields();
draw_chart();
grid2chart('');