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
	{ name:"Fond",path: "/Fond.png"},
	{ name:"Particle",path: "/particle.png"},
	{ name:"Runner",path: "/Vendor/runner.png"},
	{ name:"ObsBotBot",path: "/Obstacles/obs_bot_bot.png"},
	{ name:"ObsMiddle",path: "/Obstacles/obs_middle.png"},
	{ name:"ObsMiddleBot",path: "/Obstacles/obs_middle_bot.png"},
	{ name:"ObsMiddleTop",path: "/Obstacles/obs_middle_top.png"},
	{ name:"ObsTopTop",path: "/Obstacles/obs_top_top.png"}
];
var Images = {};