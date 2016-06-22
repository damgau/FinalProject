/**
 * Create a new Particles System
 * 
 * @class
 * @param {Vector} _position - The position of the ParticlesSystem
 * @return {ParticlesSystem}
 * */
function PSBackground(_position)
{
	this.name = "PSBackground";
	this.enabled = true;
	this.started = false;
	this.rendered = true;

	this.Parent = null;

	this.Emitters = [];
	this.Fields = [];
	
	this.Transform = {};
	this.Transform.RelativePosition = _position;
	this.Transform.Position = new Vector();
	this.Transform.RelativeScale = new Vector(1, 1);
	this.Transform.Size = new Vector();
	this.Transform.Scale = new Vector(1,1);

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
			//				EMitter : (_ParticuleSystem, _position, _velocity, _spread, _rate, _max)
			this.Emitters.push(new EBackground(
					this,
					new Vector(canvas.width + 250, canvas.height*.5),
					//new Vector(-.2, 0), 						GOOD VELOCITY
					new Vector(-.2, 0),
					null,
					1,
					10
				));
			// this.Fields.push(new FBackground(
			// 		new Vector(canvas.width*.3, canvas.height*.5 ),
			// 		//.02
			// 		-.05
			// 	));
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
			if (this.Parent != null)
			{
				this.Transform.Position.x = this.Transform.RelativePosition.x + this.Parent.Transform.Position.x;
				this.Transform.Position.y = this.Transform.RelativePosition.y + this.Parent.Transform.Position.y;
				this.Transform.Scale.x = this.Transform.RelativeScale.x * this.Parent.Transform.Scale.x;
				this.Transform.Scale.y = this.Transform.RelativeScale.y * this.Parent.Transform.Scale.y;
			}
			else
			{
				this.Transform.Position.x = this.Transform.RelativePosition.x;
				this.Transform.Position.y = this.Transform.RelativePosition.y;
				this.Transform.Scale.x = this.Transform.RelativeScale.x;
				this.Transform.Scale.y = this.Transform.RelativeScale.y;
			}

			for (var emitter in this.Emitters) 
			{
				this.Emitters[emitter].Update();
			}

			for (var field in this.Fields){
				this.Fields[field].Update();
			}
		}
	};

	this.Awake();

}