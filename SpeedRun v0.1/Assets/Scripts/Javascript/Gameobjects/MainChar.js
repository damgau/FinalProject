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
	_self = this;
	this.score = 0;
	this.gravity = 0;
	this.jumpHeight = 0;

	this.obsTouched = null;

	this.stateChar = {};
	this.stateChar.states = [];
	this.stateChar.states["Run"] = 0;
	this.stateChar.states["Jumping"] = 1;
	this.stateChar.states["Hurt"] = 2;
	this.stateChar.states["Spell"] = 3;
	this.stateChar.currentState = this.stateChar.states["Run"];

	// set Transition! (Boolean)
	this.stateChar.isJumping = false;
	this.stateChar.onElement = false;
	this.stateChar.hurtElement = false; 
	this.stateChar.castingSpell = false;
	
	// TWEEN
	this.tweenJump = null;
	this.tweenGravity = null;
	// E Ekko
	this.tweenSpell = null;
	//tweenSpell ?

	// Timer : Spells
	this.timerDash = null;
	this.canUseDash = true;

	// tab qui va recupere les informations donner par un tween
	this.relativeValue = [];

	/*
	****************************
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
			Source: Images["Runner"],
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
			totalAnimationLength: 0.2
		},
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
			this.SetPosition( canvas.width*.4,canvas.height*.5 );
			this.SetSize(80, 120);
			this.SetSpriteSheet( Images["marineRun1"],new Vector(124,232) );
			
			this.gravity = 10;
			// Hauteur à atteindre en plus de la position actuel
			this.jumpHeight = -(canvas.height*.32);
			//								_startValue, _changeValue, _duration, _type, _underType
			this.tweenGravity = new TweenAnim([0],[this.gravity], .5, "Quartic", "Out");

			// Timer Spell
			//this.timerDash = new Timer(_duration, _isRepeat, _Action, _Callback, _isStarted);
			// Action --> draw/write 4 - 3 - 2 - 1 "UP"
			// Callback ? "UP"
			this.timerDash = new Timer(4, true, null, this.callbackSpell, false);

			// Starter Jump
			this.tweenGravity.Reset();
			this.stateChar.onElement = false;
			this.stateChar.isJumping = true;
			// Lancer le tween pour jump!
			this.tweenJump = new TweenAnim([this.Transform.RelativePosition.y],[this.jumpHeight], .5, "Quadratic", "Out");
			this.tweenJump.Start();


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
			// Collider  									En fonction des "fonctionnalité" ajouté/supprimé les "set" utile/useless
			if (this.Physics.colliderIsSameSizeAsTransform) 
			{
				this.setCollider();
			}
			this.Update();
		}			
	};
	this.Update = function() 
	{
		this.score++;
		// A Z E R
		if (!this.stateChar.castingSpell && this.canUseDash) {
			if (Input.KeysDown[65]) {
			this.timerDash.Reset();
			this.stateChar.castingSpell = true;
			}
		}
		this.actionToDo();
		// draw en fonction de this.StateChar.currentState (sprite)
		// Position of MainChar & design
		//ctx.fillStyle = "#2EBF98";
		//ctx.fillRect(this.Transform.Position.x, this.Transform.Position.y,
		//			 this.Transform.Size.x, this.Transform.Size.y);
		this.Renderer.Draw();
		this.PostUpdate();	
	};
	this.PostUpdate = function() 
	{
		if (Application.debugMode) {
			Debug.DebugObject(this);
			ctx.fillStyle = "red";
			var box = this.Physics.topCollider;
			//ctx.fillRect(box.x, box.y, box.w, box.h);
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
		this.Physics.Collider.x = this.Transform.Position.x ;
		this.Physics.Collider.y = this.Transform.Position.y ;
		this.Physics.Collider.w = this.Transform.Size.x ;
		this.Physics.Collider.h = this.Transform.Size.y ;
		// top Collider
		this.Physics.topCollider.x = this.Transform.Position.x;
		this.Physics.topCollider.y = this.Transform.Position.y;
		this.Physics.topCollider.w = this.Transform.Size.x;
		this.Physics.topCollider.h = offsetCollide;
		// bot Collider
		this.Physics.botCollider.x = this.Transform.Position.x;
		this.Physics.botCollider.y = this.Transform.Position.y + this.Transform.Size.y - offsetCollide;
		this.Physics.botCollider.w = this.Transform.Size.x;
		this.Physics.botCollider.h = offsetCollide;
		// right Collider
		this.Physics.rightCollider.x = this.Transform.Position.x + this.Transform.Size.x - offsetCollide;
		this.Physics.rightCollider.y = this.Transform.Position.y;
		this.Physics.rightCollider.w = offsetCollide;
		this.Physics.rightCollider.h = this.Transform.Size.y;

	};

	this.actionToDo = function(){
		//console.log(this.stateChar.currentState);
		switch(this.stateChar.currentState){
			case this.stateChar.states["Run"] :
				if (this.stateChar.castingSpell) {
					this.stateChar.currentState = this.stateChar.states["Spell"];
					break;
				}
				if (this.stateChar.isJumping) {
					this.stateChar.currentState = this.stateChar.states["Jumping"];
					break;
				} 
				if (this.stateChar.hurtElement) {
					this.stateChar.currentState = this.stateChar.states["Hurt"];
					break;
				}
				this.run();
				break;
			case this.stateChar.states["Jumping"] :
				if (this.stateChar.castingSpell) {
					this.stateChar.currentState = this.stateChar.states["Spell"];
					break;
				}
				if (this.stateChar.onElement) {
					this.stateChar.currentState = this.stateChar.states["Run"];
					break;	
				}
				if (this.stateChar.hurtElement) {
					this.stateChar.currentState = this.stateChar.states["Hurt"];
					break;
				}
				this.jump();
				break;
			case this.stateChar.states["Hurt"] :
				if (this.stateChar.castingSpell) {
					this.stateChar.currentState = this.stateChar.states["Spell"];
					break;
				}
				if (this.stateChar.isJumping){
					this.stateChar.currentState = this.stateChar.states["Jumping"];
					break;
				}
				if (this.stateChar.onElement) {
					this.stateChar.currentState = this.stateChar.states["Run"];
					break;	
				}
				this.hurt();
				break;
			case this.stateChar.states["Spell"] : 

				if (!this.stateChar.castingSpell) {
					if (this.stateChar.isJumping) {
						this.stateChar.currentState = this.stateChar.states["Jumping"];
						break;
					}
					if (this.stateChar.onElement) {
						this.stateChar.currentState = this.stateChar.states["Run"];
						break;	
					}
					if (this.stateChar.hurtElement) {
						this.stateChar.currentState = this.stateChar.states["Hurt"];
						break;
					}
				}
				this.spell();
				break;
		}
	}
	// this.checkCollideObstacle = function () {
	// 	for (var i = 0; i <  Scenes["Game"].GameObjects.length; i++) {
	// 		var obs =  Scenes["Game"].GameObjects[i];
	// 		if (obs.name === "Obstacle") {
	// 		// Check Collision with Obs
	// 			if (Physics.CheckCollision(this.Physics.Collider, obs.Physics.Collider)) {
	// 				this.obsTouched = obs;
	// 				return true;
	// 			}
	// 		}
	// 	}
	// 	return false;
	// };

	this.checkCollideObstacle = function () {
		for (var i = 0; i <  Application.LoadedScene.GameObjects.length; i++) {
			var obs =  Application.LoadedScene.GameObjects[i];
			if (obs.name === "Obstacle") {
			// Check Collision with Obs
				if (Physics.CheckCollision(this.Physics.Collider, obs.Physics.Collider)) {
					this.obsTouched = obs;
					return true;
				}
			}
		}
		return false;
	};
	this.checkCollideOtherObs = function() {
		for (var i = 0; i <  Application.LoadedScene.GameObjects.length; i++) {
			var obs =  Application.LoadedScene.GameObjects[i];
			if (obs.name === "Obstacle" && !this.obsTouched) {
			// Check Collision with Obs
				if (Physics.CheckCollision(this.Physics.Collider, obs.Physics.Collider)) {
					this.obsTouched = obs;
					return true;
				}
			}
		}
		return false;
	}

	this.checkCollideObstacleTop = function() {

		return Physics.CheckCollision(this.Physics.botCollider, this.obsTouched.Physics.topCollider);
	};
	this.checkCollideObstacleLeft = function() {

		return Physics.CheckCollision(this.Physics.rightCollider, this.obsTouched.Physics.leftCollider);
	};
	this.checkCollideObstacleBot = function() {

		return Physics.CheckCollision(this.Physics.topCollider, this.obsTouched.Physics.botCollider);
	};
	this.run = function() {
		this.SetSpriteSheet( Images["marineRun1"],new Vector(124,232) );
		if( Input.KeysDown[32] ){
			this.tweenGravity.Reset();
			this.stateChar.onElement = false;
			this.stateChar.isJumping = true;
			// Lancer le tween pour jump!
			this.tweenJump = new TweenAnim([this.Transform.RelativePosition.y],[this.jumpHeight], .5, "Quadratic", "Out");
			this.tweenJump.Start();
		}

		else if (this.obsTouched) {
			if (!Physics.CheckCollision(this.Physics.Collider, this.obsTouched.Physics.Collider)) {
				this.stateChar.onElement = false;
				this.stateChar.isJumping = true;
				// call gravity
				this.tweenGravity.Start();
			}
		}
		else {
			// Starter or GameOver
		}
	};
	this.jump = function() {
		if (!this.gameOver()) {
			if (this.checkCollideObstacle()) {
				// Run
				if (this.checkCollideObstacleTop()) {
					if (this.tweenJump.isFinished) {
						this.stateChar.onElement = true;
						this.stateChar.isJumping = false;
					}
					else {
						this.relativeValue = this.tweenJump.recoverValue();
						this.Transform.RelativePosition.y = this.relativeValue[0];
					}
				}
				// Down
				else if (this.checkCollideObstacleBot()) {
					this.tweenJump.isFinished = true;
					this.tweenGravity.Start();
					this.relativeValue = this.tweenGravity.recoverValue();
					this.Transform.RelativePosition.y += this.relativeValue[0];
				}
				// Hurt
				else if (this.checkCollideObstacleLeft()) {
					this.stateChar.hurtElement = true;
					this.stateChar.isJumping = false;
				}
				else {
					console.log("WTF");
					if (this.tweenJump.isFinished) {
						this.relativeValue = this.tweenGravity.recoverValue();
						this.Transform.RelativePosition.y += this.relativeValue[0];	
					} else {
						this.relativeValue = this.tweenJump.recoverValue();
						this.Transform.RelativePosition.y = this.relativeValue[0];
					}
					
				}
			}
			// Down || UP
			else {
				this.SetSpriteSheet( Images["marineRun2"],new Vector(124,232) );
				// UP
				if (!this.tweenJump.isFinished) {
					this.relativeValue = this.tweenJump.recoverValue();
					this.Transform.RelativePosition.y = this.relativeValue[0];
				}
				// DOWN
				else {
					
					this.relativeValue = this.tweenGravity.recoverValue();
					this.Transform.RelativePosition.y += this.relativeValue[0];
					//console.log(this.tweenGravity);
					// TIMER a pas été Awake!
				}
			}
		}
		else {
			// Game Over
			if (Application.LoadedScene == Scenes["Game"]) {
				Scenes["Home"].lastScore = this.score;
					if (Application.LoadedScene.diffMode === "easy" && this.score > Scenes["Home"].bestScoreEasy) {
						Scenes["Home"].bestScoreEasy = this.score;
					}
					if (Application.LoadedScene.diffMode === "normal" && this.score > Scenes["Home"].bestScoreNormal) {
						Scenes["Home"].bestScoreNormal = this.score;
					}
					if (Application.LoadedScene.diffMode === "hard" && this.score > Scenes["Home"].bestScoreHard) {
						Scenes["Home"].bestScoreHard = this.score;
					}
			}
			Time.Timers = [];
			Application.LoadedScene = Scenes["Home"];			
			// Cheat Mode
			// this.stateChar.onElement = true;
			// this.stateChar.isJumping = false;
			// this.obsTouched = null;
			// this.Transform.RelativePosition.y -= 5;
			
		}
	};
	this.hurt = function() {

		if (Physics.CheckCollision(this.Physics.Collider, this.obsTouched.Physics.Collider)) {
			// check if collision with another obj (not obsTouched)
			if (this.tweenJump.isFinished) {
				//this.obsTouched.speed = 0;
				this.relativeValue = this.tweenGravity.recoverValue();
				this.Transform.RelativePosition.y += this.relativeValue[0];
			} else {
				this.relativeValue = this.tweenJump.recoverValue();
				this.Transform.RelativePosition.y = this.relativeValue[0];
			}
		}
		else {
			//														Need to create tweenObs (0 --> Scenes["Game"].generalSpeed)
			//this.obsTouched.speed = Scenes["Game"].generalSpeed;
			this.obsTouched.tweenSpeed = new TweenAnim([0],[Scenes["Game"].generalSpeed],
														 1, "Quadratic", "Out");
			//this.obsTouched.tweenSpeed.Start();
			this.stateChar.isJumping = true;
			this.stateChar.hurtElement = false;
		}
	};
	this.spell = function() {
		if (!this.tweenSpell) {
			// creer un boolean par spell & un timer
			if (Input.KeysDown[65]) {
				this.tweenSpell = new TweenAnim([this.Transform.Position.y], [this.jumpHeight], .2, "Exponential", "Out");
				for (var i = 0; i <  Scenes["Game"].GameObjects.length; i++) {
					var obj = Scenes["Game"].GameObjects[i];
					if (obj.name === "Obstacle") {
						obj.tweenSpell = new TweenAnim([obj.Transform.Position.x], [this.jumpHeight], .2, "Exponential", "Out");
					}
				}
			}		
		}
		else {
			if (!this.tweenSpell.isFinished) {
					this.relativeValue = this.tweenSpell.recoverValue();
					this.Transform.RelativePosition.y = this.relativeValue[0];
			}
			else {

				// set this.tweenSpell = null when spell is finish (for "init" next spell)
				this.tweenSpell = null;
				this.stateChar.castingSpell = false;
				this.timerDash.isStarted = true;
				this.canUseDash = false;
				this.tweenJump.isFinished = true;
			}
		}
	}
	this.callbackSpell = function(){
		_self.canUseDash = true;
	}
	this.gameOver = function(){
		if (this.Transform.RelativePosition.y > canvas.height) {
			console.log("Game Over");
			return true;
		}
		return false;
	}
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
	/*this.SetSpriteSheet = function(_img, _sizeFrame, _animationLength) 
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
	}*/

	this.SetSpriteSheet = function(_img, _sizeFrame) {
		this.Renderer.isSpriteSheet = true;
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