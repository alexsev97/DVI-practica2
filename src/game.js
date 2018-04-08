var sprites = {
 Beer: {sx: 512, sy: 99,w: 23, h: 32, frames: 1},
 Glass: {sx: 512, sy: 131, w: 23, h: 32, frames: 1},
 NPC: {sx: 512, sy: 66, w: 33, h: 33, frames: 1},
 ParedIzda: {sx: 0, sy: 0, w: 512, h: 480, frames: 1},
 Player: {sx: 512, sy: 0, w: 56, h: 66, frames: 1},
 TapperGameplay: {sx: 0, sy: 480, w: 512, h: 480, frames: 1},
 FullHeart: {sx: 512, sy: 165, w: 17, h: 14, frames: 1},
 EmptyHeart: {sx: 512, sy: 179, w: 17, h: 14, frames: 1}
};

var bar_sprites = {
  Runner: {sx: 0, sy: 500, w: 380, h: 285, frames: 4},
  Lost: {sx: 1520, sy: 500, w: 380, h: 320, frames: 1}
};

var tip_sprites = {
  FallingBeer: {sx: 96, sy: 0, w: 32, h:32},
  TouchedTip: {sx: 128, sy: 0, w: 32, h:32},
  NormalTip: {sx: 160, sy: 0, w: 32, h:32}
}

var barras = {
  First: {sx: 325, sy: 90, maxIzq: 102},
  Second: {sx: 357, sy: 185, maxIzq: 70},
  Third: {sx: 389, sy: 281, maxIzq: 38},
  Fourth: {sx: 421, sy: 377, maxIzq: 6}
};

var OBJECT_PLAYER = 1,
    OBJECT_BEER = 2,
    OBJECT_CLIENT = 4,
    OBJECT_GLASS = 8;
    OBJECT_RUNNER = 16;

var startGame = function() {
  Game.setBoard(0, new TapperGameplay());
  Game.setBoard(3,new TitleScreen("Mini Tapper", 
                                  "Press space to start playing",
                                  playGame));
  Game.enableBoard(0);
  Game.enableBoard(3);
};

const LASTLEVEL = 3;
var level = 1;
var bestScore = 0;
var numVidas = 3;
var added = false;

var level1 = function(tablero){
  var clienteB1 = new Client('NPC', 112,80,44);
  var clienteB2 = new Client('NPC', 80,175,44);
  var clienteB3 = new Client('NPC', 48,271,44);
  var clienteB4 = new Client('NPC', 16,367,44)
  tablero.add(new Spawner(clienteB1, 1, 4, 1));
  tablero.add(new Spawner(clienteB2, 1, 5, 3));
  tablero.add(new Spawner(clienteB3, 1, 6, 5));
  tablero.add(new Spawner(clienteB4, 1, 7, 7));
}

var level2 = function(tablero){
  var clienteB1 = new Client('NPC', 112,80,20);
  var clienteB2 = new Client('NPC', 80,175,25);
  var clienteB3 = new Client('NPC', 48,271,20);
  var clienteB4 = new Client('NPC', 16,367,25)
  tablero.add(new Spawner(clienteB1, 2, 6, 1));
  tablero.add(new Spawner(clienteB2, 1, 7, 3));
  tablero.add(new Spawner(clienteB3, 3, 6, 5));
  tablero.add(new Spawner(clienteB4, 1, 7, 7));
}

var level3 = function(tablero){
  var clienteB1 = new Client('NPC', 112,80,50);
  var clienteB2 = new Client('NPC', 80,175,25);
  tablero.add(new Spawner(clienteB1, 6, 2, 0));
  tablero.add(new Spawner(clienteB2, 5, 4, 3));
}

var levelScreen = function(){
  Game.setBoard(3,new TitleScreen("Level " + level, 
                                  "Press space to enter the adventure",
                                  playGame));
}

