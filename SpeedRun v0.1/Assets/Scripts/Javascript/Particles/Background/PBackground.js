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
function PBackground(_particleSystem, _position, _velocity) 
{
	this.ps = _particleSystem;
	this.Position = _position;
	this.Velocity = _velocity;
	this.color = "#10FCDD";
	this.Acceleration = new Vector();
	this.outOfBounds = false;

	this.started = false;
	/* Test : Tween */
	this.tween = null;
	this.tabValue = [];

	this.offset = 500;

	this.finalScale = 30;

	this.Transform = {};
	this.Transform.RelativePosition = _position;
	this.Transform.Position = new Vector();
	this.Transform.Size = new Vector();
	this.Transform.RelativeScale = new Vector(1,1);
	this.Transform.Scale = new Vector(1,1);
	this.Transform.Pivot = new Vector(0,0);
	this.Transform.angle = 0;

	this.Renderer = 
	{
		isVisible: true,
		isSpriteSheet: false,
		That: this.Transform,
		Material: 
		{
			Source: "",
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
			//console.log(this.That.Scale.x);
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
				ctx.drawImage(this.Material.Source,
								-this.That.Pivot.x*ScaledSizeX,
								-this.That.Pivot.y*ScaledSizeY,
								ScaledSizeX,
								ScaledSizeY);
			}
			ctx.restore();
		}
	};

}
PBackground.prototype.Start = function() 
{
	if (!this.started){
		this.Renderer.Material.Source = Images["Particle"];

		this.Transform.RelativeScale = new Vector(10, 10);
		this.Transform.Size = new Vector(10, 10);

		this.createTween();


		this.started = true;
	}
	this.PreUpdate();
}

PBackground.prototype.PreUpdate = function() 
{
	
	this.Transform.Position.x = this.Transform.RelativePosition.x;
	this.Transform.Position.y = this.Transform.RelativePosition.y;

	this.Transform.Scale.x = this.Transform.RelativeScale.x;
	this.Transform.Scale.y = this.Transform.RelativeScale.y;
	
	this.Update();		
};
/**
*
*Updates the values ​​of the particle. If they are out of the canvas , they are destroying it
*  
*
**/

PBackground.prototype.Update = function()
{
	// tween --> change scale, rotate , blabla
	this.tabValue = this.tween.recoverValue();
	//console.log(this.tabValue[0]);
	this.Transform.RelativeScale.x = this.tween.startValue[0] + this.tabValue[0];
	this.Transform.RelativeScale.y = this.tween.startValue[0] + this.tabValue[0];

	this.Transform.angle = this.tween.startValue[1] + this.tabValue[1];


	this.SubmitToFields();
	this.Velocity.x = -this.Transform.RelativeScale.x*.2;
	this.Velocity.Add(this.Acceleration);
	this.Transform.RelativePosition.Add(this.Velocity);

	if (this.Transform.RelativePosition.x < -this.offset 
		|| this.Transform.RelativePosition.y < -this.offset
		|| this.Transform.RelativePosition.y > canvas.heigth + this.offset) 
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

PBackground.prototype.Render = function()
{
	this.Renderer.Draw();
	// ctx.fillStyle = this.color;
	// ctx.fillRect(this.Transform.Position.x,
	// 			 this.Transform.Position.y,
	// 			 this.Transform.Size.x,
	// 			 this.Transform.Size.y);
};

/**
*
*apply a strengh to the particles from Fields
*
**/
PBackground.prototype.SubmitToFields = function()
{
	for (var i = 0; i < this.ps.Fields.length; i++) {
		
		var field = this.ps.Fields[i];
		var vector = new Vector();
		vector.x = field.Position.x - this.Position.x;
		vector.y = field.Position.y - this.Position.y;

		var strength = field.mass / vector.LengthSq();
		//var strength = field.mass / Math.pow(vector.LengthSq(),1.5);
		this.Acceleration = vector.Multiply(new Vector(strength, strength));
	}
};
PBackground.prototype.createTween = function() {
		// [ 10 = scale, can add rotate? ]
		var startScale = Math.Random.RangeInt(5, 10, true);
		var changeScale = Math.Random.RangeInt(5, 7, true);
		var duration = Math.Random.RangeInt(60,90, true);

		var startRotate = Math.Random.RangeInt(-360, 360, true);
		//console.log(startRotate);
		var changeRotate = Math.Random.RangeInt(-50, 50, true);
		//console.log(changeRotate);
		this.tween = new TweenAnim(	[startScale, startRotate],
									[changeScale, changeRotate],
									duration,
									"Quartic",
									"Out");
	}