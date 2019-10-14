speedWheel = 0; //speed wheels on the truck

$(document).on("click", "#plus", function () {
    speedWheel++;
    updateAnimation();
});

$(document).on("click", "#minus", function () {
    speedWheel--;
    updateAnimation();
});

let gltf = null;
let mixer = null;
let clock = new THREE.Clock();
let controls;
let camera;

let animations;
let object;

init();
animate();

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
    width = window.innerWidth;
    height = window.innerHeight;

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

    let geometry = new THREE.BoxGeometry(100, 5, 100);
    let material = new THREE.MeshLambertMaterial({
        color: "#707070"
    });

    //let ground = new THREE.Mesh(geometry, material);
    //ground.position.y -= 15;
    //ground.receiveShadow = true;
    //scene.add(ground);

    let manager = new THREE.LoadingManager();
    manager.onProgress = function (item, loaded, total) {
        console.log(item, loaded, total);
    };

    let loader = new THREE.GLTFLoader();
    loader.setCrossOrigin('anonymous'); // r84 以降は明示的に setCrossOrigin() を指定する必要がある

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
    });

    let axis = new THREE.AxesHelper(1000);
    scene.add(axis);

    renderer = new THREE.WebGLRenderer();
    //renderer.setClearColor( 0xbfe4ff );
    renderer.setClearColor(0xffffff);
    renderer.shadowMap.enabled = true;

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
    document.body.appendChild(renderer.domElement);
}

function animate() {
    requestAnimationFrame(animate);
    if (mixer) mixer.update(clock.getDelta());
    controls.update();
    render();
}

function render() {
    renderer.render(scene, camera);
}