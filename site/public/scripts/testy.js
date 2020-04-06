'use strict';

console.log("setting up map...");

KatMap.prototype.makeMyMap = function(jsons){
   
   //
   // HELPER FUNCTIONS
   //

   // handle click events on stores
    function storeOnClick(e){
	  // reset existing selection, if it exists
	  if (selection) {
		selection.setIcon(storeIcon);
	  }
    
	  // select new element!
	  e.target.setIcon(storeSelectedIcon);
	  selection = e.target;
    
	  // Insert some HTML with the feature name
	  buildSummaryLabel(e.target);
    
	  // stop click event from being propagated further
	  L.DomEvent.stopPropagation(e);
    }
    
    // function to build the HTML for the summary label using the selected feature's "name" property
    function buildSummaryLabel(currentFeature){
    
	  var featureSurveyDate;
	  var featureName = currentFeature.properties.name || "Unnamed feature";
	  var featureUpdated = currentFeature.properties.updated || "No update data provided";
	  var featureWebsite = currentFeature.properties.storewebsite || "No data";
	  var featurePhone = currentFeature.properties.storephone || "No data";
	  
	  document.getElementById('summaryLabel').innerHTML =
	    '<p style="font-size:18px"><b>' + featureName +
	    '</b><br>Website: ' + featureWebsite +
	    '</b><br>Phone number: ' + featurePhone +
	    '</b><br>Updated: ' + featureUpdated +
	    "</p>" + "<div id='editStoresButton'></div><div id='editSection'></div>"; //+ '<br>Source: ' + featureSurveyDate + '</p>';
	  
	  var updateButton = document.getElementById('editStoresButton');
	  updateButton.innerHTML = '<input type="button" value="Edit">';
	  updateButton.addEventListener('click', editStore);
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
	    inputForm += "<input type='button' id='saveStoreButton' value='SAVE NEW INFO'>";
	    
	    inputForm += "</form>";
	    document.getElementById('editSection').innerHTML = inputForm;
	    
	    var updateButton = document.getElementById('saveStoreButton');
	    updateButton.addEventListener('click', updateStore);


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
				    selection.setIcon(storeIcon);
				    
				    selection = null;
				    document.getElementById('summaryLabel').innerHTML = '<p>Click a store on the map to get more information.</p>';
				    }
				    });
   
   var myList = [];
   
   jsons.forEach(function(val){
			  var shop = val;//.data();

			  var shopMarker = L.marker([shop['Latitude'], shop['Longitude']], {icon: storeIcon}).on('click', storeOnClick);
			  shopMarker["properties"] = {"name": shop["Name"], "type": shop["Type"], "osmID": shop["osmID"]};
			  shopMarker["location"] = [shop['Latitude'], shop['Longitude']];
			  myList.push(shopMarker);
			  });
   var layerGroup = L.layerGroup(myList);
   layerGroup.addTo(map);
   
   
   
   /*   // ADD DATA
    
    // ADD ALL LAYERS AND CREATE MENU
    
    // set up menu structure
    var selectShopTypes = "<div style='column-count: 3'><form>";
    
    // add each
    for(var k in storeTypeLayers){
    console.log(k);
    var layerGroup = L.layerGroup(storeTypeLayers[k]);
    layerGroup.addTo(map);
    
    var indexName = "storeType_" + k;
    selectShopTypes += "<label><input type=\"checkbox\" id=\"" + indexName + "\" name=\"shopType\"> " + k.replace(/_/g, " ") + "</input></label><br>";
    
    layersByName[indexName] = layerGroup;
    layersVisible[indexName] = true;
    
    //https://leafletjs.com/examples/layers-control/
    }
    
    var myButton = '<input type="button" value="Click me" onclick="myFunc()">';
    
    selectShopTypes += "</form></div>";
    
    selectShopTypes += myButton;
    
    document.getElementById('selectShopTypes').innerHTML = selectShopTypes;
    */
}

function myFunc(){
   
   var items=document.getElementsByName('shopType');
   for(var i=0; i<items.length; i++){
	 console.log(items[i]);
	 if(!(items[i].type=='checkbox')){
	    console.log("ERROR: WTF MATE, U AIN'T A CHECKBOX");
	 }
	 else {
	    var checked = items[i].checked;
	    var myId = items[i].id;
	    if(!(layersVisible[myId] === checked)){
		  if (checked)
			layersByName[myId].addTo(map);
		  else
			layersByName[myId].remove();
		  layersVisible[myId] = checked;
	    }
	 }
   }
   console.log(layersVisible);
   
};
