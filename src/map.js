var w = 1600;
var h = 900;

var color = d3.scaleOrdinal(d3.schemeCategory10)
var changetime = false;
var selectall = false;
var daterange = [new Date('01/06/2014'), new Date("1/21/2014")];
var dateformat = d3.timeFormat('%A %m/%d %I:%M:%S %p');
var hourformat = d3.timeFormat('%I %p');
var time_start = new Date('01/06/2014 07:00');
var time_end = new Date('01/06/2014 17:00');

// on click, console will print x,y coordinates of mouse's location
var default_split = 75;
var svg = d3.select('#map')
    .append('svg')
    .attr('id','map_split')
    .attr('viewBox', '0 0 ' + w + ' ' + h)
    .attr('width', function(d){return default_split.toString()+'%'})
    .on('click', function(){
        coords = scale_mouse_coords(d3.mouse(this));
        console.log(coords);
    });
var bar_svg = d3.select('#map').append('svg')
    .attr('id','bar_split')
    .attr('width', function(d){return (100-default_split).toString()+'%'})
    .attr('viewBox', '0 0 ' + 400 + ' ' + 400)
    .attr('width', '25%');

var abila = svg.append("image")
    .attr("xlink:href", "data/MC2-tourist.jpg")
    .attr("id", "abila_map")
    .attr("opacity", 0.65)
    .attr("transform", "translate(75,40)");

function makesliders(){
    var time_slider = d3
        .sliderBottom()
        .min(new Date("01/06/2014"))
        .max(new Date("1/21/2014"))
        .width(500)
        .tickFormat(d3.timeFormat('%m/%d'))
        .ticks(15)
        .step(1000 * 60 * 60 * 24)
        .default([new Date("1/6/2014"), new Date("1/21/2014")])
        .fill('#ACC1AD')
        .on('onchange', val => {
            d3.select('p#value-time').text('Days Range: '.concat(val.map(d3.timeFormat('%m/%d')).join(' - ')));
            daterange = val;
    });

    var time_slider_start = d3
        .sliderBottom()
        .min(new Date('01/06/2014 00:00'))
        .max(new Date('01/06/2014 24:00'))
        .width(800)
        .tickFormat(d3.timeFormat('%I %p'))
        .ticks(24)
        .step(1000 * 60 * 60)
        .default(new Date("1/6/2014 07:00"))
        .on('onchange', val => {
            d3.select('p#value-time-start').text('Start Time: '.concat(hourformat(val)));
            time_start = val;
    });

    var time_slider_stop = d3
        .sliderBottom()
        .min(new Date('01/06/2014 00:00'))
        .max(new Date('01/06/2014 24:00'))
        .width(800)
        .tickFormat(d3.timeFormat('%I %p'))
        .ticks(24)
        .step(1000 * 60 * 60)
        .default(new Date("1/6/2014 17:00"))
        .on('onchange', val => {
            d3.select('p#value-time-stop').text('Time Range: '.concat(hourformat(val)));
            time_end = val;
    });

    var gTime = d3
        .select('div#slider-time')
        .append('svg')
        .attr('width', 800)
        .attr('height', 100)
        .append('g')
        .attr('transform', 'translate(30,30)');
    
    var gTimeStart = d3
        .select('div#slider-time-start')
        .append('svg')
        .attr('width', 1000)
        .attr('height', 100)
        .append('g')
        .attr('transform', 'translate(25,30)');
    
    var gTimeStop = d3
        .select('div#slider-time-stop')
        .append('svg')
        .attr('width', 1000)
        .attr('height', 100)
        .append('g')
        .attr('transform', 'translate(25,30)');

    gTime.call(time_slider);
    gTimeStart.call(time_slider_start);
    gTimeStop.call(time_slider_stop);
}


//import below from json later. below is for testing
const people_id = ['0','1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31', '32', '33', '34', '35'];
// const names = ['','Lucas Alcazar', 'Lars Azada', 'Felix Balas', 'Ingrid Barranco', 'Isak Baza', 'Linnea Bergen', 'Isande Borrasca', 'Nils Calixto', 'Axel Calzas', 'Ada Campo-Corrente', 'Gustav Cazar', 'Hideki Cocinaro', 'Inga Ferro', 'Lidelse Dedos', 'Loreto Bodrogi', 'Isia Vann', 'Sven Flecha', 'Birgitta Frente', 'Vira Frente', 'Stenig Fusil', 'Hennie Osvaldo', 'Kanon Herrero', 'Varja Lagos', 'Minke Mies', 'Adra Nubarron', 'Marin Onda', 'Kare Orilla', 'Elsa Orilla', 'Bertrand Ovan', 'Felix Resumir', 'Sten Sanjorge Jr.', 'Orhan Strum', 'Brand Tempestad', 'Edvard Vann', 'Willem Vasco-Pais'];
// const other_names = ['Mat Bramar', 'Anda Ribera', 'Rachel Pantanal', 'Linda Lagos', 'Ruscella Mies Haber', 'Carla Forluniau', 'Cornelia Lais', 'Emile Arpa', 'Varro Awelon', 'Dante Coginian', 'Albina Hafon', 'Benito Hawelon', 'Claudio Hawelon', 'Henk Mies', 'Valeria Morlun', 'Adan Morlun', 'Cecilia Morluniau', 'Irene Nant', 'Dylan Scozzese'];

