var simpleEnemy = (function() {
	var exports = {};

	var game, shipCollisionGroup, debug, enemiesGroup, enemiesCollisionGroup;
	exports.init = function(_game, _shipCollisionGroup, _enemiesCollisionGroup, _debug) {
		console.log(_game, _shipCollisionGroup, _enemiesCollisionGroup, _debug);
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
		enemyBody.removeCollisionGroup(enemiesCollisionGroup);
		var offset = [shipBody.x - enemyBody.x, shipBody.y - enemyBody.y];
		var angle = game.math.angleBetween(shipBody.x, shipBody.y, enemyBody.x, enemyBody.y);
		// game.physics.p2.createSpring(shipBody, enemyBody, 40, 30, 50);
		enemy.constraints.push(game.physics.p2.createLockConstraint(shipBody, enemyBody, offset, angle, 1000));
		if (enemy.melt) {
			enemy.damage = { max: 10, current: 10, inflicted: 0 };
			var tweenTime = 500;
			var sizeTween = game.add.tween(enemy.scale);
			sizeTween.to( {x: 0, y: 0}, tweenTime, null, true)
				.onComplete.add(function() {
					while (enemy.constraints.length) {
						game.physics.p2.removeConstraint(enemy.constraints.shift());
					}
					enemy.kill();
				}, this);
			var damageTween = game.add.tween(enemy.damage);
			damageTween.to( {current: 0 }, tweenTime, null, true);
			damageTween.onUpdateCallback(function(param) {
				var diff = enemy.damage.max - (enemy.damage.current + enemy.damage.inflicted);
				shipModel.damage(diff);
				enemy.damage.inflicted += diff;
			});
		}
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
		enemy.melt = true;
		return enemy;
	};

	return exports;
})();
