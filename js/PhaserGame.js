window.onload = function () {
    var game, fpsDisplay, platforms, player, cursors, playerDirection, playerFacing,
        buttonJump, buttonLeft, buttonRight, playerJump, playerLeft, playerRight;
    //W,H,CANVAS WEBGL OR AUTO, ID OF DOM ELEMENT TO APPEND TO
    game = new Phaser.Game(960, 540, Phaser.AUTO, 'game-area', { preload: preload, create: create, update: update }, false, false);

    function preload() {
        game.load.image('grass', 'assets/grass.png');
        game.load.image('ground', 'assets/ground.png');
        game.load.image('player', 'assets/player.png');
        game.load.image('background', 'assets/background.png');
        
        game.load.spritesheet('buttonSheet', 'assets/buttonSheet.png', 128, 64);
        
        game.scale.minWidth = 960;
        game.scale.minHeight = 540;
        game.scale.maxWidth = 960;
        game.scale.maxHeight = 540;
        game.scale.scaleMode = Phaser.ScaleManager.NO_SCALE;
        game.renderer.renderSession.roundPixels = true;//Prevent rendering half pixels
        //Updates game.time.fps
        game.time.advancedTiming = true;
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
        player.body.gravity.y = 1200;
        player.body.collideWorldBounds = true;
        
        buttonJump = game.add.button(800, 400, 'buttonSheet', null, this, 1, 0, 1, 0);
        buttonJump.fixedToCamera = true;
        buttonJump.events.onInputOver.add(function () {playerJump = true; });
        buttonJump.events.onInputOut.add(function () {playerJump = false; });
        buttonJump.events.onInputDown.add(function () {playerJump = true; });
        buttonJump.events.onInputUp.add(function () {playerJump = false; });
        buttonJump.alpha = 0.2;
        
        buttonLeft = game.add.button(32, 400, 'buttonSheet', null, this, 1, 0, 1, 0);
        buttonLeft.fixedToCamera = true;
        buttonLeft.events.onInputOver.add(function () {playerLeft = true; });
        buttonLeft.events.onInputOut.add(function () {playerLeft = false; });
        buttonLeft.events.onInputDown.add(function () {playerLeft = true; });
        buttonLeft.events.onInputUp.add(function () {playerLeft = false; });
        buttonLeft.alpha = 0.2;
        
        buttonRight = game.add.button(160, 400, 'buttonSheet', null, this, 1, 0, 1, 0);
        buttonRight.fixedToCamera = true;
        buttonRight.events.onInputOver.add(function () {playerRight = true; });
        buttonRight.events.onInputOut.add(function () {playerRight = false; });
        buttonRight.events.onInputDown.add(function () {playerRight = true; });
        buttonRight.events.onInputUp.add(function () {playerRight = false; });
        buttonRight.alpha = 0.2;
        
        fpsDisplay = game.add.text(64, 64, "Fps:" + game.time.fps);
    }

    function update() {
        fpsDisplay.text = "FPS:" + game.time.fps;
        
        //  Collide the player with the platforms
        game.physics.arcade.collide(player, platforms);
        
        //  Reset the players velocity (movement)
        player.body.velocity.x = 0;
        playerDirection = 0;

        if (cursors.left.isDown || playerLeft) {
            //  Move to the left
            playerDirection = -1;
        }
        
        if (cursors.right.isDown || playerRight) {
            //  Move to the right
            playerDirection = playerDirection + 1;
        }
        
        player.body.velocity.x = 150 * playerDirection;
        if (playerDirection !== playerFacing && playerDirection !== 0) {
            playerFacing = playerDirection;
            player.scale.x *= -1;
        }

        //  Allow the player to jump if they are touching the ground.
        if ((cursors.up.isDown || playerJump) && player.body.touching.down) {
            player.body.velocity.y = -350;
        }
    }
};