const names = ['','Lucas Alcazar', 'Lars Azada', 'Felix Balas', 'Ingrid Barranco', 'Isak Baza', 'Linnea Bergen', 'Isande Borrasca', 'Nils Calixto', 'Axel Calzas', 'Ada Campo-Corrente', 'Gustav Cazar', 'Hideki Cocinaro', 'Inga Ferro', 'Lidelse Dedos', 'Loreto Bodrogi', 'Isia Vann', 'Sven Flecha', 'Birgitta Frente', 'Vira Frente', 'Stenig Fusil', 'Hennie Osvaldo', 'Kanon Herrero', 'Varja Lagos', 'Minke Mies', 'Adra Nubarron', 'Marin Onda', 'Kare Orilla', 'Elsa Orilla', 'Bertrand Ovan', 'Felix Resumir', 'Sten Sanjorge Jr.', 'Orhan Strum', 'Brand Tempestad', 'Edvard Vann', 'Willem Vasco-Pais', 'Mat Bramar', 'Anda Ribera', 'Rachel Pantanal', 'Linda Lagos', 'Ruscella Mies Haber', 'Carla Forluniau', 'Cornelia Lais', 'Emile Arpa', 'Varro Awelon', 'Dante Coginian', 'Albina Hafon', 'Benito Hawelon', 'Claudio Hawelon', 'Henk Mies', 'Valeria Morlun', 'Adan Morlun', 'Cecilia Morluniau', 'Irene Nant', 'Dylan Scozzese'];

var nodes = [];
var links = []
for(name in names){
    var p = {'name': names[name], "group": 1};
    nodes.push(p);
}

//store checked people
var checked_people = [];

//flag for timer
var timerOn = false;

// month, hour, minute, second
var time = [6,6,28,01];
var starttime = Date.parse("1/6/2014  6:28:01 AM");
//var starttime = Date.parse("1/6/2014 17:00");
var stoptime = new Date(starttime + 3600*1000*24*15);
var curtime = starttime;
var newstarttime = starttime;
var newstoptime = Date.parse(stoptime);
var timestep = 20000;

var timebasic = timestep;

var pressedKey=0;
var pressed=0;

//listening for a keypress
document.addEventListener('keydown', (event) => {
    const keyName = event.key;
    pressed=1;
    pressedKey=event.key;
    if(keyName=='ArrowRight'){ forward_fn();}
    if(keyName=='ArrowLeft') { reverse_fn();}
    // if(keyName=='s')         { pause_fn();  }
  });

// -------------------Functions for controlling time-------------------------
var speedratio = 1;
function reverse_fn(){
    console.log(timestep, speedratio)
    timestep-=timebasic;
    speedratio -=1;
    console.log(timestep, speedratio)
    if (timestep<0){ start();}
    if(timestep==0){stop();}
}
function pause_fn(){
    if (timestep==0){
        timestep=timebasic;
        start();
        // d3.select("#play_pause").attr("xlink:href", "static/Icons/pause.png");//.transition().duration(200).attr("transform", "rotate(10 220,30)");
    }
    else{
        timestep=0;
        stop();
        // d3.select("#play_pause").attr("xlink:href", "static/Icons/play.png");
    }
}
function forward_fn(){
    
    timestep+=timebasic;
    speedratio +=1;
    if (timestep>0){start();}
    if(timestep==0){stop();}
}
// ------------------------------------------------------------------

function control_nav() {
    if(document.getElementById("emp").className == "false"){
        document.getElementById("mySidebar").style.width = "250px";
        document.getElementById("main").style.marginLeft = "250px";
        document.getElementById("emp").className = "true"
    }
    else{
        document.getElementById("mySidebar").style.width = "0";
        document.getElementById("main").style.marginLeft= "0";
        document.getElementById("emp").className = "false"
    }

}


// stop the timer
function stop(){
    timerOn = false;
    var datetime = new Date(curtime);
    document.getElementById("time_stamp").innerHTML = dateformat(datetime) +' '+ speedratio.toString()+'x';
    timestep = 0;
    speedratio = 0;    
}

