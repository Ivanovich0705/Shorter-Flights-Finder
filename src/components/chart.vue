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
             var width = 960
            var height = 600
             
            //  var svg = d3.select("div#dataviz-container").append("svg:svg")
            //      .attr("width", width)
            //      .attr("height", height)
            //     .style("border", "1px solid black");
                 
            //var projection = d3.geoEqualEarth()
            //    .scale([width * 1.25])
            //    .translate([width / 2, height / 2])
                   
             //var path = d3.geoPath(projection);

              var projection = d3.geoAlbersUsa()
                    .scale([width * 1.25])
                    .translate([width / 2, height / 2])
                   
             var path = d3.geoPath().projection(projection)
             
             var graphJson = d3.json("/graph.json")
             var continentalUsJson=d3.json("/continental-us.json")
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

                var files = ["/graph.json", "/continental-us.json"];
                var promises = [];

                files.forEach(function (url) {
                    promises.push(d3.json("/graph.json"))
                    promises.push(d3.json("/continental-us.json"));

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
            let data = await d3.json("/data.json");
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

.nodes circle {
    fill: #679;
    stroke: #235;
    stroke-width: 2;
}
</style>