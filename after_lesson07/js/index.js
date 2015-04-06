var mapMain;
var widgetEditor;

// @formatter:off
require([
        "esri/map",
        "esri/layers/FeatureLayer",
        "esri/tasks/GeometryService",
        "esri/dijit/editing/Editor",
        "esri/dijit/editing/TemplatePicker",
        "esri/config",
  "esri/dijit/BasemapToggle",

        "dojo/ready",
        "dojo/parser",
        "dojo/on",
        "dojo/_base/array",

        "dijit/layout/BorderContainer",
        "dijit/layout/ContentPane"],
    function (Map, FeatureLayer, GeometryService, Editor, TemplatePicker, config, BasemapToggle,
              ready, parser, on, array,
              BorderContainer, ContentPane) {
// @formatter:on

        // Wait until DOM is ready *and* all outstanding require() calls have been resolved
        ready(function () {

            // Parse DOM nodes decorated with the data-dojo-type attribute
            parser.parse();

            /*
             * Step: Specify the proxy Url
             */
            //config.defaults.io.proxyUrl = "http://localhost/proxy/proxy.ashx";

            // Create the map
            mapMain = new Map("divMap", {
                basemap: "gray",
                center: [-80.8380, 35.2229],//35.2229° N, 80.8380° W
                zoom: 10
            });

            var flFirePoints, flFireLines, flFirePolygons;
            /*
             * Step: Construct the editable layers
             */
            flFirePoints = new FeatureLayer("http://services.arcgis.com/vq6gDtLASJCfTxvY/ArcGIS/rest/services/CharlotteDiscGolfCourses_EditingPlayground/FeatureServer/0", {
                outFields: ['*']
            });

            // Listen for the editable layers to finish loading
            mapMain.on("layers-add-result", initEditor);

            // add the editable layers to the map
            mapMain.addLayers([flFirePoints]);

            function initEditor(results) {

                // Map the event results into an array of layerInfo objects
                var layerInfosWildfire = array.map(results.layers, function (result) {
                    return {
                        featureLayer: result.layer
                    };
                });

                /*
                 * Step: Map the event results into an array of Layer objects
                 */
                var layersWildfire = array.map(results.layers, function (result) {
                    return result.layer;
                });

                /*
                 * Step: Add a custom TemplatePicker widget
                 */
                var tpCustom = new TemplatePicker({
                    featureLayers: layersWildfire,
                    columns: 2
                }, "divLeft");
                tpCustom.startup();

                /*
                 * Step: Prepare the Editor widget settings
                 */
                var editorSettings = {
                    map: mapMain,
                    geometryService: new GeometryService("http://sampleserver6.arcgisonline.com/arcgis/rest/services/Utilities/Geometry/GeometryServer"),
                    layerInfos: layerInfosWildfire,
                    toolbarVisible: true,
                    templatePicker: tpCustom,
                    createOptions: {
                        polygonDrawTools: [Editor.CREATE_TOOL_FREEHAND_POLYGON, Editor.CREATE_TOOL_RECTANGLE, Editor.CREATE_TOOL_TRIANGLE, Editor.CREATE_TOOL_CIRCLE]
                    },
                    toolbarOptions: {
                        reshapeVisible: true
                    },
                    enableUndoRedo: true,
                    maxUndoRedoOperations: 20
                };

                /*
                 * Step: Build the Editor constructor's first parameter
                 */
                var editorParams = {
                    settings: editorSettings
                };

                /*
                 * Step: Construct the Editor widget
                 */
                widgetEditor = new Editor(editorParams, "divTop");
                widgetEditor.startup();

            };
            //Add widget
    var toggle = new BasemapToggle({
        map: mapMain,
        basemap: "satellite"
    }, "BasemapToggle");
    toggle.startup();

        });
    });
