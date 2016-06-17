function Spell(_duration) 
{
	this.started = false;

	this.duration = _duration;

	// Timer : Spells
	this.timerSpell = null;
	this.canUseSpell = true;

	this.Start = function() {
		if (!this.started) {
			
			this.timerSpell = new Timer(this.duration, true, null, this.callbackSpell, false);
			this.started = true;
		}
		Update();
	}
	this.Update = function () {
		this.timerSpell.Reset();
	}
	this.callbackSpell = function(){
		_self.canUseSpell = true;
	}
	this.Cast = function(tweenChar, tweenObs) {
	}
}