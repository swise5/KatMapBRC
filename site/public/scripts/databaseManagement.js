'use strict';

console.log("Setting up app...");

function KatMap(){
   this.filters = {
   type: '',
   updated: ''
   };
   
   this.dialogs = {};
   
   const config = {
   apiKey: "AIzaSyBaeFiKklF62XnAKM_UYPSJ86YRn0i293c",
   authDomain: "katmapbrc.firebaseapp.com",
   databaseURL: "https://katmapbrc.firebaseio.com",
   projectId: "katmapbrc",
   storageBucket: "katmapbrc.appspot.com",
   messagingSenderId: "7127005392",
   appId: "1:7127005392:web:3c2f4007ec6324665ec6d5",
   measurementId: "G-PEYEXJDWCR"
   };
   this.app = firebase.initializeApp(config);
   
   var that = this;
   
   firebase.firestore().enablePersistence()
   .then(function() {
	    return firebase.auth().signInAnonymously();
	    }).catch(function(err) {
			   console.log(err);
			   });
   
   firebase.firestore(this.app).collection("facilities")//.where("verified", "==", true)
   .get()
   .then(that.makeMyMap);
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
