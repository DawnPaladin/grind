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
	enemy = game.add.sprite(700, 200, 'enemy');
	ship = game.add.sprite(300, 300, 'ship');
	game.physics.p2.enable([ship, enemy], debug);
	ship.body.setCircle(200);
	ship.body.setCollisionGroup(shipCollisionGroup);
	enemy.body.setCollisionGroup(enemyCollisionGroup);
	enemy.body.collides([enemyCollisionGroup, shipCollisionGroup], collision);

	enemy.body.velocity.x = -100;
}

function update() {
	ship.body.collides([shipCollisionGroup, enemyCollisionGroup], collision);
}

function render() {
}

function collision() {
	console.log('collision detected');
}

function spawnFormation() {

}
