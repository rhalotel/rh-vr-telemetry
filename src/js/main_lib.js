/*
    parse JSON
*/

let gltf = null;
let mixer = null;
let clock = new THREE.Clock();
let scene = new THREE.Scene()
let renderer = new THREE.WebGLRenderer();
let controls;
let camera;

let animations;
let object;

init();
animate();

const engine = new rhvr.Core();
engine.init();

var vehicleSpeed;
let truckURL = "https://raw.githubusercontent.com/rhalotel/rh-vr-telemetry/master/src/models/truck/triangle_faced.gltf";
const wheelVis = new rhvr.Visualisation(["container",vehicleSpeed,truckURL,scene]);
/*
    implementovat pridavanie vis do core cez dispatcher predpokladam
*/



var lastCalledTime;
var fps;
var tmp=0;
var times=[];
var frames = 10;

function requestAnimFrame() {

  if(!lastCalledTime) {
     lastCalledTime = performance.now();
     fps = 0;
     return;
  }
  delta = (performance.now() - lastCalledTime)/1000;
  lastCalledTime = performance.now();
  fps = 1/delta;
  
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

function init() {
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



    let manager = new THREE.LoadingManager();
    manager.onProgress = function (item, loaded, total) {
        console.log(item, loaded, total);
    };

    let loader = new THREE.GLTFLoader();
    loader.setCrossOrigin('anonymous'); // r84 以降は明示的に setCrossOrigin() を指定する必要がある


    // /* TRUCK SCENE */
    // let scale = 5.0;
    // let url = "https://raw.githubusercontent.com/rhalotel/rh-vr-telemetry/master/src/models/truck/triangle_faced.gltf";

    // loader.load(url, function (data) {
    //     gltf = data;
    //     object = gltf.scene;
    //     //var mesh = scene.children[ 3 ];
    //     object.scale.set(scale, scale, scale);
    //     object.position.y = 0;
    //     object.position.x = 0;
    //     object.castShadow = true;
    //     object.receiveShadow = true;
    //     updateAnimation();

    //     //var mesh = new THREE.Mesh( object, material );
    //     scene.add(object);
    // });


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