function start(){
    // if(timestep==0){
    //     timestep = timebasic;
    //     speedratio = 1;
    // }
    // console.log("ULULALALA")
    if (curtime == newstarttime){
        d3.select("#People").selectAll('circle').remove();
        // latest = []; 
        
    }
    timerOn = true;
    var t = d3.interval(function(elapsed) {
        // console.log(elapsed);
        // increment time
        // if(timestep==0){
        //     timestep = timebasic;
        // }
        curtime = curtime + timestep;

        // console.log(new Date(curtime));
        //making timer loop over 15 days.
        // console.log(curtime)
        if (curtime > newstoptime){
            // console.log("OOPS")
                curtime = newstarttime;
                d3.select("#People").selectAll('circle').remove();
        }
        // console.log(curtime)
        for (i in checked_people){
            // console.log("plotting",checked_people[i]);
            plot_person(Number(checked_people[i]));
            log_cc_data(checked_people[i]);

        }
        // plot_person(16);
        // plot_person(34);

        //add to index.html
        var datetime = new Date(curtime);
        // console.log(datetime)
        document.getElementById("time_stamp").innerHTML = dateformat(datetime) +' ('+ speedratio.toString()+'x)';
        if (timerOn == false) t.stop();
      }, 40);

};
// event listners
document.getElementById("start").addEventListener("click", function(d){timestep = timebasic; start();});
document.getElementById("stop").addEventListener("click", stop);
document.getElementById("emp").addEventListener("click", control_nav);

var help_modal = document.getElementById("helppopup");
var help_btn = document.getElementById("help");
var help_span = document.getElementById("helpclose");

help_btn.onclick = function() {
    help_modal.style.display = "block";
}

help_span.onclick = function() {
    help_modal.style.display = "none";
}

//methods and variables for the tooltip
var div = d3.select("body").append("div")	
    .attr("class", "tooltip")				
    .style("opacity", 0);

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

//parse through each person and create a checkbox for them

function removeperson(elem){
    elem.click();
    d3.selectAll("#P".concat(elem.id)).remove();
    d3.select('#Path'.concat(elem.id)).selectAll('*').remove();
    checked_people = checked_people.filter(id => id != elem.id);
}

function create_checkboxes(names){
    var hold = document.getElementById("people");
    var label = document.createElement('label');
    var checkbox = document.createElement('input');
    var span = document.createElement('span');
    var tn = document.createTextNode('Select All');
    label.classList.add("contain");
    span.classList.add("checkmark");
    checkbox.type = "checkbox";
    checkbox.id = 'selectall'
    checkbox.addEventListener("click",function(){
        if (selectall){
            var div = document.getElementById('people');
            var checkboxes = div.getElementsByTagName('input');
            for (i = 0; i < checkboxes.length; i++){
                if (checkboxes[i].id != 'selectall' && checked_people.includes(checkboxes[i].id)){
                    removeperson(checkboxes[i]);
                }   
            }
            selectall = false;
        }
        else{
            var checkboxes = d3.select("#mySidebar").selectAll('input').property("checked",'checked');
            checkboxes.each(function(d, i) {
                if (d3.select(this).attr('id') != 'selectall'){
                    if(!(checked_people.includes(d3.select(this).attr('id')))){
                        checked_people.push(d3.select(this).attr('id'));
                    }
                }
            });
            console.log(checked_people);
            selectall = true;
        }
    });
    label.appendChild(tn); 
    label.appendChild(checkbox);
    label.appendChild(span);
    hold.appendChild(label);

    for (i in names){
        if(i != 0){
        var hold = document.getElementById("people");
        var label = document.createElement('label');
        var checkbox = document.createElement('input');
        var span = document.createElement('span');
        var tn = document.createTextNode(names[i] + ' - ' + people_id[i]);
        label.classList.add("contain");
        span.classList.add("checkmark");
        checkbox.type = "checkbox";
        checkbox.id = i.toString();
        d3.select(checkbox).on('click', clickEvent);
        label.appendChild(tn); 
        label.appendChild(checkbox);
        label.appendChild(span);
        hold.appendChild(label);
        }
    }

}

function clickEvent(){
    if (d3.select(this).property('checked')){
        checked_people.push(d3.select(this).attr('id'));
    }
    else{
        d3.select(this).property('checked', null);
        var elem = document.getElementById(d3.select(this).attr('id'));
        removeperson(elem);
    }
}

var modal = document.getElementById("timepopup");
var btn = document.getElementById("custtime");
var time_span = document.getElementsByClassName("close")[0];

btn.onclick = function() {
    stop();
    changetime = true;
    modal.style.display = "block";
}

time_span.onclick = function() {
    // d3.select("#People").selectAll('circle').remove();
    if (changetime){
        var time = d3.timeFormat('%H:%M');
        newstarttime = Date.parse(('1/'.concat(new Date(daterange[0]).getDate()).concat('/2014')) + ' ' + time(new Date(time_start)));
        newstoptime = Date.parse(('1/'.concat(new Date(daterange[1]).getDate()).concat('/2014')) + ' ' + time(new Date(time_end)));
        curtime = newstarttime;
        console.log(newstarttime);
        console.log(newstoptime);
        // console.log(('1/'.concat(new Date(daterange[0]).getDate()).concat('/2014')) + ' ' + time(new Date(time_start)) + ' to ' + ('1/'.concat(new Date(daterange[1]).getDate()).concat('/2014')) + ' ' + time(new Date(time_end)));
    }
    modal.style.display = "none";
    changetime = false;
    // start();
}

