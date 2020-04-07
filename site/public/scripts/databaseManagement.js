'use strict';

console.log("Setting up app...");

function KatMap(){
   this.filters = {
   type: '',
   updated: ''
   };
   
   this.dialogs = {};
   
   this.app = firebase.initializeApp(config);
   
   var that = this;
   
   firebase.firestore().enablePersistence()
   .then(function() {
	    return firebase.auth().signInAnonymously();
	    }).catch(function(err) {
			   console.log(err);
			   });
   
/*   firebase.firestore(this.app).collection("facilities")//.where("verified", "==", true)
   .get()
   .then(that.makeMyMap);
   */
   var dbRef = firebase.database().ref('1EGZA6sD7G4gvWPjp3olYySHcpPRDJoDB1rM1xAYp_y0');
   dbRef.on('value', function(data) {
		  var myList = [];
		  data.forEach(function(v){
					if(typeof v.val() !== 'undefined')
					  myList.push(v.val());
					});
		  that.makeMyMap(myList[0]);
   });

}



KatMap.prototype.data = {
types: [
	   'bakery',
	   'butcher',
	   'cash_and_carry',
	   'deli',
	   'frozen_food',
	   'greengrocer',
	   'health_food',
	   'newsagent',
	   'seafood',
	   'supermarket',
	   'wholesale'
	   ]
};

window.onload = function() {
   window.app = new KatMap();
};
