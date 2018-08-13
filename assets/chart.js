var width = parseInt(d3.select(".chart").style("width"));


var t = d3.scaleTime()
.domain([Date.parse(2008-00-00), Date.parse(2019-00-00)])
.range([0, width])
;

var m = d3.scaleLinear()
.domain([0, 2000])
.range([400, 0])
;

var yearAxis = d3.axisBottom()
.scale(t)
.ticks(10)
.tickSize(400)
;

var svg = d3
.select('div.chart')
.append('svg')
.attr('width','100%')
.attr('height',420)
;

var line = d3.area()
    .x(function(d){return t(Date.parse(d.date))})
    .y0(function(){return m.range()[0]})
    .y1(function(d){return m(+d.close)})
    ;

d3.csv('assets/amazon_stock.csv', function(error,data)
    {
    if (error) throw error;
    
    d3
    .select('svg')
    .append('path')
    .datum(data)
    .attr('class','line')
    .attr('d',line)
    .attr('opacity',.2)
    ;
    
    }
)
;

var chartDiv = $('.chart').offset();
var top1 = chartDiv.top;
var left1 = $('.chart').outerWidth();
console.log(top1);
console.log(left1/2);

d3.csv('assets/amazon_data.csv', function(error, data)
    {
    if (error) throw error;

    svg
    .selectAll('circle')
    .data(data)
    .enter()
    .append('circle')
    .attr('class','circle')
    .attr('cx',function(d){return t(Date.parse(d.date))})
    .attr('cy',200)
    .attr('r',function(d){return 1.2*(Math.sqrt(d.value/Math.PI))})
    .on('mouseover', function(d){
        var This = d3.select(this);
        
        var ThisData = This._groups["0"]["0"].__data__;
        
        d3
        .select('body')
        .append('div')
        .attr('class','tooltip')
        .attr('id', ThisData.name[0] + ThisData.name[1])
        .style('opacity', 1)
        .style("left", (left1/2) - 70 + "px")		
        .style("top", top1 + "px")	
        .html('<h2>' + ThisData.name + '</h2><hr>' + ThisData.value_name + '<hr> <small><i>Prior Investors:</i><br><br></small>' + ThisData.previous)
        ;

    })
    .on('mouseout', function(d){
        d3
        .selectAll('.tooltip')
        .remove()
        ;
    })
    ;

    svg.append('g')
	.attr('class', 'x-axis')
	.call(yearAxis)
	;
  
    }
)
;



// Define responsive behavior
function resize() {
  var width = parseInt(d3.select(".chart").style("width"));
    console.log(width);

  // Update the range of the scale with new width/height
  t.range([0, width]);

  // Update the axis and text with the new scale
    svg.select('.x-axis')
    .call(yearAxis)
    ;

  // Force D3 to recalculate and update the line
  svg.selectAll('.line')
    .attr("d", function(d) { return line(d); });
    
    svg.selectAll('.circle')
    .attr('cx',function(d){return t(Date.parse(d.date))})
    ;


      // Update the tick marks
      yearAxis.ticks(Math.max(width/60, 2));

}

// Call the resize function whenever a resize event occurs
d3.select(window).on('resize', resize);

// Call the resize function
resize();
