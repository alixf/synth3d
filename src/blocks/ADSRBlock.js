window.ADSRBlock = function()
{
    var geometry	= new THREE.BoxGeometry(1,1,1);
    var material	= new THREE.MeshLambertMaterial({map : Textures.adsr}); 
    var mesh	    = new THREE.Mesh(geometry, material);
    mesh.position.y = 0.5;
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    mesh.transformable = true;
    mesh.blockType = "adsr";
    mesh.linkedTo = [];
    mesh.outType = "signal";
    mesh.attack = {value:0.1};
    mesh.decay = {value:0.1};
    mesh.attackFactor = {value:1.2};
    mesh.sustain = {value:1};
    mesh.gain = {value:1};
    mesh.release = {value:0.5};
    mesh.factor = 1;
    mesh.ifNoteOn = true;
    mesh.xFactor = null;
    mesh.yFactor = null;
    mesh.zFactor = null;
    mesh.oldX = 0;
    mesh.oldY = 0.5;
    mesh.oldZ = 0;
    mesh.audioNodeGain = audioCtx.createGain();
    mesh.audioNodeGain.value = mesh.gain;
    mesh.minimalOffset = 0.00000001;
    mesh.noteOn = function()
    {
        if(!this.ifNoteOn)
        {   
            if(this.audioNodeGain.context)
            {
                    var now = this.audioNodeGain.context.currentTime;
                    this.audioNodeGain.gain.cancelScheduledValues(parseFloat(now));
                    //Attack
                    this.audioNodeGain.gain.setValueAtTime(0, parseFloat(now));
                    var attack = parseFloat(now) + parseFloat(this.attack.value) + this.minimalOffset;
                    this.audioNodeGain.gain.linearRampToValueAtTime(this.gain.value*this.attackFactor.value, attack);
                    //Decay
                    var decay = attack + parseFloat(this.decay.value) + this.minimalOffset;
                    this.audioNodeGain.gain.linearRampToValueAtTime(this.gain.value, decay);
                    this.ifNoteOn = true;
            }
        }
    };
    mesh.noteOff = function()
    {
        if(this.ifNoteOn)
        {
            if(this.audioNodeGain.context)
            {
                var now = this.audioNodeGain.context.currentTime;
                this.audioNodeGain.gain.cancelScheduledValues(parseFloat(now));
                //Release
                this.audioNodeGain.gain.setValueAtTime(this.gain.value, parseFloat(now));
                var release = parseFloat(now) + parseFloat(this.release.value) + this.minimalOffset;
                this.audioNodeGain.gain.linearRampToValueAtTime(0, release);
            }
            this.ifNoteOn = false;
        }
    };
    mesh.play = function()
    {
        if(!this.ifNoteOn)
        {
            if(this.audioNodeGain.context)
            {
                var now = this.audioNodeGain.context.currentTime;
                this.audioNodeGain.gain.cancelScheduledValues(now);
                //Attack
                this.audioNodeGain.gain.setValueAtTime(0, parseFloat(now));
                var attack = parseFloat(now) + parseFloat(this.attack.value) + this.minimalOffset;
                this.audioNodeGain.gain.linearRampToValueAtTime(this.gain.value*this.attackFactor.value, attack);
                //Decay
                var decay = attack + parseFloat(this.decay.value) + this.minimalOffset;
                this.audioNodeGain.gain.linearRampToValueAtTime(this.gain.value, decay);
                //Sustain
                var sustain = decay + parseFloat(this.sustain.value) + this.minimalOffset;
                this.audioNodeGain.gain.linearRampToValueAtTime(this.gain.value, sustain);
                //Release
                var release = sustain + parseFloat(this.release.value) + this.minimalOffset;
                this.audioNodeGain.gain.linearRampToValueAtTime(0, release);
            }
        }
    };
    return mesh;
};