window.onclick = function(event) {
    // d3.select("#People").selectAll('circle').remove();
    if (event.target == modal) {
        if (changetime){
            var time = d3.timeFormat('%H:%M');
            newstarttime = Date.parse(('1/'.concat(new Date(daterange[0]).getDate()).concat('/2014')) + ' ' + time(new Date(time_start)));
            newstoptime = Date.parse(('1/'.concat(new Date(daterange[1]).getDate()).concat('/2014')) + ' ' + time(new Date(time_end)));
            curtime = newstarttime;
            changetime = false; 
        }
        modal.style.display = "none";
        // start();
    }
    if (event.target == help_modal) {
        help_modal.style.display = "none";
    }

}

//#####################################
//Scaling methods

// xmin     ymin      xmax     ymax
//24.82403 36.045015 24.909965 36.094918
xmin = 24.82403;
ymin = 36.045015;
xmax = 24.909965;
ymax = 36.094918;

marginx = 0.05;
marginy = 0.05;
//scaling wrt x and y. Can change that to y if needed.
// also, is width and height x and y? Check if thats been correctly done.

x_extent = xmax - xmin;
x_scale = w/x_extent;

y_extent = ymax - ymin;
y_scale = h/y_extent;
// y_scale = x_scale * x_extent / y_extent;   //for equal scaling


// use the below 2 functions to scale any x,y to the screen.
function scale_x (x){
    return w*marginx + (x - xmin) * x_scale*(1-2*marginx);
}
function scale_y (y){
    return h*marginy + (ymax - y) * y_scale*(1-2*marginy);
}

// inverses scaling function to get x coordinate of the mouse 
function inverse_scale_x(mouse_x){
    return ((mouse_x - (w*marginx))/(x_scale*(1-2*marginx))) + xmin;
}

// inverses scaling function to get y coordinate of the mouse
function inverse_scale_y(mouse_y){
    return -(((mouse_y - (h*marginy))/(y_scale*(1-2*marginy))) - ymax);
}

// uses the two inverse scaling functions above to get x,y coordinates from mouse location
function scale_mouse_coords(mouse_coords){
    coords = [];
    x = inverse_scale_x(mouse_coords[0]);
    y = inverse_scale_y(mouse_coords[1]);
    coords.push(x);
    coords.push(y);
    return coords;
}
//#####################################

// draws the map using data2.json
function draw_map(){
    svg.append("g").attr("id","MapBG");
    d3.json('data/data2.json')
        .then(function (data){
            a = svg.select("#MapBG").selectAll("line").data(data)
                .enter().append("line")
                .attr("x1",function(data){return scale_x(data.x1);})
                .attr("x2",function(data){return scale_x(data.x2);})
                .attr("y1",function(data){return scale_y(data.y1);})
                .attr("y2",function(data){return scale_y(data.y2);})
            //     // .attr("stroke-linecap","round")
            //     // .attr("stroke",function(data){return data.stroke;})
                .attr("stroke","#DEB887")
            //     //.attr("stroke-width",function(data){return +data.flag*5 + 1;})
                .attr("stroke-width", 0.5)
                // .style("opacity", 0.6);
        });
}
draw_map();

function strip(location){
    var string = location.replace(/\s/g, '');
    string = string.replace(/[^a-zA-Z ]/g, '');
    return string
}

//import  data to text box
function log_cc_data(id){
    d3.csv('data/cc_data.csv')
        .then(function (data){
        // Date.parse(data.time)
            for (i=0;i<data.length;i++){
                var dat_time = Date.parse(data[i].timestamp);
                
                if (((curtime - dat_time) < timestep) && (curtime - dat_time) > 0){
                    const cur_name = data[i].FirstName + " "+ data[i].LastName;
                    //filter  by people
                    if (names[id] == cur_name){
                        const div = document.getElementById("output");
                        let newParagraph  = document.createElement('p');
                        newParagraph.innerText= data[i].timestamp +" "+ data[i].FirstName + " "+ data[i].LastName +" $" + data[i].price + ", "+ data[i].location;
                        div.appendChild(newParagraph);
                        blip(strip(data[i].location), id);

                    }
                } 
            }

          
        });
}

function blip(location, id){
    d3.selectAll('#'.concat(location)).attr('fill', color(checked_people.indexOf(id))).style('opacity',0.7);
    d3.selectAll('#'.concat(location)).transition()
        .duration(500)
        .attr("r", 25)
        .transition()
        .attr("r", 15)
        .style('opacity',0.1)
        .attr("fill", 'white');
    
}


