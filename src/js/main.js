var totalFuel = 0;
var fuelLevel1 = 0;
var Torque = 0;
var EngineHours = 0;
var EngineSpeed = 0;
var enginePercentLoad = 0;
var VehicleHDistance = 0;
var VehicleSpeed = 0;
var EngineCoolantTmp = 0;
var AmbientAirTemp = 0;
var breakPedalPosition = 0;
var combVeight = 0;

function parseJson () {
    var obj = jQuery.parseJSON( getJson() );
    console.log(obj);
    totalFuel = obj.fuelConsumption.TotalFuel * 0.001; //L
    fuelLevel1 = obj.dashDisplay.fuelLevel1 / 2.5; //%
    Torque = obj.eecTorqueSpeed.Torque - 125.0; //%
    EngineHours = obj.engineHours.EngineHours * 0.05; //s
    EngineSpeed = obj.eecTorqueSpeed.EngineSpeed * 0.125; //rpm
    enginePercentLoad = 0; // %
    VehicleHDistance = obj.vhdr.VehicleHDistance * 5.0 / 1000; //km
    VehicleSpeed = obj.tco1.VehicleSpeed / 256; //km/h
    EngineCoolantTmp = obj.engineTemp.EngineCoolantTmp - 40.0; //°C
    AmbientAirTemp = (obj.amb.AmbientAirTemp * 0.03125) - 273.0; //°C 
    breakPedalPosition = obj.electronicBreak.breakPedalPosition * 0.4; //%
    combVeight = obj.combWeight.combVeight;
}

parseJson();


speedWheel = 0; //speed wheels on the truck

$(document).on("click", "#plus", function () {
    speedWheel++;
    for (let i = 0; i < animations.length; i++) { // netreba robit updateanimation
        let animation = animations[i];
        mixer.clipAction(animation).timeScale = speedWheel;
    }
    //updateAnimation();
});

$(document).on("click", "#minus", function () {
    speedWheel--;
    for (let i = 0; i < animations.length; i++) {
        let animation = animations[i];
        mixer.clipAction(animation).timeScale = speedWheel;
    }
    //updateAnimation();
});


// let gltf = null;
let mixer = null;
let clock = new THREE.Clock();
let controls;
let camera;
//const myrhvr = new rhvr.Visualisation();

let animations;
let object;

init();
animate();

// function createStats() {
//       var stats = new Stats();
//       stats.setMode(0);

//       stats.domElement.style.position = 'absolute';
//       stats.domElement.style.left = '0';
//       stats.domElement.style.top = '0';

//       return stats;
// }

var lastCalledTime;
var fps;
var tmp=0;
var times=[];
var frames = 10;
const engine = new rhvr.Visualisation();

function requestAnimFrame() {

  if(!lastCalledTime) {
     lastCalledTime = performance.now();
     fps = 0;
     return;
  }
  delta = (performance.now() - lastCalledTime)/1000;
  lastCalledTime = performance.now();
  fps = 1/delta;
  // console.log(Math.round(fps));
  if (frames<20) {
    times.push(fps);  
    frames++;
  }
  else{
    var sum = 0;
    for( var i = 0; i < times.length; i++ ){
        sum += parseInt( times[i], 10 ); //don't forget to add the base
    }

    var avg = sum/times.length;
    document.getElementById('fps').innerHTML = Math.round(avg);
    frames=0;
  }
  
}

function updateAnimation() {
    animations = gltf.animations;
    
    if (animations && animations.length) {
        mixer = new THREE.AnimationMixer(object);
        for (let i = 0; i < animations.length; i++) {
            let animation = animations[i];
            mixer.clipAction(animation).timeScale = speedWheel;
            mixer.clipAction(animation).play();
        }
    }
}

