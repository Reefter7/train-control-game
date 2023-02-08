//////CANVAS //////////////////////////////////////////////
let canvas = document.getElementById('playingCanvas');
const WIDTH  = canvas.width = canvas.clientWidth;
const HEIGHT = canvas.height = canvas.clientHeight;
let c = canvas.getContext('2d');

//////VARIABLES AND CONSTANTS /////////////////////////////
let isPlacingTracks = false;

const mouse = {x: undefined, y: undefined};
//////EVENT LISTENERS /////////////////////////////////////
canvas.addEventListener('mousemove', e => {
	const rect = canvas.getBoundingClientRect();
	mouse.x = e.clientX - rect.left;
	mouse.y = e.clientY - rect.top;
	
	buildTrack(e.shiftKey);
});

window.addEventListener('keydown', e=>{
	if(e.key == 'Shift' && isPlacingTracks) buildTrack(true);
});
window.addEventListener('keyup', e=>{
	if(e.key == 'Shift' && isPlacingTracks) buildTrack(false);
})

canvas.addEventListener('mousedown', e => {
	console.log('aaa');
	const rect = canvas.getBoundingClientRect();
	let canvasX = e.clientX - rect.left;
	let canvasY = e.clientY - rect.top;

	if(isPlacingTracks){
		isPlacingTracks = false;
	} else {
		objects.push(new Track(canvasX, canvasY, canvasX, canvasY, 'lime'));
		isPlacingTracks = true;
	}
	console.log(isPlacingTracks);
})
//////OBJECTS /////////////////////////////////////////////
class Track{
	constructor(fromX, fromY, toX, toY, color){
		this.from = {x: fromX, y: fromY};
		this.to = {x: toX, y: toY};
		this.color = color;
		this.nails = [];
		this.setEndpoint();
	}

	draw = () => {
		c.save();
		c.strokeStyle = this.color;
		c.lineCap = "round";
		c.lineJoin = "round";
		c.lineWidth = 10;
		c.beginPath();
		c.moveTo(this.from.x, this.from.y);
		for(let nail of this.nails){
			c.lineTo(nail.x, nail.y);
		}
		c.lineTo(this.to.x, this.to.y);
		c.stroke();
		c.restore();
	}
	update = () => {
		this.draw();
	}
	calculateNails = (inverted=false) => {
		let dx = this.to.x - this.from.x;
		let dy = this.to.y - this.from.y;
	
		if(Math.sign(dx) == Math.sign(dy)){ //to-point is topleft of from-point
			if(Math.abs(dx) > Math.abs(dy)){
				(inverted) 
					? this.nails.push({x: this.from.x + dx - dy, y: this.from.y})
					: this.nails.push({x: this.to.x - dx + dy, y: this.to.y});
			} else {
				(inverted)
					? this.nails.push({x: this.from.x, y: this.from.y + dy - dx})
					: this.nails.push({x: this.to.x, y: this.to.y - dy + dx});
			}
		} else { //bottomleft
			if(Math.abs(dx) > Math.abs(dy)){
				(inverted)
					? this.nails.push({x: this.from.x + dx + dy, y: this.from.y})
					: this.nails.push({x: this.to.x - dx - dy, y: this.to.y});
			} else {
				(inverted)
					? this.nails.push({x: this.from.x, y: this.from.y + dy + dx})
					: this.nails.push({x: this.to.x, y: this.to.y - dy - dx});
			}
		}
	}

	setEndpoint = (x=this.to.x ,y=this.to.y, invertedNails) => {
		this.to.x = x;
		this.to.y = y;
		this.nails = []; //in order!
		this.calculateNails(invertedNails);
	}
}
//////FUNCTIONS ///////////////////////////////////////////
function buildTrack(inverted){
	if(isPlacingTracks) objects[objects.length - 1].setEndpoint(mouse.x, mouse.y, !inverted);
}
//////INIT AND ANIMATE ////////////////////////////////////

let objects = [];
function init(){
}

function animate(){
	requestAnimationFrame(animate);
	c.clearRect(0,0,WIDTH,HEIGHT);
	objects.forEach(obj=>obj.update());
}

init();
animate();