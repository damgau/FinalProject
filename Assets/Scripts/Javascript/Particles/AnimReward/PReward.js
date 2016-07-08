/* Fonctionne uniquement si le premier GameObject de la scene est le systeme de particules */

/**
*
* Create a particle
* @class
* 
* @param {Number} _position - set a position of particle
* @param {Number} _velocity - set a velocity of particle
* @param {String} _color - set a color of particle
*
**/
function PReward(_ps,_position, _velocity) 
{
	this.Velocity = _velocity;
	this.Acceleration = new Vector();
	this.outOfBounds = false;
	this.ps = _ps;

	this.started = false;

	this.Transform = {};
	this.Transform.RelativePosition = _position;
	this.Transform.Position = new Vector();
	this.Transform.Size = new Vector(60, 60);
	this.Transform.RelativeScale = new Vector(1,1);
	this.Transform.Scale = new Vector(1,1);
	this.Transform.Pivot = new Vector(.5,.5);
	this.Transform.angle = 0;

	this.Renderer = 
	{
		_self : this,
		isVisible: true,
		isSpriteSheet: false,
		That: this.Transform,
		Material: 
		{
			Source:"",
			SizeFrame: new Vector(),
			CurrentFrame: new Vector(),
		},
		animationCount:0,
		Animation:
		{
			animated: true,
			Animations: [],
			Current:[],
			countdown:0,
			currentIndex: 0,
			totalAnimationLength: 0.5
		},
		/**
		 * 
		 * @function Draw
		 * @memberof GameObjects/GameObjects
		 *
		 * @description
		 * Draw the game object component
		 *  
		 * */
		Draw: function() 
		{
			if (this.isVisible) {
				var ScaledSizeX = this.That.Size.x*this.That.Scale.x;
				var ScaledSizeY = this.That.Size.y*this.That.Scale.y;

				ctx.save();
				ctx.translate((this.That.Position.x), (this.That.Position.y));
				ctx.rotate(Math.DegreeToRadian(this.That.angle));
				if (this.isSpriteSheet) 
				{
					if (this.Animation.animated)
					{	
						if (this.animationCount > this.Animation.totalAnimationLength / this.Animation.Current.length) 
						{
							this.Animation.currentIndex ++ ;
							this.animationCount = 0 ;
							if (this.Animation.currentIndex > this.Animation.Current.length-1) 
							{
								this.Animation.currentIndex = 0;
							}
						} 
						
						this.animationCount += Time.deltaTime;
						
					}
					else 
					{
						this.animationCount = 0;
						this.Animation.currentIndex = 0;
					}
					this.Material.CurrentFrame = this.Animation.Current[this.Animation.currentIndex];

					ctx.drawImage(this.Material.Source,
									this.Material.CurrentFrame.x,
									this.Material.CurrentFrame.y,
									this.Material.SizeFrame.x,
									this.Material.SizeFrame.y,
									-this.That.Pivot.x*ScaledSizeX,
									-this.That.Pivot.y*ScaledSizeY,
									ScaledSizeX,
									ScaledSizeY);
				}
				else 
				{
					ctx.globalAlpha = 0.8;
					ctx.drawImage(this.Material.Source,
								-this.That.Pivot.x*ScaledSizeX,
								-this.That.Pivot.y*ScaledSizeY,
								ScaledSizeX,
								ScaledSizeY);
				}
				ctx.restore();
			}
		}
	};
}
PReward.prototype.Start = function()
{
	if(!this.started) {
		var rdm = Math.Random.RangeInt(0,3, false);
		if (rdm == 1) this.Renderer.Material.Source = Images["OrbGreenClassic"];
		else this.Renderer.Material.Source = Images["OrbWhiteClassic"];

		this.started = true;
	}
	this.Update();
}
/**
*
*Updates the values ​​of the particle. If they are out of the canvas , they are destroying it
*  
*
**/

PReward.prototype.Update = function()
{
	this.Transform.Position = this.Transform.RelativePosition;

	this.SubmitToFields();
	this.Velocity.Add(this.Acceleration);
	this.Transform.RelativePosition.Add(this.Velocity);

	if (this.Transform.RelativePosition.x < 0 || this.Transform.RelativePosition.x > canvas.width || 
		this.Transform.RelativePosition.y < 0 || this.Transform.RelativePosition.x > canvas.heigth) 
	{
		this.outOfBounds = true;
	}
	if (this.Transform.RelativePosition.y > canvas.height - canvas.height*.1) 
	{
		this.outOfBounds = true;
	}

	this.Render();
};

/**
*
*draws the particle with its color and sizes
*  
*
**/

PReward.prototype.Render = function()
{
	this.Renderer.Draw();
	//ctx.fillStyle = "yellow";
	//ctx.fillRect(this.Position.x, this.Position.y, 10, 10);
};

/**
*
*apply a strengh to the particles from Fields
*
**/
PReward.prototype.SubmitToFields = function()
{
	for (var i = 0; i < this.ps.Fields.length; i++) {
		
		var field = this.ps.Fields[i];
		var vector = new Vector();
		vector.x = field.Position.x - this.Transform.RelativePosition.x;
		vector.y = field.Position.y - this.Transform.RelativePosition.y;

		var strength = field.mass / vector.LengthSq();
		this.Acceleration = vector.Multiply(new Vector(strength, strength));
	}
};