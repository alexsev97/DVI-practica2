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

//Sprites de la hoja barman con el jugador corriendo (4 frames) y el jugador cuando pierde
var bar_sprites = {
  Runner: {sx: 0, sy: 500, w: 380, h: 285, frames: 4},
  Lost: {sx: 1520, sy: 500, w: 380, h: 320, frames: 1}
};

//Sprites de la hoja tip con la cerveza cayendo, sprite de cuando se coge la propina y sprite simple de la propina
var tip_sprites = {
  FallingBeer: {sx: 96, sy: 0, w: 32, h:32},
  TouchedTip: {sx: 128, sy: 0, w: 32, h:32},
  NormalTip: {sx: 160, sy: 0, w: 32, h:32}
}

//Para facilitar muchas operaciones, se han puesto las barras como variables (coordenadas de hasta donde van por la izq, der y la coordenada y)
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

const LASTLEVEL = 3; //indica si hemos llegado al ultimo nivel
var level = 1; //nivel por el que vamos
var bestScore = 0; //mejor puntuacion hasta el momentos
var numVidas = 3; //numero de vidas
var added = false; //variable auxiliar para mostrar los corazones de vida

//Nivel 1
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

//Nivel 2
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

//Nivel 3
var level3 = function(tablero){
  var clienteB1 = new Client('NPC', 112,80,50);
  var clienteB2 = new Client('NPC', 80,175,25);
  tablero.add(new Spawner(clienteB1, 6, 2, 0));
  tablero.add(new Spawner(clienteB2, 5, 4, 3));
}

//Funcion que muestra un pequeño titulo al cambiar de nivel
var levelScreen = function(){
  Game.setBoard(3,new TitleScreen("Level " + level, 
                                  "Press space to enter the adventure",
                                  playGame));
}

var playGame = function() {
  Game.disableBoard(3);

  //Primera capa, con el fondo del juego
  var fondo = new GameBoard();
  fondo.add(new TapperGameplay());

  //Segunda capa, con el jugador, clientes y las DeadZones
  var personajes = new GameBoard();
  personajes.add(new Player(barras.First));

  //Tercera capa, con la pared izquierda y los corazones de vida
  var superpuesta = new GameBoard();
  superpuesta.add(new ParedIzda());
  superpuesta.add(new HeartManager());

  //En funcion del nivel, cargamos los distintos clientes
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

//Animacion al coger una propina
var TouchedTip = function(sx,sy) {
  this.setup('TouchedTip');
  this.x = sx; this.y = sy; this.time = 0;

  this.step = function(dt){
    this.time += dt;
    if(this.time >= 1)
      this.board.remove(this); //pasado 1 segundo quitamos el sprite
  }
};

TouchedTip.prototype = new Sprite();

var Tip = function(sx,sy){
   this.setup('NormalTip',  { vx: 0, reloadTime: 0.25, maxVel: 200, frame: 0, counter: 0});
   this.x = sx; this.y = sy; this.time = 0;

   this.step = function(dt){
    this.time += dt;
    //Mantenemos la propina en la barra durante 10 segundos
    if(this.time >= 10)
      this.board.remove(this);

    var collision = this.board.collide(this,OBJECT_RUNNER);

    //Al colisionar el jugador, sumamos a la puntuacion y ponemos la animacion de coger propina
    if(collision) {
      Game.points += this.points || 1500;
      this.board.remove(this);
      this.board.add(new TouchedTip (this.x,this.y));
    }
 }
};

Tip.prototype = new Sprite();

//Jugador corriendo
var Runner = function(barra){
  this.setup('Runner',  { vx: 0, reloadTime: 0.25, maxVel: 200, frame: 0, counter: 0});
  this.x = barra.sx-30; this.y = barra.sy; this.barra = barra;

  this.step = function(dt) {

    if(Game.keys['izquierda']) { 
      this.counter++; //contador auxiliar para cambiar de frame cada cierto tiempo
      //Cada 4 pulsaciones de izquierda, se mueve el frame
      if(this.counter == 3) {
        ++this.frame;
        this.counter = 0;
      }
      if (this.frame == 4) this.frame = 0;
        this.vx = -this.maxVel; 

      if (this.x <= barra.maxIzq) //si hemos llegado al final de la barra, nos quedamos ahi
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
      //Si llegamos al final de la barra con el runner, automaticamente los transformamos en un player
       if(this.x >= barra.sx-40){
        this.board.remove(this);
        this.board.add(new Player(barra));
      }
    }
    else { this.frame = 0; this.vx = 0; }
    
    //Si estamos en mitad de la barra y pulsamos abajo o arriba, debemos volver a poner cervezas
    if(Game.keys['abajo']) {
      this.board.remove(this); //quitamos al jugador corriendo
      //Ponemos al jugador que pone cervezas en la barra correspondiente
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

//Fondo de nuestro juego
var TapperGameplay = function(){
  this.setup('TapperGameplay');
  this.x = 0;
  this.y = 0;

  this.step = function(dx){ };
}

TapperGameplay.prototype = new Sprite();

//Pared izquierda
var ParedIzda = function(){
  this.setup('ParedIzda');
  this.x = 0;
  this.y = 0;

  this.step = function(dx){ };
}

ParedIzda.prototype = new Sprite();

//Jugador que pone cervezas (jugador simple)
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
      this.board.remove(this); //quitamos al player actual y lo movemos a otra barra
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
      this.board.add(new Beer(this.x-sprites.Beer.w,this.y,-70)); //ponemos una cerveza un poco mas a la izquierda de donde esta el player con una velocidad de -70
      this.rb = this.reloadBeer; //solo se puede crear una cerveza cada cierto tiempo
    }
    //Si nos movemos a la izquierda en una barra, quitamos al jugador actual y lo cambiamos por un runner
    else if (Game.keys['izquierda']){
      this.board.remove(this);
      this.board.add(new Runner(barra));
    }

};
}

Player.prototype = new Sprite();
Player.prototype.type = OBJECT_PLAYER;

//Cerveza simple
var Beer = function(px, py, vel) { 
  this.setup('Beer', { x: px, y: py, vx: vel });
}

Beer.prototype = new Sprite();
Beer.prototype.type = OBJECT_BEER;

Beer.prototype.step = function(dt) {
    this.x += this.vx * dt;
};


//Cliente
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
      Game.points += this.points || 50; //sumamos los puntos
      this.board.remove(this); //quitamos el cliente
      this.board.remove(collision); //quitamos el objeto beer
      this.board.add(new Glass(this.x+10,this.y+10,this.vx)); //ponemos una jarra vacia

      //Las propinas se generan de forma aleatoria
      if(Math.floor((Math.random() * 3)) == 0)
        this.board.add(new Tip(this.x, this.y +15));

      GameManager.notifyNewGlass();
    } 
};

