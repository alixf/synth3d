window.LightSetup = function(ambient, directionals, debug)
{
    var instance = new THREE.Object3D();
    
    var light = new THREE.AmbientLight(ambient);
    instance.add(light);
    
    for(var i = 0; i < directionals.length; ++i)
    {
        var data = directionals[i];
        var newLight = new THREE.DirectionalLight(0xffffff, data.intensity * 0.5);
        newLight.position.set(data.x, data.y, data.z);
        newLight.castShadow             = true;
        newLight.shadowCameraNear       = 0;
        newLight.shadowCameraFar        = 500;
        newLight.shadowDarkness         = 0.1*data.intensity;
        newLight.shadowCameraVisible    = debug || false;
        newLight.shadowCameraRight      =  10;
        newLight.shadowCameraLeft       = -10;
        newLight.shadowCameraTop        =  10;
        newLight.shadowCameraBottom     = -10;
        newLight.shadowMapWidth         = 2048;
        newLight.shadowMapHeight        = 2048;
        newLight.shadowBias             = 0.0001;
        instance.add(newLight);
    }
    return instance;
};