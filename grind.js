var game = new Phaser.Game("100%", "100%", Phaser.AUTO, '', { preload: preload, create: create, update: update, render: render });
var debug = false;

var ship, enemy, enemies, shipCollisionGroup, enemyCollisionGroup, spawnEnemy, healthBar;

function preload() {
	game.load.image('ship', 'graphics/simple-ship.svg');
	game.load.image('enemy', 'graphics/square-enemy.svg');
}

function create() {
	game.physics.startSystem(Phaser.Physics.P2JS);
	game.physics.p2.setImpactEvents(true);
	game.physics.p2.updateBoundsCollisionGroup();
	game.stage.backgroundColor = '#1C1C1C';

	shipCollisionGroup = game.physics.p2.createCollisionGroup();
	enemyCollisionGroup = game.physics.p2.createCollisionGroup();
	enemies = game.add.group();
	enemies.enableBody = true;
	enemies.physicsBodyType = Phaser.Physics.P2JS;
	ship = game.add.sprite(200, 200, 'ship');
	shipGroup = game.add.group();
	shipGroup.enableBody = true;
	shipGroup.addChild(ship);
	shipGroup.x = 200;
	shipGroup.y = 200;
	shipGroup.pivot.x = 200;
	shipGroup.pivot.y = 200;
	spawn();

	game.physics.p2.enable([ship, enemies], debug);
	ship.body.setCircle(200);
	ship.body.setCollisionGroup(shipCollisionGroup);
	ship.body.collides([shipCollisionGroup, enemyCollisionGroup], collision);
	ship.body.fixedRotation = true;

	cursors = game.input.keyboard.addKeys({
		'left': Phaser.KeyCode.A,
		'right': Phaser.KeyCode.D,
		'up':   Phaser.KeyCode.W,
		'down': Phaser.KeyCode.S,
		'space': Phaser.KeyCode.SPACEBAR
	});

	healthBar = new HealthBar(game, { x: game.width/2, y: 50, width: 500 });
	shipModel.hullHealthEvent.add(function(shipStatus) {
		var percentage = shipStatus.hullHealth / shipStatus.hullMaxHealth * 100;
		healthBar.setPercent(percentage);
	});
}

function update() {
	ship.body.setZeroVelocity();
	ship.body.setZeroRotation();

	if (cursors.up.isDown) {
		ship.body.y -= 10;
	} else if (cursors.down.isDown) {
		ship.body.y += 10;
	}

	if (cursors.left.isDown) {
		ship.body.x -= 10;
	} else if (cursors.right.isDown) {
		ship.body.x += 10;
	} else if (cursors.space.isDown) {
		spawnEnemy = true;
	} else if (cursors.space.isUp && spawnEnemy) {
		spawn();
		spawnEnemy = false;
	}
}

function render() {
	// game.debug.text('A and D to rotate; spacebar to spawn enemies', 32, 32);
}

function collision(shipBody, impactorBody) {
	var enemy = impactorBody.sprite;
	impactorBody.removeCollisionGroup(enemyCollisionGroup);
	var offset = [shipBody.x - impactorBody.x, shipBody.y - impactorBody.y];
	var angle = game.math.angleBetween(shipBody.x, shipBody.y, impactorBody.x, impactorBody.y);
	// game.physics.p2.createSpring(shipBody, impactorBody, 40, 30, 50);
	enemy.constraints.push(game.physics.p2.createLockConstraint(shipBody, impactorBody, offset, angle, 1000));
	enemy.damage = { max: 10, current: 10, inflicted: 0 };
	var tweenTime = 500;
	var sizeTween = game.add.tween(enemy.scale);
	sizeTween.to( {x: 0, y: 0}, tweenTime, null, true)
		.onComplete.add(function() {
			while (enemy.constraints.length) {
				game.physics.p2.removeConstraint(enemy.constraints.shift());
			}
			console.log(enemy.constraints);
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

function spawn(x, y) {
	enemy = enemies.create(700, 200, 'enemy');
	enemy.body.velocity.x = -100;
	enemy.body.setCollisionGroup(enemyCollisionGroup);
	enemy.body.collides([shipCollisionGroup, enemyCollisionGroup]);
	enemy.body.sprite = enemy;
	enemy.body.debug = debug;
	enemy.anchor.x = 0.5;
	enemy.anchor.y = 0.5;
	enemy.constraints = [];
}
