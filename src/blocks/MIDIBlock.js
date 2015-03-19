window.MIDIBlock = function()
{
    var geometry	= new THREE.BoxGeometry(1,1,1);
    var material	= new THREE.MeshLambertMaterial({map : Textures.midi}); 
    var mesh	    = new THREE.Mesh(geometry, material);
    mesh.position.y = 0.5;
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    mesh.transformable = true;
    mesh.blockType = "midi";
    mesh.note = 69;
    mesh.sons = [];
    mesh.linkedTo = [];
    mesh.updateFrequencies = function()
    {
    	for (var son of this.sons)
    	{
    		son.audioNode.frequency.value = Math.pow(2,(this.note-69)/12)*440; //Note to frequency conversion
    	}
    	return this.note;
    };
    return mesh;
};