//Jarra vacia
var Glass = function(px, py, vel) { 
  this.setup('Glass', { x: px, y: py, vx: vel });
}

Glass.prototype = new Sprite();
Glass.prototype.type = OBJECT_GLASS;

Glass.prototype.step = function(dt) {
    this.x += this.vx * dt;

    var collision = this.board.collide(this,OBJECT_PLAYER);

    if(collision) {
      Game.points += this.points || 100; //sumamos los puntos de recoger una jarra
      GameManager.notifyGlassPicked(); //notificamos que ha sido recogida
      this.board.remove(this); //y quitamos la jarra
    } 
  };

//Vida
var FullHeart = function(px){
  this.setup('FullHeart', {x: px, y: 10});
}

FullHeart.prototype = new Sprite();
FullHeart.prototype.step = function(dt) {};

//Vida vacia
var EmptyHeart = function(px){
  this.setup('EmptyHeart', {x: px, y: 10});
}

EmptyHeart.prototype = new Sprite();
EmptyHeart.prototype.step = function(dt) {};

//El heartmanager es el encargado de crear los corazones segun las vidas que tengamos
var HeartManager = function(){
  this.step = function(){
    var FH1 = new FullHeart(440);
    var FH2 = new FullHeart(460);
    var FH3 = new FullHeart(480);
    var EH1 = new EmptyHeart(440);
    var EH2 = new EmptyHeart(460);

    //Si no habian sido pintados los corazones y segun el numero de vidas, los dibujamos
    //El added nos ayuda a que no este todo el rato pintando/quitando corazones
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

//Zona de choque
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

  //Si choca una cerveza
  var collisionBeer = this.board.collide(this,OBJECT_BEER);
    if(collisionBeer) {
      GameManager.notifyBeerExtremoIzquierdo();
      this.board.remove(collisionBeer);
    }  

  //Si choca una jarra vacia
  var collisionGlass = this.board.collide(this,OBJECT_GLASS);
    if(collisionGlass) {
      GameManager.notifyGlassExtremoDerecho();
      this.board.remove(collisionGlass);
    }

  //Si choca un cliente
  var collisionClient = this.board.collide(this,OBJECT_CLIENT);
   if(collisionClient) {
    GameManager.notifyClienteExtremoDerecho();
      this.board.remove(collisionClient);
    }
 }

 //Clientes
 var Spawner = function(client,numClientes, frec, retardo){
  //creamos una copia del cliente con los parametros que pasamos
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

 //Manager del juego
 var GameManager = new function() {                      
  var currentClientes = 0;
  var currentGlasses = 0;

  this.winGame = function() {
    currentGlasses = 0;
    currentClientes = 0;
    Game.disableBoard(1);
    Game.disableBoard(2);
    //Si estamos en el ultimo nivel, mostramos que ya ha ganado
    if (level == LASTLEVEL){ 
      if(Game.points > bestScore) bestScore = Game.points;
      level = 1;
      numVidas = 3;
      added = false;
      Game.setBoard(3,new TitleScreen("You win! Best score: " + bestScore, 
                                    "Press space to play again",
                                    playGame));
    }
    //Si no hemos llegado al ultimo nivel aun, significa solamente que hemos subido de nivel
    else{
      ++level;
      added = false;
      levelScreen();
    }
    Game.enableBoard(3);
  }

  this.loseGame = function() {
    //Si solo nos quedaba una vida, entonces habremos perdido el juego
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
    //Si por el contrario, aun teniamos alguna vida, se nos quitara
    else{
      --numVidas;
      added = false;
      this.checkVictory(); //comprobamos si hemos ganado, ya que podemos ganar perdiendo una vida
    }
  };

  //Funciones de notificacion

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

//El initialize ahora tendra los 3 tipos distintos de sprites
window.addEventListener("load", function() {
  Game.initialize("game",sprites,bar_sprites,tip_sprites,startGame);
});


