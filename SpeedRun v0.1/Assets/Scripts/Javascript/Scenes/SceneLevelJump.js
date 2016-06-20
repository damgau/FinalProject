function SceneLevelJump() 
{
	this.name = "LevelJump";
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
	var _self = this;

	// Pattern !

	this.currentPattern = 0;
	this.partternToPlay;
	this.lastObsOfPattern;

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
			this.GameObjects.push(new MainChar());
			// push the first wave
			this.partternToPlay = this.createPattern(this.currentPattern);
			this.lastObsOfPattern = this.partternToPlay[this.partternToPlay.length - 1];
			for (var i = 0; i < this.partternToPlay.length; i++) {
				this.GameObjects.push(this.partternToPlay[i]);
			}
			this.started = true;
			Print('System:Scene ' + this.name + " Started !");
			Time.SetTimeWhenSceneLoaded();
		}
		this.Update();
	}
	this.Update = function() 
	{
		if (!Application.GamePaused) 
		{
			// Background
			ctx.fillStyle = "#2C2A2A";
			ctx.fillRect(0,0, canvas.width, canvas.height);

			// if last Index of tab is on screen, start next wave
			if (this.lastObsOfPattern.Transform.Position.x + this.lastObsOfPattern.Transform.Size.x < canvas.width) {

				var random = this.currentPattern;
				while(random == this.currentPattern){

					//									Warning if add partern change de RangeInt !!
					random = Math.Random.RangeInt(0, 4, false);
				}
				this.currentPattern = random;

				this.partternToPlay = this.createPattern(this.currentPattern);
				this.lastObsOfPattern = this.partternToPlay[this.partternToPlay.length - 1];
				for (var i = 0; i < this.partternToPlay.length; i++) {
					this.GameObjects.push(this.partternToPlay[i]);
				}
			}

			// Remove useless GO
			for (var i = 0; i < this.GameObjects.length; i++) 
			{
				this.GameObjects[i].Start();
				if (this.GameObjects[i].name === "Obstacle") {
					// 400(number) : marge pour ne pas supprimer l'objet trop tôt
					// doit etre un peu plus grand que this.GameObjects[i].Transform.Size
					if (this.GameObjects[i].Transform.Position.x < -400) {
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
			// ctx.fillStyle = "#F4F3F3";
			// ctx.fillText( this.GameObjects[0].score,canvas.width - canvas.width*.1, canvas.height*.1,
			// 			 this.currentWidth, 50);
		} 
		else 
		{
			// Show pause menu
		}
	}
	this.createPattern = function(_currentPattern){
		var cWidth = canvas.width;
		var cHeight = canvas.height;
		// 										Need other solution : valeor brut :/
		var oWidth = 200;
		var oHeight = 50;

		var pattern = [];
		switch(_currentPattern){
			// First Wave
			case 0 : 
				pattern = [
					new Obstacle(new Vector(0, cHeight*.5)
								, this.generalSpeed),
					new Obstacle(new Vector(oWidth,cHeight*.5)
								, this.generalSpeed),
					new Obstacle(new Vector(oWidth*2,cHeight*.5)
								, this.generalSpeed),
					new Obstacle(new Vector(oWidth*3,cHeight*.5)
								, this.generalSpeed),
					new Obstacle(new Vector(oWidth*4,cHeight*.5)
								, this.generalSpeed),
					new Obstacle(new Vector(oWidth*5,cHeight*.5)
								, this.generalSpeed),
					new Obstacle(new Vector(oWidth*6,cHeight*.5)
								, this.generalSpeed)
				]; 

			return pattern;

			case 1 : 
				pattern = [
										
					new Obstacle(new Vector(cWidth + oWidth,cHeight*.5)
									, this.generalSpeed),
					
					new Obstacle(new Vector(cWidth + oWidth*2,cHeight*.5)
									, this.generalSpeed),
					
					new Obstacle(new Vector(cWidth + oWidth*3,cHeight*.55)
									, this.generalSpeed),
					
					new Obstacle(new Vector(cWidth + oWidth*4,cHeight*.55)
									, this.generalSpeed),
					
					new Obstacle(new Vector(cWidth + oWidth*5,cHeight*.6)
									, this.generalSpeed),
					
					new Obstacle(new Vector(cWidth + oWidth*6,cHeight*.5)
									, this.generalSpeed)
				];

			return pattern;

			case 2 : 
				pattern = [
					
					new Obstacle(new Vector(cWidth, cHeight*.5)
								, this.generalSpeed),
					
					new Obstacle(new Vector(cWidth + oWidth,cHeight*.5)
								, this.generalSpeed),
					
					new Obstacle(new Vector(cWidth + oWidth*2,cHeight*.5)
								, this.generalSpeed),
					
					new Obstacle(new Vector(cWidth + oWidth*5,cHeight*.5)
								, this.generalSpeed),
					
					new Obstacle(new Vector(cWidth + oWidth*6,cHeight*.5)
								, this.generalSpeed)
				];

			return pattern;

			case 3 : 
				pattern = [
					new Obstacle(new Vector(cWidth, cHeight*.5)
								, this.generalSpeed),
					
					new Obstacle(new Vector(cWidth + oWidth,cHeight*.55)
								, this.generalSpeed),
					
					new Obstacle(new Vector(cWidth + oWidth*4,cHeight*.45)
								, this.generalSpeed),
					
					new Obstacle(new Vector(cWidth + oWidth*5,cHeight*.45)
								, this.generalSpeed),
					
					new Obstacle(new Vector(cWidth + oWidth*6,cHeight*.5)
								, this.generalSpeed)
				];
			return pattern;			
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