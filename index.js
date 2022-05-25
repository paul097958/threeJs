let scene, camera, render, controls;

function init() {
    //make a scene
    scene = new THREE.Scene();
    // make a render
    render = new THREE.WebGLRenderer()
    render.setClearColor(0xEBE6E8, 1.0)
    render.setSize(window.innerWidth, window.innerHeight)
    render.shadowMap.enable = true
    // put it on the page
    document.body.appendChild(render.domElement);
    // use the help ------------------------------------------
    let axesHelper = new THREE.AxesHelper(5);
    scene.add(axesHelper);
    // make a light
    let pointLight = new THREE.PointLight(0xffffff)
    pointLight.position.set(10, 10, 10)
    scene.add(pointLight)
    // make a camera
    camera = new THREE.PerspectiveCamera(
        45,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );

    camera.position.set(10, 0, 10)
    camera.lookAt(scene.position)

    controls = new THREE.OrbitControls(camera, render.domElement);

    //controls.addEventListener( 'change', render ); // call this only in static scenes (i.e., if there is no animation loop)
  
    controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
    controls.dampingFactor = 0.05;
  
    controls.screenSpacePanning = false;
}


init()

class MakeTheShape {
    constructor() {
        let topGeometry = new THREE.BoxGeometry(5, 5, 5)
        let bottomGeometry = new THREE.BoxGeometry(2, 10, 2)
        let commonMaterial = new THREE.MeshStandardMaterial({
            color: 0xffffff
        })
        this.top = new THREE.Mesh(topGeometry, commonMaterial)
        this.top.position.set(0, 0, 0)
        this.bottom = new THREE.Mesh(bottomGeometry, commonMaterial)
        this.bottom.position.set(0, 7.5, 0)
        this.group = new THREE.Group()
        this.group.add(this.top)
        this.group.add(this.bottom)
    }
    anime() {
        this.group.rotation.y += 0.01
    }
}

function makeAFloor() {
    let planeGeometry = new THREE.PlaneGeometry(100, 100)
    let planeMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff })
    let plane = new THREE.Mesh(planeGeometry, planeMaterial)
    plane.rotation.x = -0.5 * Math.PI
    plane.position.set(0, -2.5, 0)
    scene.add(plane)
}
makeAFloor()


window.addEventListener('resize', function () {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    render.setSize(window.innerWidth, window.innerHeight)
})




let make = new MakeTheShape()
set()

function set() {
    make.anime()
    scene.add(make.group)
    requestAnimationFrame(set);
    controls.update()
    render.render(scene, camera)
}






