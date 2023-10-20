const Canvas = document.getElementById("Canvas");
const ctx = Canvas.getContext("2d");

//Canvas size
Canvas.width = 768;
Canvas.height = 432;


//Grid variables
const HotBarSize = 32;
const GridTileSize = 16;
const GameTiles = [];


//Stores all the game objects that display sprites
let EnemysToDraw = [];
let FrendlyTroopsToDraw = [];

//Tile template so I can create more tiles easy
class Tile {
    constructor(x, y, scale) {
        this.x = x;
        this.y = y;
        this.scale = scale;
        this.width = GridTileSize;
        this.height = GridTileSize;
        this.img = new Image();
        this.img.src = "Sprites/Ground1.png";
    }

    Draw() {
        ctx.drawImage(this.img, 0, 0, 16, 16, this.x, this.y, this.width * this.scale, this.height * this.scale);
    }
}

//Creates a grid to draw grid tiles
function CreateGrid() {
    for (let y = HotBarSize; y < Canvas.height; y += GridTileSize) {
        for (let x = 0; x < Canvas.width; x += GridTileSize) {
            GameTiles.push(new Tile(x, y, 1));
        }
    }
    console.log(Canvas.height / GridTileSize + " Y axis Tiles and " + Canvas.width / GridTileSize + " Tiles on the x axis");
}
//Invokes creating grid at start
CreateGrid();

//Draws the grid tiles
function DrawGridTiles() {
    for (let i = 0; i < GameTiles.length; i++) {
        GameTiles[i].Draw();
    }
}

function Repeat() {
    DrawGridTiles();

    //Draws the menu at the top of the canvas in black
    ctx.drawStyle = "black";
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, Canvas.width, HotBarSize);

    for(let i = 0; i < EnemysToDraw.length; i++){
        //Grabs the cuurent object it is looping through and saves it as a var
        let CurrentSprite = EnemysToDraw[i];

        //Draw the sprites depending on if they should be fliped or not
        CurrentSprite.DrawSprite(CurrentSprite.fliped);
        
        //Moves the objects to 0 if they go past the canvas width
        if(CurrentSprite.position.x <= Canvas.width){
            CurrentSprite.position.x += CurrentSprite.speed;
        }
        else{
            console.log("MadeIt");
            CurrentSprite.position.x = 0;
        }

        //Check and move objects if they are above or below the canvas
        if(CurrentSprite.position.y < HotBarSize){
            console.log("Moveing Sprite " + CurrentSprite.name)
            CurrentSprite.position.y += GridTileSize;
        }
        if(CurrentSprite.position.y > Canvas.height - GridTileSize){
            console.log("Moveing Sprite " + CurrentSprite.name)
            CurrentSprite.position.y -= GridTileSize;
        }
    }
    //Repeats the function
    requestAnimationFrame(Repeat);
}

//Helps me create multiple Sprite game objects
class Enemy{
    constructor(ImageSrc, ImgCrop, position, size, scale, speed, name, IsFliped){
        this.position = position;
        this.size = size;
        this.scale = scale;
        this.speed = speed;
        this.name = name;
        this.fliped = IsFliped;
        this.ImgCrop = ImgCrop;

        this.img = new Image();
        this.img.src = ImageSrc;
    }
    
    //Draws the sprite and flips it if neciscary
    DrawSprite(flip){
        ctx.save();

        if(flip){
            ctx.scale(-1, 1);
            ctx.drawImage(this.img, this.ImgCrop, 0, this.size.x, this.size.y, -this.position.x - 16, this.position.y, this.scale.x, this.scale.y);    
        }
        else{
            ctx.scale(1, 1);
            ctx.drawImage(this.img, this.ImgCrop, 0, this.size.x, this.size.y, this.position.x, this.position.y, this.scale.x, this.scale.y);    
        }

        ctx.restore();
    }
}

class FrendlyTroop{
    constructor(ImageSrc, ImgCrop, position, size, scale, speed, name, IsFliped){
        this.position = position;
        this.size = size;
        this.scale = scale;
        this.speed = speed;
        this.name = name;
        this.fliped = IsFliped;
        this.ImgCrop = ImgCrop;

        this.img = new Image();
        this.img.src = ImageSrc;
    }
}

//Function that spawns objects for me
function SpawnSpriteObject(ObjCount, SpritePath, StartSpawnPos, speed, IsFliped){
    for(let i = 0; i < ObjCount; i++){
        let temp = new Enemy(SpritePath, 0, {x: Canvas.width, y: StartSpawnPos + (16 * i)}, {x: 16, y: 16}, {x: 16, y: 16}, Math.random() * (0.25 * speed, 0.9 * speed) + 0.1 * speed, SpritePath + " " + i, IsFliped);
        EnemysToDraw.push(temp);
    }
}

//Uses the spawn function to spawn goblins for testing
SpawnSpriteObject(25, "Sprites/Goblin.png", 32, -1, true);

//Test varables
const Dwarf = new Enemy("Sprites/Dwarf.png", 0, {x: 375, y: 208}, {x: 16, y: 16}, {x: 16, y: 16}, 0.1, "Dwarf", false);
const Wizard = new Enemy("Sprites/Wizard.png", 0, {x: 375, y: 192}, {x: 16, y: 16}, {x: 16, y: 16}, 0.15, "Wizard", false);
let TileSelector = new Enemy("Sprites/Ground.png", 224, {x: 0, y: HotBarSize + 200}, {x: 16, y: 16}, {x: 16, y: 16}, 0, "TileSelector", false);

EnemysToDraw.push(Wizard, Dwarf, TileSelector);

//A function that runs evrey frame
Repeat();

//Regesters key presses
document.addEventListener("keydown", function(event){
    if(event.key === "w"){
        TileSelector.position.y -= GridTileSize;
    }
    if(event.key === "s"){
        TileSelector.position.y += GridTileSize;
        TileSelector.ImageSrc = "Sprites/Wizard.png"
    }
});


// //DragonAnimations
 const DragonAnimations = [
     { AnimationName: "DragonDeath", Duration: "0.75s", Steps: "steps(13)", Iterations: "1"},
     { AnimationName: "DragonIdleFly", Duration: "0.5s", Steps: "steps(7)", Iterations: "infinite"},
     { AnimationName: "DragonAttack", Duration: "0.75s", Steps: "steps(8)", Iterations: "infinite"},
     { AnimationName: "DragonSleep", Duration: "2s", Steps: "steps(20)", Iterations: "infinite"}
];