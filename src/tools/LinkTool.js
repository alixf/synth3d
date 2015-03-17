window.LinkTool = function(scene, camera)
{
    this.block = null;
    this.type = 'freq';
    
    this.setBlock = function(block)
    {
        this.block = block;
        this.spline = this.setLink(null, this.block.position, new THREE.Vector3(0,0,0), this.type);
    }
    
    this.setType = function(type)
    {
        this.type = type;
    }
    
    this.onClick = function(event)
    {
        if(this.hoverBlock != null)
        {
            if(this.type == 'freq')
            {
                this.hoverBlock.freqIn = this.block;
                this.hoverBlock.freqInLink = this.spline;
                this.block.freqOut = this.hoverBlock;
                this.block.freqOutLink = this.spline;
            }
            if(this.type == 'amp')
            {
                this.hoverBlock.ampIn = this.block;
                this.hoverBlock.ampInLink = this.spline;
                this.block.ampOut = this.hoverBlock;
                this.block.ampOutLink = this.spline;
            }
            currentTool = Tools.defaultTool;
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
        if(link != null)
        {
            scene.remove(link);
        }
        else
            console.log("create");
        
        var offset = new THREE.Vector3();//(type == 'freq') ? new THREE.Vector3(0, -0.1, 0) : new THREE.Vector3(0, 0.1, 0);
        var curve = new THREE.SplineCurve3([start/*+offset*/, end/*+offset*/]);
        var geometry = new THREE.Geometry();
        geometry.vertices = curve.getPoints(10);
        var material = new THREE.LineBasicMaterial({color : type == 'freq' ? 0xff0000 : 0x0000ff, linewidth : 5});
        var newLink = new THREE.Line(geometry, material);
        scene.add(newLink);
        return newLink;
    }
};