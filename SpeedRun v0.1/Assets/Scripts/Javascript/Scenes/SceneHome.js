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

	this.lastScore = 0;
	this.bestScroreEasy = 0;
	this.bestScroreNormal = 0;
	this.bestScroreHard = 0;
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

			this.boxEasy = new Box(canvas.width*.38, canvas.height*.25, 250, 80);
			this.boxNormal = new Box(canvas.width*.38, canvas.height*.50, 250, 80);
			this.boxHard = new Box(canvas.width*.38, canvas.height*.71, 250, 80);
			this.boxLevelJump = new Box(canvas.width*.075, canvas.height*.25, 250, 80);


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
			ctx.fillStyle = "#DAD5D5";
			ctx.font = "24px arial";
			ctx.fillText("SCORES", canvas.width*.74, canvas.height*.15);

			// Best Scrore EASY
			ctx.fillStyle = "#DAD5D5";
			ctx.font = "24px arial";
			ctx.fillText("" + this.bestScroreEasy,canvas.width*.77, canvas.height*.30);

			// Best Scrore NORMAL
			ctx.fillStyle = "#DAD5D5";
			ctx.font = "24px arial";
			ctx.fillText("" + this.bestScroreNormal,canvas.width*.77, canvas.height*.55);

			// Best Scrore HARD
			ctx.fillStyle = "#DAD5D5";
			ctx.font = "24px arial";
			ctx.fillText("" + this.bestScroreHard,canvas.width*.77, canvas.height*.76);


			//Mode Libre
			// easy
			ctx.fillStyle = "#3AF600";
			ctx.fillRect(this.boxEasy.x, this.boxEasy.y, this.boxEasy.w, this.boxEasy.h);
			if (Input.mouseClick && Physics.CheckCollision(Input.MousePosition, this.boxEasy)) {
				
				this.difficultyMode = "easy";
				Scenes["Game"] = new SceneGame(Scenes["Home"].difficultyMode);
				Application.LoadedScene = Scenes["Game"];
			}

			// normal
			ctx.fillStyle = "#EF7E22";
			ctx.fillRect(this.boxNormal.x, this.boxNormal.y, this.boxNormal.w, this.boxNormal.h);
			if (Input.mouseClick && Physics.CheckCollision(Input.MousePosition, this.boxNormal)) {
				
				this.difficultyMode = "normal";
				Scenes["Game"] = new SceneGame(Scenes["Home"].difficultyMode);
				Application.LoadedScene = Scenes["Game"];
			}
			// hard
			ctx.fillStyle = "#E01C1C";
			ctx.fillRect(this.boxHard.x, this.boxHard.y, this.boxHard.w, this.boxHard.h);
			if (Input.mouseClick && Physics.CheckCollision(Input.MousePosition, this.boxHard)) {
				
				this.difficultyMode = "hard";
				Scenes["Game"] = new SceneGame(Scenes["Home"].difficultyMode);
				Application.LoadedScene = Scenes["Game"];
			}

			// Level Jump
			ctx.fillStyle = "#62D8CE";
			ctx.fillRect(this.boxLevelJump.x, this.boxLevelJump.y, this.boxLevelJump.w, this.boxLevelJump.h);
			if (Input.mouseClick && Physics.CheckCollision(Input.MousePosition, this.boxLevelJump)) {
				Scenes["LevelJump"] = new SceneLevelJump();
				Application.LoadedScene = Scenes["LevelJump"];
			}

		} else {
			// Show pause menu
		}
	}

	this.Awake()
}