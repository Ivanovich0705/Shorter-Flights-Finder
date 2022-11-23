<template>

    

</template>

<script scoped>
import { UserApiService } from "../services/user-api-service";
import { isGloballyWhitelisted, stringifyStyle } from '@vue/shared';
import * as d3 from 'd3'
export default {
    data() {
    return {
          loading: [false, false, false],
            loadData: {},
            h: 600,
            w: 960,

        orderOrigin: "",
      orderDestination: "",
        originAirportSelected: "",
        destinationAirportSelected: "",
      countries: [],
      originAirports: [],
      destinationAirports: [],
      nodesUrl:""
    }
  },
  created() {
      this.countryApiService = new UserApiService()

      this.countryApiService.getCountries().then((response) => {
      console.log("HEREE")
      this.countries = response.data;
      console.log(this.recent_orders)
        console.log("HEREE NOT ANYMORE")
      });

      
  },
  mounted() {
    
  
    this.d3init()
        
    },
    methods: {
        validateOrigin: function () {
        if (this.orderOrigin == "") {
          this.orderOriginError = true
        } else {
          this.orderOriginError = false
          this.loadOriginAirports()
        }
      },
      validateDestination () {
        if (this.orderDestination == "") {
          this.orderDestinationError = true
        } else {
          this.orderDestinationError = false
          this.loadDestinationAirports()
        }
      },
    

      loadOriginAirports() {
        this.countryApiService.getAirportsByCountry(this.orderOrigin.country)
          .then(response => {
            this.originAirports = response.data
          })
        console.log(this.originAirports)
        console.log(this.orderOrigin)
      },
      loadDestinationAirports() {
        this.countryApiService.getAirportsByCountry(this.orderDestination.country)
          .then(response => {
            this.destinationAirports = response.data
          })
      },

      d3init(start = -1, end = -1) {
        this.deleteSvgs()
        console.log(start)
        console.log(end)
        if (start == -1 && end == -1) {
          //this.nodesUrl = 'https://acomplex-tf-api.herokuapp.com/nodes'
          this.nodesUrl = 'http://127.0.0.1:5000/nodes'
        } else if (end == -1) {
          //this.nodesUrl = 'https://acomplex-tf-api.herokuapp.com/prim/' + start
          this.nodesUrl = 'http://127.0.0.1:5000/prim/' + start
          console.log("prim here")
        } else {
          //this.nodesUrl = 'https://acomplex-tf-api.herokuapp.com/dijkstra/' + start + '/' + end
          this.nodesUrl = 'http://127.0.0.1:5000/dijkstra/' + start + '/' + end
          //this.nodesUrl='https://acomplex-tf-api.herokuapp.com/dijkstra/1146/1147'
        }
        console.log(this.nodesUrl)
        
      console.log("Chart Loaded");
        
        var positioning = 'map'
        var width = 1600
        var height = 800
       

         var projection = d3.geoMercator()
             .scale(210)
             .center([0,20])
             .translate([width / 2, height / 2])
              
        var path = d3.geoPath().projection(projection)
        
        //var graphJson = d3.json('https://acomplex-tf-api.herokuapp.com/dijkstra/1146/1147')
        var graphJson = d3.json(this.nodesUrl)
        //var graphJson = d3.json('http://127.0.0.1:5000')
        //var graphJson = d3.json('http://127.0.0.1:5000/nodes')
        var linkForce = d3.forceLink()
            .distance(1)
        var simulation = d3.forceSimulation(graphJson.nodes)
            .force("link", d3.forceLink().id(function(d) { return d.new_id; }))
            //.force("link", d3.forceLink(graphJson.links))
            .force('charge', d3.forceManyBody().strength(-20))
            .force('center', d3.forceCenter(width / 2, height / 2))
            .stop()
        var drag = d3.drag()
            .on('start', dragStarted)
            .on('drag', dragged)
           .on('end', dragEnded)

      var files = ["1",
       "2"];
           var promises = [];

           files.forEach(function (url) {
               //promises.push(d3.json('https://acomplex-tf-api.herokuapp.com/dijkstra/1146/1147'))
               //promises.push(d3.json(this.nodesUrl))
               promises.push(graphJson)
               //promises.push(d3.json('http://127.0.0.1:5000/nodes'))
               //promises.push(d3.json("/graph.json"))
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
            console.log("initialize")
         var graph = results[0]
         var features = results[1].features
         console.log(graph)
         simulation.nodes(graph.nodes)

         

         simulation.force('link').links(graph.links)
         var svg = d3.select('body')
           .append('svg')
           .attr('width', width)
           .attr('height', height)
           .style("fill", "#DDDDDD")
           .style("border", "1px solid white")
           .style("border-radius", "10px")
           .style("box-shadow", "0 6px 30px rgba(0, 0, 0, 0.356), 0 0 6px rgba(0, 0, 0, 0.05)")
           .style("display", "block")
           .style("margin", "auto");

                
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
             .attr('stroke-width', 1)
             .attr("stroke", "grey")//Line Color
           .attr("opacity", "0.25")//Line Color
             
         var nodes = svg.append('g')
             .attr('class', 'nodes')
             .selectAll('circle')
             .data(graph.nodes)
             .enter().append('circle')
             .attr("stroke", function (d) {
               // 3 1 2 4
               if ( -25.664063 >= d.lon && d.lon >= -101.250000 && -59.175928 <= d.lat && d.lat <= 18.479609) {
                     return "#476930";//Latin America
               }
               if ( -27.949219 >= d.lon && d.lon >= -170.683594 && 8.581021 <= d.lat && d.lat <= 77.692870) {
                     return "#0583d2";//North America
                 }
               if ( 49.746094 >= d.lon && d.lon >= -22.324219 && 35.0299968 <= d.lat && d.lat <= 72.816074) {
                     return "#FFFCEB";//Europe
               }
               if ( 54.492188 >= d.lon && d.lon >= -32.519531 && -35.603719 <= d.lat && d.lat <= 35.603719) {
                     return "#D0C7C2";//Africa
               }
               if ( 195.644531 >= d.lon && d.lon >= 105.820313 && -48.224673 <= d.lat && d.lat <= -4.915833) {
                     return "#2D7D7E";//Oceania
               }
               return "#AD2E45";//Asia

             })//Cirlce Border Color
             .attr("fill", function (d) {
               // 3 1 2 4
               if ( -25.664063 >= d.lon && d.lon >= -101.250000 && -59.175928 <= d.lat && d.lat <= 18.479609) {
                     return "#86B049";//Latin America
               }
               if ( -27.949219 >= d.lon && d.lon >= -170.683594 && 8.581021 <= d.lat && d.lat <= 77.692870) {
                     return "#16558f";//North America
                 }
               if ( 49.746094 >= d.lon && d.lon >= -22.324219 && 35.0299968 <= d.lat && d.lat <= 72.816074) {
                     return "#F9CF33";//Europe
               }
               if ( 54.492188 >= d.lon && d.lon >= -32.519531 && -35.603719 <= d.lat && d.lat <= 35.603719) {
                     return "#896B60";//Africa
               }
               if ( 195.644531 >= d.lon && d.lon >= 105.820313 && -48.224673 <= d.lat && d.lat <= -4.915833) {
                     return "#7ECCCC";//Oceania
               }
               return "#EFE5E3";//Asia

             })//Circle Fill Color235
             .attr("stroke-width", "2")
             .attr("opacity", "0.9")//Line Color
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

      deleteSvgs() {
        d3.selectAll("svg").remove();
      }
    }
}

</script>

<style scoped>


.map path {
    fill: #eee;
    stroke: #fff;
    stroke-width: 2;
}

.inputs{
  background-color: #55939e; 
  background-repeat: repeat;

}

.flex {
    align-items: center;
    justify-content: center;
  }
  
  .flex .drop-down {
    margin-left: 2rem;
    width: 12rem;
  }
  
  .country-item img {
    width: 19px;
    margin-right: 0.5rem;
  }
  
  .order-origin {
    background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='58' height='43' fill='none' viewBox='0 0 58 43'%3e%3cpath fill='%23264986' d='M56.55 37.267H1.45c-.8 0-1.45.641-1.45 1.433v2.867C0 42.359.65 43 1.45 43h55.1c.8 0 1.45-.641 1.45-1.433V38.7c0-.792-.65-1.433-1.45-1.433ZM7.3 27.706c.57.612 1.368.96 2.205.96l11.83-.017a6.004 6.004 0 0 0 2.686-.638l26.368-13.227c2.423-1.215 4.595-2.95 6.073-5.223 1.66-2.551 1.84-4.398 1.185-5.702-.654-1.305-2.242-2.264-5.28-2.46-2.704-.173-5.395.531-7.818 1.746l-8.927 4.478-19.82-7.35a1.625 1.625 0 0 0-1.631-.1L8.213 3.162a1.627 1.627 0 0 0-.469 2.556l14.157 8.788-9.353 4.692-6.557-3.267a1.629 1.629 0 0 0-1.456.002L.898 17.758a1.627 1.627 0 0 0-.504 2.515L7.3 27.706Z'/%3e%3c/svg%3e");
    width: 58px;
    height: 43px;
  
  &
  --Vector {
    background-position: 0 0;
  }
  
  }
  
  .order-destination {
    background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='58' height='46' fill='none' viewBox='0 0 58 46'%3e%3cpath fill='%23264986' d='M56.55 40.25H1.45c-.801 0-1.45.643-1.45 1.438v2.874C0 45.358.649 46 1.45 46h55.1c.801 0 1.45-.643 1.45-1.438v-2.874c0-.795-.649-1.438-1.45-1.438ZM4.06 18.477l8.043 7.188a5.68 5.68 0 0 0 2.308 1.251l26.064 7.04c2.4.647 4.944.783 7.34.122 2.69-.743 3.937-1.906 4.283-3.209.347-1.302-.157-2.938-2.118-4.937-1.748-1.781-4.02-2.946-6.42-3.594l-8.836-2.386-9.095-17.237a1.5 1.5 0 0 0-1.057-1.07L18.673.052a1.493 1.493 0 0 0-1.877 1.477l4.343 14.753-9.262-2.5-2.5-6.1a1.494 1.494 0 0 0-.999-.892l-3.6-.973A1.495 1.495 0 0 0 2.9 7.244l.02 9.144c.018.8.547 1.558 1.14 2.09Z'/%3e%3c/svg%3e");
    width: 58px;
    height: 46px;
  
  &
  --Vector {
    background-position: 0 0;
  }
  
  }
  .inline{
    display: inline-block;
  }
  
  .order-box {
    background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='50' height='35' fill='none' viewBox='0 0 50 35'%3e%3cpath fill='%23264986' d='M33.259 17.502a3.787 3.787 0 0 1-3.234-1.828l-5.023-8.328-5.016 8.328a3.8 3.8 0 0 1-3.242 1.836c-.351 0-.703-.047-1.039-.148L5.003 14.299v13.906c0 1.149.781 2.149 1.89 2.422l16.89 4.226a5.078 5.078 0 0 0 2.422 0l16.905-4.226A2.505 2.505 0 0 0 45 28.205V14.3l-10.702 3.055a3.595 3.595 0 0 1-1.039.148Zm16.608-8.765L45.844.706A1.276 1.276 0 0 0 44.54.011L25.002 2.503l7.163 11.882c.297.492.89.727 1.446.57l15.46-4.413a1.287 1.287 0 0 0 .796-1.805ZM4.16.706.136 8.737c-.36.719.024 1.578.79 1.797l15.46 4.414a1.284 1.284 0 0 0 1.444-.57l7.172-11.875L5.456.01A1.277 1.277 0 0 0 4.16.706Z'/%3e%3c/svg%3e");
    width: 50px;
    height: 35px;
  
  &
  --Vector {
    background-position: 0 0;
  }
  
  }
  .p-button i, span{
    color: white;
  }
  .p-button.google {
    background: linear-gradient(to left, #213d50 50%, #213d50 50%);
    background-size: 200% 100%;
    background-position: right bottom;
    transition: background-position 0.5s ease-out;
    color: #000;
    border-color: #213d50;
}
.p-button.google:hover {
    background-position: left bottom;
}
.p-button.google i {
    background-color: #213d50;
}
.p-button.amazgoogleon:focus {
    box-shadow: 0 0 0 1px #213d50;
}



</style>

