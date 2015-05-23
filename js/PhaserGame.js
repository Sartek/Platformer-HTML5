window.onload = function () {
    var game, platforms, player, cursors, playerDirection, playerFacing;
    //W,H,CANVAS WEBGL OR AUTO, ID OF DOM ELEMENT TO APPEND TO
    game = new Phaser.Game(960, 540, Phaser.AUTO, 'game-area', { preload: preload, create: create, update: update });

    function preload() {
        game.load.image('grass', 'assets/grass.png');
        game.load.image('ground', 'assets/ground.png');
        game.load.image('player', 'assets/player.png');
        game.load.image('background', 'assets/background.png');
    }

    function create() {
    
        game.physics.startSystem(Phaser.Physics.ARCADE);
        cursors = game.input.keyboard.createCursorKeys();
    
        //Background
        game.stage.backgroundColor = "#344866";
        game.add.sprite(0, 0, 'background');
    
        platforms = game.add.group();
        platforms.enableBody = true;
        var groundTiles, grassTiles, i;
        groundTiles = [];
        grassTiles = [];
        for (i = 0; i < game.world.width; i = i + 32) {
            groundTiles.push(platforms.create(i, game.world.height - 32, 'ground'));
            groundTiles[groundTiles.length - 1].body.immovable = true;
            grassTiles.push(platforms.create(i, game.world.height - 64, 'grass'));
            grassTiles[grassTiles.length - 1].body.immovable = true;
        }
        
        player = game.add.sprite(128, game.world.height - 112, 'player');
        player.anchor.setTo(0.5, 0);
        playerFacing = 1;
        game.physics.arcade.enable(player);
        //player.body.bounce.y = 0.2;
        player.body.gravity.y = 1200;
        player.body.collideWorldBounds = true;
    }
    
    var playerDirection,playerFacing;

    function update() {
        
        //  Collide the player with the platforms
        game.physics.arcade.collide(player, platforms);
        
        //  Reset the players velocity (movement)
        player.body.velocity.x = 0;
        playerDirection = 0;

        if (cursors.left.isDown) {
            //  Move to the left
            playerDirection = -1;
        }
        
        if (cursors.right.isDown) {
            //  Move to the right
            playerDirection = playerDirection + 1;
        }
        
        player.body.velocity.x = 150 * playerDirection;
        if(playerDirection != playerFacing && playerDirection != 0) {
            playerFacing = playerDirection;
            player.scale.x *= -1;
        }

        //  Allow the player to jump if they are touching the ground.
        if (cursors.up.isDown && player.body.touching.down) {
            player.body.velocity.y = -350;
        }
    }
};