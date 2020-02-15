var width = 1600,
    height = 900,
    margin = 100;

const names = ['','Lucas Alcazar', 'Lars Azada', 'Felix Balas', 'Ingrid Barranco', 'Isak Baza', 'Linnea Bergen', 'Isande Borrasca', 'Nils Calixto', 'Axel Calzas', 'Ada Campo-Corrente', 'Gustav Cazar', 'Hideki Cocinaro', 'Inga Ferro', 'Lidelse Dedos', 'Loreto Bodrogi', 'Isia Vann', 'Sven Flecha', 'Birgitta Frente', 'Vira Frente', 'Stenig Fusil', 'Hennie Osvaldo', 'Kanon Herrero', 'Varja Lagos', 'Minke Mies', 'Adra Nubarron', 'Marin Onda', 'Kare Orilla', 'Elsa Orilla', 'Bertrand Ovan', 'Felix Resumir', 'Sten Sanjorge Jr.', 'Orhan Strum', 'Brand Tempestad', 'Edvard Vann', 'Willem Vasco-Pais'];

var x_center = width / 2,
    y_center = height / 2,
    radius = (height - 2 * margin) / 2;

var n_elements;
function index_to_rad(index) {
  return 2 * Math.PI * index / n_elements;
}

var div = d3.select("body").append("div")	
    .attr("class", "tooltip")				
    .style("opacity", 0);

var color = d3.scale.category10();
// var color = d3.scaleOrdinal(d3.schemeCategory10);
var force = d3.layout.force()
    .charge(-100)
    .linkDistance(300)
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

d3.csv('data/car-assignments.csv', function(data){
  for(d in data){
    var car_id = +data[d].CarID;
    if(names.includes(data[d].FirstName + ' ' + data[d].LastName)){
      var p = {'name': data[d].FirstName + ' ' + data[d].LastName, "group": data[d].CurrentEmploymentType, "subgroup":data[d].CurrentEmploymentTitle};
      nodes.push(p);
    }
  }
  // console.log(JSON.stringify(nodes))  
});

d3.json("data/force2.json", function(error, graph) {
  if (error) throw error;
  
  graph.nodes = graph.nodes.sort(function(a, b) { return d3.ascending(a.group, b.group); });
  n_elements = graph.nodes.length;

  force
      .nodes(graph.nodes)
      .links(graph.links)
      .start();

  var max_value = d3.max(graph.links, function(d){ return d.value; });

  var link = svg.selectAll(".link")
      .data(graph.links)
    .enter().append("line")
      .attr("class", "link")
      .style("opacity", 0.8)
      .style("stroke-width", function(d) { return 5 * d.value / max_value; })
      .attr('stroke', 'black');

  var node = svg.selectAll(".node")
      .data(graph.nodes)
    .enter().append("circle")
      .attr("class", "node")
      .attr("r", 10)
      .attr("name", function(d){ return d.name})
      .style("fill", function(d) { return color(d.group); })
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
        valeu =d;
        d3.selectAll('line').attr('stroke', function(d){
          if (d.source == valeu || d.target == valeu){
            return 'red';
          }
          else{
            return 'black';
          }
        })
      })
      .on('mouseout', function(d){
        d3.select(this).attr('hover',0);
        return tooltip_out(d);
      });

  node.append("title")
      .text(function(d) { return d.name; });

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
          .attr('x1', function(d){console.log(d.source); return d.source.x_resume; })
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