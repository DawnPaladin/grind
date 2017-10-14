var simpleEnemy = (function() {
	var exports = {};

	var game, shipCollisionGroup, debug, enemiesGroup, enemiesCollisionGroup;
	var damagePerTick = 2;
	var attackInterval = 100;
	exports.init = function(_game, _shipCollisionGroup, _enemiesCollisionGroup, _debug) {
		game = _game;
		shipCollisionGroup = _shipCollisionGroup;
		enemiesCollisionGroup = _enemiesCollisionGroup;
		debug = _debug;
		enemiesGroup = game.add.group();
		enemiesGroup.enableBody = true;
		enemiesGroup.physicsBodyType = Phaser.Physics.P2JS;
		return enemiesGroup;
	};

	function collision(enemyBody, shipBody) {
		var enemy = enemyBody.sprite;
		if (enemy.onHull) return false;
		enemyBody.removeCollisionGroup(enemiesCollisionGroup);
		var offset = [shipBody.x - enemyBody.x, shipBody.y - enemyBody.y];
		var angle = game.math.angleBetween(shipBody.x, shipBody.y, enemyBody.x, enemyBody.y);
		enemy.constraints.push(game.physics.p2.createLockConstraint(shipBody, enemyBody, offset, angle, 1000));
		shipModel.touchMe(enemy);
		enemy.touchMe(shipBody);
	}

	exports.spawn = function(x = 700, y = 200) {
		if (!enemiesGroup) throw new Error("enemiesGroup missing");
		if (!enemiesCollisionGroup) throw new Error("enemiesCollisionGroup missing");
		if (!shipCollisionGroup) throw new Error("shipCollisionGroup missing");
		var enemy = enemiesGroup.create(x, y, 'enemy');
		enemy.body.velocity.x = -100;
		enemy.body.setCollisionGroup(enemiesCollisionGroup);
		enemy.body.collides([shipCollisionGroup, enemiesCollisionGroup], collision);
		enemy.body.sprite = enemy;
		enemy.body.debug = debug;
		enemy.anchor.x = 0.5;
		enemy.anchor.y = 0.5;
		enemy.constraints = [];
		enemy.onHull = false;
		enemy.health = 100;
		enemy.maxHealth = 100;
		console.log(enemy.scale);
		enemy.die = function() {
			while (enemy.constraints.length) {
				game.physics.p2.removeConstraint(enemy.constraints.shift());
			}
			clearInterval(enemy.attackTimer);
			clearInterval(enemy.defenseTimer);
			enemy.kill();
		};
		enemy.damage = function(amount) {
			enemy.health -= amount;
			enemy.updateSize();
			if (enemy.health <= 0) enemy.die();
		};
		enemy.touchMe = function(ship) {
			enemy.onHull = true;
			enemy.attackTimer = setInterval(function() {
				shipModel.damage(damagePerTick);
			}, attackInterval);
		};
		enemy.updateSize = function() {
			var healthPercentage = enemy.health / enemy.maxHealth;
			enemy.scale.x = enemy.scale.y = healthPercentage;
		};
		return enemy;
	};

	return exports;
})();