var playGame = function() {
  Game.disableBoard(3);
  var fondo = new GameBoard();
  fondo.add(new TapperGameplay());
  var personajes = new GameBoard();
  personajes.add(new Player(barras.First));
  var superpuesta = new GameBoard();
  superpuesta.add(new ParedIzda());
  superpuesta.add(new HeartManager());

  if (level == 1){
    level1(personajes);
  }
  else if (level == 2){
    level2(personajes);
  }
  else if (level == 3){
    level3(personajes);
  }

  personajes.add(new DeadZone(325,90));
  personajes.add(new DeadZone(357,185));
  personajes.add(new DeadZone(389,281));
  personajes.add(new DeadZone(421,377));

  personajes.add(new DeadZone(102,90));
  personajes.add(new DeadZone(70,185));
  personajes.add(new DeadZone(38,281));
  personajes.add(new DeadZone(6,377));


  Game.setBoard(0, fondo);
  Game.enableBoard(0);
  Game.setBoard(1, personajes);
  Game.enableBoard(1);
  Game.setBoard(2, superpuesta);
  Game.enableBoard(2);
  if(level == 1){
    Game.setBoard(5,new GamePoints(0));
    Game.enableBoard(5);
  }
};

var TouchedTip = function(sx,sy) {
  this.setup('TouchedTip');
  this.x = sx; this.y = sy; this.time = 0;

  this.step = function(dt){
    this.time += dt;
    if(this.time >= 1)
      this.board.remove(this);
  }
};

TouchedTip.prototype = new Sprite();

var Tip = function(sx,sy){
   this.setup('NormalTip',  { vx: 0, reloadTime: 0.25, maxVel: 200, frame: 0, counter: 0});
   this.x = sx; this.y = sy; this.time = 0;

   this.step = function(dt){
    this.time += dt;
    if(this.time >= 10)
      this.board.remove(this);

    var collision = this.board.collide(this,OBJECT_RUNNER);

    if(collision) {
      Game.points += this.points || 1500;
      this.board.remove(this);
      this.board.add(new TouchedTip (this.x,this.y));
    }
 }
};

Tip.prototype = new Sprite();

var Runner = function(barra){
  this.setup('Runner',  { vx: 0, reloadTime: 0.25, maxVel: 200, frame: 0, counter: 0});
  this.x = barra.sx-30; this.y = barra.sy; this.barra = barra;

  this.step = function(dt) {
    if(Game.keys['izquierda']) { 
      this.counter++;
      if(this.counter == 3) {
        ++this.frame;
        this.counter = 0;
      }
      if (this.frame == 4) this.frame = 0;
        this.vx = -this.maxVel; 
     if (this.x <= barra.maxIzq)
        this.x = barra.maxIzq;
    }
    else if(Game.keys['derecha']) { 
      this.counter++;
      if(this.counter == 3) {
        --this.frame; 
        this.counter = 0;
      }
      if (this.frame == -1) 
        this.frame = 3; this.vx = this.maxVel; 
      if(this.x >= barra.sx-40){
        this.board.remove(this);
        this.board.add(new Player(barra));
      }
    }
    else { this.frame = 0; this.vx = 0; }
    if(Game.keys['abajo']) {
      this.board.remove(this);
      if(this.barra == barras.First) this.board.add(new Player(barras.Second));
      else if (this.barra == barras.Second) this.board.add(new Player(barras.Third));
      else if (this.barra == barras.Third) this.board.add(new Player(barras.Fourth));
      else if (this.barra == barras.Fourth) this.board.add(new Player(barras.First));
    }
    else if(Game.keys['arriba']){
      this.board.remove(this);
      if(this.barra == barras.First) this.board.add(new Player(barras.Fourth));
      else if (this.barra == barras.Second) this.board.add(new Player(barras.First));
      else if (this.barra == barras.Third) this.board.add(new Player(barras.Second));
      else if (this.barra == barras.Fourth) this.board.add(new Player(barras.Third));
    }
    this.x += this.vx * dt;

    this.reload-=dt;
  }

}

