function EventDispatcherCreate(obj) {
    //ci pridanie fumkcionality kazdemu objektu resp. na co konkretne je potrebne dispatcher pouzit
    obj.eventhandlers = [];

    obj.on = function(eventType, fun) {
        var self = this;
        if (fun) {
            obj.eventhandlers.push({
                eventType: eventType,
                fun: fun
            })
        } else {
            var toRemove = obj.eventhandlers.filter(function(d) {
                return d.eventType == eventType
            });
            toRemove.forEach(function(handler) {
                var removeIndex = obj.eventhandlers.indexOf(handler);
                self.eventhandlers.splice(removeIndex, 1);
            });
        }
    }
    obj.dispatch = function(eventType, arg) {
        var toDispatch = obj.eventhandlers.filter(function(d) {
            return d.eventType == eventType
        });
        toDispatch.forEach(function(handler) {
            handler.fun(arg);
        });
    }
}

var rhvr = {
    DataProvider: function(options) {;
    },
    Core: function() {
        if (rhvr.Core.instance != null)
            return rhvr.Core.instance;

        rhvr.Core.instance = this;
        var self = this;

        this.constructor = function() {
            this._instance = this;
            this.queue = [];
            this.visItems = [];
        }
        this.init = function() {
            this.run();
        }
        this.run = function() {
            this.runInterval = setInterval(
                function() {
                    if (typeof self.queue !== 'undefined' && self.queue.length > 0) {
                        var d = self.queue.shift();
                        self.task(d);
                    }
                },
                100 // 0.1sec
            );
        }
        this.task = function(d) {
            this.visItems.forEach(function(item) {
                item.update(d);
            });
        }
        this.setDataProvider = function(provider) {
            this.dataProvider = provider;
            this.dataProvider.on("recdata", function(e) {
                self._newData(e.arg)
            })
        }
        this.addToQueue = function(arg) {
            this.queue.push(arg);
        }
        this._newData = function(dataArg) {
            this.queue.push(dataArg);
        }
        this.addsVis = function(vis) {
            this.visItems.push(vis)
        }
        this.constructor();
    },

    Visualisation: function(settings) {
        var self = this;
        var manager;
        var loader;
        var gltf;
        var scene;
        var mixer = null;
        var settings;
        var animations;
        var controls;
        var renderer;
        var camera;
        var animationNames;
        var cameraNames;
        var object3DNames;
        var initSuccess;
        var clock;
        var stats;
        var isStats;
        // var settings = {
        // 	htmlEl: "",
        // 	specModel: null,
        // 	scene3d: "", //URL objektu v docs
        // 	sceneNewThree: null //odkaz na scenu do initu EDIT:uz nie
        // }

        this.updateTimeScale = function(anims, timeScale) {
            if (anims && anims.length) {
                for (let i = 0; i < anims.length; i++) {
                    var thisAnim = self.mixer.clipAction(anims[i]);
                    thisAnim.timeScale = timeScale;
                    thisAnim.play();
                }
            }
        }
        this.getCameraByName = function(camName) {
            var cams = [];
            camName.forEach(function(item, index) {
                console.log(cameraNames[index])
                cams[index] = self.gltf.cameras[self.cameraNames.indexOf(item)];
            });
            return cams;
        }
        this.getAnimationByName = function(animName) {
            var anims = [];
            animName.forEach(function(item, index) {
                anims[index] = self.animations[self.animationNames.indexOf(item)];
            });
            return anims;
        }
        this.get3DObjectByName = function(object3D) {
            var objects3D = [];
            object3D.forEach(function(item, index) {
                objects3D[index] = self.gltf.scene.children[self.object3DNames.indexOf(item)];
            });
            return objects3D;
        }
        this.jumpToAnimationPercent = function(anims, percent) {
            if (anims && anims.length) {
                for (let i = 0; i < anims.length; i++) {
                    var jumpTime = (anims[i].duration / 100) * percent;
                    var thisAnim = self.mixer.clipAction(anims[i]);
                    thisAnim.timeScale = 0;
                    thisAnim.time = jumpTime;
                    thisAnim.play();;
                }
            }
        }

        this.constructor = function(settings) {
            //console.log("vis.constructor()")
            self.settings = settings;
            console.log("settings:" + settings + "this.settings:" + this.settings)
            rhvr.Core.instance.addsVis(self);
            // this.settings.scene3d=settings[2];
        }
        
        this.constructor(settings);

        this.init = function() {
        	self.isStats = false;
            self.animationNames = [];
            self.cameraNames = [];
            self.object3DNames = [];
            self.scene = new THREE.Scene();
            self.renderer = renderer = new THREE.WebGLRenderer();
            self.manager = new THREE.LoadingManager();
            self.manager.onProgress = function(item, loaded, total) {
                console.log(item, loaded, total);
            };

            self.loader = new THREE.GLTFLoader();
            self.loader.setCrossOrigin('anonymous'); // r84 以降は明示的に setCrossOrigin() を指定する必要がある
            let scale = 5.0;
            var url = self.settings.gltfModel;

            self.loader.load(url, function(data) {
                    self.clock = new THREE.Clock();
                    console.log("URL inside loader.load() in library RHVR:" + url);
                    self.gltf = data;
                    object = self.gltf.scene;
                    object.scale.set(scale, scale, scale);
                    object.position.y = 0;
                    object.position.x = 0;
                    object.castShadow = true;
                    object.receiveShadow = true;
                    self.animations = self.gltf.animations;
                    self.mixer = new THREE.AnimationMixer(object)
                    for (i = 0; i < self.gltf.animations.length; i++) {
                        self.animationNames[i] = self.animations[i].name;
                    }
                    for (i = 0; i < self.gltf.cameras.length; i++) {
                        self.cameraNames[i] = self.gltf.cameras[i].name;
                    }
                    for (i = 0; i < self.gltf.scene.children.length; i++) {
                        self.object3DNames[i] = self.gltf.scene.children[i].name;
                    }
                    // // self.updateAnimation();	

                    // updateAnimation();	//treba prekopat...nasa funkcia, ktora pouziva mixer - zatial animuje iba koleso
                    //ale mozno netreba updatovat, kedze to je este len init a update sa bude riesit
                    //po prijati dat a naslednom .run a .task, co vola .update

                    //var mesh = new THREE.Mesh( object, material );
                    // this.settings.sceneNewThree.add(object);

                    self.scene.add(object);

                    var fnrender = function() {
                    	if (self.isStats) self.stats.begin();
                        if (self.mixer) self.mixer.update(self.clock.getDelta());
                        self.controls.update();
                        self.renderer.render(self.scene, self.camera);
                        if (self.isStats) self.stats.end();

                        requestAnimationFrame(fnrender);
                    }

                    // var lastCalledTime;
                    // var fps;
                    // var tmp=0;
                    // var times=[];
                    // var framesFPS = 10;
                    // function requestAnimFrame() {
					
					//   if(!lastCalledTime) {
					//      lastCalledTime = performance.now();
					//      fps = 0;
					//      return;
					//   }
					//   delta = (performance.now() - lastCalledTime)/1000;
					//   lastCalledTime = performance.now();
					//   fps = 1/delta;
					  
					//   if (framesFPS<20) {
					//     times.push(fps);  
					//     framesFPS++;
					//   }
					//   else{
					//     var sum = 0;
					//     for( var i = 0; i < times.length; i++ ){
					//         sum += parseInt( times[i], 10 ); //don't forget to add the base
					//     }
					
					//     var avg = sum/times.length;
					//     document.getElementById('fps').innerHTML = Math.round(avg);
					//     framesFPS=0;
					//   }
					// }

                    try	{
                    	self.stats = new Stats();
	                    self.stats.setMode(0);
	                    self.stats.domElement.style.position = 'absolute';
	                    self.stats.domElement.style.left = null;
	                    self.stats.domElement.style.right = '0';
	                    self.stats.domElement.style.top = '0';
	                    $(settings.container).append(self.stats.domElement);
	                    self.isStats = true;
                    }
                    catch(e) {
                    	console.error('Stats library not found. Please include Stats library for FPS counter.\n'+e);
                    	self.isStats = false;
                    }

                    width = window.innerWidth - 200;
                    height = window.innerHeight - 200;

                    let ambient = new THREE.AmbientLight(0x101030);
                    self.scene.add(ambient);

                    // const light = new THREE.SpotLight(0xFFFFFF, 2, 100, Math.PI / 4, 8);
                    // light.position.set(10, 25, 25);
                    // light.castShadow = true;
                    // self.scene.add(light);

                    self.camera = new THREE.PerspectiveCamera(60, width / height, 0.01, 10000);
                    //camera.position.set(1, 5, 30);
                    self.camera.position.set(40, 10, 30);


                    /* GROUND SCENE */
                    let geometry = new THREE.BoxGeometry(100, 5, 100);
                    let material = new THREE.MeshBasicMaterial({
                        color: "#282B2A"
                    });

                    let ground = new THREE.Mesh(geometry, material);
                    ground.position.y -= 5;
                    ground.receiveShadow = true;
                    self.scene.add(ground);

                    /* RESIZE WINDOW */
                    window.addEventListener('resize', function() { // resize
                        var WIDTH = window.innerWidth,
                            HEIGHT = window.innerHeight;
                        self.renderer.setSize(WIDTH, HEIGHT);
                        self.camera.aspect = WIDTH / HEIGHT;
                        self.camera.updateProjectionMatrix();
                    });

                    /* AXES HELPER */
                    let axis = new THREE.AxesHelper(1000);
                    self.scene.add(axis);


                    //renderer.setClearColor( 0xbfe4ff );
                    self.renderer.setClearColor(0xbfe4ff);
                    self.renderer.shadowMap.enabled = true;


                    /* ORBIT CONTROLS */
                    self.controls = new THREE.OrbitControls(self.camera, self.renderer.domElement);
                    self.controls.userPan = false;
                    self.controls.userPanSpeed = 0.0;
                    self.controls.maxDistance = 5000.0;
                    self.controls.maxPolarAngle = Math.PI * 0.495;
                    //controls.autoRotate = true;
                    self.controls.autoRotate = false;
                    self.controls.autoRotateSpeed = -2.0;

                    self.renderer.setSize(width, height);
                    self.renderer.gammaOutput = true;
                    $(settings.container).append(self.renderer.domElement);


                    requestAnimationFrame(fnrender);
                    self.settings.specModel.init(self);
                    self.initSuccess = true;
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
        this.update = function(d) {
            var spec = self.settings.specModel; /// specifikovat strukturu specModel
            if (self.initSuccess) spec.update(d, self);
            // spec.table.forEach(function(specItem) 
            // {
            // 	/*
            // 		Tato funckcia by sa mala volat v kazdej vizualicacii ak pridu nove data, ktore su osetrene este frontov ktora sa spracuvava v Core.run
            // 		specItem by mal mat ciastkovu aktualizacnu konkretnu funkciu na prislusne hodnoty z dat a mala by sa na zaklade hodnoty animovat urita cast modelu napr. tocenie kolies, otocenie solarneho panelu ... atd  

            // 	 */
            // });
            // if(spec.hasOwnProperty('VehicleSpeed')){
            // 	spec.VehicleSpeed(d)
            // }
        }
    }
};
EventDispatcherCreate(rhvr.Core);
EventDispatcherCreate(rhvr.Visualisation);
EventDispatcherCreate(rhvr.DataProvider);