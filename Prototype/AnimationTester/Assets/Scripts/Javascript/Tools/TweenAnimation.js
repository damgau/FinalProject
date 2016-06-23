/*
				_startValue = [x:0, y:0, rot:30]
				_changeValue = [x:100, y:100, rot:80]

*/

function TweenAnim(_startValue, _changeValue, _duration, _type, _underType, _callBack){
	var _self = this;
	this.startValue = _startValue;
	this.changeValue = _changeValue;
	this.duration = _duration;
	this.type = _type || "Linear";
	this.underType = _underType || null;
	this.timerIsFinished = false;
	this.CallBack = _callBack || null;
	this.isFinished = false;

	this.timerCallback = function(){
		_self.timerIsFinished = true;
	}
	this.timer = new Timer(this.duration, false, null, this.timerCallback, false);


	this.tweenValue = [];

	// function Start, Stop, Reset, return value
	this.Start = function(){
		if (!this.isFinished) {
			this.timer.isStarted = true;
			var value;
			this.tweenValue = [];

			if (this.underType) {
				for (var i = 0; i < this.startValue.length; i++) {
					tween = Tween[this.type]
					value = tween[this.underType](this.timer.currentTime,
											this.startValue[i],
											this.changeValue[i],
											this.timer.duration);
					this.tweenValue.push(value);
				}
			} else {
				for (var i = 0; i < this.startValue.length; i++) {
					value = Tween[this.type](this.timer.currentTime,
											this.startValue[i],
											this.changeValue[i],
											this.timer.duration);
					this.tweenValue.push(value);
				}
			}

			// test !
			if (this.timerIsFinished) {
				if (this.CallBack) {
					console.log("gonna CallBack")
					this.CallBack();
				}
				this.isFinished = true;
			}
		}		
	}
	this.recoverValue = function(){
		this.Start();
		return this.tweenValue;
	}
	this.Reset = function(){
		this.timerIsFinished = false;
		this.isFinished = false;
		this.timer.Reset();
	}
}