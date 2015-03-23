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
                if(event.which == 3  && intersects[i].object.blockType != "speaker")
                {
                    Tools.defaultTool.removeBlock(intersects[i].object);
                }
                else if(event.which == 3  && intersects[i].object.blockType == "speaker")
                {
                    Tools.defaultTool.unlinkSpeaker(intersects[i].object);
                }
                else
                {
                    found = true;
                    this.setBlock(intersects[i].object);
                }
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
        var changed = false;
        if(this.block.xFactor && this.block.position.x != this.block.oldX)
        {
            this.block.xFactor.value += (this.block.position.x - this.block.oldX) * this.block.factor;
            this.block.oldX = this.block.position.x;
            changed = true;
        }
        if(this.block.yFactor && this.block.position.y != this.block.oldY)
        {
            this.block.yFactor.value += (this.block.position.y - this.block.oldY) * this.block.factor;
            this.block.oldY = this.block.position.y;
            changed = true;
        }
        if(this.block.zFactor && this.block.position.z != this.block.oldZ)
        {
            this.block.zFactor.value += (this.block.position.z - this.block.oldZ) * this.block.factor;
            this.block.oldZ = this.block.position.z;
            changed = true;
        }
        if(this.block.blockType == "midi")
        {
            if(!changed && this.block.note.val != Math.round(this.block.note.value))
                this.block.note.value = Math.round(this.block.note.val);
            else
                this.block.note.val = Math.round(this.block.note.value);
            this.block.updateFrequencies();
        }
        for (var linkedBlock of this.block.linkedTo)
        {
            for (var linkedBlock2 of linkedBlock[0].linkedTo)
            {
                if(linkedBlock2[0] == this.block)
                {
                    linkedBlock2[1] = Tools.linkTool.setLink(linkedBlock2[1], linkedBlock[0].position, linkedBlock2[0].position, linkedBlock2[2]);
                }
            }
            linkedBlock[1] = Tools.linkTool.setLink(linkedBlock[1], this.block.position, linkedBlock[0].position, linkedBlock[2]);
        }
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