let scene, camera, renderer, controls, cube, world, sphereBody, groundBody;
function init() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );
    camera.position.set(10, 10, 10);
    camera.lookAt(scene.position);
    scene.add(camera);
    // make a light
    let light = new THREE.PointLight(0xffffff, 2);
    light.position.set(50, 100, 120);
    // make a light helper
    let helper = new THREE.PointLightHelper(light, 5);
    scene.add(helper);
    // make the shadow
    light.castShadow = true;
    scene.add(light);
    // make the helper
    let axesHelper = new THREE.AxesHelper(5);
    scene.add(axesHelper);
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = 2;
    document.body.appendChild(renderer.domElement);
    // make the control
    controls = new THREE.OrbitControls(camera, renderer.domElement);
}

function cannon() {
    world = new CANNON.World()
    world.gravity.set(0, -9.8, 0)
    // 碰撞偵測
    world.broadphase = new CANNON.NaiveBroadphase()

    let sphereShape = new CANNON.Sphere(5)
    let sphereCM = new CANNON.Material({
        color: 0x009100,
        wireframe: true
    })
    sphereBody = new CANNON.Body({
        mass: 5,
        shape: sphereShape,
        material: sphereCM,
        position: new CANNON.Vec3(0, 10, 0)
    })
    world.add(sphereBody)

    // 建立地板剛體
    let groundShape = new CANNON.Plane()
    let groundCM = new CANNON.Material()
    groundBody = new CANNON.Body({
        mass: 0,
        shape: groundShape,
        material: groundCM,
        position: new CANNON.Vec3(0, 0, 0)
    })
    // setFromAxisAngle 旋轉 x 軸 -90 度
    groundBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2)
    world.add(groundBody)

    let sphereGroundContact = new CANNON.ContactMaterial(groundCM, sphereCM, {
        friction: 0.5,
        restitution: 0.7
    })
    world.addContactMaterial(sphereGroundContact)
}

function floor() {
    let geometry = new THREE.PlaneGeometry(100, 100, 100);
    let material = new THREE.MeshLambertMaterial({
        color: 0xCF9E9E
    });
    let plane = new THREE.Mesh(geometry, material);
    plane.position.copy(groundBody.position)
    plane.rotation.x = -Math.PI / 2;
    plane.receiveShadow = true;
    scene.add(plane);
}

function square() {
    let geometry = new THREE.BoxGeometry(5, 5, 5);
    let material = new THREE.MeshPhongMaterial({
        color: 0xFF95CA,
        wireframe: true
    });
    cube = new THREE.Mesh(geometry, material);
    cube.position.set(0, 10, 0)
    cube.castShadow = true;
    scene.add(cube);
}

function squareAnimate() {
    cube.rotation.x += 0.01
    cube.rotation.y += 0.01
    cube.rotation.z += 0.01
}
let timeStep = 1.0 / 60.0

function animate() {
    world.step(timeStep)
    if (cube) {
        cube.position.copy(sphereBody.position)
        cube.quaternion.copy(sphereBody.quaternion)
    }
    requestAnimationFrame(animate);
    squareAnimate();
    renderer.render(scene, camera);
}

init()
cannon()
square()
floor()
animate()

window.onresize = () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
}