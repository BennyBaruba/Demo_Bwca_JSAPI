var map;


require(["esri/map",

   

    "dojo/parser",
    "dojo/on",
    "dojo/dom",

    "dojo/domReady!"], function
    (Map,
 
  
      parser,
      on, 
      dom) {

    parser.parse();
  


    map = new Map("map", {
        basemap: "topo",
        center: [-91.436, 47.980], // longitude, latitude 47.9022° N, 91.8558° W
        zoom: 10
        //extent: setExtent
    });


    //Events in web app

    map.on("load", function() {
        //after map loads, connect to listen to mouse move & drag events
     
    });






});