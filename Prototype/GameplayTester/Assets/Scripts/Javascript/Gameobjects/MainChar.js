function MainChar() 
{
	this.name = "MainChar";
	this.enabled = true;
	this.started = false;
	this.rendered = true;
	this.fixedToCamera = true;


	/*
				Personnal Variable
	*/
	this.gravity = 0;
	this.jumpHeight = 0;
	this.ascension = 0;
	this.topToReach = 0;

	this.jumped = false;

	this.stateChar = {};
	this.stateChar.states = [];
	this.stateChar.states["Run"] = 0;
	this.stateChar.states["Jumping"] = 1;
	this.stateChar.states["Hurt"] = 2;
	this.stateChar.currentState = this.stateChar.states["Run"];

	// set Transition! (Boolean)
	this.stateChar.isJumping = false; // esp
	this.stateChar.onElement = false; // on obstacle for example
	this.stateChar.hurtElement = false; // aie 	
	

	/*
	********************************
	*/
	this.MouseOffset = new Vector();

	this.Parent = null;
	
	this.Transform = {};
	this.Transform.RelativePosition = new Vector();
	this.Transform.Position = new Vector();
	this.Transform.Size = new Vector();
	this.Transform.RelativeScale = new Vector(1,1);
	this.Transform.Scale = new Vector(1,1);
	this.Transform.Pivot = new Vector(0,0);
	this.Transform.angle = 0;

	this.Physics = {};
	this.Physics.enabled = true;
	this.Physics.clickable = false;
	this.Physics.dragAndDroppable = false;
	this.Physics.colliderIsSameSizeAsTransform = true;
	this.Physics.countHovered = 0;
	this.Physics.Collider = new Box();
	/*
				Personnal Variable
	*/
	this.Physics.topCollider = new Box();
	this.Physics.botCollider = new Box();
	this.Physics.rightCollider = new Box();

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
	this.Awake = function() 
	{
		Print('System:GameObject ' + this.name + " Created !");
	};
	this.Start = function() 
	{
		if (!this.started) {
			// operation start
			this.SetPosition( canvas.width*.5 - 10,canvas.height*.5 );
			this.SetSize( 50, 50 );
			this.gravity = 10;
			this.jumpHeight = 400;
			this.ascension = 15;

			// Set Collision
			if (this.Physics.colliderIsSameSizeAsTransform) 
			{
				this.setCollider();
			}

			this.started = true;
			Print('System:GameObject ' + this.name + " Started !");
		}
		this.PreUpdate();
	};
	this.PreUpdate = function() 
	{
		if (this.enabled) 
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
			if (Application.LoadedScene.CurrentCamera != null) 
			{
				Application.LoadedScene.CurrentCamera.Start();
				if (!this.fixedToCamera) 
				{
					this.Transform.Position.x -= Application.LoadedScene.CurrentCamera.Transform.Position.x;
					this.Transform.Position.y -= Application.LoadedScene.CurrentCamera.Transform.Position.y;
				}
			}
			
			this.Update();
		}			
	};
	this.Update = function() 
	{
		// 												Gerer le press for jump ( 1 press = 1 jump )
		if( Input.KeysDown[32] == true ){
			if (!this.stateChar.isJumping) {
				this.topToReach = this.Transform.RelativePosition.y - this.jumpHeight;
			}
			this.stateChar.isJumping = true;
		}
		this.actionToDo();
		this.checkCollideObstacle();
		// Collider  									En fonction des "fonctionnalité" ajouté/supprimé les "set" utile/useless
		if (this.Physics.colliderIsSameSizeAsTransform) 
		{
			this.setCollider();
		}
		// draw en fonction de this.StateChar.currentState
		// Position of MainChar & design
		ctx.fillStyle = "#2EBF98";
		ctx.fillRect(this.Transform.Position.x, this.Transform.Position.y,
					 this.Transform.Size.x, this.Transform.Size.y);

		this.PostUpdate();	
	};
	this.PostUpdate = function() 
	{
		if (Application.debugMode) {
			Debug.DebugObject(this);
			ctx.fillStyle = "red";
			var box = this.Physics.botCollider;
			ctx.fillRect(box.x, box.y, box.w, box.h);
		}
		this.GUI();
	};
	this.GUI = function() {};

	/*
				Personnal Methods
	*/

	this.setCollider = function () {
		// "offset" = "marge"
		var offsetCollide = 10;
		//basic Collider
		this.Physics.Collider.x = this.Transform.RelativePosition.x ;
		this.Physics.Collider.y = this.Transform.RelativePosition.y ;
		this.Physics.Collider.w = this.Transform.Size.x ;
		this.Physics.Collider.h = this.Transform.Size.y ;
		// top Collider
		this.Physics.topCollider.x = this.Transform.RelativePosition.x - offsetCollide;
		this.Physics.topCollider.y = this.Transform.RelativePosition.y - offsetCollide;
		this.Physics.topCollider.w = this.Transform.Size.x + offsetCollide + offsetCollide;
		this.Physics.topCollider.h = offsetCollide;
		// bot Collider
		this.Physics.botCollider.x = this.Transform.RelativePosition.x - offsetCollide;
		this.Physics.botCollider.y = this.Transform.RelativePosition.y + this.Transform.Size.y - offsetCollide;
		this.Physics.botCollider.w = this.Transform.Size.x + offsetCollide  + offsetCollide;
		this.Physics.botCollider.h = offsetCollide;
		// right Collider
		this.Physics.rightCollider.x = this.Transform.RelativePosition.x + this.Transform.Size.x - offsetCollide;
		this.Physics.rightCollider.y = this.Transform.RelativePosition.y - offsetCollide;
		this.Physics.rightCollider.w = offsetCollide + offsetCollide;
		this.Physics.rightCollider.h = this.Transform.Size.y + offsetCollide + offsetCollide;
	};

	this.actionToDo = function(){
		switch(this.stateChar.currentState){
			case this.stateChar.states["Run"] :
				if (this.stateChar.isJumping) this.stateChar.currentState = this.stateChar.states["Jumping"];
				if (this.stateChar.hurtElement) this.stateChar.currentState = this.stateChar.states["Hurt"];
				// il court!
				console.log("Il court");
				break;
			case this.stateChar.states["Jumping"] :
				if (this.stateChar.onElement) this.stateChar.currentState = this.stateChar.states["Run"];
				if (this.stateChar.hurtElement) this.stateChar.currentState = this.stateChar.states["Hurt"];
				// il saute ! 
				if (this.Transform.RelativePosition.y < canvas.height - 50 ) {
					if (!this.jumped) {
						// Fake TWEEN (crested = atteins un sommet)
						if (this.Transform.RelativePosition.y >= this.topToReach) {
							this.Transform.RelativePosition.y -= this.ascension;
						} else {
							this.jumped = true;
						}
					} else {
						
						this.Transform.RelativePosition.y += this.gravity;
					}
				} else {
					// 															GAME OVER
					//console.log("GAME OVER");
					//GODMODE
					this.stateChar.isJumping = false;
					this.jumped = false;
					this.Transform.RelativePosition.y -= 5;
					this.stateChar.currentState = this.stateChar.states["Run"];
				}
				console.log("Il saute");
				break;
			case this.stateChar.states["Hurt"] :
				if (this.stateChar.isJumping) this.stateChar.currentState = this.stateChar.states["Jumping"];
				if (this.stateChar.onElement) this.stateChar.currentState = this.stateChar.states["Run"];
				// il est touché!
				console.log("Il est touché");
			break;
		}
	}
	this.checkCollideObstacle = function () {
		for (var i = 0; i < Scenes["Game"].GameObjects.length; i++) {
			var obs = Scenes["Game"].GameObjects[i];
			if (obs.name === "Obstacle") {
			// Check Collision with Obs
				if (Physics.CheckCollision(this.Physics.Collider, obs.Physics.Collider)) {
					
				}
			}
		}
	};
	/**
	 * @function onHover
	 * @memberof GameObjects/GameObjects
	 * @description
	 *
	 * Counter on hover the GameObject
	 * */
	this.onHover = function() 
	{
		this.Physics.countHovered ++;	
	};

	/**
	 * @function onClicked
	 * @memberof GameObjects/GameObjects
	 * @description
	 *
	 * Set the MouseOffset with mouse position <br/>
	 * Increment the countHovered
	 * */
	this.onClicked = function() 
	{
		this.MouseOffset.x = Input.MousePosition.x - this.Transform.Position.x;
		this.MouseOffset.y = Input.MousePosition.y - this.Transform.Position.y;
		this.Physics.countHovered ++;
	};
	/**
	 * @function onUnHovered
	 * @memberof GameObjects/GameObjects
	 * @description
	 *
	 * Reinitialize the countHovered to 0
	 * */
	this.onUnHovered = function() 
	{
		this.Physics.countHovered = 0;
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
	 * @function SetPositionCollider
	 * @memberof GameObjects/GameObjects
	 *
	 * @param {Number} _x
	 * @param {Number} _y
	 * 
	 * @description
	 * set the x and y position(Physics collider) of game object
	 * */
	this.SetPositionCollider = function(_x, _y)
	{
	    if(typeof _x != 'number') PrintErr("Parameter x in SetPositionCollider Go");
	    if(typeof _y != 'number') PrintErr("Parameter y in SetPositionCollider Go");
		this.Physics.Collider.Position.x = _x;
		this.Physics.Collider.Position.y = _y;
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
	 * @function SetColliderSize
	 * @memberof GameObjects/GameObjects
	 *
	 * @param {Number} _x
	 * @param {Number} _y
	 * 
	 * @description
	 * set the x and y for the collider size of game object
	 * */
	this.SetColliderSize = function(_x, _y)
	{
	    if(typeof _x != 'number') PrintErr("Parameter x in SetColliderSize Go");
	    if(typeof _y != 'number') PrintErr("Parameter y in SetColliderSize Go");
		this.Physics.Collider.Size.x = _x;
		this.Physics.Collider.Size.y = _y;
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
	/**
	 * @function SetSpriteSheet
	 * @memberof GameObjects/GameObjects
	 *
	 * @param {String} _img - the source image of sprite sheet
	 * @param {Vector} _sizeFrame - the size frame of the sprite
	 * @param {Number} _animationLength - how many frame has the sprite sheet
	 *
	 * @description
	 *
	 * Set the sprite sheet source image, the size of one frame and the number of frame the sprite sheet has.
	 * */
	this.SetSpriteSheet = function(_img, _sizeFrame, _animationLength) 
	{
	    if(typeof _img != 'string') PrintErr("Parameter img in SetSpriteSheet");
		if(!(_sizeFrame instanceof(Vector))) PrintErr("Parameter sizeFrame in SetSpriteSheet");
	    if(typeof _animationLength != 'number') PrintErr("Parameter animationLength in SetSpriteSheet");
		this.Renderer.isSpriteSheet = true;
		this.Animation.totalAnimationLength = _animationLength || 0.5;
		this.Renderer.Material.SizeFrame = _sizeFrame;
 		this.Renderer.Material.Source = _img;
 		this.Renderer.Material.CurrentFrame = new Vector(0,0);
 		for (var i = 0; i < _img.height; i += this.Renderer.Material.SizeFrame.y) 
 		{
 			var array = [];
 			for (var j = 0; j < _img.width; j += this.Renderer.Material.SizeFrame.x) 
 			{
 				array.push(new Vector(j, i));
 			}
 			this.Renderer.Animation.Animations.push(array);
 		}
 		this.Renderer.Animation.Current = this.Renderer.Animation.Animations[0];
	}
	this.Awake();
}