function plot_locations(){
    d3.csv('data/locations.csv')
        .then(function (data){
        svg.append('g').attr('id','POI')
            .selectAll('circle')
            .data(data)
            .enter().append('circle')
            .attr('r', 15)
            .attr('fill', 'white')
            .attr('id', function(d){ return strip(d.location)})
            .style('opacity', function(d){
                if(isNaN(d.lat)){
                    return 0
                }
                return 0.1
            })
            .attr('cx', function(d){ 
                if(isNaN(d.long)){
                    return 0
                }
                return scale_x(d.long)})
            .attr('cy', function(d){
                if(isNaN(d.lat)){
                    return 0
                }
                return scale_y(d.lat)})
            .on('mouseover', function(d){
                if(!isNaN(d.long)){
                    d3.select(this).style('opacity', 0.1);
                    var val = d.location;
                    return tooltip_in(val)
                }
            })
            //onclick print out location
            .on('click', function(d){
                log_all_data(d.location);
            })
            .on('mouseout', function(d){
                if(!isNaN(d.long)){
                    d3.select(this).style('opacity', 0.1);
                    div.transition().duration(500)
                        .style("opacity", 0);
                }
            });
    });
}
//log cc data and loc data of selected people

var cnt_dict = {};
function log_all_data(d){
    cnt_dict = {};
    const cur_location = d;
                // console.log(d.location);
                d3.json('data/gps_sort_place.json')
                .then(function (data){
                    // console.log(data[d.location]);
                    const div = document.getElementById("history");
                    div.innerHTML = '';
                    //header for new place
                    let header  = document.createElement('h2');
                    header.innerText = cur_location;
                    div.appendChild(header);
                    //loop through location history and output people who have visited

                    for (var i=0; i< data[cur_location]["history"].length;i++){
                        let newParagraph  = document.createElement('p');
                        var person_id = data[cur_location]["history"][i].id;
                        current_person_id = parseInt(person_id)-1;
                        for(var n=0; n<checked_people.length;n++){
                            if (parseInt(current_person_id) == parseInt(checked_people[n])){
                                ptime = Date.parse(data[cur_location]["history"][i].time)
                                if (ptime > newstarttime && ptime < newstoptime){
                                    newParagraph.innerText= data[cur_location]["history"][i].time +" Name: "+ names[current_person_id] + " ID: " + data[cur_location]["history"][i].id;
                                    div.appendChild(newParagraph);
                                }
                            }
                        }


                    }
                })

                d3.json('data/loyal_cc_combo.json')
                .then(function (data){
                    current_key  = "Frank's Fuel";
                    //some error parsing. im not sure why
                    for (const [key, value] of Object.entries(data)) {
                        if (strip(cur_location) == strip(key)){
                            current_key= key;

                        }
                    }
                    console.log(data[current_key]);
                    const cc_div = document.getElementById("credit_history");
                    cc_div.innerHTML = '';

                    //header for new place
                    let header  = document.createElement('h2');
                    header.innerText = cur_location;
                    cc_div.appendChild(header);
                    //loop through cc history and output people who have visited
                    for (var i=0; i< data[current_key].length;i++){
                        for(var n=0; n<checked_people.length;n++){
                            const current_person_id = parseInt(checked_people[n]);
                            const poi_name  = names[current_person_id];
                            const cur_name = data[current_key][i][2] + " " + data[current_key][i][3];
                            //loop through poi
                            if (poi_name == cur_name){
                                ptime = Date.parse(data[current_key][i][4])
                                if (ptime > newstarttime && ptime < newstoptime){
                                    if (cnt_dict[cur_name] == undefined){
                                        cnt_dict[cur_name] = 1;
                                    } else{
                                        cnt_dict[cur_name] += 1;
                                    }
                                    let newParagraph  = document.createElement('p');
                                    newParagraph.innerText= cur_name + " $" + data[current_key][i][1] + " Time: " + data[current_key][i][4] + " Type: " + data[current_key][i][5];
                                    cc_div.appendChild(newParagraph);
                                }
                            }

                        }
                    }
                    draw_bar(cnt_dict);


                })
}

function get_radius(time){
    if (time > 100000){
        return 3;
    }
    else{
        return (1 - 1*(time/(100000)))*10 + 2;
    }
}

// to read a person's data:
//Processing points of interest

var start_indices = [];
for(temp= 0; temp<36;temp++){
    start_indices.push(0);

}
var end_indices = [];
for(temp= 0; temp<36;temp++){
    end_indices.push(0);

}

poi_set = [];
for(ii = 0; ii<36;ii++){
    poi_set.push([]);
}

var dataBig;

var weights = [];
for(ii = 0; ii<36;ii++){    
    weights.push([]);
    for(jj = 0; jj<36;jj++){
        weights[ii].push(0);
    }
}
//console.log(weights)
 

