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

	this.bestScoreEasy = 0;
	this.bestScoreNormal = 0;
	this.bestScoreHard = 0;
	this.difficultyMode = "easy";

	this.boxEasy;
	this.imgEasy;

	this.boxNormal;
	this.imgNormal;

	this.boxHard;
	this.imgHard;

	this.boxJump;
	this.imgJump;

	/*
			GUI
	*/
	this.lastScore = 0;
	this.lastDest;
	this.lastTime;

	this.Awake = function() {
		//console.clear();
		console.log('%c System:Scene ' + this.name + " Created !", 'background:#222; color:#bada55');

	}
	this.Start = function() {
		if (!this.started) {
			Time.SetTimeWhenSceneBegin();
			// operation start
			this.imgEasy = Images["buttonEasy"];
			this.boxEasy = new Box(canvas.width*.585, canvas.height*.37, 200, 78);

			this.imgNormal = Images["buttonNormal"];
			this.boxNormal = new Box(canvas.width*.585, canvas.height*.46, 200, 78);

			this.imgHard = Images["buttonHard"];
			this.boxHard = new Box(canvas.width*.585, canvas.height*.55, 200, 78);

			this.imgJump = Images["buttonJumpDisabled"];
			this.boxJump = new Box(canvas.width*.585, canvas.height*.64, 200, 78);


			var bg = new Background();
			this.GameObjects.push(bg);

			this.started = true;
			console.log('%c System:Scene ' + this.name + " Started !", 'background:#222; color:#bada55');
			Time.SetTimeWhenSceneLoaded();
		}
		this.Update();
	}
	this.Update = function() {
		if (!Application.GamePaused) {

			//EASY
			if (Physics.CheckCollision(Input.MousePosition, this.boxEasy)){
				this.imgEasy = Images["buttonEasyHover"];
				if (Input.mouseClick) {
					this.difficultyMode = "easy";
					Scenes["Game"] = new SceneGame(Scenes["Home"].difficultyMode);
					Application.LoadedScene = Scenes["Game"];	
				}
			} else {
				this.imgEasy = Images["buttonEasy"];
			}

			//NORMAL
			if (Physics.CheckCollision(Input.MousePosition, this.boxNormal)){
				this.imgNormal = Images["buttonNormalHover"];
				if (Input.mouseClick) {
					this.difficultyMode = "normal";
					Scenes["Game"] = new SceneGame(Scenes["Home"].difficultyMode);
					Application.LoadedScene = Scenes["Game"];	
				}
			} else {
				this.imgNormal = Images["buttonNormal"];
			}

			//Hard
			if (Physics.CheckCollision(Input.MousePosition, this.boxHard)){
				this.imgHard = Images["buttonHardHover"];
				if (Input.mouseClick) {
					this.difficultyMode = "hard";
					Scenes["Game"] = new SceneGame(Scenes["Home"].difficultyMode);
					Application.LoadedScene = Scenes["Game"];
				}
			} else {
				this.imgHard = Images["buttonHard"];
			}

			//JUMPS
			if (Physics.CheckCollision(Input.MousePosition, this.boxJump)){
				this.imgJump = Images["buttonJumpHover"];
				if (Input.mouseClick) {
					Scenes["LevelJump"] = new SceneLevelJump();
					Application.LoadedScene = Scenes["LevelJump"];
				}
			} else {
				this.imgJump = Images["buttonJumpDisabled"];
			}

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

			// Panel
			ctx.drawImage(Images["panel"], canvas.width*.554, canvas.height*.29, 301, 452);

			ctx.fillStyle = "#fbfcfe";
			ctx.font = "bold 16px Consolas";
			ctx.fillText("Destination",canvas.width*.615, canvas.height*.345);

			// Title
			ctx.drawImage(Images["title"], canvas.width*.2966, canvas.height*.27, 364, 205);


			//Mode Libre
			// easy
			ctx.drawImage(this.imgEasy, this.boxEasy.x, this.boxEasy.y, this.boxEasy.w, this.boxEasy.h);
			// title Easy
			ctx.fillStyle = "#fbfcfe";
			ctx.font = "bold 12px arial";
			ctx.fillText("EASY",this.boxEasy.x + canvas.width*.055, this.boxEasy.y + canvas.height*.04);

			// Best Score EASY
			ctx.font = "12px arial";
			ctx.fillText("Best score : " + this.bestScoreEasy,this.boxEasy.x + canvas.width*.055, this.boxEasy.y + canvas.height*.057);


			// normal
			ctx.drawImage(this.imgNormal, this.boxNormal.x, this.boxNormal.y, this.boxNormal.w, this.boxNormal.h);
			// title NORMAL
			ctx.fillStyle = "#fbfcfe";
			ctx.font = "bold 12px arial";
			ctx.fillText("NORMAL",this.boxNormal.x + canvas.width*.055, this.boxNormal.y + canvas.height*.04);
			// Best Score NORMAL
			ctx.font = "12px arial";
			ctx.fillText("Best score : " + this.bestScoreNormal,this.boxNormal.x + canvas.width*.055, this.boxNormal.y + canvas.height*.057);

			// hard
			ctx.drawImage(this.imgHard, this.boxHard.x, this.boxHard.y, this.boxHard.w, this.boxHard.h);
			// title HARD
			ctx.fillStyle = "#fbfcfe";
			ctx.font = "bold 12px arial";
			ctx.fillText("HARD",this.boxHard.x + canvas.width*.055, this.boxHard.y + canvas.height*.04);
			// Best Score HARD
			ctx.fillStyle = "#fbfcfe";
			ctx.font = "12px arial";
			ctx.fillText("Best score : " + this.bestScoreHard,this.boxHard.x + canvas.width*.055, this.boxHard.y + canvas.height*.057);

			// Level Jump
			ctx.drawImage(this.imgJump, this.boxJump.x, this.boxJump.y, this.boxJump.w, this.boxJump.h);
			// title Jump
			ctx.fillStyle = "#fbfcfe";
			ctx.font = "bold 12px arial";
			ctx.fillText("JUMP",this.boxJump.x + canvas.width*.055, this.boxJump.y + canvas.height*.048);

			// last game
			ctx.fillStyle = "#fbfcfe";
			ctx.font = "14px Consolas";
			ctx.fillText("Last Game", canvas.width*.342, canvas.height*.48);

			// Last Score
			ctx.fillStyle = "#fbfcfe";
			ctx.font = "14px Consolas";
			ctx.fillText("Score : " + this.lastScore, canvas.width*.342, canvas.height*.51);

			// Last Timer
			ctx.fillStyle = "#fbfcfe";
			ctx.font = "14px Consolas";
			ctx.fillText("Time : " + this.lastTime, canvas.width*.342, canvas.height*.54);

			// Last Destination
			ctx.fillStyle = "#fbfcfe";
			ctx.font = "14px Consolas";
			ctx.fillText("Destination : " + this.lastDest, canvas.width*.342, canvas.height*.57);	

		} else {
			// Show pause menu
		}
	}

	this.Awake()
}