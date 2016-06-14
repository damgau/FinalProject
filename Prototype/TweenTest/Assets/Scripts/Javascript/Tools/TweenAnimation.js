/*
				_startValue = [x:0, y:0, rot:30]
				_changeValue = [x:100, y:100, rot:80]

*/

function TweenAnim(_startValue, _changeValue, _duration, _type, _underType){
	this.startValue = _startValue;
	this.changeValue = _changeValue;
	this.duration = _duration;
	this.type = _type || "Linear";
	this.underType = _underType || null;
	this.timer = new Timer(this.duration, false, null, null, false);


	// obj/tab de value to change
	// obj/tab de value changed!
	this.tweenValue = null;

	// function Start, Stop, Reset, return value
	this.Start = function(){
		this.timer.isStarted = true;
		var value;
		this.tweenValue = [];
		// switch(this.type)
		// {
		// 	case "Linear" : 
		// 		// for obj/tab
		// 		for (var i = 0; i < this.startValue.length; i++) {
		// 			console.log(this.timer.currentTime);
		// 			value = Tween.Linear(this.timer.currentTime,
		// 							this.startValue[i],
		// 							this.changeValue[i],
		// 							this.timer.duration);
		// 			this.tweenValue.push(value);
		// 		}
		// 	break;
		// }

		if (this.underType) {
			for (var i = 0; i < this.startValue.length; i++) {
				tween = Tween[this.type]
				value = tween[this.underType](this.timer.currentTime,
										this.startValue[0],
										this.changeValue[0],
										this.timer.duration);
				this.tweenValue.push(value);
			}
		} else {
			for (var i = 0; i < this.startValue.length; i++) {
				value = Tween[this.type](this.timer.currentTime,
										this.startValue[0],
										this.changeValue[0],
										this.timer.duration);
				this.tweenValue.push(value);
			}
		}
		
	}
	this.recoverValue = function(){
		this.Start();
		return this.tweenValue;
	}

}