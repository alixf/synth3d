window.SpeakerBlock = function()
{
    var geometry	= new THREE.BoxGeometry(1,1,1);
    var material	= new THREE.MeshLambertMaterial({map : Textures.speaker}); 
    var mesh	    = new THREE.Mesh(geometry, material);
    mesh.position.y = 0.5;
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    mesh.transformable = true;
    mesh.blockType = "speaker";
    mesh.audioNode = audioCtx.destination;
    mesh.audioNodeGain = audioCtx.createGain();
    mesh.analyser = audioCtx.createAnalyser();
 	mesh.analyser.connect(mesh.audioNode);
    mesh.audioNodeGain.connect(mesh.analyser);
    mesh.linkedTo = [];
    mesh.xFactor = null;
    mesh.yFactor = null;
    mesh.zFactor = null;
    mesh.factor = 1;   
  	mesh.analyser.minDecibels = -140;
  	mesh.analyser.maxDecibels = -10;
  	mesh.freqs = new Uint8Array(mesh.analyser.frequencyBinCount);
  	mesh.times = new Uint8Array(mesh.analyser.frequencyBinCount);
  	mesh.draw = function(canvas) {
  		var SMOOTHING = 0.8;
		var FFT_SIZE = 2048;

		this.analyser.smoothingTimeConstant = SMOOTHING;
		this.analyser.fftSize = FFT_SIZE;

		// Get the frequency data from the currently playing music
		this.analyser.getByteFrequencyData(this.freqs);
		this.analyser.getByteTimeDomainData(this.times);

		var width = Math.floor(1/this.freqs.length, 10);
		var drawContext = canvas.getContext('2d');
		drawContext.clearRect(0 , 0 , canvas.width, canvas.height);
		var WIDTH = canvas.width;
		var HEIGHT = canvas.height;
		// Draw the frequency domain chart.
		for (var i = 0; i < this.analyser.frequencyBinCount; i++) {
			var value = this.freqs[i];
			var percent = value / 256;
			var height = HEIGHT * percent;
			var offset = HEIGHT - height - 1;
			var barWidth = WIDTH/this.analyser.frequencyBinCount;
			var hue = i/this.analyser.frequencyBinCount * 360;
			drawContext.fillStyle = 'hsl(' + hue + ', 100%, 50%)';
			drawContext.fillRect(i * barWidth, offset, barWidth, height);
		}
		  // Draw the time domain chart.
		for (var i = 0; i < this.analyser.frequencyBinCount; i++) {
			var value = this.times[i];
			var percent = value / 256;
			var height = HEIGHT * percent;
			var offset = HEIGHT - height - 1;
			var barWidth = WIDTH/this.analyser.frequencyBinCount;
			drawContext.fillStyle = 'black';
			drawContext.fillRect(i * barWidth, offset, 1, 2);
		}
  	};

    return mesh;
};