function init() {
    width = window.innerWidth-200;
    height = window.innerHeight-200;

    scene = new THREE.Scene();
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



    let manager = new THREE.LoadingManager();
    manager.onProgress = function (item, loaded, total) {
        console.log(item, loaded, total);
    };

    let loader = new THREE.GLTFLoader();
    loader.setCrossOrigin('anonymous'); // r84 以降は明示的に setCrossOrigin() を指定する必要がある


    /* TRUCK SCENE */
    let scale = 5.0;
    let url = "https://raw.githubusercontent.com/rhalotel/rh-vr-telemetry/master/src/models/truck/triangle_faced.gltf";

    loader.load(url, function (data) {
        gltf = data;
        object = gltf.scene;
        //var mesh = scene.children[ 3 ];
        object.scale.set(scale, scale, scale);
        object.position.y = 0;
        object.position.x = 0;
        object.castShadow = true;
        object.receiveShadow = true;
        updateAnimation();

        //var mesh = new THREE.Mesh( object, material );
        scene.add(object);
    },
    function ( xhr ) {

        console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

    },
    // called when loading has errors
    function ( error ) {

        console.log( 'An error happened' );

    }
    );


    /* RESIZE WINDOW */
    window.addEventListener('resize', function() { // resize
      var WIDTH = window.innerWidth,
          HEIGHT = window.innerHeight;
      renderer.setSize(WIDTH, HEIGHT);
      camera.aspect = WIDTH / HEIGHT;
      camera.updateProjectionMatrix();
    });

    /* AXES HELPER */
    // let axis = new THREE.AxesHelper(1000);
    // scene.add(axis);

    renderer = new THREE.WebGLRenderer();
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

    // stats = new Stats();
    // stats.showPanel( 1 ); // 0: fps, 1: ms, 2: mb, 3+: custom
    // document.body.appendChild(stats.dom );
}



function animate() {
    requestAnimationFrame(animate);
    if (mixer) mixer.update(clock.getDelta());
    controls.update();
    render();
}

function render() {
    renderer.render(scene, camera);
    requestAnimFrame()
}




function getJson() {
    return `{
        "fuelConsumption": {
            "notUsed": 4294967295,
            "TotalFuel": 96939 
        },
        "dashDisplay": {
            "notUsed0": 255,
            "fuelLevel1": 149,
            "notUsed": {
                "FixedElementField": 255
            },
            "fuelLevel2": 255,
            "notUsed8": 255
        },
        "eecTorqueSpeed": {
            "notUsed": {
                "FixedElementField": 242
            },
            "Torque": 146,
            "EngineSpeed": 9857,
            "notUsed1": {
                "FixedElementField": 255
            }
        },
        "engineHours": {
            "EngineHours": 50969,
            "notUsed": 4294967295
        },
        "vehicleID": {
            "ch": {
                "FixedElementField": 0
            }
        },
        "fmsID": {
            "b1": 0,
            "SW": {
                "FixedElementField": 0
            },
            "notUsed2": {
                "FixedElementField": 0
            },
            "DiagSupport": 0,
            "RequestSupport": 0,
            "notUsed": 0
        },
        "vhdr": {
            "VehicleHDistance": 166991736,
            "VehicleTripDistance": 3828948
        },
        "tco1": {
            "b1": 75,
            "b2": 16,
            "b3": 192,
            "b4": 192,
            "ShaftSpeed": 12306,
            "VehicleSpeed": 22777,
            "Driver1WS": 3,
            "Driver2WS": 1,
            "MontionDetected": 1,
            "Driver1TimeRS": 0,
            "Driver1Card": 1,
            "VehiceOverspeed": 0,
            "Driver2TimeRS": 0,
            "Driver2Card": 0,
            "FMSTruckNotUsed": 3,
            "SystemEvent": 0,
            "HandlingInfo": 0,
            "TCOPerformance": 0,
            "DirectionIndicator": 3
        },
        "engineTemp": {
            "EngineCoolantTmp": 131,
            "notUsed": {
                "FixedElementField": 255
            }
        },
        "amb": {
            "notUsed1": {
                "FixedElementField": 194
            },
            "AmbientAirTemp": 9408,
            "notUsed": {
                "FixedElementField": 255
            }
        },
        "driverID": {
            "ascii": {
                "FixedElementField": 0
            }
        },
        "electronicBreak": {
            "notUsed": 0,
            "breakPedalPosition": 0,
            "notUsed1": {
                "FixedElementField": 243
            }
        },
        "eec14Fuel": {
            "notUsed": {
                "FixedElementField": 0
            },
            "fuelType": 0,
            "notUsed1": 0
        },
        "gasTotal": {
            "notUsed": {
                "FixedElementField": 0
            },
            "totalFuelGASUsed": 0
        },
        "driveEngagenment": {
            "notUsed": {
                "FixedElementField": 0
            },
            "b1": 0,
            "notUsed2": 0,
            "engageState": 0,
            "notUsed1": 0
        },
        "combWeight": {
            "notUsed": 0,
            "combVeight": 0,
            "notUsed2": 0
        },
        "axleTireWights": {
            "axleWeight00": 0,
            "axleWeight01": 0,
            "axleWeight10": 0,
            "axleWeight11": 0,
            "axleWeight12": 0,
            "axleWeight13": 0,
            "axleWeight20": 0,
            "axleWeight21": 0,
            "axleWeight22": 0,
            "axleWeight23": 0
        },
        "time": "2019-10-26T13:32:05.000Z"
    }`;
}