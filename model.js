var shipModel = (function() {
	var hullHealth = 100;
	var hullMaxHealth = 100;
	var shieldHealth = 125;
	var shieldMaxHealth = 125;
	var shieldDamagePerTick = 2;
	var attackInterval = 100;

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
	function healShields(amount) {
		shieldHealth += amount;
		if (shieldHealth > shieldMaxHealth) shieldHealth = shieldMaxHealth;
		shieldHealthEvent.dispatch(getShipStatus());
	}
	function touchMe(impactor) {
		impactor.defenseTimer = setInterval(function() {
			if (shieldHealth > 0) {
				impactor.damage(shieldDamagePerTick);
			}
		}, attackInterval);
	}

	return {
		getShipStatus,
		damage,
		healShields,
		hullHealthEvent,
		shieldHealthEvent,
		touchMe,
	};
})();
