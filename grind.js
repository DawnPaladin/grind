"use strict";

var game = new Phaser.Game("100%", "100%", Phaser.AUTO, '', { preload: preload, create: create, update: update, render: render });
var debug = false;

var ship, enemy, shipGroup, enemies, shipCollisionGroup, enemyCollisionGroup, spawnEnemy, healthBar, shieldBar, cursors;

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
	ship = game.add.sprite(500, 600, 'ship');
	shipGroup = game.add.group();
	shipGroup.enableBody = true;
	shipGroup.addChild(ship);
	shipGroup.x = 200;
	shipGroup.y = 200;
	shipGroup.pivot.x = 200;
	shipGroup.pivot.y = 200;

	enemyCollisionGroup = game.physics.p2.createCollisionGroup();
	enemies = simpleEnemy.init(game, shipCollisionGroup, enemyCollisionGroup, debug);
	simpleEnemy.spawnFormation();

	game.physics.p2.enable([ship, enemies], debug);
	ship.body.setCircle(200);
	ship.body.setCollisionGroup(shipCollisionGroup);
	ship.body.collides([shipCollisionGroup, enemyCollisionGroup]);
	ship.body.fixedRotation = true;

	cursors = game.input.keyboard.addKeys({
		'left': Phaser.KeyCode.A,
		'right': Phaser.KeyCode.D,
		'up':   Phaser.KeyCode.W,
		'down': Phaser.KeyCode.S,
		'space': Phaser.KeyCode.SPACEBAR
	});

	healthBar = new HealthBar(game, { x: game.width/2, y: 50, width: 500 });
	shieldBar = new HealthBar(game, { x: game.width/2, y: 100, width: 500, bar: { color: "rgb(44, 204, 190)" }, bg: { color: 'dimgray' }});
	shipModel.hullHealthEvent.add(function(shipStatus) {
		var percentage = shipStatus.hullHealth / shipStatus.hullMaxHealth * 100;
		healthBar.setPercent(percentage);
	});
	shipModel.shieldHealthEvent.add(function(shipStatus) {
		var percentage = shipStatus.shieldHealth / shipStatus.shieldMaxHealth * 100;
		shieldBar.setPercent(percentage);
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
		simpleEnemy.spawn();
		spawnEnemy = false;
	}
}

function render() {
	// game.debug.text('A and D to rotate; spacebar to spawn enemies', 32, 32);
}
