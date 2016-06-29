/**
 * Get Canvas and the context<br/>
 *
 * - Create Scene Object which will contain the scene<br/>
 * - Create and set the gravity<br/>
 * - Application : An Object which will handle the scene to load, if game is paused or not and if debug mode is activate<br/>
 * - imagesLoaded : counter for loaded images<br/>
 * - WalkableTiles : an Array which will contain where integer where we can walk<br/>
 * - ImagesPath : Array of image object. Each image has a name and a path<br/>
 * - Images : an object which contain all loaded image
 * 
 * */


var canvas = document.getElementById('canvas');
var ctx = canvas.getContext("2d");

var Scenes = {};
var Gravity = new Vector();
Gravity.y = -9.81;


var Application = 
{
	LoadedScene: null,
	gamePaused: false,
	debugMode: false
};

var imagesLoaded = 0;
var WalkableTiles = [];

var ImagesPath = 
[
	// { name:"monImage",path: "background/image.png"},
	{ name:"Fond",path: "/Fond.jpg"},
	{ name:"Particle",path: "/particle.png"},
	{ name:"Runner",path: "/Vendor/runner.png"},
	{ name:"ObsBotBot",path: "/Obstacles/obs_bot_bot.png"},
	{ name:"ObsMiddle",path: "/Obstacles/obs_middle.png"},
	{ name:"ObsMiddleBot",path: "/Obstacles/obs_middle_bot.png"},
	{ name:"ObsMiddleTop",path: "/Obstacles/obs_middle_top.png"},
	{ name:"ObsTopTop",path: "/Obstacles/obs_top_top.png"},
	{ name:"easyMode",path: "/HomePage/easyMode.png"},
	{ name:"hardMode",path: "/HomePage/hardMode.png"},
	{ name:"normalMode",path: "/HomePage/normalMode.png"},
	{ name:"levelJump",path: "/HomePage/levelJump.png"},
	{ name:"marineRun1",path: "/MarineAnim/Anim1.png"},
	{ name:"marineRun2",path: "/MarineAnim/Anim2.png"},
	{ name:"MadfuguJump",path: "/MadfuguAnim/jump.png"},
	{ name:"MadfuguRun",path: "/MadfuguAnim/run.png"},
	{ name:"p01",path: "/Particles/p01.jpg"},
	{ name:"p02",path: "/Particles/p02.png"},
	{ name:"p03",path: "/Particles/p03.png"},
	{ name:"OrbGreenClassic",path: "/Particles/reward/OrbGreenClassic.png"},
	{ name:"OrbWhiteClassic",path: "/Particles/reward/OrbWhiteClassic.png"},
	{ name:"OrbYellow",path: "/Particles/reward/OrbYellow.png"},
	{ name:"OrbGreen",path: "/Particles/reward/OrbGreen.png"},
	{ name:"MunnyOrb",path: "/Particles/reward/MunnyOrb.png"},
	{ name:"MadfuguObsBotBot",path: "/Obstacles/madfugu/obs_bot_bot.png"},
	{ name:"MadfuguObsMiddle",path: "/Obstacles/madfugu/obs_middle.png"},
	{ name:"MadfuguObsMiddleBot",path: "/Obstacles/madfugu/obs_middle_bot.png"},
	{ name:"MadfuguObsMiddleTop",path: "/Obstacles/madfugu/obs_middle_top.png"},
	{ name:"MadfuguObsTopTop",path: "/Obstacles/madfugu/obs_top_top.png"},
	{ name:"Particle01",path: "/particle01.png"},
	{ name:"Particle02",path: "/particle02.png"},
	{ name:"Particle03",path: "/particle03.png"},
	{ name:"buttonEasy",path: "/Interface/easy.png"},
	{ name:"buttonEasyHover",path: "/Interface/easyHover.png"},
	{ name:"buttonHard",path: "/Interface/hard.png"},
	{ name:"buttonHardHover",path: "/Interface/hardHover.png"},
	{ name:"buttonJump",path: "/Interface/jump.png"},
	{ name:"buttonJumpDisabled",path: "/Interface/jumpDisabled.png"},
	{ name:"buttonJumpHover",path: "/Interface/jumpHover.png"},
	{ name:"buttonNormal",path: "/Interface/normal.png"},
	{ name:"buttonNormalHover",path: "/Interface/normalHover.png"},
	{ name:"title",path: "/Interface/title.png"},
	{ name:"panel",path: "/Interface/UI.png"}
];
var Images = {};