window.DefaultTool = function(scene, camera)
{
    this.scene = scene;
    this.camera = camera;
    
    this.onMove = function(event)
    {
    }
    
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
                Tools.transformTool.setBlock(intersects[i].object);
                currentTool = Tools.transformTool;
                found = true;
            }
        }
    }
}
//      var raycaster = new THREE.Raycaster();
//        raycaster.setFromCamera(mouse, camera);
//        var intersects = raycaster.intersectObjects(scene.children);
//
//        var i = 0;
//        for (i = 0; i < scene.children.length; i++)
//        {
//            //if(scene.children[i] == mesh)
//            //    scene.children[i].material.color = new THREE.Color(0xffffff);
//        }
//        for (i = 0; i < intersects.length; i++)
//        {
//            //if(intersects[i].object == mesh)
//            //    intersects[i].object.material.color = new THREE.Color(0xffdddd);
//        }