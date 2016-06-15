function SceneGame() 
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
	this.generalSpeed = 0;
	this.timerEnergie = null;
	this.timerReward = null;
	var _self = this;
	/*
				Test : Jauge d'energie
	*/
	this.obsAvailable = 0;
	this.obsAvailableMax = 0;
	/*
				GUI : Jauge Energie
	*/
	this.maxWidth = 200;
	this.widthByEnergie = 0;
	this.currentWidth = 0;
	this.reloadWidth = 0; 


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
			this.generalSpeed = 10;

			// nb obstacle utilisable (Energie)
			this.obsAvailable = 3;
			this.obsAvailableMax = 3;

			// Timer regenerate obs
			//						 _Action : augmenter la jauge graphiquement
			// 						ATTENTION : Ne pas oublier de reset (action) si Timer n'est pas "fini"
			//						_CallBack : Increment 
			// Timer(_duration, _isRepeat, _Action, _Callback, _isStarted) 
			//						Need to "call" methods?
			this.timerEnergie = new Timer(2, true, this.IncrementGUIEnergie, this.canIncrementEnergie, false);
			this.timerReward = new Timer(5, true, null, this.generateReward, true);

			this.GameObjects.push(new MainChar());
			var tempObstacle = new Obstacle(
												new Vector( canvas.width*.7, canvas.height*.5 ),
												this.generalSpeed
											); // found solution (go proc  les 1 sur les autres)
			this.GameObjects.push(tempObstacle);
			this.GameObjects.push(new Obstacle(null, this.generalSpeed));

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
			ctx.fillStyle = "#2C2A2A";
			ctx.fillRect(0,0, canvas.width, canvas.height);

			// generate auto : OBS
			if (this.GameObjects.length < 5) {

				this.GameObjects.push(new Obstacle(null, this.generalSpeed));
			}


			//generate onClick : OBS
			// 												TEST
			if (Input.mouseClick) {
			//if (Input.mouseLongClick) {

				this.onClick();
				this.timerEnergie.isStarted = false;
				this.timerEnergie.Reset();
			}
			this.regenEnergie();

			for (var i = 0; i < this.GameObjects.length; i++) 
			{
				this.GameObjects[i].Start();

				// Remove useless GO or Call particuleSystem (effect)
				if (this.GameObjects[i].name === "Obstacle" || this.GameObjects[i].name === "Reward") {
					// 400(number) : marge pour ne pas supprimer l'objet trop tôt
					// doit etre un peu plus grand que this.GameObjects[i].Transform.Size
					if (this.GameObjects[i].Transform.Position.x < -400) {
						this.GameObjects.splice(i,1);
						// 													Not sure
						i--;
					}
				}
				// Remove reward catched
				if (this.GameObjects[i].name === "Reward") {
					// GameObjects[0] = Player
					if (Physics.CheckCollision(this.GameObjects[0].Physics.Collider, this.GameObjects[i].Physics.Collider)) {
						this.incrementEnergie();
						this.GameObjects.splice(i,1);
						// 													Not sure
						i--;
					}
				}
			}
			// for (var i = 0; i < this.Groups.length; i++) 
			// {
			// 	this.Groups[i].Start();
			// }
			
			this.widthByEnergie = this.maxWidth/this.obsAvailableMax;
			this.currentWidth = this.widthByEnergie*this.obsAvailable;
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

			// Jauge ENERGIE
			
			// Permet de ne pas reload si on a le max de obs dispo  (reload < 99 --> "debug graphique")
			if (this.obsAvailable < this.obsAvailableMax && this.reloadWidth < 99) {
				// modifier la largeur en fonction du temps (reload)
				ctx.fillStyle = "#F2C53C";
				ctx.fillRect(canvas.width*.2, canvas.height - canvas.height*.1,
							 this.currentWidth + this.widthByEnergie*this.reloadWidth/100, 50);
			}
			
			// modifier la largeur en fonction du nombre disponible
			ctx.fillStyle = "#FFF000";
			ctx.fillRect(canvas.width*.2, canvas.height - canvas.height*.1,
						 this.currentWidth, 50);


		} 
		else 
		{
			// Show pause menu
		}
	}
	this.onClick = function(){
		// Recup MousePos
		var pos = new Vector(Input.MousePosition.x, Input.MousePosition.y);
		// Condition to drop GO
		if (this.canGenerateObs(pos)) {

			//create OBS
			var obs = new Obstacle(pos, this.generalSpeed);
			this.GameObjects.push(obs);
			this.obsAvailable--;
			//console.log(this.obsAvailable);
		}
	}
	this.canGenerateObs = function (_pos){
		// check if the energie is available
		if (this.obsAvailable < 1) {
			console.log("YOU NEED ENERGIE");
			return false;
		}
		for (var i = 0; i < this.GameObjects.length; i++) {
			// check if cursor is on obs
			if (this.GameObjects[i].name === "Obstacle") {
				// 200, 50 = size box
				var tmpCollider = new Box(_pos.x, _pos.y, 200, 50);
				if (Physics.CheckCollision(tmpCollider, this.GameObjects[i].Physics.Collider)) {
					console.log("cant pop");
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
	this.generateReward = function(){
		//console.log("create Reward");
		_self.GameObjects.push(new Reward(null, _self.generalSpeed));
	}

	this.Awake();
}