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
    
    this.onMove = function(event)
    {
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