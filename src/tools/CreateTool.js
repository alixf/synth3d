window.CreateTool = function(scene, camera)
{
    this.scene = scene;
    this.addedToScene = false;
    function enableCreateTool(Block)
    {
        return function(event)
        {
            if(window.currentTool.setBlock)
                window.currentTool.setBlock(null);
            window.currentTool = Tools.createTool;
            window.currentTool.setBlock(new Block());
        }
    }
    document.querySelector("#oscillatorBlock").addEventListener("click", enableCreateTool(OscillatorBlock));
    document.querySelector("#adsrBlock").addEventListener("click", enableCreateTool(ADSRBlock));
    document.querySelector("#midiBlock").addEventListener("click", enableCreateTool(MIDIBlock));
    document.querySelector("#delayBlock").addEventListener("click", enableCreateTool(DelayBlock));
    document.querySelector("#loopBlock").addEventListener("click", enableCreateTool(LoopBlock));
    document.querySelector("#filterBlock").addEventListener("click", enableCreateTool(FilterBlock));
    document.querySelector("#sampleBlock").addEventListener("click", enableCreateTool(SampleBlock));
    
    this.onClick = function(event)
    {
        if(event.which == 3)
        {
            scene.remove(this.block);
            window.currentTool = Tools.defaultTool;
        }
        else
        {
            window.currentTool = Tools.linkTool;      
            window.currentTool.setType(this.block.outType);
            window.currentTool.setBlock(this.block);
        }
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
            this.block.oldX = this.block.position.x + 0;
            this.block.oldY = this.block.position.y + 0;
            this.block.oldZ = this.block.position.z + 0;
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