d3.json('data/gps_clean_condensed.json')
    .then(function (data){
        dataBig = data;
        for(id in people_id){
            id = +id;
            //console.log(id)
            loc_data = dataBig[+id];
            var t;
            end_indices[id] = loc_data.length;
                
            var points = [];
            for(t = 0; t < loc_data.length; t++){
                data = loc_data[t];
                if (Date.parse(data.time2) - Date.parse(data.time) >100000){
                    poi_set[id].push(data);
                }
            }
            // console.log(poi_set[0][1]);
        }

        // for (var i=0;i<36;i++){
        //     for (var j=0;j<36;j++){
        //         if (j != i){
        //             for(i1 = 0; i1< poi_set[i].length; i1++)
        //             {
        //                 for(j1 = 0; j1<poi_set[j].length; j1++){
        //                      p1 = poi_set[j][j1];
        //                      p2 = poi_set[i][i1];
        //                      if (((+p1.lat -p2.lat)**2 + (+p1.long-p2.long)**2)**0.5 < 0.0005){
        //                          if(((+p1.lat -36.04788349351959)**2 + (+p1.long-24.87969110956669)**2)**0.5>0.005){
                                        
                                 
        //                             t11 = Date.parse(p1.time);
        //                             t12 = Date.parse(p1.time2);
        //                             t21 = Date.parse(p2.time);
        //                             t22 = Date.parse(p2.time2);

        //                             if ((t11<=t21 && t12>= t21) || (t21<=t11 && t22>= t11)){
        //                                 weights[i][j]+=1;
        //                                 weights[j][i]+=1;
        //                             }
        //                         }
        //                     }

        //                 }
        //             }
        //      }
        //     }
        // }
        // console.log(weights)
        // for (var i=0;i<36;i++){
        //     for (var j=0;j<36;j++){
        //         if(i != j && weights[i][j] > 4){
        //             var dict = {'source': i, 'target': j, 'value': weights[i][j]};
        //             links.push(dict);
        //         }
        //     }
        // }
        
        // var force = {'nodes': nodes, 'links': links};
        // force = JSON.stringify(force);
        // console.log(force);
            // // for person in list{
        //     for person2 in list{
        //         if person2 != person{
        //             for i in person{
        //                 for j in person2{
        //                     if i.time or i.time2 between j.time and j.time2
        //                      or if j.time or j.time2 between i.time and i.time2{
        //                          weight[person][person1]+=1
        //                      }
        //                 }
        //             }
        //         }
        //     }
        // }


    });
//this above call is async to program execution. The following will return 0
//console.log(poi_set.length);
//Now to find all pairwise collisions in this 2500 size list.
//Just need to check if data.time-data.time2 collides with data2.time-data2.time2. can sort this data by person and look for pairwise collisions by person?
//That would increase efficiency, as we only have to check till data.time2 time for data2 (The entries should be sorted by time)


//generating variables for paths and other stuff
paths = []
svg.append('g').attr('id','Paths')
var temp;
for(temp = 1; temp<36;temp++){
    paths.push(svg.select("#Paths").append('g').attr('id','Path'.concat(temp.toString())));
}

var first_time = true;

var latest = [];
for(temp= 1; temp<36;temp++){
    latest.push(null);

}
var last_10 = [null, null, null, null, null, null, null, null, null, null];



