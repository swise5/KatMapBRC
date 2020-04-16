'use strict';

console.log("setting up map...");

function resetMyMarker(marker, radius, strokeBool){
	marker.setRadius(radius);
	marker.setStyle({stroke: strokeBool});
	marker.redraw();
}

KatMap.prototype.makeMyMap = function(jsons){

   //
   // HELPER FUNCTIONS
   //

   var selectedRadius = 10;
   var normalRadius = 7;

   // handle click events on stores
   function storeOnClick(e){
	  // reset existing selection, if it exists
	  if (selection) {
	  	//selection.setIcon(storeIcon);
	  	resetMyMarker(selection, normalRadius, true);
	  }

	  // select new element!
	  resetMyMarker(e.target, selectedRadius, true);
	  //e.target.setIcon(storeSelectedIcon);
	  selection = e.target;

	  // Insert some HTML with the feature name
	  buildSummaryLabel(e.target);

	  // stop click event from being propagated further
	  L.DomEvent.stopPropagation(e);
	}

    // function to build the HTML for the summary label using the selected feature's "name" property
    function buildSummaryLabel(currentFeature){

    	var featureSurveyDate;
/*    	var featureName = currentFeature.properties.name || "Unnamed feature";
    	var featureUpdated = currentFeature.properties.updated || "No update data provided";
    	var featureWebsite = currentFeature.properties.storewebsite || "No data";
    	var featurePhone = currentFeature.properties.storephone || "No data";
*/

    	var summaryLabelDiv = document.getElementById("summaryLabel");//informationSection");
    	console.log(summaryLabelDiv);
    	console.log(document);
    	var summaryLabelFirstChild = summaryLabelDiv.children[0];
    	//var mysummaryLabelDiv = summaryLabelDiv.childNodes;

    	var storeNode = document.createElement("p");
    	for(var i in currentFeature.properties){
//    		console.log(i, currentFeature.properties[i]);
			var myAttr = i + ": " + currentFeature.properties[i];
    		storeNode.appendChild(document.createTextNode(myAttr));
    		storeNode.appendChild(document.createElement("br"));
    	}

    	if(summaryLabelFirstChild !== undefined) {
    		summaryLabelDiv.removeChild(summaryLabelFirstChild);
	    	summaryLabelDiv.appendChild(storeNode);// + "<div id='editStoresButton'></div><div id='editSection'></div>"; //+ '<br>Source: ' + featureSurveyDate + '</p>';
    	}
	    else
	    	summaryLabelDiv.appendChild(storeNode);

	    summaryLabelDiv.setAttribute("style", "column-count: 3; text-align: left");

/*	  var updateButton = document.getElementById('editStoresButton');
	  updateButton.innerHTML = '<input type="button" value="Edit">';
	  updateButton.addEventListener('click', editStore);
	*/
	};

   // edit and update the store information
   function editStore(e){
   	if(selection != null){

	    // center on the store
	    map.flyTo(selection.location, 15);
	    
	    // pull down the latest information from that store
	    var store = selection.properties;

	    var storeName = store['name'], website = store['storewebsite'], phone = store['storephone'];
	    
	    var inputForm = "<form name='updatedStoreInfoForm' id='updatedStoreInfoForm'>";
	    inputForm += "<b>Name:</b> <input type='text' id='storename' name='storename' placeholder='" + storeName + "'><br>";
	    inputForm += "<b>Website:</b> <input type='text' id='storewebsite' name='storewebsite' placeholder='" + website + "'><br>";
	    inputForm += "<b>Phone:</b> <input type='text' id='storephone' name='storephone' placeholder='" + phone + "'><br>";
	    inputForm += "<b>Hours:</b> <input type='text' id='hours' name='hours' placeholder='" + store['hours'] + "'><br>";
	 //   inputForm += "<input type='button' id='saveStoreButton' value='SAVE NEW INFO'>";

	 inputForm += "</form>";
	 document.getElementById('editSection').innerHTML = inputForm;

/*	    var updateButton = document.getElementById('saveStoreButton');
	    updateButton.addEventListener('click', updateStore);
	    */

	}
	else {
		console.log("ERROR: no store selected for update");
	}
}

function updateStore(){
	console.log("I'M IN UPDATE STORE");

	var myKey = selection.properties.key;
	var storeRef = firebase.firestore().collection('facilities').doc(myKey);

	var formInfo = document.getElementById('updatedStoreInfoForm');
	console.log(formInfo);

	var newValue = {};
	for (var x=0, y=formInfo.elements.length; x < y; x++) {
		var field = formInfo.elements[x];
		if (field.name && field.type !== "submit") {
			newValue[encodeURIComponent(field.name)] = (field.type == "radio" || field.type == "checkbox" ? (field.checked == "checked") : encodeURIComponent(field.value));
		}
	}

	storeRef.update(newValue).then(function(){
		console.log("Successful update!");
	});
	 //db.add(newValue);
	};


   // SET UP HOLDERS
   var selection;
   
   var storeTypeLayers = {};
   
   // STYLE THINGS
   var storeIcon = L.icon({
   	iconUrl: 'images/store_transparent.png',
   	iconSize: [20,20]
   });
   
   var storeSelectedIcon = L.icon({
   	iconUrl: 'images/store_transparent_red.png',
   	iconSize: [20,20]
   });

    // SET UP THE MAP

    var map = L.map('new-leaflet-friend', {
    	center: [51.3678764,-0.1173447],
    	zoom: 13
    });
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {}).addTo(map);

   // handle clicks on the map that didn't hit a feature
   map.addEventListener('click', function(e) {
   	if (selection) {
   		//selection.setIcon(storeIcon);
   		resetMyMarker(selection, normalRadius, false);
   		
   		selection = null;
   		var myNode = document.createElement("p");
   		myNode.appendChild(document.createTextNode("Click a store on the map to get more information."));
   		document.getElementById('summaryLabel').appendChild(myNode);
   	}
   });
   
   var myList = [];
   
 //  pal <- colorFactor(c("navy", "red"), domain = c("Aldi", "Iceland", "Tesco", "Sainsburys", "Waitrose", "Lidl", "M&S", "Budgens", "Co-op", "INDEPENDENT", "Sainsbury's", "Londis,", "Nisa", "CostCutter,", "Hathaways,", "Kandies", "McColl's,", "COOP,", "Brockley", "Best-one,", "Niazi", "Budgens,"))
 var brandColor = {"Aldi": "#882222", "Iceland": "#996666", "Tesco": "#333399", "Sainsburys": "#ff9900", "Waitrose": "#888822", "Lidl": "#888822", "M&S": "#888822", "Budgens": "#888822", "Co-op": "#888822", "INDEPENDENT": "#ffffff", "Sainsbury's": "#888822", "Londis,": "#888822", "Nisa": "#888822", "CostCutter,": "#888822", "Hathaways,": "#888822", "Kandies": "#888822", "McColl's,": "#888822", "COOP,": "#888822", "Brockley": "#888822", "Best-one,": "#888822", "Niazi": "#888822", "Budgens,": "#888822"};


 jsons.forEach(function(val){
			  var shop = val;//.data();
			  
			  var myBrand = val["Brand"];

//			  var shopMarker = L.marker([shop['Latitude'], shop['Longitude']], {icon: storeIcon}).on('click', storeOnClick);

var shopMarker = L.circleMarker([shop['Latitude'], shop['Longitude']], {radius: normalRadius, fillColor: brandColor[myBrand], fillOpacity: .75, weight: 1, stroke: true, color: 'black'}).on('click', storeOnClick);

shopMarker["properties"] = shop;
shopMarker["location"] = [shop['Latitude'], shop['Longitude']];
myList.push(shopMarker);
});
 var layerGroup = L.layerGroup(myList);
 layerGroup.addTo(map);


