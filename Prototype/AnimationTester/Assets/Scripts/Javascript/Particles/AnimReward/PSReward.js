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
			// On click Add Emitter
			if (Input.mouseClick) {
				// Condition for generate
				this.addEmitter();
			}

			for (var emitter in this.Emitters) 
			{
				this.Emitters[emitter].Update();
			}
		}
	};

	this.Awake();

	this.addEmitter = function() {
		console.log("here")
		this.Emitters.push(new ESpawn(Input.MousePosition));
	}

}