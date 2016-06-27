/**
 * Create a new Emitter
 * 
 * @class
 * @param {Vector} _position - The position of the Emitter
 * @param {Vector} _velocity - The position of the Emitter
 * @param {Number} _spread - The amplitude
 * @param {Number} _rate - The speedrate 
 * @param {Number} _max - The maximum number of particles
 * 
 * @return {Emitter}
 * */
function EReward(_position, _max) 
{
	this.Parent = null;
	this.Particules = [];
	this.particulesMax = _max || 1;
	this.RelativePosition = _position;
	this.Position = new Vector();
	this.isStarted = false;
	this.isFinished = false;
}
/**
*
* Launch the Particles
*
* */
EReward.prototype.EmitParticules = function() 
{
	if (!this.isStarted) {
		for (var i = 0; i < this.particulesMax; i++) {

			var startPosX = this.RelativePosition.x;
			var changePosX = -200 - this.RelativePosition.x;
			var posY = this.RelativePosition.y;

			this.Particules.push(new PReward(false,	startPosX, changePosX, posY)); 
		}
		this.isStarted = true;
	}
};
/**
*
* Update the Particles movement
*
* */
EReward.prototype.Update = function() 
{
	if (this.Parent != null)
	{
		this.Position.x = this.RelativePosition.x + this.Parent.Transform.Position.x;
		this.Position.y = this.RelativePosition.y + this.Parent.Transform.Position.y;
	}
	this.EmitParticules();
	for (index in this.Particules) 
	{
		if (this.Particules[index].tween && this.Particules[index].tween.isFinished) 
		{
			this.Particules[index].Renderer.isVisible = false;
			this.Particules.splice(index,1);
			index--;
		} 
		else 
		{
			this.Particules[index].Start();
		}
	}
};