let scene, camera, render, controls, pointLight, points, world;
let moveStatus = true
function init() {
    //make a scene
    scene = new THREE.Scene();
    // make a render
    render = new THREE.WebGLRenderer({
        antialias: true
    })
    render.setClearColor(0xEBE6E8, 1.0)
    render.setSize(window.innerWidth, window.innerHeight)
    render.shadowMap.enabled = true
    render.shadowMap.type = 2
    // put it on the page
    document.body.appendChild(render.domElement);
    // use the help ------------------------------------------
    let axesHelper = new THREE.AxesHelper(5);
    scene.add(axesHelper);

    // make a camera
    camera = new THREE.PerspectiveCamera(
        45,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );

    camera.position.set(30, 10, 30)
    camera.lookAt(scene.position)

    controls = new THREE.OrbitControls(camera, render.domElement);
    controls.enableDamping = true
    controls.dampingFactor = 1

    let ambientLight = new THREE.AmbientLight(0x404040, 1)
    scene.add(ambientLight)
    // make a light
    pointLight = new THREE.PointLight(0xffffff, 2)
    pointLight.castShadow = true
    pointLight.position.set(50, 50, 0)
    scene.add(pointLight)
    // make the shadow type
    render.shadowMap.type = 2

    // 建立物理世界
    world = new CANNON.World()

    // 設定重力場為 y 軸 -9.8 m/s²
    world.gravity.set(0, -9.8, 0)

    // 碰撞偵測
    world.broadphase = new CANNON.NaiveBroadphase()

}


init()

class Fire {
    constructor() {
        this.geometry = new THREE.Geometry()
        let texture = new THREE.TextureLoader().load('./public/boom.jpg')
        this.material = new THREE.PointsMaterial({
            size: 5,
            map: texture,
            blending: THREE.AdditiveBlending,
            depthTest: false,
            transparent: true,
            opacity: 0.7
        })
    }
    makeFire() {
        for (let i = 0; i < 15000; i++) {
            let vertex = new THREE.Vector3(
                0,
                10,
                0
            )
            vertex.velocityX = THREE.Math.randFloat(-5, 5)
            vertex.velocityY = THREE.Math.randFloat(-5, 5)
            vertex.velocityZ = THREE.Math.randFloat(-5, 5)
            this.geometry.vertices.push(vertex)
        }
        this.points = new THREE.Points(this.geometry, this.material)
        scene.add(this.points)
    }
    makeAnime() {
        this.points.geometry.vertices.forEach(function (vertex) {
            vertex.y = vertex.y - vertex.velocityY
            vertex.x = vertex.x - vertex.velocityX
            vertex.z = vertex.z - vertex.velocityZ
        })
        this.points.geometry.verticesNeedUpdate = true
    }
}

class MakeTheShape {
    constructor() {
        let topGeometry = new THREE.BoxGeometry(5, 5, 5)
        let bottomGeometry = new THREE.BoxGeometry(2, 10, 2)
        let loader = new THREE.TextureLoader()
        let skin = loader.load('./public/brick.jpg')
        let commonMaterial = new THREE.MeshStandardMaterial({
            // color: 0xffffff,
            map: skin
        })
        this.top = new THREE.Mesh(topGeometry, commonMaterial)
        this.top.position.set(0, 0, 0)
        this.bottom = new THREE.Mesh(bottomGeometry, commonMaterial)
        this.bottom.position.set(0, 7.5, 0)
        this.group = new THREE.Group()
        this.group.add(this.top)
        this.group.add(this.bottom)
        this.group.traverse(function (object) {
            if (object instanceof THREE.Mesh) {
                object.castShadow = true
                object.receiveShadow = true
            }
        })
    }
    anime() {
        // make group go back and forth
        if (moveStatus) {
            this.group.position.y += 1
            if (this.group.position.y > 10) {
                moveStatus = false
            }
        } else {
            this.group.position.y -= 1
            if (this.group.position.y < 0) {
                moveStatus = true
            }
        }

    }
}

class makeTheCircle {
    constructor() {
        let sphereShape = new CANNON.Sphere(1)
        let sphereCM = new CANNON.Material()
        let sphereBody = new CANNON.Body({
            mass: 5,
            shape: sphereShape,
            position: new CANNON.Vec3(0, 10, 0),
            material: sphereCM
        })
        world.add(sphereBody)
    }
}

class makeALamp {
    constructor() {
        let lampGeometry = new THREE.SphereGeometry(13, 64, 32)
        let material = new THREE.MeshStandardMaterial({
            color: 0xF9F900
        })
        this.lamp = new THREE.Mesh(lampGeometry, material)
        this.lamp.position.set(110, 110, 0)
        this.status = 'front'
        this.lamp.traverse(function (object) {
            if (object instanceof THREE.Mesh) {
                object.castShadow = true
                object.receiveShadow = true
            }
        })
    }
}

function makeTheDonut() {
    const geometry = new THREE.TorusGeometry(3, 1, 16, 200);
    const material = new THREE.MeshBasicMaterial({ color: 0x000000 });
    const donut = new THREE.Mesh(geometry, material);
    donut.position.set(0, 20, 0)
    donut.rotation.x = -0.5 * Math.PI
    donut.castShadow = true
    scene.add(donut)
}
makeTheDonut()




function makeTheStar() {
    const geometry = new THREE.Geometry()

    const texture = new THREE.TextureLoader().load('./public/download.png')
    let material = new THREE.PointsMaterial({
        size: 5,
        map: texture,
        blending: THREE.AdditiveBlending,
        depthTest: false,
        transparent: true,
        opacity: 0.7
    })

    const range = 250
    for (let i = 0; i < 1500; i++) {
        const x = THREE.Math.randInt(-range, range)
        const y = THREE.Math.randInt(-range, range)
        const z = THREE.Math.randInt(-range, range)
        const point = new THREE.Vector3(x, y, z)
        point.velocityX = THREE.Math.randFloat(-0.16, 0.16)
        point.velocityY = THREE.Math.randFloat(0.1, 0.3)
        geometry.vertices.push(point)
    }

    points = new THREE.Points(geometry, material)
    scene.add(points)
}

makeTheStar()



function makeAFloor() {
    let planeGeometry = new THREE.PlaneGeometry(100, 100)
    let planeMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff })
    let plane = new THREE.Mesh(planeGeometry, planeMaterial)
    plane.rotation.x = -0.5 * Math.PI
    plane.position.set(0, -7, 0)
    plane.receiveShadow = true
    scene.add(plane)
}
makeAFloor()


function pointsAnimation() {
    points.geometry.vertices.forEach(function (v) {
        v.y = v.y - v.velocityY
        v.x = v.x - v.velocityX

        if (v.y <= -250) v.y = 250
        if (v.x <= -250 || v.x >= 250) v.velocityX = v.velocityX * -1
    })
    points.geometry.verticesNeedUpdate = true
}





window.addEventListener('resize', function () {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    render.setSize(window.innerWidth, window.innerHeight)
})




let make = new MakeTheShape()
let lamp = new makeALamp()
let make1 = new Fire()
make1.makeFire()
set()
function set() {
    make.anime()
    scene.add(make.group)
    scene.add(lamp.lamp)
    make1.makeAnime()
    pointsAnimation()
    requestAnimationFrame(set);
    controls.update()
    render.render(scene, camera)
}






