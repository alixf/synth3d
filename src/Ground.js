window.Ground = function()
{
    var instance = new THREE.Object3D();
    
    var grid = new THREE.GridHelper(20, 1);
    grid.setColors(0x888888, 0xDDDDDD);
    grid.castShadow = false;
    grid.receiveShadow = false;
    instance.add(grid);

    var geometry = new THREE.PlaneGeometry(100, 100);
    var material = new THREE.MeshBasicMaterial({color: 0xffffff});
    var plane = new THREE.Mesh(geometry, material);
    plane.rotateOnAxis(new THREE.Vector3(1,0,0), -1.57);
    plane.translateZ(-0.01);
    plane.castShadow = false;
    plane.receiveShadow = true;
    window.ground = plane;
    instance.add(plane);
    instance.isGroundPlane = true;
    
    return instance;
};