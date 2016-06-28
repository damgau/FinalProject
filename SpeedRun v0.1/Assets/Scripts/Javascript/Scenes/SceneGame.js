function SceneGame(_difMode) 
{
	this.name = "Game";
	this.GameObjects =[];
	this.Groups = [];
	this.Cameras = [];
	this.CurrentCamera = null;
	this.AlphaMask = null;
	this.started = false;

	this.WorldSize = new Vector(4096,4096);

	/*
				Personnal Variable
	*/
	this.mainChar;

	this.background;
	this.psBackground;

	this.rangeFirstPlan = canvas.height*.4;

	this.diffMode = _difMode;
	this.obsToGenerate = 0;

	this.generalSpeed = 0;
	this.timerEnergie = null;
	this.durationEnergie;
	this.timerReward = null;
	var _self = this;
	/*
				Test : Jauge d'energie
	*/
	this.obsAvailable = 0;
	this.obsAvailableMax = 0;
	/* 
				GUI
	*/
	this.posUI = canvas.width*.8;

	/*
				GUI : Jauge Energie
	*/
	this.maxWidth = 200;
	this.widthByEnergie = 0;
	this.currentWidth = 0;
	this.reloadWidth = 0; 
	this.feedbackEnergie;

	/* 
				GUI SPELL
	*/

	this.nbSpell = 4;
	this.widthBySpell = 0;
	this.feedbackSpell;


	/* 
				ANIM
	*/
	this.psSpawn;
	this.PSFirstPlan;

	this.Awake = function() 
	{
		console.clear();
		Print('System:Scene ' + this.name + " Created !");
	}

	this.Start = function() 
	{
		if (!this.started) 
		{
			Time.SetTimeWhenSceneBegin();
			// operation start
			// create background
			this.background = new Background();
			this.psBackground = new PSBackground(new Vector(0, 0));
			// create MainChar
			this.mainChar = new MainChar();
			// nb Spell
			this.widthBySpell = this.maxWidth/this.nbSpell;
			this.generalSpeed = 10;
			// nb obstacle utilisable (Energie)
			var tempObstacle = new Obstacle(
												new Vector( canvas.width*.7, canvas.height*.5 ),
												this.generalSpeed
											);
			this.GameObjects.push(tempObstacle);
			this.GameObjects.push(new Obstacle(null, this.generalSpeed));

			if (this.diffMode === "easy") {
				this.obsToGenerate = 5;
				this.obsAvailable = 3;
				this.obsAvailableMax = 3;
				this.durationEnergie = .5;
			}
			if (this.diffMode === "normal") {
				this.obsToGenerate = 4;
				this.obsAvailable = 3;
				this.obsAvailableMax = 3;
				this.durationEnergie = 1;
			}
			if (this.diffMode === "hard") {
				this.obsToGenerate = 2;
				this.obsAvailable = 3;
				this.obsAvailableMax = 3;
				this.durationEnergie = 2;
			}
			// Timer regenerate obs
			// 						ATTENTION : Ne pas oublier de reset (action) si Timer n'est pas "fini"
			this.timerEnergie = new Timer(this.durationEnergie, true, this.IncrementGUIEnergie, this.canIncrementEnergie, false);
			this.timerReward = new Timer(2, true, null, this.GenerateReward, true);

			/*Spawn Anim*/
			this.psSpawn = new PSSpawn();
			this.PSFirstPlan = new PSFirstPlan();

			// boucle for console.log
			// for (var i = 0; i < this.GameObjects.length; i++) {
			// 	console.log(this.GameObjects[i].Physics.Collider);
			// }

			this.started = true;
			Print('System:Scene ' + this.name + " Started !");
			Time.SetTimeWhenSceneLoaded();
		}
		this.Update();
	}
	/**
	 * Start every GameObject, Group and apply the debug mode if asked
	 * Called each frame,code game is here.
	 * */
	this.Update = function() 
	{
		if (!Application.GamePaused) 
		{
			// Background
			this.background.Start();
			this.psBackground.Start();

			// generate auto : OBS
			if (this.GameObjects.length < this.obsToGenerate) {
				var pos = new Vector(canvas.width + 10,Math.Random.RangeInt(250, canvas.height - 250, false));
				if (this.canAutoGenerateObs(pos.x)) {
					if (pos.y < this.rangeFirstPlan) {
						var obs = new Obstacle(pos, this.generalSpeed, true);
					} else {
						var obs = new Obstacle(pos, this.generalSpeed, false);
					}
					this.GameObjects.push(obs);
				}
			}


			//generate onClick : OBS
			if (Input.mouseClick) {
			//if (Input.mouseLongClick) {

				this.onClick();
				this.timerEnergie.Reset();
			}
			this.regenEnergie();

			// "LastPlan"
			for (var i = 0; i < this.GameObjects.length; i++) 
			{
				if (!this.GameObjects[i].isFirstPlan) {
					this.GameObjects[i].Start();
				}

				// Remove reward catched
				if (this.GameObjects[i].name === "Reward") {
					if (Physics.CheckCollision(this.mainChar.Physics.Collider, this.GameObjects[i].Physics.Collider)) {
						this.incrementEnergie();
						var pos = this.GameObjects[i].Transform.Position;
						this.PSFirstPlan.addEmitter(1);
						this.GameObjects.splice(i,1);
						i--;
						break;
					}
				}

				// Remove useless GO or Call particuleSystem (effect)
				if (this.GameObjects[i].name === "Obstacle" || this.GameObjects[i].name === "Reward") {
					// 400(number) : marge pour ne pas supprimer l'objet trop tôt
					// doit etre un peu plus grand que this.GameObjects[i].Transform.Size
					if (this.GameObjects[i].Transform.Position.x < -400) {
						this.GameObjects.splice(i,1);
						i--;
					}
				}
			}
			// for (var i = 0; i < this.Groups.length; i++) 
			// {
			// 	this.Groups[i].Start();
			// }
			
			// MAIN CHAR last start : position
			this.mainChar.Start();
			
			// First Plan
			for (var i = 0; i < this.GameObjects.length; i++) 
			{
				if (this.GameObjects[i].isFirstPlan) {
					this.GameObjects[i].Start();
				}
			}


			// Spawn on click
			this.psSpawn.Start();
			this.PSFirstPlan.Start();


			// Calcul for GUI
			this.widthByEnergie = this.maxWidth/this.obsAvailableMax;
			this.currentWidth = this.widthByEnergie*this.obsAvailable;
			this.maxWidth = this.widthByEnergie*this.obsAvailableMax;
		}
		if (Application.debugMode) 
		{
			Debug.DebugScene();
		}
		this.GUI();
	}
	this.GUI = function() 
	{
		if (!Application.GamePaused) 
		{
			//Show UI

			this.maxWithEnergieUI();
			// Score
			ctx.fillStyle = "#F4F3F3";
			ctx.fillText( this.mainChar.score,canvas.width - canvas.width*.1, canvas.height*.1,
						 50, 50);
			// Jauge ENERGIE
			this.jaugeEnergieUI();
			// Spell
			this.spellUI();
			this.withEnergieUI();
			
		} 
		else 
		{
			// Show pause menu
		}
	}
	// this.onClick = function(){
	// 	// Recup MousePos
	// 	// offset
	// 	var offsetX = Input.MousePosition.x - 100;
	// 	var offsetY = Input.MousePosition.y + 25;
	// 	var relativePos = new Vector(offsetX, offsetY);
	// 	// Condition to drop GO
	// 	if (this.canGenerateObs(relativePos)) {

	// 		//create OBS
	// 		if (relativePos.y < this.rangeFirstPlan) {
	// 			var obs = new Obstacle(relativePos, this.generalSpeed, true);
	// 		} else {
	// 			var obs = new Obstacle(relativePos, this.generalSpeed);
	// 		}
			
	// 		obs.tweenSpeed = new TweenAnim([0],[Scenes["Game"].generalSpeed],
	// 													 1, "Quadratic", "Out");
	// 		this.GameObjects.push(obs);
	// 		this.obsAvailable--;
	// 		//console.log(this.obsAvailable);
	// 	}
	// }

	/* Test Anim : create GO on clic */
	this.onClick = function(){

		// Recup MousePos
		// offset
		var offsetX = Input.MousePosition.x - 100;
		var offsetY = Input.MousePosition.y + 25;
		var relativePos = new Vector(offsetX, offsetY);
		// Condition to drop GO
		if (this.canGenerateObs(relativePos)) {

			// AddEmitter
			
			// 1. create 2 rect (STROKE)
			// 2. Tween -> épesseur, x, y, width, height, rotate? 
			// 3. fin du tween = create OBS

			//create OBS
			if (relativePos.y < this.rangeFirstPlan) {
				var obs = new Obstacle(relativePos, this.generalSpeed, true);
			} else {
				var obs = new Obstacle(relativePos, this.generalSpeed);
			}
			
			obs.tweenSpeed = new TweenAnim([0],[Scenes["Game"].generalSpeed],
														 1, "Quadratic", "Out");
			this.GameObjects.push(obs);
			this.obsAvailable--;
			//console.log(this.obsAvailable);
		}
	}

	this.canGenerateObs = function (_pos){
		// check if the energie is available
		if (this.obsAvailable < 1) {
			//console.log("YOU NEED ENERGIE");
			this.feedbackEnergie = true;
			return false;
		}
		for (var i = 0; i < this.GameObjects.length; i++) {
			// check if cursor is on obs
			if (this.GameObjects[i].name === "Obstacle") {
				// 200, 50 = size box
				var tmpCollider = new Box(_pos.x, _pos.y, 200, 50);
				if (Physics.CheckCollision(tmpCollider, this.GameObjects[i].Physics.Collider)) {
					//console.log("cant pop");
					return false
				}
			}
		}
		return true;
	}
	this.regenEnergie = function(){

		// if dont click timerEnergie 
		// if 2s regen
		if (!Input.mouseLongClick) {
			this.timerEnergie.isStarted = true;
			this.feedbackEnergie = false;

		}
	}
	this.incrementEnergie = function(){
		if (this.obsAvailable < this.obsAvailableMax) {
			this.obsAvailable++;
			//console.log("Energie up : " + this.obsAvailable);
		}
	}
	this.canIncrementEnergie = function(){
		//Scenes["Game"].incrementEnergie();
		
		_self.incrementEnergie();	
	}
	this.IncrementGUIEnergie = function(){
		//_self.reloadWidth (in %)
		_self.reloadWidth = 100/(this.duration/this.currentTime);
	}
	this.GenerateReward = function(){
		// generate auto : reward
		var isGenerate = false;
		while(!isGenerate){
			var pos = new Vector(canvas.width + 10,Math.Random.RangeInt(250, canvas.height - 250, false));
			if (_self.canGenerateReward(pos)) {
				_self.GameObjects.push(new Reward(pos, _self.generalSpeed));
				isGenerate = true;
			}
		}
		_self.PSFirstPlan.addEmitter();

	}
	this.canAutoGenerateObs = function(_x){
		for (var i = 0; i < this.GameObjects.length; i++) {
			// check if cursor is on obs
			if (this.GameObjects[i].name === "Obstacle") {
				if (_x < this.GameObjects[i].Transform.RelativePosition.x + this.GameObjects[i].Transform.Size.x) {
					return false;
				}
			}
		}
		return true;
	}
	this.canGenerateReward = function(_pos){
		for (var i = 0; i < this.GameObjects.length; i++) {
			// check if cursor is on obs
			if (this.GameObjects[i].name === "Obstacle") {
				// 200, 50 = size reward
				var tmpCollider = new Box(_pos.x, _pos.y, 50, 50);
				if (Physics.CheckCollision(tmpCollider, this.GameObjects[i].Physics.Collider)) {
					//console.log("cant pop reward");
					return false
				}
			}
		}
		return true;
	}
	this.withEnergieUI = function(){
		for (var i = 0; i < this.obsAvailableMax + 1; i++) {
			ctx.beginPath();
			if (this.feedbackEnergie) {
				ctx.strokeStyle = "#d58176";
				ctx.lineWidth = 7;
			} else {
				ctx.strokeStyle = "black";
				ctx.lineWidth = 2;
			}
			ctx.strokeRect(this.posUI, canvas.height - canvas.height*.1,
						 this.widthByEnergie*i, 50);
			ctx.closePath();	
		}
	}
	this.spellUI = function() {
		if (this.mainChar.canUseDash) {
			ctx.fillStyle = "#3b7bdd";
		} else {
			if (this.feedbackSpell) {
				ctx.fillStyle = "#d58176";
			} else {
				ctx.fillStyle = "rgba(78, 79, 82, .3)";
			}
		}
		ctx.fillRect(canvas.width*.89, canvas.height - canvas.height*.16,
					 this.widthBySpell, 50);

		if (!this.mainChar.canUseDash) {
			ctx.fillStyle = "#3b7bdd";
			ctx.font = "30px arial";
			var cd = Math.ceil(this.mainChar.timerDash.duration - this.mainChar.timerDash.currentTime);
			ctx.fillText("" + cd, canvas.width*.9, canvas.height - canvas.height*.125, this.widthBySpell, 50);
		}
	}
	this.jaugeEnergieUI = function() {
		// Permet de ne pas reload si on a le max de obs dispo  (reload < 99 --> "debug graphique")
		if (this.obsAvailable < this.obsAvailableMax && this.reloadWidth < 99) {
			// modifier la largeur en fonction du temps (reload)
			if (this.reloadWidth < 33) {
				ctx.fillStyle = "#7c3229";
			}
			else if (this.reloadWidth < 70){
				ctx.fillStyle = "#db9718";
			} else {
				ctx.fillStyle = "#60d612";
			}
			//ctx.fillStyle = "#F2C53C";
			ctx.fillRect(this.posUI, canvas.height - canvas.height*.1,
						 this.currentWidth + this.widthByEnergie*this.reloadWidth/100, 50);
		}
		// modifier la largeur en fonction du nombre disponible
		ctx.fillStyle = "#9add1e";
		ctx.fillRect(this.posUI, canvas.height - canvas.height*.1,
					 this.currentWidth, 50);
	}
	this.maxWithEnergieUI = function() {
		ctx.save();
		ctx.beginPath();
		if (this.feedbackEnergie) {
			ctx.strokeStyle = "#d58176";
			ctx.lineWidth = 7;
		} else {
			ctx.strokeStyle = "black";
			ctx.lineWidth = 2;
		}
		ctx.fillStyle = "#010000";
		ctx.rect(this.posUI, canvas.height - canvas.height*.1,
					 this.maxWidth, 50);
		ctx.closePath();
		ctx.stroke();

		/* Test : Shadow */
		ctx.shadowColor = 'rgba(0,0,0,.5)';
		ctx.shadowBlur = 20;
		ctx.shadowOffsetX = 5;
		ctx.shadowOffsetY = 5;
		ctx.fill();
		ctx.restore();
	}
	this.Awake();
}