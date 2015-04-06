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
         
    "esri/graphic",
    "esri/symbols/SimpleMarkerSymbol",
    "esri/symbols/SimpleLineSymbol",
    "esri/symbols/SimpleFillSymbol",
    "esri/Color",
    "esri/InfoTemplate",
    "esri/tasks/query",
    "esri/geometry/Circle",
         
    "esri/renderers/UniqueValueRenderer",

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
      
  		Graphic,
      SimpleMarkerSymbol,
     	SimpleLineSymbol,
      SimpleFillSymbol,
     	Color,
      InfoTemplate,
      Query,
      Circle,
      
      UniqueValueRenderer,

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

    map.on("click", addRedPoint);


   map.on("load", function() {
        //after map loads, connect to listen to mouse move & drag events
        map.on("mouse-move", queryCampsites);
        map.on("mouse-drag", queryCampsites);
    });
  
  on(dom.byId("queryBurnAreas"), "click", queryBurnAreas);

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
var infoTemplate = new esri.InfoTemplate();
infoTemplate.setTitle("${NAME}");
infoTemplate.setContent( "<b>Entry Point Number:  <b>${ENTRY_NUMBER:NumberFormat}<br/>"
                             + "<b>Access Type: </b>${ACCESS_TYPE}<br/>");
  
    var featureLayer_EntryPoint = new FeatureLayer("http://services.arcgis.com/vq6gDtLASJCfTxvY/arcgis/rest/services/Bwca/FeatureServer/0", {
        outFields: ["*"],
        infoTemplate: infoTemplate
    });
  var defaultSymbol = new SimpleMarkerSymbol();
    defaultSymbol.setSize(14);
    defaultSymbol.setOutline(new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([255, 0, 0]), 1));
    defaultSymbol.setColor(new Color([255, 255, 255, 0.5]));


    var renderer = new UniqueValueRenderer(defaultSymbol, "ACCESS_TYPE");

    //add symbol for each possible value
    renderer.addValue("overnight paddle", new SimpleMarkerSymbol().setColor(new Color([255, 0, 0, 0.5])));
    renderer.addValue("day use motor", new SimpleMarkerSymbol().setColor(new Color([0, 255, 0, 0.5])));
    renderer.addValue("overnight", new SimpleMarkerSymbol().setColor(new Color([0, 0, 255, 0.5])));
    renderer.addValue("overnight hiking", new SimpleMarkerSymbol().setColor(new Color([255, 0, 255, 0.5])));


    featureLayer_EntryPoint.setRenderer(renderer);
    map.addLayer(featureLayer_EntryPoint);
  
  //graphics



    function addRedPoint(evt) {
        map.graphics.clear();
        var pointSymbol = new SimpleMarkerSymbol();
        pointSymbol.setSize(14);
        pointSymbol.setOutline(new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([255, 0, 0]), 1));
        pointSymbol.setColor(new Color([255, 0, 0, 0.25]));

        var graphic = new Graphic(evt.mapPoint, pointSymbol);
        map.graphics.add(graphic);
    }



// query campsites

    function queryCampsites(evt)
    {

        var symbol = new SimpleMarkerSymbol(
            SimpleMarkerSymbol.STYLE_CIRCLE,
            12,
            new SimpleLineSymbol(
                SimpleLineSymbol.STYLE_NULL,
                new Color([247, 34, 101, 0.9]),
                1
            ),
            new Color([207, 34, 171, 0.5])
        );
        featureLayer_Campsite.setSelectionSymbol(symbol);

        var circleSymb = new SimpleFillSymbol(
            SimpleFillSymbol.STYLE_NULL,
            new SimpleLineSymbol(
                SimpleLineSymbol.STYLE_SHORTDASHDOTDOT,
                new Color([105, 105, 105]),
                2
            ), new Color([255, 255, 0, 0.25])
        );
        var circle;
        circle = new Circle({
            center: evt.mapPoint,
            geodesic: true,
            radius: 3,
            radiusUnit: "esriMiles"
        });
        map.graphics.clear();
        map.infoWindow.hide();
        var graphic = new Graphic(circle, circleSymb);
        map.graphics.add(graphic);

        var queryCircle = new Query();
        queryCircle.geometry = circle.getExtent();
        //use a fast bounding box query. will only go to the server if bounding box is outside of the visible map
        featureLayer_Campsite.selectFeatures(queryCircle, FeatureLayer.SELECTION_NEW);

    }


//Ask questions of your data
    function queryBurnAreas(){

        var fieldsSelectionSymbol =
            new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,
                new SimpleLineSymbol(SimpleLineSymbol.STYLE_DASHDOT,
                    new Color([255, 0, 0]), 2), new Color([255, 255, 0, 0.5]));
        featureLayer_Fire.setSelectionSymbol(fieldsSelectionSymbol);
        //set up query
        var selectQuery = new Query();
        selectQuery.where = "FIRE_YEAR = 2010";

        featureLayer_Fire.selectFeatures(selectQuery, FeatureLayer.SELECTION_NEW);
    }

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