var gpsOptions = {
  enableHighAccuracy: true,
  timeout: 5000,
  maximumAge: 0
};

// https://developer.mozilla.org/en-US/docs/Web/API/Geolocation/getCurrentPosition
function success(pos) {
  var crd = pos.coords;

  console.log('Your current position is:');
  console.log(`Latitude : ${crd.latitude}`);
  console.log(`Longitude: ${crd.longitude}`);
  console.log(`More or less ${crd.accuracy} meters.`);
  var youMarker = L.circleMarker([crd.latitude, crd.longitude], {radius:selectedRadius, fillColor: "#FF0000", fillOpacity: 1.})
  var myLayer = L.layerGroup([youMarker]);
  myLayer.addTo(map);
}

function error(err) {
  console.warn(`ERROR(${err.code}): ${err.message}`);
}

navigator.geolocation.getCurrentPosition(success, error, gpsOptions);

}


KatMap.prototype.makeTableView = function(jsons){

	var myTable = document.createElement('table');
	//myTable.style.width='90%';
	myTable.style.minWidth = '500px';
	myTable.setAttribute('border', '1');
	myTable.style.overflow='scroll';
	myTable.style.margin='10px';

	var myTableBody = document.createElement('tbody');

	var displayCols = ['Name', 'Address', 'Phone number', 'Notes', 'Brand'];

	var headerTr = document.createElement('tr');
	for(var i in displayCols){
		var th = document.createElement('th');
		th.appendChild(document.createTextNode(displayCols[i]));
		headerTr.appendChild(th);
	}
	myTableBody.appendChild(headerTr);

	 jsons.forEach(function(val){
//	 	console.log(val);
	 	var tr = document.createElement('tr');
	 	for (var i in displayCols){
	 		var td = document.createElement('td');
	 		td.appendChild(document.createTextNode(val[displayCols[i]]));
	 		tr.appendChild(td);
	 	}
	 	tr.addEventListener("click", function(){
	 		alert(val["Name"]);
	 	});
	 	myTableBody.appendChild(tr);
	});

	myTable.appendChild(myTableBody);
	document.querySelector('.mapHolder').appendChild(myTable);

}

