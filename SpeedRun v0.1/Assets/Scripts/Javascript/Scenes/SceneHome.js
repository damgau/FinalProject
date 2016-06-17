/**	**** Create a new Scene **** 
*
*	@step 1							Copy the content of this file in a new .js document.
*   ----------------------------------------------------------------------------------------------------------------------------
*	@step 2							Save the new file in Assets/Javascript/Scenes/NameOfYourScene.js .
*   ----------------------------------------------------------------------------------------------------------------------------
*	@step 3                      	In the index.html add below this comment <!-- Scene --> the line: 
*                    "<script type="text/javascript" src="Assets/Scripts/Javascript/Scenes/NameOfYourGameObject.js"></script>"
*	----------------------------------------------------------------------------------------------------------------------------
*	@step 4						    For create a new scene, use this instruction: "new Scene()".
*/

/*	**** How to make the setup of a Scene ****
*	
*	@property name 																											{string} 			 
*	The name of the scene.
*	--------------------------------------------------------------------------------------------------------------------------------
*	@property GameObjects 																				   {array[GameObject1, ...]} 			 
*	All the GameObject of the scene	
*
*/

/*	**** Scene's Methods ****
*
*	@method Awake()									
*	Called at the instruction new Scene().
*	--------------------------------------------------------------------------------------------------------------------------------
*	@method Start()									
*	Called at the first use of scene in game.
*	--------------------------------------------------------------------------------------------------------------------------------
*	@method Update()								
*	Called each frame,code game is here.
*	--------------------------------------------------------------------------------------------------------------------------------
*	@method GUI()
*	Called each frame, code all the GUI here.
*/

/* **** For launch Scene ****
*
*	To load your scene, use this instruction: "Application.LoadLevel(LevelName)".
*/
function SceneHome() {
	this.name = "Home";
	this.GameObjects =[];
	this.Groups = [];
	this.Cameras = [];
	this.CurrentCamera = null;

	this.started = false;

	this.WorldSize = new Vector(4096,4096);

	this.bestScore = 0;
	this.difficultyMode = "easy";
	this.boxEasy;
	this.boxNormal;
	this.boxHard;


	this.Awake = function() {
		//console.clear();
		console.log('%c System:Scene ' + this.name + " Created !", 'background:#222; color:#bada55');

	}
	this.Start = function() {
		if (!this.started) {
			Time.SetTimeWhenSceneBegin();
			// operation start
			var bg = new Background();
			this.GameObjects.push(bg);
			var mainCharRun = new MainCharRun();
			this.GameObjects.push(mainCharRun);

			this.started = true;
			console.log('%c System:Scene ' + this.name + " Started !", 'background:#222; color:#bada55');
			Time.SetTimeWhenSceneLoaded();
		}
		this.Update();
	}
	this.Update = function() {
		if (!Application.GamePaused) {
			for (var i = 0; i < this.GameObjects.length; i++) {
				this.GameObjects[i].Start();
			}
			for (var i = 0; i < this.Groups.length; i++) {
				this.Groups[i].Start();
			}
		}
		this.GUI();
	}
	this.GUI = function() {
		if (!Application.GamePaused) {
			//Show UI

			// Score
			ctx.fillStyle = "white";
			ctx.textAlign = "center";
			ctx.font = "30px arial";
			ctx.fillText("Best Score : " + this.bestScore,canvas.width*.53,(canvas.height*.6)-100);
			ctx.textAlign = "normal";

			//Mode Libre

			// easy
			this.boxEasy = new Box(canvas.width*.3, canvas.height*.3, 50, 50);
			ctx.fillStyle = "#3AF600";
			ctx.fillRect(this.boxEasy.x, this.boxEasy.y, this.boxEasy.w, this.boxEasy.h);
			if (Input.mouseClick && Physics.CheckCollision(Input.MousePosition, this.boxEasy)) {
				console.log("easy");
				this.difficultyMode = "easy";
			}

			// normal
			this.boxNormal = new Box(canvas.width*.5, canvas.height*.3, 50, 50);
			ctx.fillStyle = "#EF7E22";
			ctx.fillRect(this.boxNormal.x, this.boxNormal.y, this.boxNormal.w, this.boxNormal.h);
			if (Input.mouseClick && Physics.CheckCollision(Input.MousePosition, this.boxNormal)) {
				console.log("normal");
				this.difficultyMode = "normal";
			}
			// hard
			this.boxHard = new Box(canvas.width*.7, canvas.height*.3, 50, 50);
			ctx.fillStyle = "#E01C1C";
			ctx.fillRect(this.boxHard.x, this.boxHard.y, this.boxHard.w, this.boxHard.h);
			if (Input.mouseClick && Physics.CheckCollision(Input.MousePosition, this.boxHard)) {
				console.log("hard");
				this.difficultyMode = "hard";
			}

		} else {
			// Show pause menu
		}
	}

	this.Awake()
}