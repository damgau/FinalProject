/**
 * Create a new Particles System
 * 
 * @class
 * @param {Vector} _position - The position of the ParticlesSystem
 * @return {ParticlesSystem}
 * */
function PSReward()
{
	this.name = "PSReward";
	this.enabled = true;
	this.started = false;
	this.rendered = true;

	this.Emitters = [];
	this.Fields = [];

	/** 
	* Create the Particles System, log a message in the console
	*
	* */
	this.Awake = function()
	{
		Print('System: Particle System ' + this.name + " Created !");
	};

	/** 
	* Start the Particles System, launch Update() if already started
	*
	* */
	this.Start = function() 
	{
		if (!this.started) 
		{
			// operation start
			this.Fields.push(new FReward(
					new Vector(canvas.width - 200, canvas.height - 100),
					1000
				));
			this.started = true;
			Print('System: Particle System ' + this.name + " Started !");
		}
		this.Update();
	};
	/** 
	* Update every values of the Particles System
	*
	* */
	this.Update = function() 
	{
		if ( this.enabled ) 
		{
			for (var emitter in this.Emitters) 
			{
				this.Emitters[emitter].Update();
			}

			for (var field in this.Fields){
				this.Fields[field].Update();
			}
		}
	};

	this.addEmitter = function(_pos) {
		this.Emitters.push(new EReward(
					this,
					_pos,
					new Vector(-20, -5),
					50
				));
	}

	this.Awake();


}