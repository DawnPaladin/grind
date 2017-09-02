var game = new Phaser.Game("100%", "100%", Phaser.AUTO, '', { preload: preload, create: create, update: update, render: render });
var debug = false;

var ship, enemy, enemies, shipCollisionGroup, enemyCollisionGroup;

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

	// ship = shipGroup.create(0, 0, 'ship');
	// console.log(ship);

	game.physics.p2.enable([ship, enemies], debug);
	ship.body.setCircle(200);
	ship.body.setCollisionGroup(shipCollisionGroup);
	ship.body.collides([shipCollisionGroup, enemyCollisionGroup], collision);

	cursors = game.input.keyboard.addKeys({
		'left': Phaser.KeyCode.A,
		'right': Phaser.KeyCode.D,
		'space': Phaser.KeyCode.SPACEBAR
	});
}

function update() {
	ship.body.setZeroVelocity();
	ship.body.setZeroRotation();

	if (cursors.left.isDown) {
		shipGroup.rotation -= .1;
	} else if (cursors.right.isDown) {
		shipGroup.rotation += .1;
	} else if (cursors.space.isDown) {
		spawn();
	}
}

function render() {
}

function collision(shipBody, impactorBody) {
	var enemy = impactorBody.sprite;
	// console.log(enemy);
	// var positionInWorld = [enemy.world.x, enemy.world.y]
	// console.log(positionInWorld);
	shipGroup.addChild(enemy);
	enemy.body.removeCollisionGroup(enemyCollisionGroup);
	enemy.body.setZeroVelocity();
	enemy.body.setZeroRotation();
	// ship.body.toLocalFrame(enemy.body, positionInWorld);
}

function spawn() {
	// var enemy = game.add.sprite(600, 200, 'enemy');
	var enemy = enemies.create(500, 200, 'enemy');
	enemy.body.velocity.x = -100;
	enemy.body.setCollisionGroup(enemyCollisionGroup);
	enemy.body.collides([shipCollisionGroup, enemyCollisionGroup]);
	enemy.body.sprite = enemy;
}

function spawnFormation() {

}
