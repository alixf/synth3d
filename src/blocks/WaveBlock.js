window.WaveBlock = function()
{
    var geometry	= new THREE.BoxGeometry(1,1,1);
    var material	= new THREE.MeshLambertMaterial({map : Textures.wave}); 
    var mesh	    = new THREE.Mesh(geometry, material);
    mesh.audioNode = audioCtx.createOscillator();
    mesh.position.y = 0.5;
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    mesh.transformable = true;
    mesh.blockType = "wave";
    mesh.audioNodeGain = audioCtx.createGain();
    mesh.audioNode.connect(mesh.audioNodeGain);
    mesh.audioNodeGain.connect(audioCtx.destination);
    return mesh;
};