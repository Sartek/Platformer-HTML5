window.onload = function () {
    var game, w, h, scale, fpsDisplay, Debugger, DEBUG,
        background, platforms, player, cursors, playerDirection, playerFacing,
        buttonJump, buttonLeft, buttonRight, playerJump, playerLeft, playerRight;
    
    DEBUG = false;
    if (DEBUG) {
        Debugger = function () { };
        Debugger.log = function (message) {
            try {
                console.log(message);
            } catch (exception) {
                return;
            }
        };
    }
    
    w = 960;
    h = 540;
    scale = 1;
    if (window.innerWidth >=  w * 2 && window.innerHeight >= h * 2) {
        scale = 2;
    }
    
    if (DEBUG) {
        Debugger.log("innerWidth:" + window.innerWidth + "innerHeight:" + window.innerHeight);
        Debugger.log("outerWidth:" + window.outerWidth + "outerHeight:" + window.outerHeight);
        Debugger.log("devicePixelRatio:" + window.devicePixelRatio);
        Debugger.log("scale:" + scale);
    }
    
    //W,H,CANVAS WEBGL OR AUTO, ID OF DOM ELEMENT TO APPEND TO
    game = new Phaser.Game(w * scale, h * scale, Phaser.AUTO, '', { preload: preload, create: create, update: update }, false, false);

    function preload() {
        game.load.image('grass', 'assets/grass.png');
        game.load.image('ground', 'assets/ground.png');
        game.load.image('player', 'assets/player.png');
        game.load.image('background', 'assets/background.png');
        
        game.load.spritesheet('buttonSheet', 'assets/buttonSheet.png', 128, 64);
        
        game.scale.minWidth = w * scale;
        game.scale.minHeight = h * scale;
        game.scale.maxWidth = w * scale;
        game.scale.maxHeight = h * scale;
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
        background = game.add.sprite(0, 0, 'background');
        background.scale.x = scale;
        background.scale.y = scale;
    
        platforms = game.add.group();
        platforms.enableBody = true;
        var groundTiles, grassTiles, i;
        groundTiles = [];
        grassTiles = [];
        for (i = 0; i < (game.world.width); i = i + 32 * scale) {
            groundTiles.push(platforms.create(i, (game.world.height - 32 * scale), 'ground'));
            groundTiles[groundTiles.length - 1].body.immovable = true;
            groundTiles[groundTiles.length - 1].scale.x = scale;
            groundTiles[groundTiles.length - 1].scale.y = scale;
            grassTiles.push(platforms.create(i, (game.world.height - 64 * scale), 'grass'));
            grassTiles[grassTiles.length - 1].body.immovable = true;
            grassTiles[groundTiles.length - 1].scale.x = scale;
            grassTiles[groundTiles.length - 1].scale.y = scale;
        }
        player = game.add.sprite(128 * scale, game.world.height - 112 * scale, 'player');
        player.anchor.setTo(0.5, 0.5);
        player.scale.x = scale;
        player.scale.y = scale;
        playerFacing = 1;
        game.physics.arcade.enable(player);
        player.body.gravity.y = 1200 * scale;
        player.body.collideWorldBounds = true;
        
        buttonJump = game.add.button(800 * scale, 400 * scale, 'buttonSheet', null, this, 1, 0, 1, 0);
        buttonJump.fixedToCamera = true;
        buttonJump.events.onInputOver.add(function () {playerJump = true; });
        buttonJump.events.onInputOut.add(function () {playerJump = false; });
        buttonJump.events.onInputDown.add(function () {playerJump = true; });
        buttonJump.events.onInputUp.add(function () {playerJump = false; });
        buttonJump.alpha = 0.2;
        buttonJump.scale.x = scale;
        buttonJump.scale.y = scale;
        
        buttonLeft = game.add.button(32 * scale, 400 * scale, 'buttonSheet', null, this, 1, 0, 1, 0);
        buttonLeft.fixedToCamera = true;
        buttonLeft.events.onInputOver.add(function () {playerLeft = true; });
        buttonLeft.events.onInputOut.add(function () {playerLeft = false; });
        buttonLeft.events.onInputDown.add(function () {playerLeft = true; });
        buttonLeft.events.onInputUp.add(function () {playerLeft = false; });
        buttonLeft.alpha = 0.2;
        buttonLeft.scale.x = scale;
        buttonLeft.scale.y = scale;
        
        buttonRight = game.add.button(160 * scale, 400 * scale, 'buttonSheet', null, this, 1, 0, 1, 0);
        buttonRight.fixedToCamera = true;
        buttonRight.events.onInputOver.add(function () {playerRight = true; });
        buttonRight.events.onInputOut.add(function () {playerRight = false; });
        buttonRight.events.onInputDown.add(function () {playerRight = true; });
        buttonRight.events.onInputUp.add(function () {playerRight = false; });
        buttonRight.alpha = 0.2;
        buttonRight.scale.x = scale;
        buttonRight.scale.y = scale;
        if (DEBUG) {
            fpsDisplay = game.add.text(64 * scale, 64 * scale, "Fps:" + game.time.fps);
            fpsDisplay.scale.x = scale;
            fpsDisplay.scale.y = scale;
        }
    }

    function update() {
        if (DEBUG) {
            fpsDisplay.text = "FPS:" + game.time.fps;
        }
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
        
        player.body.velocity.x = (150 * playerDirection) * scale;
        if (playerDirection !== playerFacing && playerDirection !== 0) {
            playerFacing = playerDirection;
            player.scale.x *= -1;
        }

        //  Allow the player to jump if they are touching the ground.
        if ((cursors.up.isDown || playerJump) && player.body.touching.down) {
            player.body.velocity.y = -350 * scale;
        }
    }
};