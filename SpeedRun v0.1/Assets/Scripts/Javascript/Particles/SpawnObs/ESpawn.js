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
function ESpawn(_position, _max) 
{
	this.Parent = null;
	this.Particules = [];
	this.particulesMax = _max || 2;
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
ESpawn.prototype.EmitParticules = function() 
{
	if (!this.isStarted) {
		for (var i = 0; i < this.particulesMax; i++) {
			// function PSpawn(	_isRect, _startPosX, _startPosY, _startSizeX, _startSizeY, _startAngle,
			//					_changePosX, _changePosY, _changeSizeX, _changeSizeY, _changeAngle) 
			var offsetX = - 100;
			var offsetY = 25;

			var finalPosX = this.RelativePosition.x + offsetX;
			var finalPosY = this.RelativePosition.y + offsetY;
			var finalSizeX = 250;
			var finalSizeY = 80;
			var finalAngle = 0;

			var startPosX = Math.Random.RangeInt(finalPosX - 100, finalPosX + 100, false);
			var startPosY = Math.Random.RangeInt(finalPosY - 100, finalPosY + 100, false);
			var startSizeX = Math.Random.RangeInt(finalSizeX - 100, finalSizeX + 100, false);
			var startSizeY = Math.Random.RangeInt(finalSizeY - 100, finalSizeY + 100, false);
			//var startAngle = Math.Random.RangeInt(-75, 75, false);
			var startAngle = 0;
			
			var changePosX = finalPosX - startPosX;
			var changePosY = finalPosY - startPosY;
			var changeSizeX = finalSizeX - startSizeX;
			var changeSizeY = finalSizeY - startSizeY;
			var changeAngle = finalAngle - startAngle;


			this.Particules.push(new PSpawn(true,	startPosX, startPosY, startSizeX, startSizeY, startAngle,
				 									changePosX, changePosY, changeSizeX, changeSizeY, changeAngle)
								); 
		}
		this.isStarted = true;
	}
};
/**
*
* Update the Particles movement
*
* */
ESpawn.prototype.Update = function() 
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