Runner.prototype = new Sprite();
Runner.prototype.type = OBJECT_RUNNER;

var TapperGameplay = function(){
  this.setup('TapperGameplay');
  this.x = 0;
  this.y = 0;

  this.step = function(dx){ };
}

TapperGameplay.prototype = new Sprite();

var ParedIzda = function(){
  this.setup('ParedIzda');
  this.x = 0;
  this.y = 0;

  this.step = function(dx){ };
}

ParedIzda.prototype = new Sprite();

var Player = function(barra){

  this.setup('Player',{reloadTime: 0.25, reloadBeer: 0.3});
  this.x = barra.sx; this.y = barra.sy; this.barra = barra;
  this.reload = this.reloadTime;
  this.rb = this.reloadBeer;

  this.step = function(dt) {
    this.reload-=dt;
    this.rb-=dt;

    if(Game.keys['abajo'] && this.reload < 0) {

      Game.keys['abajo'] = false;
      this.board.remove(this);
      if(this.barra == barras.First) this.board.add(new Player(barras.Second));
      else if (this.barra == barras.Second) this.board.add(new Player(barras.Third));
      else if (this.barra == barras.Third) this.board.add(new Player(barras.Fourth));
      else if (this.barra == barras.Fourth) this.board.add(new Player(barras.First));
    }

    else if(Game.keys['arriba'] && this.reload < 0) { 

      Game.keys['arriba'] = false;
      this.board.remove(this);
      if(this.barra == barras.First) this.board.add(new Player(barras.Fourth));
      else if (this.barra == barras.Second) this.board.add(new Player(barras.First));
      else if (this.barra == barras.Third) this.board.add(new Player(barras.Second));
      else if (this.barra == barras.Fourth) this.board.add(new Player(barras.Third));
      this.reload = this.reloadTime;
    }
    if(Game.keys['espacio'] && this.rb < 0){
      this.board.add(new Beer(this.x-sprites.Beer.w,this.y,-70));
      this.rb = this.reloadBeer;
    }

    else if (Game.keys['izquierda']){
      this.board.remove(this);
      this.board.add(new Runner(barra));
    }

};
}

Player.prototype = new Sprite();
Player.prototype.type = OBJECT_PLAYER;

var Beer = function(px, py, vel) { 
  this.setup('Beer', { x: px, y: py, vx: vel });
}

Beer.prototype = new Sprite();
Beer.prototype.type = OBJECT_BEER;

Beer.prototype.step = function(dt) {
    this.x += this.vx * dt;
};


var Client = function(sprite, px, py, vel) { 
  this.setup(sprite, { x: px, y: py, vx: vel });

}

Client.prototype = new Sprite();
Client.prototype.type = OBJECT_CLIENT;

Client.prototype.step = function(dt) {
    this.x += this.vx * dt;

    var collision = this.board.collide(this,OBJECT_BEER);

    if(collision) {
      GameManager.notifyServedClient();
      Game.points += this.points || 50;
      this.board.remove(this);
      this.board.remove(collision);
      this.board.add(new Glass(this.x+10,this.y+10,this.vx));

      if(Math.floor((Math.random() * 3)) == 0)
        this.board.add(new Tip(this.x, this.y +15));


      GameManager.notifyNewGlass();
    } 
};

var Glass = function(px, py, vel) { 
  this.setup('Glass', { x: px, y: py, vx: vel });
}

Glass.prototype = new Sprite();
Glass.prototype.type = OBJECT_GLASS;

Glass.prototype.step = function(dt) {
    this.x += this.vx * dt;

    var collision = this.board.collide(this,OBJECT_PLAYER);

    if(collision) {
      Game.points += this.points || 100;
      GameManager.notifyGlassPicked();
      this.board.remove(this);
    } 
  };

