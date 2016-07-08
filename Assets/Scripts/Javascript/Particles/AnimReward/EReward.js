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
function EReward(_ps, _position, _velocity, _max) 
{
	this.Parent = null;
	this.Particules = [];
	this.particulesMax = _max || 20;
	this.RelativePosition = _position;
	this.Position = _position;
	this.Velocity = _velocity || new Vector();
	//this.spread = Math.PI/32; //angles possibles de direction
	this.spread = Math.Random.AngleRadian(0, 1800);
	this.angleNow = 0;

	this.ps = _ps;
}
/**
*
* Launch the Particles
*
* */
EReward.prototype.EmitParticules = function() 
{
	while (this.particulesMax--) 
	{
		if (this.Particules.length < this.particulesMax) 
		{
			// You can change this values for more fun.
			var angle = this.Velocity.GetAngle() + this.spread * Math.random() ;
			var position = new Vector(this.Position.x - 100 * Math.random(),this.Position.y * Math.random());
			//var position = new Vector(this.Position.x * Math.random(),this.Position.y * Math.random());
			var velocity = this.Velocity.FromAngle(angle);
			this.Particules.push(new PReward(this.ps,position,velocity,this.color));
		} 
		else return;
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
		if (this.Particules[index].outOfBounds) 
		{
			this.Particules.splice(index,1);
			index--;
		} 
		else 
		{
			this.Particules[index].Start();
			// Call in Particule.Update
			//this.Particules[index].Render();
		}
	}
};