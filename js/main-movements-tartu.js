//--- PART 1: ADDING BASE MAPS AND SCALE BAR ---

// variable for the map
var map = L.map('map', {
	center: [58.4, 26.7],
	zoom: 10
});

var esri = L.esri.basemapLayer('DarkGray');
	esri.addTo(map);

L.control.scale({imperial:false, position:'bottomright'}).addTo(map);

//--- PART 2: ADDING ANIMATION OF OD MATRIX WITH VARIABLE geoJsonFeatureCollection  ---
var oneToManyFlowmapLayer = L.canvasFlowmapLayer(geoJsonFeatureCollection, {
	originAndDestinationFieldIds: {
			originUniqueIdField: 'start_kant_id',
			originGeometry: {
				x: 'x_origin',
				y: 'y_origin'
			},
			destinationUniqueIdField: 'end_kant_id',
			destinationGeometry: {
				x: 'x_dest',
				y: 'y_dest'
			}
	},
	canvasBezierStyle: {
		type: 'classBreaks',
		field: 'RegularMovers',
		classBreakInfos: [{
			classMinValue: 0,
			classMaxValue: 24,
			symbol: {
				strokeStyle: '#fee8c8',
				lineWidth: 0.5,
				lineCap: 'round',
				shadowColor: '#fee8c8',
				shadowBlur: 2.0
			}
		}, {
			classMinValue: 25,
			classMaxValue: 100,
			symbol: {
				strokeStyle: '#fdbb84',
				lineWidth: 1.5,
				lineCap: 'round',
				shadowColor: '#fdbb84',
				shadowBlur: 2.0
			}
		}, {
			classMinValue: 101,
			classMaxValue: 10000000,
			symbol: {
				strokeStyle: '#e34a33',
				lineWidth: 3,
				lineCap: 'round',
				shadowColor: '#e34a33',
				shadowBlur: 2.0
			}
		}],
		defaultSymbol: {
			strokeStyle: '#e7e1ef',
			lineWidth: 0.5,
			lineCap: 'round',
			shadowColor: '#e7e1ef',
			shadowBlur: 1.5
		},
	},
	pathDisplayMode: 'selection',
	animationStarted: true
}).addTo(map);

// Selection for dispaly
oneToManyFlowmapLayer.on('mouseover', function(e) {
 if (e.sharedOriginFeatures.length) {
	oneToManyFlowmapLayer.selectFeaturesForPathDisplay(e.sharedOriginFeatures, 'SELECTION_NEW');
 }
 if (e.sharedDestinationFeatures.length) {
	oneToManyFlowmapLayer.selectFeaturesForPathDisplay(e.sharedDestinationFeatures, 'SELECTION_NEW');
 }
});

oneToManyFlowmapLayer.selectFeaturesForPathDisplayById('start_kant_id', 673, true, 'SELECTION_NEW');

//PART 3. ADDING A LEGEND WITH COLORS

function getColor(d) {
return d > 100  ? '#e34a33' :
       d > 24   ? '#fdbb84' :
                '#fee8c8' ;
}

var legendcolor = L.control({position: 'bottomright'});

legendcolor.onAdd = function (map) {
	 var div = L.DomUtil.create('div', 'info legend'),
			 grades = [0, 24, 100],
			 labels = [];
			 // loop through our density intervals and generate a label with a colored square for each interval
			     for (var i = 0; i < grades.length; i++) {
			         div.innerHTML +=
			         '<i class ="line" style="background:' + getColor(grades[i] + 1) + '"></i> ' +
			         grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');

			           }    return div;
			    };
legendcolor.addTo(map);
