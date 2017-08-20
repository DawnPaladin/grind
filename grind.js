var game = new Phaser.Game("100%", "100%", Phaser.AUTO, '', { preload: preload, create: create, update: update, render: render });
var debug = false;

function preload() {
	game.load.image('ship', 'graphics/simple-ship.svg');
	game.load.image('enemy', 'graphics/square-enemy.svg');
	game.load.physics('physicsData', 'physics.json');
}

function create() {
	game.physics.startSystem(Phaser.Physics.P2JS);
	game.stage.backgroundColor = '#1C1C1C';

	ship = game.add.sprite(300, 300, 'ship');
	enemy = game.add.sprite(700, 200, 'enemy');

	game.physics.p2.enable([ship, enemy], debug);
	game.physics.p2.gravity.y = 0;
	ship.body.setCircle(200);

	enemy.body.velocity.x = -100;
}

function update() {
}

function render() {
}

function spawnFormation() {

}
