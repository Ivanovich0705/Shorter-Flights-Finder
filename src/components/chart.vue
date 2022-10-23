<template>
    <h1>Hi</h1>
    <button id="toggle">Toggle Map</button>
    <div id="dataviz-container"></div>

</template>

<script scoped>
import * as d3 from 'd3'
export default {
    data() {
        return {
            loadData: {},
            h: 600,
            w: 960
        }
    },
    mounted() {
        console.log("Chart Loaded");
        this.fetchData();

        // var svg = d3.select("div#dataviz-container").append("svg:svg")
        //     .attr("width", this.w) 
        //     .attr("height", this.h)
        //     .style("border", "1px solid black");


        // var simulation = d3.forceSimulation(this.loadData.nodes)

        // var node_drag = d3.drag()
        //     .on("start", dragstart)
        //     .on("drag", dragmove)
        //     .on("end", dragend);

        // function dragstart(d, i) {
        //     force.stop() // stops the force auto positioning before you start dragging
        // }
        // function dragmove(d, i) {
        //     d.px += d3.event.dx;
        //     d.py += d3.event.dy;
        //     d.x += d3.event.dx;
        //     d.y += d3.event.dy;
        //     tick(); // this is the key to make it work together with updating both px,py,x,y on d !
        // }

        // function dragend(d, i) {
        //     d.fixed = true; // of course set the node to fixed so the force doesn't include the node in its auto positioning stuff
        //     tick();
        //     force.resume();
        // }

        // d3.forceLink(this.loadData.links)
        //     .distance(40)

        // var link = svg.selectAll("line.link").data(this.loadData.links).enter().append("svg:line").attr("class", "link")
        //     .attr("x1", function(d) { return d.source.x; })
        //     .attr("y1", function(d) { return d.source.y; })
        //     .attr("x2", function(d) { return d.target.x; })
        //     .attr("y2", function(d) { return d.target.y; });

        // var node = svg.selectAll("g.node").data(json.nodes).enter().append("svg:g").attr("class", "node")
        //     .call(node_drag);


        // node.append("circle")
        //      .attr("cx", 0)
        //      .attr("cy", 0)
        //      .attr("r", function(d) { return d.weight; })  // .attr("r", 25)
        //      .style("fill", function (d) { if (d.name == 'Myriel') return "white"; else return "black"; })
        //      .attr("stroke", "black");



             var positioning = 'map'
             var width = 1800
             var height = 800
             
            //  var svg = d3.select("div#dataviz-container").append("svg:svg")
            //      .attr("width", width)
            //      .attr("height", height)
            //     .style("border", "1px solid black");

            //var projection = d3.geoEqualEarth()
            //    .scale([width * 1.25])
            //    .translate([width / 2, height / 2])

             //var path = d3.geoPath(projection);

             
              var projection = d3.geoMercator()
                  .scale(250)
                  .center([0,20])
                 .translate([width / 2, height / 2])
                   
             var path = d3.geoPath().projection(projection)
             
             var graphJson = d3.json("https://raw.githubusercontent.com/Ivanovich0705/algorith_complex_datasets/main/graph.json")
             var continentalUsJson=d3.json("https://raw.githubusercontent.com/Ivanovich0705/algorith_complex_datasets/main/continental-us.json")
             var linkForce = d3.forceLink()
                 .distance(40)
             var simulation = d3.forceSimulation(graphJson.nodes)
                 .force("link", d3.forceLink(graphJson.links))
                 .force('charge', d3.forceManyBody().strength(-160))
                 .force('center', d3.forceCenter(width / 2, height / 2))
                 .stop()
             var drag = d3.drag()
                 .on('start', dragStarted)
                 .on('drag', dragged)
                .on('end', dragEnded)

        var files = ["https://raw.githubusercontent.com/Ivanovich0705/algorith_complex_datasets/main/graph.json",
            "https://raw.githubusercontent.com/Ivanovich0705/algorith_complex_datasets/main/continental-us.json"];
                var promises = [];

                files.forEach(function (url) {
                    //promises.push(d3.json("https://raw.githubusercontent.com/Ivanovich0705/algorith_complex_datasets/main/graph.json"))
                    promises.push(d3.json("/graph.json"))
                    //promises.push(d3.json("https://raw.githubusercontent.com/Ivanovich0705/algorith_complex_datasets/main/continental-us.json"));
                    promises.push(d3.json("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson"))
                });

                Promise.all(promises).then(function(values) {
                    console.log(values);
                    initialize(values)
                });

                // d3.queue()
                //  .defer(d3.json, 'graph.json')
                //  .defer(d3.json, 'continental-us.json')
                //  .awaitAll(initialize)

             function initialize(results) {
                 
                 var graph = results[0]
                 var features = results[1].features
                 console.log(graph)
                 simulation.nodes(graph.nodes)
                 
                 simulation.force('link').links(graph.links)
                 var svg = d3.select('body')
                     .append('svg')
                     .attr('width', width)
                     .attr('height', height)
                     
                 var map = svg.append('g')
                     .attr('class', 'map')
                     .selectAll('path')
                     .data(features)
                     .enter().append('path')
                     .attr('d', path)
                 var links = svg.append('g')
                     .attr('class', 'links')
                     .selectAll('line')
                     .data(graph.links)
                     .enter().append('line')
                     .attr('stroke-width', function (d) { return d.count / 4 })
                 var nodes = svg.append('g')
                     .attr('class', 'nodes')
                     .selectAll('circle')
                     .data(graph.nodes)
                     .enter().append('circle')
                     .attr('r', 5)
                     .call(drag)

                 nodes.append('title')
                     .text(function (d) { return d.faa })
                 fixed(true)
                 d3.select('#toggle').on('click', toggle)
                 function fixed(immediate) {
                     graph.nodes.forEach(function (d) {
                         var pos = projection([d.lon, d.lat])
                         d.x = pos[0]
                         d.y = pos[1]
                     })
                     var t = d3.transition()
                         .duration(immediate ? 0 : 600)
                         .ease(d3.easeElastic.period(0.5))
                     update(links.transition(t), nodes.transition(t))
                 }
                 function ticked() {
                     update(links, nodes)
                 }
                 function update(links, nodes) {
                     links
                         .attr('x1', function (d) { return d.source.x })
                         .attr('y1', function (d) { return d.source.y })
                         .attr('x2', function (d) { return d.target.x })
                         .attr('y2', function (d) { return d.target.y })
                     nodes
                         .attr('cx', function (d) { return d.x })
                         .attr('cy', function (d) { return d.y })
                 }
                 function toggle() {
                     if (positioning === 'map') {
                         positioning = 'sim'
                         map.attr('opacity', 0.25)
                         simulation.on('tick', ticked).alpha(1).restart()
                     } else {
                         positioning = 'map'
                         map.attr('opacity', 1)
                         simulation.on('tick', null).stop()
                         fixed()
                     }
                 }
             }
             function dragStarted(d) {
                simulation.alphaTarget(0.3).restart()
                 d.fx = d.x
                 d.fy = d.y
             }
            function dragged(event, d) {
                if (positioning === 'map') { return }
                d.fx = event.x
                d.fy = event.y
             }
             function dragEnded(d) {
                 simulation.alphaTarget(0)
                 d.fx = null
                 d.fy = null
             }




        
    },
    methods: {
        async fetchData() {
            let data = await d3.json("https://raw.githubusercontent.com/Ivanovich0705/algorith_complex_datasets/main/graph.json");
            this.loadData = data;
        }
    }
}

</script>

<style>
#toggle {
    position: absolute;
    right: 15px; top: 15px;
    z-index: 100;
}

.map path {
    fill: #eee;
    stroke: #fff;
    stroke-width: 2;
}

.links line {
    stroke: #679;
    stroke-opacity: 0.25;
}

.nodes circle{
    background-image:url("data:image/png;base64,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") ;
}
.nodes circle {
    fill: #679;
    stroke: #235;
    stroke-width: 2;
}
</style>