var FullHeart = function(px){
  this.setup('FullHeart', {x: px, y: 10});
}

FullHeart.prototype = new Sprite();
FullHeart.prototype.step = function(dt) {};

var EmptyHeart = function(px){
  this.setup('EmptyHeart', {x: px, y: 10});
}

EmptyHeart.prototype = new Sprite();
EmptyHeart.prototype.step = function(dt) {};

var HeartManager = function(){
  this.step = function(){
    var FH1 = new FullHeart(440);
    var FH2 = new FullHeart(460);
    var FH3 = new FullHeart(480);
    var EH1 = new EmptyHeart(440);
    var EH2 = new EmptyHeart(460);
    if (!added && numVidas == 3){
      this.board.add(FH1);
      this.board.add(FH2);
      this.board.add(FH3);
      added = true;
    }
    else if(!added && numVidas == 2){
      this.board.add(EH1);
      this.board.add(FH2);
      this.board.add(FH3);
      added = true;
    }
    else if(!added && numVidas == 1){
      this.board.add(EH1);
      this.board.add(EH2);
      this.board.add(FH3);
      added = true;
    }
  }

  this.draw = function(){}

};

var DeadZone = function(px, py){
  this.x = px; this.y = py;
  this.w = 10; this.h = 66;
};

DeadZone.prototype.draw = function(){
   /*var canvas = document.getElementById("game");
    var ctx = canvas.getContext("2d");
    ctx.fillStyle = "green";
    ctx.fillRect(this.x,this.y,this.w,this.h);*/
}

 DeadZone.prototype.step = function(dt){

  var collisionBeer = this.board.collide(this,OBJECT_BEER);
    if(collisionBeer) {
      GameManager.notifyBeerExtremoIzquierdo();
      this.board.remove(collisionBeer);
    }  

  var collisionGlass = this.board.collide(this,OBJECT_GLASS);
    if(collisionGlass) {
      GameManager.notifyGlassExtremoDerecho();
      this.board.remove(collisionGlass);
    }

  var collisionClient = this.board.collide(this,OBJECT_CLIENT);
   if(collisionClient) {
    GameManager.notifyClienteExtremoDerecho();
      this.board.remove(collisionClient);
    }
 }

 var Spawner = function(client,numClientes, frec, retardo){
  this.cliente = Object.create(client); 
  this.cliente.x = client.x; this.cliente.y = client.y; 
  this.numClientes = numClientes; 
  this.frec = frec; this.retardo = retardo; this.reload = retardo;
  GameManager.notifyAddClientes(numClientes);
 };

 Spawner.prototype.step = function(dt){
  if(this.numClientes > 0){
    this.reload -=dt;
    if(this.reload <= 0){
      --this.numClientes;
      this.reload = this.frec;
      var copia = Object.create(this.cliente)
      this.board.add(copia); 
    }
  }
 }

 Spawner.prototype.draw = function(ctx){};

 var GameManager = new function() {                      
  var currentClientes = 0;
  var currentGlasses = 0;

  this.winGame = function() {
    currentGlasses = 0;
    currentClientes = 0;
    Game.disableBoard(1);
    Game.disableBoard(2);
    if (level == LASTLEVEL){ 
      if(Game.points > bestScore) bestScore = Game.points;
      level = 1;
      numVidas = 3;
      added = false;
      Game.setBoard(3,new TitleScreen("You win! Best score: " + bestScore, 
                                    "Press space to play again",
                                    playGame));
    }
    else{
      ++level;
      added = false;
        levelScreen();
    }
    Game.enableBoard(3);
  }

  this.loseGame = function() {
    if(numVidas == 1) {
        currentGlasses = 0;
        currentClientes = 0;
        Game.disableBoard(1);
        Game.disableBoard(2);
        if(Game.points > bestScore) bestScore = Game.points;
        Game.setBoard(3,new TitleScreen("You lose! Best score: " + bestScore, 
                                       "Press space to play again",
                                      playGame));
        level = 1;
        numVidas = 3;
        added = false;
        Game.enableBoard(3);
    }
    else{
      --numVidas;
      added = false;
      this.checkVictory();
    }
  };

  this.notifyClienteExtremoDerecho = function() {
    --currentClientes;
    this.loseGame();
  }

  this.notifyGlassExtremoDerecho = function() {
    --currentGlasses;
    this.loseGame();
  }

  this.notifyBeerExtremoIzquierdo = function() {
    this.loseGame();
  }

  this.notifyNewGlass = function() {
    ++currentGlasses;
  }

  this.notifyGlassPicked = function() {
    --currentGlasses;
    this.checkVictory();
  }

  this.notifyServedClient = function() {
    --currentClientes;
  }

   this.checkVictory = function() {
    if(currentClientes == 0 && currentGlasses == 0)
      this.winGame();
  }

  this.notifyAddClientes = function(nClientes) {
    currentClientes += nClientes;
  }
};

