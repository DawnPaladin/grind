var shipModel = (function() {
	var hullHealth = 100;
	var hullMaxHealth = 100;
	var shieldHealth = 100;
	var shieldMaxHealth = 100;

	var abilities = {};

	var hullHealthEvent = new Phaser.Signal();
	var shieldHealthEvent = new Phaser.Signal();

	function getShipStatus() {
		return {
			hullHealth,
			hullMaxHealth,
			shieldHealth,
			shieldMaxHealth,
		};
	}
	function damage(amount) {
		if (shieldHealth == 0) {
			hullHealth -= amount;
			hullHealthEvent.dispatch(getShipStatus());
		} else {
			if (amount > shieldHealth) {
				shieldHealth = 0;
			} else {
				shieldHealth -= amount;
			}
			shieldHealthEvent.dispatch(getShipStatus());
		}
	}

	return {
		getShipStatus,
		damage,
		hullHealthEvent,
		shieldHealthEvent,
	};
})();
