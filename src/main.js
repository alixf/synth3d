window.Textures =
{
    speaker : THREE.ImageUtils.loadTexture('textures/blocks_01.png'),
    osc : THREE.ImageUtils.loadTexture('textures/blocks_05.png'),
    adsr : THREE.ImageUtils.loadTexture('textures/blocks_06.png'),
    midi : THREE.ImageUtils.loadTexture('textures/blocks_07.png'),
    am : THREE.ImageUtils.loadTexture('textures/blocks_09.png'),
    loop : THREE.ImageUtils.loadTexture('textures/blocks_10.png'),
    delay : THREE.ImageUtils.loadTexture('textures/blocks_11.png'),
    sample : THREE.ImageUtils.loadTexture('textures/blocks_12.png'),
    filter : THREE.ImageUtils.loadTexture('textures/blocks_09.png'),
};

window.onload = function()
{
    // Set Renderer and scene
    var container = document.querySelector("#container");

    var renderer = new THREE.WebGLRenderer({antialias : true});
    renderer.setClearColor(new THREE.Color(127,127,127), 1);
    renderer.shadowMapEnabled = true;
    renderer.shadowMapType = THREE.PCFSoftShadowMap;
    renderer.setSize(container.innerWidth, container.innerHeight);
    container.appendChild(renderer.domElement);
    var scene = new THREE.Scene();

    // Audio Context

    AudioContext = AudioContext || webkitAudioContext;
    audioCtx = new AudioContext();
    
    // Camera
    var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.01, 1000);
    camera.position.z = 10;
    camera.position.y = 10;
    scene.add(camera);
    
    // Orbital controls
    var controls = new THREE.OrbitControls(camera, renderer.domElement);
    
    // Light Setup
    scene.add(new LightSetup(0x404040, [{x : 30, y: 80, z : 50, intensity : 1.0},{x : -30, y: 100, z : -50, intensity : 0.33},{x : -30, y : 90, z : 50, intensity : 0.67}]));
    
    // Ground (grid and ground plane)
    scene.add(new Ground());

    // Default Speaker Block
    var speaker = new SpeakerBlock();
    scene.add(speaker);
    var canvas = document.querySelector("#signalCanvas");
    var ratio = 50;
    canvas.height = (canvas.width * ratio / 100);

    // Tools
    window.Tools =
    {
        defaultTool : new DefaultTool(scene, camera),
        createTool : new CreateTool(scene, camera),
        transformTool : new TransformTool(scene, camera, renderer.domElement),
        linkTool : new LinkTool(scene, camera),
    }
    window.currentTool = Tools.defaultTool;
    
    // Transform control

    // Event : Mouse Move
    mouse = new THREE.Vector2();
    function onMouseMove(event)
    {
        event.preventDefault();
        mouse.x = (event.offsetX / container.offsetWidth) * 2 - 1;
        mouse.y = -(event.offsetY / container.offsetHeight) * 2 + 1;
        
        if(currentTool != null && currentTool.onMove != null)
            currentTool.onMove(event);
    }
    container.addEventListener('mousemove', onMouseMove);
    
    // Event : Mouse Click
    function onMouseClick(event)
    {
        event.preventDefault();
        if(currentTool != null && currentTool.onClick != null)
            currentTool.onClick(event);
    }
    container.addEventListener('mouseup', onMouseClick);
    
    // Event : Resize
    function onResize()
    {
        renderer.setSize(container.offsetWidth, container.offsetHeight);
        camera.aspect = container.offsetWidth / container.offsetHeight;
        camera.updateProjectionMatrix();
        canvas.height = (canvas.width * ratio / 100);
    }
    window.addEventListener('resize', onResize);
    onResize();

    // Event : Render
    var render = function()
    {
        requestAnimationFrame(render);
        
        if(currentTool != null && currentTool.update != null)
            currentTool.update();
        
        renderer.render(scene, camera);
        speaker.draw(canvas);
    };
    render();
};