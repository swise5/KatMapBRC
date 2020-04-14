'use strict';

console.log("Setting up app...");

function KatMap(){

	this.databasePathname = '1EGZA6sD7G4gvWPjp3olYySHcpPRDJoDB1rM1xAYp_y0/Sheet1';

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
	})
	.then(function(){
		that.initTemplates();
		that.initRouter();
	})
	.catch(function(err) {
		console.log(err);
	});

/*   firebase.firestore(this.app).collection("facilities")//.where("verified", "==", true)
   .get()
   .then(that.makeMyMap);
   */
   /*
   CORRECT GOOD WORKING ONE
   var dbRef = firebase.database().ref('1EGZA6sD7G4gvWPjp3olYySHcpPRDJoDB1rM1xAYp_y0/Sheet1');
   dbRef.on('value', function(data) {
		  var myList = [];
		  data.forEach(function(v){
					if(typeof v.val() !== 'undefined')
					  myList.push(v.val());
					});
		  that.makeMyMap(myList);
   });
   */
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


KatMap.prototype.initTemplates = function() {
	this.templates = {};

	var that = this;

	// query all .template elements in the document and add them with their id to the list of templates
	document.querySelectorAll('.template').forEach(function(t) {
		that.templates[t.getAttribute('id')] = t;
	});
}

KatMap.prototype.baseView = function(){
	var that = this;

	var myHolder = document.querySelector('.mapHolder');
	myHolder.innerHTML = "<div id='new-leaflet-friend' style='height: 70vh; border: 1px solid #AAA;'></div><div id='summaryLabel'></div>"

	var dbRef = firebase.database().ref(that.databasePathname);
	dbRef.on('value', function(data) {
		var myList = [];
		data.forEach(function(v){
			if(typeof v.val() !== 'undefined')
				myList.push(v.val());
		});
		that.makeMyMap(myList);
	});
}

KatMap.prototype.tableView = function(){
	var that = this;

	var dbRef = firebase.database().ref(that.databasePathname);
	dbRef.on('value', function(data) {
		var myList = [];
		data.forEach(function(v){
			if(typeof v.val() !== 'undefined')
				myList.push(v.val());
		});
		that.makeTableView(myList);
//		that.makeMyMap(myList);
	});
	//document.querySelector('.mapHolder').innerHTML = mytable;
}

KatMap.prototype.rerender = function() {
	this.router.navigate(document.location.pathname + '?' + new Date().getTime());
};


KatMap.prototype.initRouter = function() {
	this.router = new Navigo();

	var that = this;
	this.router
	.on({
		'/': function() {
			that.baseView();
		}
	})
	.on({
		'/tableview': function() {
			that.tableView();
		}
	})
	.resolve();


};

KatMap.prototype.getCleanPath = function(dirtyPath) {
	if (dirtyPath.startsWith('/index.html')) {
		return dirtyPath.split('/').slice(1).join('/');
	} else {
		return dirtyPath;
	}
};

KatMap.prototype.getFirebaseConfig = function() {
	return firebase.app().options;
};