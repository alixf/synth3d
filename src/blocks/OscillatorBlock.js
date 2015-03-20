window.OscillatorBlock = function()
{
    var geometry	= new THREE.BoxGeometry(1,1,1);
    var material	= new THREE.MeshLambertMaterial({map : Textures.osc}); 
    var mesh	    = new THREE.Mesh(geometry, material);
    mesh.audioNode = audioCtx.createOscillator();
    mesh.position.y = 0.5;
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    mesh.transformable = true;
    mesh.blockType = "osc";
    mesh.audioNodeGain = audioCtx.createGain();
    mesh.audioNode.start(0);
    mesh.audioNode.connect(mesh.audioNodeGain);
    mesh.linkedTo = [];
    mesh.outType = "signal";
    mesh.xFactor = null;
    mesh.yFactor = null;
    mesh.zFactor = null;
    mesh.factor = 1;
    mesh.oldX = 0;
    mesh.oldY = 0.5;
    mesh.oldZ = 0;
    return mesh;
};