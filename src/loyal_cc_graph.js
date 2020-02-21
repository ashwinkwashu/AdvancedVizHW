var width = 14000,
    height = 9000,
    margin = 100;

var x_center = width / 2,
    y_center = height / 2,
    radius = (height - 2 * margin) / 2;

var n_elements;
function index_to_rad(index) {
  return 2 * Math.PI * index / n_elements;
}

var div = d3.select('body').append('div')	
    .attr('class', 'tooltip')				
    .style('opacity', 0);

var departments = ['Information Technology', 'Executive', 'Engineering', 'Security', 'Facilities', 'Administration'];

var colorscale = ['#7076FF', '#AA6EF9', '#FF6490', '#FF8169', '#FFAE38', '#FFDB00']

// var color = d3.scale.category10();
var color = d3.scale.ordinal().domain(departments)
  .range(colorscale);

var force = d3.layout.force()
    .charge(200)
    .linkDistance(3000)
    .size([width, height]);

var x_scale = d3.scale.linear()
    .domain([0,1])
    .range([x_center, x_center + radius]);

var y_scale = d3.scale.linear()
    .domain([0,1])
    .range([y_center, y_center + radius]);

// var svg = d3.select("body").append("svg")
//     .attr("width", width)
//     .attr("height", height);

var svg = d3.select('body')
    .append('svg')
    .attr('viewBox', '0 0 ' + width + ' ' + height);

var nodes = [];

//Fade in for the tooltip
function tooltip_in(d){
  //show the tooltip
  div.transition()		
      .duration(200)		
      .style("opacity", .9);		
  div.html(d)	
      .style("left", (d3.event.pageX) + "px")		
      .style("top", (d3.event.pageY - 28) + "px");
}

//fade out for the tooltip
function tooltip_out(d) {		
  div.transition()		
      .duration(500)		
      .style("opacity", 0);
}

// d3.csv('data/car-assignments.csv', function(data){
//   for(d in data){
//     var car_id = +data[d].CarID;
//     var p = {'name': data[d].FirstName + ' ' + data[d].LastName, "group": data[d].CurrentEmploymentType, "subgroup":data[d].CurrentEmployment};
//     nodes.push(p);
//   }
//   console.log(JSON.stringify(nodes))  
// });

var low_thresh = -1;
var high_thresh = 100000;
var max_value = 0;

