/**
 * Create a new Scene
 * <ul><li>Copy the content of this file in a new .js document.</li>
 * <li>Save the new file in Assets/Javascript/Scenes/NameOfYourScene.js .</li>
 * <li>In the index.html add below this comment <!-- Scene --> the line: 
*                    "<script type="text/javascript" src="Assets/Scripts/Javascript/Scenes/NameOfYourGameObject.js"></script>"</li>
 * <li>For create a new scene, use this instruction: "new Scene()".</li>
 * </ul>
 * <strong>To load your scene, use this instruction: "Application.LoadLevel(LevelName)".</strong>
 * 
 * @class
 * 
 * @return {Scene}
 * */
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

	/**
	 * Called at the instruction new Scene().
	 * */
	this.Awake = function() 
	{
		console.clear();
		Print('System:Scene ' + this.name + " Created !");
	}
	
	/**
	 * Start the Scene and show a message in console or launch Update() if already started
	 * Called at the first use of scene in game.
	 * */
	this.Start = function() 
	{
		if (!this.started) 
		{
			Time.SetTimeWhenSceneBegin();
			// operation start
			this.generalSpeed = 10;

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
			if (this.GameObjects.length < 3) {
				this.GameObjects.push(new Obstacle(null, this.generalSpeed));
			}

			//generate onClick : OBS
			// 												TEST
			// if (Input.mouseClick) {
			if (Input.mouseLongClick) {
				this.onClick();
			}

			for (var i = 0; i < this.GameObjects.length; i++) 
			{
				this.GameObjects[i].Start();

				// Remove useless GO or Call particuleSystem (effect)
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
	/**
	 * Called each frame, code all the GUI here.
	 * */
	this.GUI = function() 
	{
		if (!Application.GamePaused) 
		{
			//Show UI
		} 
		else 
		{
			// Show pause menu
		}
	}
	this.generateObs = function(){
		// pop obs
		// point de pivot?
		// checkCollision with obs if true --> don't pop

	}
	this.onClick = function(){
		// Recup MousePos
		var pos = new Vector(Input.MousePosition.x, Input.MousePosition.y);
		// Condition to drop GO
		if (this.canGenerateObs(pos)) {

			//create OBS
			var obs = new Obstacle(pos, this.generalSpeed);
			this.GameObjects.push(obs);
		}
	}
	this.canGenerateObs = function (_pos){
		for (var i = 0; i < this.GameObjects.length; i++) {
			if (this.GameObjects[i].name === "Obstacle") {
				if (Physics.CheckCollision(_pos, this.GameObjects[i].Physics.Collider)) {
					console.log("cant pop");
					return false
				}
			}
		}
		return true;
	}
	this.Awake();
}