window.TransformTool = function(scene, camera, inputTarget)
{
    this.block = null;
    this.camera = camera;
    this.control = new THREE.TransformControls(camera, inputTarget);
    scene.add(this.control);
    
    this.onClick = function(event)
    {
        var raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(mouse, camera);
        var intersects = raycaster.intersectObjects(scene.children);

        var found = false;
        for (var i = 0; i < intersects.length; i++)
        {
            if(intersects[i].object.transformable)
            {
                found = true;
                this.setBlock(intersects[i].object);
            }
        }
        if(!found)
        {
            this.setBlock(null);
            currentTool = Tools.defaultTool;
        }
    }
    
    this.update = function()
    {
        if(this.block.freqIn != null)
            Tools.linkTool.setLink(this.block.freqInLink, this.block.position, this.block.freqIn.position, 'freq');
        if(this.block.freqOut != null)
            Tools.linkTool.setLink(this.block.freqOutLink, this.block.freqOut.position, this.block.position, 'freq');
        if(this.block.ampIn != null)
            Tools.linkTool.setLink(this.block.ampInLink, this.block.position, this.block.ampIn.position, 'amp');
        if(this.block.ampOut != null)
            Tools.linkTool.setLink(this.block.ampOutLink, this.block.ampOut.position, this.block.position, 'amp');
    }
    
    this.setBlock = function(block)
    {
        if(block == null)
            this.control.detach(this.block);
        else
            this.control.attach(block);
        
        this.block = block;
        document.querySelector("synth3d-inspector").block = block;
    }
};