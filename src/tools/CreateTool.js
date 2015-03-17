window.CreateTool = function(scene, camera)
{
    this.scene = scene;
    this.addedToScene = false;
    function enableCreateTool(Block)
    {
        return function(event)
        {
            window.currentTool = Tools.createTool;
            window.currentTool.setBlock(new Block());
        }
    }
    document.querySelector("#waveBlock").addEventListener("click", enableCreateTool(WaveBlock));
    document.querySelector("#adsrBlock").addEventListener("click", enableCreateTool(ADSRBlock));
    document.querySelector("#midiBlock").addEventListener("click", enableCreateTool(MIDIBlock));
    document.querySelector("#delayBlock").addEventListener("click", enableCreateTool(DelayBlock));
    
    this.onClick = function(event)
    {
        window.currentTool = Tools.transformTool;
        window.currentTool.setBlock(this.block);
        this.setBlock(null);
    }
    
    this.onMove = function(event)
    {
        var raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(mouse, camera);
        var intersects = raycaster.intersectObjects([window.ground]);

        var found = false;
        for (var i = 0; i < intersects.length; i++)
        {
             this.block.position.x = intersects[i].point.x;
             this.block.position.z = intersects[i].point.z;
            if(!this.addedToScene)
            {
                this.addedToScene = true;
                scene.add(this.block);
            }
        }
    }
    
    this.setBlock = function(block)
    {
        if(block == null)
        {
            this.block.material.opacity = 1.0;
            this.block.material.transparent = false;
        }
        else
        {
            block.material.opacity = 0.5;
            block.material.transparent = true;
            this.addedToScene = false;
        }
        this.block = block;
    }
};