/*var winGame = function() {
  Game.setBoard(3,new TitleScreen("You win!", 
                                  "Press fire to play again",
                                  playGame));
};

var loseGame = function() {
  Game.setBoard(3,new TitleScreen("You lose!", 
                                  "Press fire to play again",
                                  playGame));
};

var Starfield = function(speed,opacity,numStars,clear) {

  // Set up the offscreen canvas
  var stars = document.createElement("canvas");
  stars.width = Game.width; 
  stars.height = Game.height;
  var starCtx = stars.getContext("2d");

  var offset = 0;

  // If the clear option is set, 
  // make the background black instead of transparent
  if(clear) {
    starCtx.fillStyle = "#000";
    starCtx.fillRect(0,0,stars.width,stars.height);
  }

  // Now draw a bunch of random 2 pixel
  // rectangles onto the offscreen canvas
  starCtx.fillStyle = "#FFF";
  starCtx.globalAlpha = opacity;
  for(var i=0;i<numStars;i++) {
    starCtx.fillRect(Math.floor(Math.random()*stars.width),
                     Math.floor(Math.random()*stars.height),
                     2,
                     2);
  }

  // This method is called every frame
  // to draw the starfield onto the canvas
  this.draw = function(ctx) {
    var intOffset = Math.floor(offset);
    var remaining = stars.height - intOffset;

    // Draw the top half of the starfield
    if(intOffset > 0) {
      ctx.drawImage(stars,
                0, remaining,
                stars.width, intOffset,
                0, 0,
                stars.width, intOffset);
    }

    // Draw the bottom half of the starfield
    if(remaining > 0) {
      ctx.drawImage(stars,
              0, 0,
              stars.width, remaining,
              0, intOffset,
              stars.width, remaining);
    }
  };

  // This method is called to update
  // the starfield
  this.step = function(dt) {
    offset += dt * speed;
    offset = offset % stars.height;
  };
};

var PlayerShip = function() { 
  this.setup('TapperGameplay', { vx: 0, reloadTime: 0.25, maxVel: 200 });

  this.reload = this.reloadTime;
  this.x = Game.width/2 - this.w / 2;
  this.y = Game.height - Game.playerOffset - this.h;

  this.step = function(dt) {
    if(Game.keys['left']) { this.vx = -this.maxVel; }
    else if(Game.keys['right']) { this.vx = this.maxVel; }
    else { this.vx = 0; }

    this.x += this.vx * dt;

    if(this.x < 0) { this.x = 0; }
    else if(this.x > Game.width - this.w) { 
      this.x = Game.width - this.w;
    }

    this.reload-=dt;
    if(Game.keys['fire'] && this.reload < 0) {
      Game.keys['fire'] = false;
      this.reload = this.reloadTime;

      this.board.add(new PlayerMissile(this.x,this.y+this.h/2));
      this.board.add(new PlayerMissile(this.x+this.w,this.y+this.h/2));
    }
  };
};

PlayerShip.prototype = new Sprite();
PlayerShip.prototype.type = OBJECT_PLAYER;

PlayerShip.prototype.hit = function(damage) {
  if(this.board.remove(this)) {
    loseGame();
  }
};


var PlayerMissile = function(x,y) {
  this.setup('missile',{ vy: -700, damage: 10 });
  this.x = x - this.w/2;
  this.y = y - this.h; 
};

PlayerMissile.prototype = new Sprite();
PlayerMissile.prototype.type = OBJECT_PLAYER_PROJECTILE;

PlayerMissile.prototype.step = function(dt)  {
  this.y += this.vy * dt;
  var collision = this.board.collide(this,OBJECT_ENEMY);
  if(collision) {
    collision.hit(this.damage);
    this.board.remove(this);
  } else if(this.y < -this.h) { 
      this.board.remove(this); 
  }
};


var Enemy = function(blueprint,override) {
  this.merge(this.baseParameters);
  this.setup(blueprint.sprite,blueprint);
  this.merge(override);
};

Enemy.prototype = new Sprite();
Enemy.prototype.type = OBJECT_ENEMY;

Enemy.prototype.baseParameters = { A: 0, B: 0, C: 0, D: 0, 
                                   E: 0, F: 0, G: 0, H: 0,
                                   t: 0, reloadTime: 0.75, 
                                   reload: 0 };

Enemy.prototype.step = function(dt) {
  this.t += dt;

  this.vx = this.A + this.B * Math.sin(this.C * this.t + this.D);
  this.vy = this.E + th
  is.F * Math.sin(this.G * this.t + this.H);

  this.x += this.vx * dt;
  this.y += this.vy * dt;

  var collision = this.board.collide(this,OBJECT_PLAYER);
  if(collision) {
    collision.hit(this.damage);
    this.board.remove(this);
  }

  if(Math.random() < 0.01 && this.reload <= 0) {
    this.reload = this.reloadTime;
    if(this.missiles == 2) {
      this.board.add(new EnemyMissile(this.x+this.w-2,this.y+this.h));
      this.board.add(new EnemyMissile(this.x+2,this.y+this.h));
    } else {
      this.board.add(new EnemyMissile(this.x+this.w/2,this.y+this.h));
    }

  }
  this.reload-=dt;

  if(this.y > Game.height ||
     this.x < -this.w ||
     this.x > Game.width) {
       this.board.remove(this);
  }
};

Enemy.prototype.hit = function(damage) {
  this.health -= damage;
  if(this.health <=0) {
    if(this.board.remove(this)) {
      Game.points += this.points || 100;
      this.board.add(new Explosion(this.x + this.w/2, 
                                   this.y + this.h/2));
    }
  }
};

var EnemyMissile = function(x,y) {
  this.setup('enemy_missile',{ vy: 200, damage: 10 });
  this.x = x - this.w/2;
  this.y = y;
};

EnemyMissile.prototype = new Sprite();
EnemyMissile.prototype.type = OBJECT_ENEMY_PROJECTILE;

EnemyMissile.prototype.step = function(dt)  {
  this.y += this.vy * dt;
  var collision = this.board.collide(this,OBJECT_PLAYER)
  if(collision) {
    collision.hit(this.damage);
    this.board.remove(this);
  } else if(this.y > Game.height) {
      this.board.remove(this); 
  }
};



var Explosion = function(centerX,centerY) {
  this.setup('explosion', { frame: 0 });
  this.x = centerX - this.w/2;
  this.y = centerY - this.h/2;
};

Explosion.prototype = new Sprite();

Explosion.prototype.step = function(dt) {
  this.frame++;
  if(this.frame >= 12) {
    this.board.remove(this);
  }
};
*/
window.addEventListener("load", function() {
  Game.initialize("game",sprites,bar_sprites,tip_sprites,startGame);
});


