window.onload = function()
{
    var blocksTexture = THREE.ImageUtils.loadTexture('textures/blocks_01.png');

    var container = document.querySelector("#container");
    var renderer = new THREE.WebGLRenderer({antialias : true});
    renderer.setClearColor(new THREE.Color(127,127,127), 1);
    renderer.shadowMapEnabled = true;
    renderer.shadowMapType = THREE.PCFSoftShadowMap;
    renderer.setSize(container.innerWidth, container.innerHeight);
    container.appendChild(renderer.domElement);

    // Scene
    var scene = new THREE.Scene();

    // Camera
    var camera	= new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.01, 1000);
    camera.position.z = 10;
    camera.position.y = 10;
    scene.add(camera);

    // Orbital controls
    var controls = new THREE.OrbitControls(camera);
    controls.damping = 0.2;
    //controls.addEventListener('change', render);

    // Grid
    var grid = new THREE.GridHelper(20, 1);
    grid.setColors(0x888888, 0xDDDDDD);
    grid.castShadow = false;
    grid.receiveShadow = false;
    scene.add(grid);

    var geometry = new THREE.PlaneGeometry(100, 100);
    var material = new THREE.MeshBasicMaterial({color: 0xffffff, side: THREE.DoubleSide});
    var plane = new THREE.Mesh(geometry, material);
    plane.rotateOnAxis(new THREE.Vector3(1,0,0), 1.57);
    plane.translateZ(0.01);
plane.castShadow = false;
plane.receiveShadow = true;
    scene.add(plane);

    // Object
    var geometry	= new THREE.BoxGeometry(1,1,1);
    var material	= new THREE.MeshLambertMaterial({map : blocksTexture}); 
    var mesh	    = new THREE.Mesh(geometry, material);
    mesh.position.y = 0.5;
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    scene.add(mesh);

    // Light
    var lights = [{x : 30, y: 80, z : 50, intensity : 1.0},
                  {x : -30, y: 100, z : -50, intensity : 0.33},
                  //{x : -3, y : -4, z : -5, intensity : 1.0},
                  {x : -30, y : 90, z : 50, intensity : 0.67}];
    for(var i = 0; i < lights.length; ++i)
    {
        var data = lights[i];
        var directionalLight = new THREE.DirectionalLight(0xffffff, data.intensity * 0.5);
        directionalLight.position.set(data.x, data.y, data.z);
        scene.add(directionalLight);
        directionalLight.castShadow = true;
        directionalLight.shadowCameraNear = 0;
        directionalLight.shadowCameraFar = 500;
        directionalLight.shadowDarkness = 0.1*data.intensity;
        //directionalLight.shadowCameraVisible = true;
        directionalLight.shadowCameraRight      =  10;
        directionalLight.shadowCameraLeft       = -10;
        directionalLight.shadowCameraTop        =  10;
        directionalLight.shadowCameraBottom     = -10;
        directionalLight.shadowMapWidth = 2048;
        directionalLight.shadowMapHeight = 2048;
        directionalLight.shadowBias = 0.0001;
    }
    var light = new THREE.AmbientLight( 0x404040  ); // soft white light
    scene.add( light );

    // Transform control
    control = new THREE.TransformControls(camera, renderer.domElement);
    scene.add(control);

    mouse = new THREE.Vector2();
    var raycaster = new THREE.Raycaster();
    function onMouseMove(event)
    {
        event.preventDefault();
        mouse.x = (event.offsetX / container.offsetWidth) * 2 - 1;
        mouse.y = -(event.offsetY / container.offsetHeight) * 2 + 1;
    }
    container.addEventListener('mousemove', onMouseMove);
    function onMouseClick(event)
    {
        event.preventDefault();
        mouse.x = (event.offsetX / container.offsetWidth) * 2 - 1;
        mouse.y = -(event.offsetY / container.offsetHeight) * 2 + 1;
        raycaster.setFromCamera(mouse, camera);
        var intersects = raycaster.intersectObjects(scene.children);

        var found = false;

        for (var i = 0; i < intersects.length; i++)
        {
            if(intersects[i].object == mesh)
            {   
                control.attach(mesh);
                found = true;
            }
        }
        if(!found)
        {
            control.detach(control.object);
        }
    }
    container.addEventListener('click', onMouseClick);


    // On Resize
    function onResize()
    {
        renderer.setSize(container.offsetWidth, container.offsetHeight);
        camera.aspect = container.offsetWidth / container.offsetHeight;
        camera.updateProjectionMatrix();
    }
    window.addEventListener('resize', onResize, false);
    onResize();

    // Render
    var render = function ()
    {
        requestAnimationFrame(render);
        camera.updateMatrixWorld();


        raycaster.setFromCamera(mouse, camera);
        var intersects = raycaster.intersectObjects(scene.children);

        var i = 0;
        for (i = 0; i < scene.children.length; i++)
        {
            if(scene.children[i] == mesh)
                scene.children[i].material.color = new THREE.Color(0xffffff);
        }
        for (i = 0; i < intersects.length; i++)
        {
            if(intersects[i].object == mesh)
                intersects[i].object.material.color = new THREE.Color(0xffdddd);
        }

        renderer.render(scene, camera);
    };

    render();
};