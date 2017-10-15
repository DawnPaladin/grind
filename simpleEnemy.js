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
		if (enemy.onHull || (enemyBody.sprite.name == "enemy" && shipBody.sprite.name == "enemy")) return false;
		enemyBody.removeCollisionGroup(enemiesCollisionGroup);
		var offset = [shipBody.x - enemyBody.x, shipBody.y - enemyBody.y];
		var angle = game.math.angleBetween(shipBody.x, shipBody.y, enemyBody.x, enemyBody.y);
		enemy.constraints.push(game.physics.p2.createLockConstraint(shipBody, enemyBody, offset, angle, 1000));
		shipModel.touchMe(enemy);
		enemy.touchMe(shipBody);
	}

	function spawn(x = 700, y = 200) {
		if (!enemiesGroup) throw new Error("enemiesGroup missing");
		if (!enemiesCollisionGroup) throw new Error("enemiesCollisionGroup missing");
		if (!shipCollisionGroup) throw new Error("shipCollisionGroup missing");
		var enemy = enemiesGroup.create(x, y, 'enemy');
		enemy.name = "enemy";
		enemy.body.velocity.y = 100;
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
		enemy.inputEnabled = true;
		enemy.events.onInputDown.add(function harvest() {
			var maxDamage = 100;
			var damage = maxDamage > enemy.health ? enemy.health : maxDamage;
			shipModel.healShields(damage);
			enemy.damage(damage);
		}, this);
		return enemy;
	}
	exports.spawn = spawn;

	exports.spawnFormation = function() {
		spawn(900, 200);
		spawn(700, 200);
		spawn(500, 200);
		spawn(300, 200);
		spawn(100, 200);
	};

	return exports;
})();
