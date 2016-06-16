/**
 * @class Timer
 * @namespace Tools/Timer
 *
 * @param {Time} _duration - 
 * @param {Time} _isRepeat - 
 * @param {Time} _Action - 
 * @param {Time} _Callback - 
 *
 * @description
 * Create an instance of timer
 *
 * */
function Timer(_duration, _isRepeat, _Action, _Callback, _isStarted) 
{
	this.ID = 0;
	this.currentTime = 0;
	this.duration = _duration;
	this.repeat = _isRepeat || false;
	this.Action = _Action || null;
	this.Callback = _Callback || null;
	this.isStarted = _isStarted || false;
	this.isCleared = false;

	this.Awake = function () 
	{
		Timer.lastID++;
		this.ID = Timer.lastID;
		Time.Timers.push(this);
		return this.ID;
	}

	this.Update = function() 
	{
		if (this.isStarted){
			if (this.currentTime + Time.deltaTime < this.duration) 
			{
				this.currentTime += Time.deltaTime;
				if (this.Action != null) 
				{
					this.Action();
				}
			}
			else 
			{
				//End Of Timer
				//console.log('End Timer');
				this.currentTime = this.duration;
				if (this.Callback != null) 
				{
					this.Callback();
				}
				if (this.repeat)
				{	
					this.Reset();
				} 
				else 
				{
					this.isCleared = true;
					this.Clear();
				}
			}
		}
	}

	this.Reset = function() 
	{
		if (this.isCleared) {
			this.isCleared = false;
			this.Awake();
		}
		if (this.repeat) this.isStarted = true;
		else this.isStarted = false;

		this.currentTime = 0;

	}

	this.Clear = function() 
	{
		var index = Time.Timers.indexOf(this);
		Time.Timers.splice(index,1);
	}

	this.Awake();
}

Timer.lastID = 0;