svg.append("g").attr('id','People');
function plot_person(id){
    var item = document.getElementById('P'.concat(id.toString()));
    if (typeof(item) == 'undefined' || item == null){
        svg.select('#People').append("g").attr("id",'P'.concat(id.toString()));
    }

    if (dataBig == undefined){
        console.log('Async!!!!')
    }
    // d3.json('data/gps_clean_condensed.json')
    //     .then(function (dataBig){
            // console.log(id);
            loc_data = dataBig[+id];
            console.log(id)

            var t;
            
            var points = [];

            for(t = 0; t < loc_data.length; t++){
                
                data = loc_data[t];

                if(curtime - Date.parse(data.time)<0){
                    t = loc_data.length;
                }
                if (curtime-Date.parse(data.time)>=0 && Date.parse(data.time)>newstarttime) {
                    //is this If condition needed?
                    latest[id] = data;


                    points.push({'x':scale_x(data.long), 'y':scale_y(data.lat)});
                    var name="T" + Date.parse(data.time);
                    var item = document.getElementById(name);
                    
                    // console.log(data)
                    if (Date.parse(data.time2) - Date.parse(data.time) >100000){
                        
                        if (typeof(item) == 'undefined' || item == null){
                            time = data.time;
                            time2 = data.time2;
                            // console.log("Inside")
                            var x = scale_x(data.long);
                            var y = scale_y(data.lat);
                            var rad = get_radius(curtime - Date.parse(data.time))

                            // console.log(d3.schemeCategory20)
                            svg.select("#P".concat(id.toString()))
                                .append("circle").attr("id",name)
                                .attr('cx', x)
                                .attr('cy', y)
                                .attr('r', rad*3)
                                .attr('fill', color(checked_people.indexOf(data.id)))
                                .style('opacity', 0.6)
                                .attr('time',time)
                                .attr('time2',time2)
                                .on("mouseover",function(d){
                                    prnt = names[id] + '<br/>' + d3.select(this).attr('time').slice(0,5) + d3.select(this).attr('time').slice(-9,) +'-' +  d3.select(this).attr('time2').slice(-9,);
                                    return tooltip_in(prnt)}) //show the duration of stay on hover
                                .on("mouseout", function(d){return tooltip_out(d)});;
                        }
                        else{
                            var rad = get_radius(curtime - Date.parse(data.time))
                            svg.select("#".concat(name.toString()))
                                .attr('r', rad*3);
                        }
                    }
                    
                } 
                
            };
            //showing the path
            // svg.select



            if (latest[id] != null){
                var lineFunc = d3.line()
                    .x(function(d) { return +d.x })
                    .y(function(d) { return +d.y })
                svg.select("#Paths").select("#Path".concat(id.toString())).selectAll("path").remove();
                svg.select("#Paths").select("#Path".concat(id.toString())).append('path')
                    .attr('d', lineFunc(points))
                    .attr('stroke',function(data){return color(checked_people.indexOf(latest[id].id))})
                    .attr('fill', 'none')
                    .attr("stroke-width", 2)
                    .on("mouseover",function(data){d3.select(this).attr('stroke-width',5); return tooltip_in(names[id])})//Show the path id on hover					
                    .on("mouseout", function(d){d3.select(this).attr('stroke-width',2); return tooltip_out(d)});
                    
                var x = scale_x(latest[id].long);
                var y = scale_y(latest[id].lat);
                
                svg.selectAll("#current".concat(id.toString())).remove();
                svg.select("#P".concat(id.toString()))
                    .append("circle").attr("id","current".concat(id.toString()))
                    .attr('cx', x).attr('cy',y)
                    .attr('r', 6).attr('fill',color(checked_people.indexOf(data.id)))
                    .on("mouseover",function(data){d3.select('#Path'.concat(id.toString())).select('path').attr('stroke-width',10); return tooltip_in(names[id])})//Show the path id on hover					
                    .on("mouseout", function(d){d3.select('#Path'.concat(id.toString())).select('path').attr('stroke-width',2); return tooltip_out(d)});
                svg.selectAll("#currentM".concat(id.toString())).remove();
                svg.select("#P".concat(id.toString()))
                    .append("image")
                    .attr("id","currentM".concat(id.toString()))
                    .attr("x",x-10)
                    .attr("y",y-20)
                    .attr("xlink:href", "../icons/marker.png")
                    .attr('width', 20)
                    .attr('height', 20)
                    .on("mouseover",function(data){d3.select('#Path'.concat(id.toString())).select('path').attr('stroke-width',10); return tooltip_in(names[id])})//Show the path id on hover					
                    .on("mouseout", function(d){d3.select('#Path'.concat(id.toString())).select('path').attr('stroke-width',2); return tooltip_out(d)});;
                
            }
        // }
        // );
}
// var q = d3.queue()
//     .defer(makesliders)
//     .defer(draw_map)
//     .defer(plot_locations)
//     .await(finished);


makesliders();
plot_locations();
create_checkboxes(names);
// document.getElementById("time_stamp").innerHTML = 'Current Time: ' + new Date(curtime).toString();



document.getElementById("reload").addEventListener("click", update_paths_static);
document.getElementById("clear").addEventListener("click", clear_map);

function clear_map(){
    var checked_people_cop = checked_people.slice(0);
    var div = document.getElementById('people');
    var checkboxes = div.getElementsByTagName('input');
    for (i = 0; i < checkboxes.length; i++){
        if (checkboxes[i].id != 'selectall' && checked_people_cop.includes(checkboxes[i].id)){
            console.log(checkboxes[i].id);
            removeperson(checkboxes[i]);
        }
        else{
            console.log(checkboxes[i].id)
            console.log(selectall)
            if(selectall){
                checkboxes[i].click();
                selectall = false;
            }
        }
    }
    svg.select('#People').selectAll().remove();
}

function update_paths_static(){
    stop();
    d3.select("#People").selectAll('circle').remove();
    curtime = newstoptime;
    console.log(curtime)
    var datetime = new Date(curtime);
    document.getElementById("time_stamp").innerHTML = dateformat(datetime);
    svg.select('#People').selectAll().remove();
    for( t = 0; t<checked_people.length; t++){
        console.log(checked_people[t])
        plot_person(checked_people[t])
    }
    draw_bar(cnt_dict);
}
document.getElementById("time_stamp").innerHTML = dateformat(new Date(curtime));
//create dropdown menu for places
function create_dropdown(){
    //create dropdown for place
    var parent = document.getElementById("dropdown");

    //Create and append select list
    var selectList = document.createElement("select");
    selectList.id = "mySelect";
    parent.appendChild(selectList);
    var option = document.createElement("option");
    option.value ="";
    option.text = "Select a place";
    selectList.appendChild(option);

    d3.csv('data/locations.csv')
        .then(function (data){
        // Date.parse(data.time)
            for (i=0;i<data.length;i++){
                var option = document.createElement("option");
                option.value = data[i].location;
                option.text = data[i].location;
                selectList.appendChild(option);
            }
    });

}

