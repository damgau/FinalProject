function SceneFirst() 
{
	this.name = "First";
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
	this.background;
	this.psBackground;

	this.rangeFirstPlan = canvas.height*.4;

	this.obsToGenerate = 0;

	this.generalSpeed = 0;
	var _self = this;
	/* 
				GUI
	*/

	/* 
				ANIM
	*/
	this.psSpawn;
	this.psFirstPlan;

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
			this.generalSpeed = 10;
			// nb obstacle utilisable (Energie)
			var tempObstacle = new Obstacle(
												new Vector( canvas.width*.7, canvas.height*.5 ),
												this.generalSpeed
											);
			this.GameObjects.push(tempObstacle);
			this.GameObjects.push(new Obstacle(null, this.generalSpeed));

			
			/*Spawn Anim*/
			this.psSpawn = new PSSpawn();
			this.psFirstPlan = new PSFirstPlan();

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

			// "LastPlan"
			for (var i = 0; i < this.GameObjects.length; i++) 
			{
				if (!this.GameObjects[i].isFirstPlan) {
					this.GameObjects[i].Start();
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
			// First Plan
			for (var i = 0; i < this.GameObjects.length; i++) 
			{
				if (this.GameObjects[i].isFirstPlan) {
					this.GameObjects[i].Start();
				}
			}


			this.psSpawn.Start();
			this.psFirstPlan.Start();
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

			// Score
			ctx.fillStyle = "#F4F3F3";
			ctx.fillText( this.score,canvas.width - canvas.width*.1, canvas.height*.1,
						 50, 50);
		} 
		else 
		{
			// Show pause menu
		}
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
	this.Awake();
}