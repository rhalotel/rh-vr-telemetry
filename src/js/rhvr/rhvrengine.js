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
		if(rhvr.Core.instance != null)
			return rhvr.Core.instance ;
			
		rhvr.Core.instance = this;
		 
		
		
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
					
					if(typeof self.queue!=='undefined' && self.queue.length > 0)
					{
						var d = self.queue.shift();
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
		this.addsVis = function(vis)
		{
			this.visItems.push(vis)
		}
		this.constructor();
		
		
	
	},
	
	Visualisation: function(settings)
	{
		let manager;
		let loader;
		let gltf;
		let scene = new THREE.Scene();
		let mixer = null;
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
			rhvr.Core.instance.addsVis(this);
			
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
				this.mixer =  new THREE.AnimationMixer(object)
				updateAnimation();
				
		        // updateAnimation();	//treba prekopat...nasa funkcia, ktora pouziva mixer - zatial animuje iba koleso
		        					//ale mozno netreba updatovat, kedze to je este len init a update sa bude riesit
		        					//po prijati dat a naslednom .run a .task, co vola .update

		        //var mesh = new THREE.Mesh( object, material );
				// this.settings.sceneNewThree.add(object);
				
				scene.add(object);
				
				var fnrender  =  function() {
				   requestAnimationFrame(fnrender);
				    // if (mixer) mixer.update(clock.getDelta());
				    controls.update();
				    renderer.render(scene, camera);
				    requestAnimFrame();
				}
						
					var lastCalledTime;
					var fps;
					var tmp=0;
					var times=[];
					var framesFPS = 10;
					
					function requestAnimFrame() {
					
					  if(!lastCalledTime) {
					     lastCalledTime = performance.now();
					     fps = 0;
					     return;
					  }
					  delta = (performance.now() - lastCalledTime)/1000;
					  lastCalledTime = performance.now();
					  fps = 1/delta;
					  
					  if (framesFPS<20) {
					    times.push(fps);  
					    framesFPS++;
					  }
					  else{
					    var sum = 0;
					    for( var i = 0; i < times.length; i++ ){
					        sum += parseInt( times[i], 10 ); //don't forget to add the base
					    }
					
					    var avg = sum/times.length;
					    document.getElementById('fps').innerHTML = Math.round(avg);
					    framesFPS=0;
					  }
					   
					}
			
			
				width = window.innerWidth-200;
					    height = window.innerHeight-200;
					
					    let ambient = new THREE.AmbientLight(0x101030);
					    scene.add(ambient);
					
					    const light = new THREE.SpotLight(0xFFFFFF, 2, 100, Math.PI / 4, 8);
					    light.position.set(10, 25, 25);
					    light.castShadow = true;
					    scene.add(light);
					
					    camera = new THREE.PerspectiveCamera(60, width / height, 0.01, 10000);
					    //camera.position.set(1, 5, 30);
					    camera.position.set(40, 10, 30);
					
					
					    /* GROUND SCENE */
					    let geometry = new THREE.BoxGeometry(100, 5, 100);
					    let material = new THREE.MeshBasicMaterial({
					        color: "#282B2A"
					    });
					
					    let ground = new THREE.Mesh(geometry,material);
					    ground.position.y -= 5;
					    ground.receiveShadow = true;
					    scene.add(ground);
					
					    /* RESIZE WINDOW */
					    window.addEventListener('resize', function() { // resize
					      var WIDTH = window.innerWidth,
					          HEIGHT = window.innerHeight;
					      renderer.setSize(WIDTH, HEIGHT);
					      camera.aspect = WIDTH / HEIGHT;
					      camera.updateProjectionMatrix();
					    });
					
					    /* AXES HELPER */
					    let axis = new THREE.AxesHelper(1000);
					    scene.add(axis);
					
					    
					    //renderer.setClearColor( 0xbfe4ff );
					    renderer.setClearColor(0xbfe4ff);
					    renderer.shadowMap.enabled = true;
					
					
					    /* ORBIT CONTROLS */
					    controls = new THREE.OrbitControls(camera, renderer.domElement);
					    controls.userPan = false;
					    controls.userPanSpeed = 0.0;
					    controls.maxDistance = 5000.0;
					    controls.maxPolarAngle = Math.PI * 0.495;
					    //controls.autoRotate = true;
					    controls.autoRotate = false;
					    controls.autoRotateSpeed = -2.0;
					
					    renderer.setSize(width, height);
					    renderer.gammaOutput = true;
					    document.getElementById("container").appendChild(renderer.domElement);
	
	
						requestAnimationFrame(fnrender);
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



