function EventDispatcherCreate(obj)
{
	//ci pridanie fumkcionality kazdemu objektu resp. na co konkretne je potrebne dispatcher pouzit
	obj.eventhandlers =  [];
	
	obj.on = function(eventType,fun)
	{
		
		var self = this;
		if(fun)
		{
			obj.eventhandlers.push({
				eventType: eventType,
				fun: fun
			 })	
		}
		else
		{
			var toRemove =  obj.eventhandlers.filter(function(d){ return d.eventType ==  eventType } );
			toRemove.forEach(function(handler){
				 
			
				var removeIndex = obj.eventhandlers.indexOf(handler);
				self.eventhandlers.splice(removeIndex,1);
					
				
			});
		}
	}
	obj.dispatch = function(eventType, arg)
	{
		var toDispatch =  obj.eventhandlers.filter(function(d){ return d.eventType ==  eventType } );
		toDispatch.forEach(function(handler){
					handler.fun(arg);				
		});
		
	}
}


let manager;
let loader;
let gltf;
let scene = new THREE.Scene();
let mixer = new THREE.AnimationMixer(object);

var rhvr = 
{
	
	DataProvider: function(options)
	{
		;
	},
	
	Core : function()
	{
		if(this._instance != null)
			return this._instance;
		 
		
		
		var self = this;
		
		this.constructor = function()
		{
			this._instance = this;
			this.queue = [];
			this.visItems = [];
			
			
		}
		this.init = function()
		{
			this.run();
		}
		this.run = function()
		{
			this.runInterval = setInterval(
				
				function(){
					
					if(typeof this.queue!=='undefined' && this.queue.length > 0)
					{
						var d = this.queue.shift();
						self.task(d);
					}
					
				},
				100 // 0.1sec
				
			);
		}
		this.task = function(d)
		{
			this.visItems.forEach(function(item){
				
				item.update(d);
			});
		}
		this.setDataProvider = function(provider)
		{
			this.dataProvider = provider;
			this.dataProvider.on("recdata",function(e){
			
				self._newData(e.arg)
				
			})
		}
		this.addToQueue = function(arg){
			this.queue.push(arg);
		}
		this._newData = function(dataArg)
		{
			this.queue.push(dataArg);
		}
		this.constructor();
		
		
	
	},
	
	Visualisation: function(settings)
	{
		
		var settings;
		// var settings = {
		// 	htmlEl: "",
		// 	specModel: null,
		// 	scene3d: "", //URL objektu v docs
		// 	sceneNewThree: null //odkaz na scenu do initu EDIT:uz nie
		// }
	 
				
		this.constructor = function(settings)
		{
			//console.log("vis.constructor()")
			this.settings = settings;
			// this.settings.scene3d=settings[2];
		}
				this.constructor(settings);
		this.init = function()
		{
			
			manager = new THREE.LoadingManager();
			manager.onProgress = function (item, loaded, total) {
				console.log(item, loaded, total);
			};
		
			loader = new THREE.GLTFLoader();
			loader.setCrossOrigin('anonymous'); // r84 以降は明示的に setCrossOrigin() を指定する必要がある

			let scale = 5.0;
			var url = this.settings[2];
			
			loader.load(url, function (data) {
				console.log("URL inside loader.load() in library RHVR:"+url);
		        gltf = data;
		        object = gltf.scene;
		        object.scale.set(scale, scale, scale);
		        object.position.y = 0;
		        object.position.x = 0;
		        object.castShadow = true;
				object.receiveShadow = true;
				animations=gltf.animations;
				updateAnimation();
				
		        // updateAnimation();	//treba prekopat...nasa funkcia, ktora pouziva mixer - zatial animuje iba koleso
		        					//ale mozno netreba updatovat, kedze to je este len init a update sa bude riesit
		        					//po prijati dat a naslednom .run a .task, co vola .update

		        //var mesh = new THREE.Mesh( object, material );
				// this.settings.sceneNewThree.add(object);
				
				scene.add(object);
			}
			// function ( xhr ) {

			// 	console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
		
			// },
			// // called when loading has errors
			// function ( error ) {
		
			// 	console.log( 'An error happened' );
		
			// }
			);

			
			//mixer = new THREE.AnimationMixer(mesh); //tuna si vytvorime mixer
			
		}
		this.update = function(d)
		{

			
			var spec =   this.settings[3]; /// specifikovat strukturu specModel
			// spec.table.forEach(function(specItem) 
			// {
				
				
			// 	/*
			// 		Tato funckcia by sa mala volat v kazdej vizualicacii ak pridu nove data, ktore su osetrene este frontov ktora sa spracuvava v Core.run
			// 		specItem by mal mat ciastkovu aktualizacnu konkretnu funkciu na prislusne hodnoty z dat a mala by sa na zaklade hodnoty animovat urita cast modelu napr. tocenie kolies, otocenie solarneho panelu ... atd  
				
			// 	 */
			// });
			if(spec.hasOwnProperty('VehicleSpeed')){
				spec.VehicleSpeed(d)
			}
		}
		
		
	}
	
};

function updateAnimation(){
			
	if (animations && animations.length) {
		for (let i = 0; i < animations.length; i++) {
			let animation = animations[i];
			mixer.clipAction(animation).timeScale = 0;
			mixer.clipAction(animation).play();
		}
	}
	
}

EventDispatcherCreate(rhvr.Core);
EventDispatcherCreate(rhvr.Visualisation);
EventDispatcherCreate(rhvr.DataProvider);



