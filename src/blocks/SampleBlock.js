window.SampleBlock = function()
{
    var geometry	= new THREE.BoxGeometry(1,1,1);
    var material	= new THREE.MeshLambertMaterial({map : Textures.sample}); 
    var mesh	    = new THREE.Mesh(geometry, material);
    mesh.position.y = 0.5;
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    mesh.transformable = true;
    mesh.blockType = "sample";
    mesh.audioNode = audioCtx.createBufferSource();
    mesh.audioNodeGain = audioCtx.createGain();
    mesh.audioNode.connect(mesh.audioNodeGain);
    mesh.sons = [];
    mesh.linkedTo = [];
    mesh.isPlaying = true;
    mesh.outType = "signal";
    mesh.xFactor = null;
    mesh.yFactor = null;
    mesh.zFactor = null;
    mesh.factor = 1;
    var buff = null;
    mesh.loadSample = function(samplename)
    {
        var req = new XMLHttpRequest(); 
        req.open("GET",samplename,true); 
        req.responseType = "arraybuffer"; 
        req.onload = function() { 
        //decode the loaded data 
        audioCtx.decodeAudioData(req.response, function(buffer) { 
            buff = buffer;  
        }); 
    }; 
        req.send();
    };

    mesh.playSample = function()
    {
        if(buff != null)
        {
            this.audioNode = audioCtx.createBufferSource();
            this.audioNode.connect(mesh.audioNodeGain);
            this.audioNode.buffer = buff;
            this.audioNode.start(0);
        }
        else
        {
            console.log("No sound loaded, can't play.")
        }
    };
    return mesh;
};