window.LinkTool = function(scene, camera)
{
    this.block = null;
    this.type = 'freq';
    this.linked = false;
    
    this.setBlock = function(block)
    {
        this.block = block;
        if(this.block)
            this.spline = this.setLink(null, this.block.position, new THREE.Vector3(0,0,0), this.type);
        else
            scene.remove(this.spline);
    }
    
    this.setType = function(type)
    {
        this.type = type;
    }
    
    this.onClick = function(event)
    {
        if(event.which == 3)
        {
            scene.remove(this.spline);
            currentTool = Tools.defaultTool;
            return false;
        }
        this.linked = false;
        if(this.hoverBlock != null)
        {
            if(this.type == 'signal')
            {
                if(this.hoverBlock.blockType == 'speaker' || this.hoverBlock.blockType == 'adsr')
                {
                    this.block.audioNodeGain.connect(this.hoverBlock.audioNodeGain);
                    if(this.hoverBlock.blockType == 'adsr')
                        this.hoverBlock.modulation = this.block.modulation;
                    this.linked = true;
                }
                if(this.hoverBlock.blockType == 'osc')
                {
                    if(this.block.modulation == "amp")
                        this.block.audioNodeGain.connect(this.hoverBlock.audioNodeGain.gain);
                    else
                        this.block.audioNodeGain.connect(this.hoverBlock.audioNode.frequency);
                    this.linked = true;
                    
                }
                if(this.hoverBlock.blockType == 'delay' || this.hoverBlock.blockType == 'filter')
                {
                    this.block.audioNodeGain.connect(this.hoverBlock.audioNode);
                    this.hoverBlock.modulation = this.block.modulation;
                    this.linked = true;
                }
            }
            if(this.type == 'freq')
            {
                if(this.hoverBlock.blockType == 'osc')
                {
                    this.linked = true;
                }
            }
            if(this.linked)
            {
                this.block.linkedTo.push([this.hoverBlock, this.spline, this.type]);
                this.hoverBlock.linkedTo.push([this.block, this.spline, this.type]);
                currentTool = Tools.defaultTool;
            }
        }
    }
    
    this.onMove = function(event)
    {
        var raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(mouse, camera);
        var intersects = raycaster.intersectObjects(scene.children);
        var end = new THREE.Vector3();
        var found = false;
        for (var i = 0; i < intersects.length; i++)
        {
            if(intersects[i].object.transformable)
            {
                this.hoverBlock = intersects[i].object;
                end = this.hoverBlock.position;
                found = true;
            }
        }
        if(!found)
        {
            this.hoverBlock = null;
            var vector = new THREE.Vector3();
            vector.set(mouse.x, mouse.y, 0.5);
            vector.unproject(camera);
            var dir = vector.sub(camera.position).normalize();
            var distance = -camera.position.y / dir.y;
            end = camera.position.clone().add(dir.multiplyScalar(distance));
        }
        
        this.spline = this.setLink(this.spline, this.block.position, end, this.type);
    }
    
    this.setLink = function(link, start, end, type)
    {
        if(link)
        {
            scene.remove(link);
        }
        var offset = new THREE.Vector3();//(type == 'freq') ? new THREE.Vector3(0, -0.1, 0) : new THREE.Vector3(0, 0.1, 0);
        var curve = new THREE.SplineCurve3([start/*+offset*/, end/*+offset*/]);
        var geometry = new THREE.Geometry();
        geometry.vertices = curve.getPoints(10);
        var material = new THREE.LineBasicMaterial({color : type == 'signal' ? 0xff0000 : 0x0000ff, linewidth : 5});
        var newLink = new THREE.Line(geometry, material);
        scene.add(newLink);
        return newLink;
    }
};