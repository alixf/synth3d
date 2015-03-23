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
                var block = intersects[i].object;
                if(event.which == 3 && block.blockType != "speaker")
                {
                    this.removeBlock(block);
                }
                else if(event.which == 3 && block.blockType == "speaker")
                {
                    this.unlinkSpeaker(block);
                }
                else
                {
                    Tools.transformTool.setBlock(block);
                    currentTool = Tools.transformTool;
                    found = true;
                }
            }
        }
    }

    this.removeBlock = function(block)
    {
        for (var linkedBlock = 0; linkedBlock < block.linkedTo.length; linkedBlock += 1)
        {
            for (var linkedBlock2 = 0; linkedBlock2 < block.linkedTo[linkedBlock][0].linkedTo.length; linkedBlock2 += 1)
            {
                var lblock = block.linkedTo[linkedBlock][0].linkedTo[linkedBlock2];
                if(lblock[0] == block)
                {
                    if(lblock[1])
                    {
                        scene.remove(lblock[1]);
                    }
                    block.linkedTo[linkedBlock][0].linkedTo.splice(linkedBlock2,1);
                    linkedBlock2 -= 1;
                }
            }
            if(block.linkedTo[linkedBlock][1])
            {
                scene.remove(block.linkedTo[linkedBlock][1])
            }
            block.linkedTo.splice(linkedBlock,1);
            linkedBlock -= 1;
        }
        if(block.audioNode)
            block.audioNode.disconnect();
        if(block.audioNodeGain)
            block.audioNodeGain.disconnect();
        scene.remove(block);
    }

    this.unlinkSpeaker = function(block)
    {
        if(block.blockType == "speaker")
        {
            for (var linkedBlock = 0; linkedBlock < block.linkedTo.length; linkedBlock += 1)
            {
                for (var linkedBlock2 = 0; linkedBlock2 < block.linkedTo[linkedBlock][0].linkedTo.length; linkedBlock2 += 1)
                {
                    var lblock = block.linkedTo[linkedBlock][0].linkedTo[linkedBlock2];
                    if(lblock[0] == block)
                    {
                        if(lblock[1])
                        {
                            block.linkedTo[linkedBlock][0].audioNodeGain.disconnect(block.audioNodeGain);
                            scene.remove(lblock[1]);
                        }
                        block.linkedTo[linkedBlock][0].linkedTo.splice(linkedBlock2,1);
                        linkedBlock2 -= 1;
                    }
                }
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