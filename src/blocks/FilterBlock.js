window.FilterBlock = function()
{
    var geometry	= new THREE.BoxGeometry(1,1,1);
    var material	= new THREE.MeshLambertMaterial({map : Textures.filter}); 
    var mesh	    = new THREE.Mesh(geometry, material);
    mesh.position.y = 0.5;
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    mesh.transformable = true;
    mesh.blockType = "filter";
    mesh.audioNode = audioCtx.createBiquadFilter();
    mesh.audioNodeGain = audioCtx.createGain();
    mesh.audioNode.connect(mesh.audioNodeGain);
    mesh.linkedTo = [];
    mesh.outType = "signal";
    mesh.xFactor = null;
    mesh.yFactor = null;
    mesh.zFactor = null;
    mesh.oldX = 0;
    mesh.oldY = 0.5;
    mesh.oldZ = 0;
    mesh.factor = 1;
    mesh.audioNode.type = "lowpass";
    mesh.audioNode.frequency.value = 1000;
    mesh.audioNode.Q.value = 1;
    return mesh;
};