function compare(a, b) {
  // help from https://www.sitepoint.com/sort-an-array-of-objects-in-javascript/
  const locA = a.frequency;
  const locB = b.frequency;

  let comparison = 0;
  if (locA < locB) {
    comparison = 1;
  } else if (locA > locB) {
    comparison = -1;
  }
  return comparison;
}




function draw_bar(data_imported){
    var output = []
    var i = 0;
    for(var key in data_imported) {
        if(data_imported.hasOwnProperty(key)) {
            output[i] = {"name":key,"frequency":data_imported[key]};
            i +=1;
        }
    }
    // var xsort = _.sortBy(output, 'frequency' );
    // console.log(xsort);
    output.sort(compare);
    var barwidth = 300*(100-default_split)/25;
    var barheight = 300;

    var xScale = d3.scaleBand()
        .range([0, barwidth])
        .padding([0.2]);

    var yScale = d3.scaleLinear()
        .range([barheight, 0]);

    xScale.domain(output.map(function(d) { return d.name; }));
    yScale.domain([0, d3.max(output, function(d) { return +d.frequency; })]);
    bar_svg.selectAll(".bar").remove();
    bar_svg.selectAll("#scale").remove();

    var bar = bar_svg.append('g').attr('id','bar').attr('transform', 'translate(' + 50 + ',' + 50 + ')');
    bar.selectAll(".bar").data(output)
        .enter().append('rect')
        .attr('class', 'bar')
        .style('opacity', 0.9)
        .attr('fill', function(d){
            return color(checked_people.indexOf(names.indexOf(d.name).toString()));})
        .attr('x', function(d) { return xScale(d.name); })
        .attr('width', xScale.bandwidth())
        .attr('y', function(d) { return yScale(+d.frequency); })
        .attr('height', function(d) { return barheight - yScale(+d.frequency); })
        .on('mouseover', function(d){
            d3.select(this).style('opacity', 1);
            var val = d.name + '<br/>' + d.frequency;
            return tooltip_in(val);
        })
        .on('mouseout', function(d){
            d3.select(this).style('opacity', 0.9);
            return tooltip_out(d);
        });
        
    bar.append('g')
        .attr('id', 'scale')
        .attr('transform', 'translate(0,' + barheight + ')')
        .call(d3.axisBottom(xScale).tickValues([]))
        .append("text").attr("transform", "translate(" + barwidth/2 + " ," + 30 + ")")
        .style("text-anchor", "middle")
        .attr("fill", "black") 
        .text(function(d){
            var e = document.getElementById("mySelect");
            const location = e.options[e.selectedIndex].value;
            var text = 'Vistor Frequency for ' + location + ' by CC Data';
            return text;
        });
  
    // add the y axis
    bar.append('g')
        .attr('id', 'scale')
        .call(d3.axisLeft(yScale))
        .append("text")
        .attr("transform", "rotate(-90) translate(-110,-50)")
        .attr("fill", "black") 
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Frequency Count");


    // svg.append('g').attr('id','bar');
    // svg.selectAll("bar")
    // .data(output)
    // .enter()
    // .append("rect")
    // .attr("class", "bar")
    // .attr("x", function (d, i) {
    //     for (i>0; i < data.length; i++) {
    //         return i * 21;
    //     }
    // })
    // .attr("y", function (d) {
    //     return height - (d.val*10);
    // })
    // .attr("width", 20)
    // .attr("height", function (d) {
    //     return d.val * 10;
    // });


}

function sel_place(){
    var e = document.getElementById("mySelect");
    const location = e.options[e.selectedIndex].value;
    log_all_data(location);

}
//create_dropdown menus
create_dropdown();
document.getElementById("mySelect").addEventListener("change", sel_place,false);

introJs().start();


//for rescaling the map and graph

document.getElementById("screenDivideButton").addEventListener('click',function(){
    default_split = +document.getElementById("screen_percent").value;
    console.log(default_split)
    var bar_w=400*(100-default_split)/25
    d3.select("#bar_split")
        .attr('width', function(d){return (100-default_split).toString()+'%'})
        .attr('viewBox', '0 0 ' + bar_w + ' ' + 400);
    d3.select("#map_split")
        .attr('width', function(d){return default_split.toString()+'%'});
    draw_bar(cnt_dict);
        
      });
