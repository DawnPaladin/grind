var shipModel = (function() {
	var _hullHealth = 100;
	var _hullMaxHealth = 100;

	var hullHealthEvent = new Phaser.Signal();

	function getShipStatus() {
		return {
			hullHealth: _hullHealth,
			hullMaxHealth: _hullMaxHealth,
		};
	}
	function damage(amount) {
		_hullHealth -= amount;
		hullHealthEvent.dispatch(getShipStatus());
	}

	return {
		getShipStatus,
		damage,
		hullHealthEvent,
	};
})();
