function PReward(_isRect, _startPosX,  _changePosX, _startPosY)
{
	var _self = this;
	this.name = "PReward";
	this.enabled = true;
	this.started = false;
	this.rendered = true;
	this.fixedToCamera = true;

	this.MouseOffset = new Vector();

	this.Parent = null;

	// IF it's rect
	this.isRect = _isRect || false;
	this.color = "white";
	this.lineWidth = 5;


	// tween
	//this.startPosX = _startPosX;
	this.startPosX = canvas.width + 300;
	this.startPosY = _startPosY;

	//this.changePosX = _changePosX;
	this.changePosX = -(canvas.width + 300) - 200;

	this.startScale = 0;
 	this.changeScale = 1;

	this.tween;
	this.tabValue = [];
	
	this.Transform = {};
	this.Transform.RelativePosition = new Vector();
	this.Transform.Position = new Vector();
	this.Transform.Size = new Vector();
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
			Source: Images["p02"],
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
					if (this._self.isRect) {
						ctx.beginPath();
						ctx.globalAlpha = 0.5;
						ctx.strokeStyle = this._self.color;
						ctx.lineWidth = this._self.lineWidth;
						ctx.rect(-this.That.Pivot.x*ScaledSizeX,
									-this.That.Pivot.y*ScaledSizeY,
									ScaledSizeX,
									ScaledSizeY);
						ctx.stroke();
						ctx.closePath();
					}
					else
					{
						ctx.drawImage(this.Material.Source,
									-this.That.Pivot.x*ScaledSizeX,
									-this.That.Pivot.y*ScaledSizeY,
									ScaledSizeX,
									ScaledSizeY);
					}
				}
				ctx.restore();
			}
		}
	};

	/**
	 * @function Awake
	 * @memberof GameObjects/GameObjects
	 * @description
	 *
	 * Called at the instruction new GameObject()
	 * */
	this.Awake = function() 
	{
		//Print('System:GameObject ' + this.name + " Created !");
	};

	/**
	 * @function Start
	 * @memberof GameObjects/GameObjects
	 * @description
	 *
	 * Start the GameObject and show a message in console or launch Update() if already started <br/>
	 * Set the transform component to the physics collider
	 * */
	this.Start = function() 
	{
		if (!this.started) {
			// operation start
			this.SetSize(200,200);
			this.SetScale(1,1);
			this.Transform.RelativePosition.y = this.startPosY;
			this.Transform.angle = -120;

			this.tween = new TweenAnim([this.startPosX, this.startScale],
										[this.changePosX, this.changeScale],
										2, "Cubic", "In", 
										function(){});

			this.started = true;
			Print('System:GameObject ' + this.name + " Started !");
		}
		this.PreUpdate();
	};

	/**
	 * @function PreUpdate
	 * @memberof GameObjects/GameObjects
	 * @description
	 *
	 * If GameObject in group (parent), take relative position from parent position <br/>
	 * If not, set GameObject own position <br/>
	 *
	 * Start the camera if exist and set position if fixed
	 *
	 * */
	this.PreUpdate = function() 
	{
		if (this.enabled) 
		{
			//[PosionX, PosionY, angle]
			this.tabValue = this.tween.recoverValue();
			this.Transform.RelativePosition.x = this.tabValue[0];
			//this.Transform.RelativeScale = new Vector(this.tabValue[1], this.tabValue[1]);

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
			this.Update();
		}
			
	};
	/**
	 * @function Update
	 * @memberof GameObjects/GameObjects
	 * @description
	 *
	 * Call postUpdate function (each frame)
	 * */
	this.Update = function() 
	{
		this.Renderer.Draw();
		this.PostUpdate();	
	};
	/**
	 * @function PostUpdate
	 * @memberof GameObjects/GameObjects
	 * @description
	 *
	 * Execute PostUpdate. If DebugMode is active, diplay GameObject in debug mode
	 *
	 * */
	this.PostUpdate = function() 
	{
	};
	/**
	 * @function SetPosition
	 * @memberof GameObjects/GameObjects
	 *
	 * @param {Number} _x
	 * @param {Number} _y
	 * 
	 * @description
	 * set the x and y position(Transform) of game object
	 * */
	this.SetPosition = function(_x, _y)
	{
	    if(typeof _x != 'number') PrintErr("Parameter x in SetPosition Go");
	    if(typeof _y != 'number') PrintErr("Parameter y in SetPosition Go");
		this.Transform.RelativePosition.x = _x;
		this.Transform.RelativePosition.y = _y;
	};
	/**
	 * @function SetSize
	 * @memberof GameObjects/GameObjects
	 *
	 * @param {Number} _x
	 * @param {Number} _y
	 * 
	 * @description
	 * set the x and y for the size of game object
	 * */
	this.SetSize = function(_x, _y)
	{
	    if(typeof _x != 'number') PrintErr("Parameter x in SetSize Go");
	    if(typeof _y != 'number') PrintErr("Parameter y in SetSize Go");
		this.Transform.Size.x = _x;
		this.Transform.Size.y = _y;
	};
	/**
	 * @function SetScale
	 * @memberof GameObjects/GameObjects
	 *
	 * @param {Number} _x
	 * @param {Number} _y
	 * 
	 * @description
	 * set the x and y for the scale of game object
	 * */
	this.SetScale = function(_x, _y)
	{
	    if(typeof _x != 'number') PrintErr("Parameter x in SetScale Go");
	    if(typeof _y != 'number') PrintErr("Parameter y in SetScale Go");
		this.Transform.RelativeScale.x = _x;
		this.Transform.RelativeScale.y = _y;
	};

	/**
	 * @function SetPivot
	 * @memberof GameObjects/GameObjects
	 *
	 * @param {Number} _x
	 * @param {Number} _y
	 * 
	 * @description
	 * set the x and y for the pivot of game object
	 * */
	this.SetPivot = function(_x, _y)
	{
	    if(typeof _x != 'number') PrintErr("Parameter x in SetPivot Go");
	    if(typeof _y != 'number') PrintErr("Parameter y in SetPivot Go");
		this.Transform.Pivot.x = _x;
		this.Transform.Pivot.y = _y;
	};

	this.Awake();
}