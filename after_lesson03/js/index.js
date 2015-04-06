var map;


require(["esri/map",
    "esri/layers/ArcGISTiledMapServiceLayer",
    "esri/layers/ArcGISDynamicMapServiceLayer",
    "esri/geometry/Extent",
    "esri/SpatialReference",
    "esri/layers/FeatureLayer",
         "esri/InfoTemplate",
    

    "esri/dijit/BasemapToggle",
    "esri/dijit/OverviewMap",
    "esri/dijit/Search",

    "dojo/parser",
    "dojo/on",
    "dojo/dom",

    "dojo/domReady!"], function
    (Map,
      Tiled,
      ArcGISDynamicMapServiceLayer, 
      Extent,
     	SpatialReference,
      FeatureLayer,
      InfoTemplate,
      BasemapToggle,
      OverviewMap,

      Search,
      parser,
      on, 
      dom) {

    parser.parse();
  
//            var setExtent = new Extent(-10403509, 5993812, -9933880, 6210894,
//                    new SpatialReference({wkid: 102100}));

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


    var tiledBlowDown = new Tiled("http://tiles.arcgis.com/tiles/vq6gDtLASJCfTxvY/arcgis/rest/services/BlowdownAreas/MapServer");

    map.addLayer(tiledBlowDown);

    var dynamicMapServiceLayerUSA = new ArcGISDynamicMapServiceLayer("http://sampleserver6.arcgisonline.com/arcgis/rest/services/USA/MapServer", {
        "opacity" : 0.5
    });
    dynamicMapServiceLayerUSA.setVisibleLayers([0,1]);
    map.addLayer(dynamicMapServiceLayerUSA);

    var featureLayerBWCABND = new FeatureLayer("http://services.arcgis.com/vq6gDtLASJCfTxvY/ArcGIS/rest/services/Bwca/FeatureServer/5",{

    });

    map.addLayer(featureLayerBWCABND);

    var featureLayer_Fire = new FeatureLayer("http://services.arcgis.com/vq6gDtLASJCfTxvY/arcgis/rest/services/Bwca/FeatureServer/3", {
        opacity: 0.5
    });
    map.addLayer(featureLayer_Fire);

    var featureLayer_PortageTrail = new FeatureLayer("http://services.arcgis.com/vq6gDtLASJCfTxvY/arcgis/rest/services/Bwca/FeatureServer/2", {});
    map.addLayer(featureLayer_PortageTrail);

    var featureLayer_Campsite = new FeatureLayer("http://services.arcgis.com/vq6gDtLASJCfTxvY/arcgis/rest/services/Bwca/FeatureServer/1", {});
    map.addLayer(featureLayer_Campsite);

    var infoTemplate = new InfoTemplate("${NAME}", "Entry Point Number:  ${ENTRY_NUMBER:NumberFormat}");
    var featureLayer_EntryPoint = new FeatureLayer("http://services.arcgis.com/vq6gDtLASJCfTxvY/arcgis/rest/services/Bwca/FeatureServer/0", {
        outFields: ["*"],
        infoTemplate: infoTemplate
    });

    map.addLayer(featureLayer_EntryPoint);

    //Add Map widgets
  var toggle = new BasemapToggle({
        map: map,
        basemap: "satellite"
    }, "BasemapToggle");
    toggle.startup();

    var overviewMapDijit = new OverviewMap({
        map: map,
        visible: true
    });
    overviewMapDijit.startup();

 var s = new Search({
            map: map
         }, "search");
         s.startup();

});