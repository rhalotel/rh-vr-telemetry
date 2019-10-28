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
		 
		
		
		var self = t
		his;
		
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
					
					if(this.queue.length > 0)
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
		this._newData = function(dataArg)
		{
			this.queue.push(dataArg);
		}
		this.constructor();
		
		
	
	},
	
	Visualisation: function(settings)
	{
		
		var settings = [];
		// var settings = {
		// 	htmlEl: ...,
		// 	specModel: ...,
		// 	scene3d: ..., //URL objektu v docs
		// 	sceneNewThree: .... //odkaz na scenu do initu
		// }
	 
		let gltf = null;
		
		
		this.constructor = function(settings)
		{
			//console.log("vis.constructor()")
			 this.settings = settings;
		}
		this.pisUz = function()
		{
			console.log("idzem");
		}
		this.init = function()
		{
			let scale = 5.0;
			// scene = new THREE.Scene();
			loader.load(this.settings[2], function (data) {
		        gltf = data;
		        object = gltf.scene;
		        object.scale.set(scale, scale, scale);
		        object.position.y = 0;
		        object.position.x = 0;
		        object.castShadow = true;
		        object.receiveShadow = true;
		        updateAnimation();	//treba prekopat...nasa funkcia, ktora pouziva mixer - zatial animuje iba koleso
		        					//ale mozno netreba updatovat, kedze to je este len init a update sa bude riesit
		        					//po prijati dat a naslednom .run a .task, co vola .update

		        //var mesh = new THREE.Mesh( object, material );
		        this.settings[3].add(object);
	    	});

			// renderer = new THREE.WebGLRenderer();
		    // renderer.setClearColor(0xbfe4ff);
		    // renderer.shadowMap.enabled = true;
			// document.getElementById(this.settings.htmlEl).appendChild(renderer.domElement);
			//mixer = new THREE.AnimationMixer(mesh); //tuna si vytvorime mixer
			
		}
		this.update = function(d)
		{

			
			var spec =   this.settings[1]; /// specifikovat strukturu specModel
			spec.table.forEach(function(specItem) 
			{
				
				
				/*
					Tato funckcia by sa mala volat v kazdej vizualicacii ak pridu nove data, ktore su osetrene este frontov ktora sa spracuvava v Core.run
					specItem by mal mat ciastkovu aktualizacnu konkretnu funkciu na prislusne hodnoty z dat a mala by sa na zaklade hodnoty animovat urita cast modelu napr. tocenie kolies, otocenie solarneho panelu ... atd  
				
				 */
			});
		}
		this.constructor(settings);
		
	}
	
};

EventDispatcherCreate(rhvr.Core);
EventDispatcherCreate(rhvr.Visualisation);
EventDispatcherCreate(rhvr.DataProvider);



