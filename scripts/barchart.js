var y_max = 260;
var filename = ""; //default
var target = '';

var margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = 900 - margin.left - margin.right,
    height = 200 - margin.top - margin.bottom;
	
var x = d3.scale.ordinal()
    .rangeRoundBands([0, width], .1);

var y = d3.scale.linear()
    .range([height, 0]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .ticks(10, "");

var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


// メイン処理
draw(target);


// 関数
function draw(target) {
	svg.selectAll(".bar").remove();
	svg.selectAll("g").remove();
  // ファイル読み込み
  d3.csv(filename, function(error, data) {
	// CSVファイルのヘッダー数分ボタンを自動生成
	var headerKeys = d3.map(data[0]).keys(); //ヘッダー用にkeyを取得
	headerKeys.splice(0,1);
	d3.select('.selector').remove();
    d3.select("#buttons")    // div #buttonsに出力
    .selectAll("input")
   	.data(headerKeys)
   	.enter() //headerKeysの個数分生成
    .append("input")
   	.attr({"id": "selector"})
   	.attr({"onclick": function(headerKeys){return "draw('" + headerKeys + "')"}})
   	.attr({"type": "button"})
   	.attr({"value": function(headerKeys){return headerKeys}});

	// 初期カラムの指定が無い場合は1つ目
	if( target == '' ) {
		target = headerKeys[0];
	}
  	  
  // SVGへのグラフ描画
  x.domain(data.map(function(d) { return d.city; }));
  y.domain([0, y_max]);
//  y.domain([0, d3.max(data, function(d) { return d[target] })]);

  //X軸
  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

  //Y軸
  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("高齢化率(%)");


  //棒グラフ
  svg.selectAll(".bar")
      .data(data)
      .enter().append("rect")
      .attr("class", "bar")
      .attr("x", function(d) { return x(d.city); })
      .attr("width", x.rangeBand())
      .attr("y", function(d) { return y(d[target]); })
      .attr("height", function(d) { return height - y(d[target]); });
});

}

// データとファイルの紐付け定義
d3.csv("files.csv", function(error, list){
    d3.select("#dropdown")    // div dropdownに出力
    .append("form")    // table要素を追加
    .attr({"name": "prefs"})
    .append("select")
    .attr({"name": "chartSelect"})
    .attr({"onChange": "changePref()"})
    .selectAll("option")
    .data(list) // 出力するデータ
    .enter()    // データ数だけ要素を生成
    .append("option")
    .attr({"value": function(d){return d.file;}})
    .text(function(d){  // データ内容を出力
        return d.pref;
    })
});

// DropBoxの値が変わったときデータを変更する
function changePref(){
  var obj = document.prefs.chartSelect;

  index = obj.selectedIndex;
  if (index != 0){
    filename = obj.options[index].value;
    title = obj.options[index].text;
    draw('');
    changeCenter( title );
  }
}


/*
d3.csv(filename, function(error, data){
	
	var headerKeys = d3.map(data[0]).keys(); //ヘッダー用にkeyを取得
	headerKeys.splice(0,1);
	d3.select('.selector').remove();
    d3.select("#buttons")    // div#result内に出力
    .selectAll("input")
   	.data(headerKeys)
   	.enter()
    .append("input")
   	.attr({"id": "selector"})
   	.attr({"onclick": function(headerKeys){return "draw('" + headerKeys + "')"}})
   	.attr({"type": "button"})
   	.attr({"value": function(headerKeys){return headerKeys}});
	        
});
*/