d3.json("data/force_loyal_cc.json", function(error, graph) {
// d3.json("data/force_cc.json", function(error, graph) {
  if (error) throw error;
  graph.nodes = graph.nodes.sort(function(a, b) { return d3.ascending(a.group, b.group); });
  n_elements = graph.nodes.length;

  force
      .nodes(graph.nodes)
      .links(graph.links)
      .start();

  max_value = d3.max(graph.links, function(d){ return d.value; });

  var link = svg.append('g').attr('class', 'links').selectAll('line')
      .data(graph.links)
    .enter().append('line')
      // .style('opacity', 0.8)
      .style('stroke-width', function(d) { return Math.max(50 * (d.value) / (max_value), 0); })
      // .style('stroke-opacity', '0.6')
      .attr('stroke', '#999')
      .attr('value', function(d){ return d.value})
      .on('mouseover',function(d){
        // d3.select(this).attr('hover',1);
        if(d.name != ''){
          var val = d.value;
          tooltip_in(val);
        }
      });

  var node = svg.append('g').attr('class', 'nodes').selectAll('circle')
      .data(graph.nodes)
    .enter().append('circle')
    .attr('id',function(d){ return 'P'+d.index})
      .attr('r', 100)
      .attr('name', function(d){ return d.name})
      .style('fill', function(d) { return color(d.group); })
      .attr('stroke', '#fff')
      .style('stroke-width','1.5px')
      .attr('opacity', function(d){
        if(d.name != ''){
          return 1;
        }
        else{
          return 0;
        }
      })
      .call(force.drag)
      .on('mouseover', function(d){
        // d3.select(this).attr('hover',1);
        if(d.name != ''){
          var val = d.name + '<br/>' + d.group + ' - ' + d.subgroup;
          tooltip_in(val);
        }
        var arr_neighbours=[];
        valeu =d;
        d3.selectAll('line').attr('stroke', function(d){
          if (d.source == valeu || d.target == valeu){
            var src = d.source;
            var tar = d.target;
            d3.selectAll('circle').attr('r', function(d){
              if((d == src || d == tar) && d != valeu){
                console.log(d);
                arr_neighbours.push('#'+d3.select(this).attr('id'));
              }
              return 100;
            })
            return 'black';
          }
          else{
            return '#999';
          }
        });
        for(var iter = 0 ; iter< arr_neighbours.length; iter++){
          d3.select(arr_neighbours[iter]).attr('r', 150)
        }
        d3.select(this).attr('r', 150);
      })
      .on('mouseout', function(d){
        d3.select(this).attr('hover',0)
        d3.select(this).attr('r', 100);
        d3.selectAll('line').attr('stroke', '#999');
        return tooltip_out(d);
      });

    var labels = node.append("text")
      .text(function(d){return d.name;})
      .attr('x', 6)
      .attr('y', 3)
      .attr("font-size", '10px');

  force.on("tick", function() {
    link.attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

    node.attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; });
  });

  d3.selectAll("#controls input[name=mode]").on("change", function(){
    if (this.value == 'circle') { 

      force.stop();

      var circles = svg.selectAll('circle')[0];
      svg.selectAll('circle').data().forEach(function(d,i){
        d.x_resume = circles[i].cx.animVal.value;
        d.y_resume = circles[i].cy.animVal.value
      });
      
      svg.selectAll('line')
        .transition().duration(1000)
          .attr('x1', function(d){ return x_scale(Math.sin(index_to_rad(d.source.index))); })
          .attr('x2', function(d){ return x_scale(Math.sin(index_to_rad(d.target.index))); })
          .attr('y1', function(d){ return y_scale(Math.cos(index_to_rad(d.source.index))); })
          .attr('y2', function(d){ return y_scale(Math.cos(index_to_rad(d.target.index))); });
          
      
      svg.selectAll('circle')
        .transition().duration(1000)
          .attr('cx', function(d,i){ return x_scale(Math.sin(index_to_rad(i))); })
          .attr('cy', function(d,i){ return y_scale(Math.cos(index_to_rad(i))); })
          ;

    } else { 

      svg.selectAll('line')
        .transition().duration(1000)
          .attr('x1', function(d){ return d.source.x_resume; })
          .attr('y1', function(d){ return d.source.y_resume; })
          .attr('x2', function(d){ return d.target.x_resume; })
          .attr('y2', function(d){ return d.target.y_resume; });

      svg.selectAll('circle')
        .transition().duration(1000)
          .attr('cx', function(d){ return d.x_resume; })
          .attr('cy', function(d){ return d.y_resume; });

      setTimeout(function(){
        force.resume();
      },1000);

    }

  });

});



document.getElementById("lowerButton").addEventListener('click',function(){
  low_thresh = +document.getElementById("thresh_low_input").value;
  svg.selectAll('line').style('stroke-width', function(d){
    var v = +d3.select(this).attr('value');
    if(v<low_thresh){
      v=0;
    }
    if(v>high_thresh){
      v=0;
    }
    console.log(low_thresh, high_thresh);
    return Math.max(50 * v / Math.min(max_value, high_thresh), 0);
  })
});

document.getElementById("higherButton").addEventListener('click',function(){
  high_thresh = +document.getElementById("thresh_high_input").value;
  svg.selectAll('line').style('stroke-width', function(d){
    var v = +d3.select(this).attr('value');
    if(v<low_thresh){
      v=0;
    }
    if(v>high_thresh){
      v=0;
    }
    console.log(low_thresh, high_thresh);
    console.log(v);
    console.log(Math.max(50 * v / Math.min(max_value, high_thresh), 0))
    return Math.max(50 * v / Math.min(max_value, high_thresh), 0);
  })
});