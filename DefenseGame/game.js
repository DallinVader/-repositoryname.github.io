const Canvas = document.getElementById("Canvas");
const ctx = Canvas.getContext("2d");

//Canvas size
Canvas.width = 512;
Canvas.height = 240;
Canvas.style.scale = "relative";

//Hot bar variables
const HotBarSize = 32;
let CurrentWave = 0;

//Grid variables
const GridTileSize = 16;
const GameTiles = [];

//Stores all the game objects that display sprites
let SpritesToDraw = [];
let Enemys = [];
let PlayerProjectile = [];

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

    for(let i = 0; i < SpritesToDraw.length; i++){
        //Grabs the cuurent object it is looping through and saves it as a var
        let CurrentSprite = SpritesToDraw[i];

        //Draw the sprites depending on if they should be fliped or not
        CurrentSprite.DrawSprite(CurrentSprite.fliped);
    }
    if(Enemys.length == 0){
        CurrentWave += 1;
        for(let w = 0; w < CurrentWave; w++){
            SpawnSpriteObject(12, "Sprites/Goblin.png", 32, -1.5, true);
        }
    }


    for (let i = 0; i < PlayerProjectile.length; i++){
        let CurrentProjectile = PlayerProjectile[i];
        
        CurrentProjectile.position.x += CurrentProjectile.speed;

        for (let e = 0; e < Enemys.length; e++) {
            if(CollisionDetect(CurrentProjectile, Enemys[e])){
                
                for(let w = 0; w < SpritesToDraw.length; w++){
                    if(SpritesToDraw[i].name == CurrentProjectile.name){
                        console.log("Yay");
                    }
                }


                Enemys.splice(e, 1);
                PlayerProjectile.splice(i, 1);

                let DeathSound = new Audio("Sounds/DeathSound.wav");
                DeathSound.play();

            }
            
        }

    }

    for (let i = 0; i < Enemys.length; i++) {
        //Grabs the cuurent object it is looping through and saves it as a var
        let CurrentEnemy = Enemys[i];

        //Moves the objects to 0 if they go past the canvas width
        if(CurrentEnemy.position.x <= Canvas.width && CurrentEnemy.position.x >= 0){
            CurrentEnemy.position.x += CurrentEnemy.speed;
        }


        //Check and move objects if they are above or below the canvas
        if(CurrentEnemy.position.y < HotBarSize){
            CurrentEnemy.position.y += GridTileSize;
        }
        if(CurrentEnemy.position.y > Canvas.height - GridTileSize){
            CurrentEnemy.position.y -= GridTileSize;
        }
        
    }

    //Repeats the function
    requestAnimationFrame(Repeat);
}

//Helps me create multiple Sprite game objects
class Sprite{
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

function CollisionDetect(a, b){
    let TrueOrFalseCollision;

    if(a.position.x > b.position.x - b.scale.x && a.position.x < b.position.x + b.scale.x && a.position.y > b.position.y - b.size.y && a.position.y < b.position.y + b.size.y
        ){
        TrueOrFalseCollision = true;
    }
    else{
        TrueOrFalseCollision = false;
    }
    return TrueOrFalseCollision;

}

//Function that spawns objects for me
function SpawnSpriteObject(ObjCount, SpritePath, StartSpawnPos, speed, IsFliped){
    for(let i = 0; i < ObjCount; i++){
        let temp = new Sprite(SpritePath, 0, {x: Canvas.width, y: StartSpawnPos + (16 * i)}, {x: 16, y: 16}, {x: 16, y: 16}, Math.random(0.2, 1) * speed, SpritePath + " " + i, IsFliped);
        SpritesToDraw.push(temp);
        Enemys.push(temp);
    }
}

function SpawnFrendleyUnit(ObjCount, SpritePath, offset, StartSpawnPos, StartSize, speed, name, IsFliped){
    for(let i = 0; i < ObjCount; i++){
        let temp = new Sprite(SpritePath, offset, StartSpawnPos, {x: StartSize.x, y: StartSize.y}, {x: StartSize.x, y: StartSize.y}, speed, name, IsFliped);
        PlayerProjectile.push(temp);
        SpritesToDraw.push(temp);
    }
}

function RemoveObjByNameFromList(List, NameToFind){
    for (let i = 0; i < List.length; i++) {
        if(List[i].name == NameToFind){
            console.log("Removed " + List[i].name)
            List.splice(i, 1);
        }
        
    }
}

//Uses the spawn function to spawn goblins for testing
SpawnSpriteObject(12, "Sprites/Goblin.png", 32, -1.5, true);

//Test varables
const Dwarf = new Sprite("Sprites/Dwarf.png", 0, {x: 375, y: 208}, {x: 16, y: 16}, {x: 16, y: 16}, 0.1, "Dwarf", false);
const Wizard = new Sprite("Sprites/Wizard.png", 0, {x: 375, y: 192}, {x: 16, y: 16}, {x: 16, y: 16}, 0.15, "Wizard", false);
let TileSelector = new Sprite("Sprites/Dragon.png", 0, {x: 0, y: HotBarSize + 200}, {x: 46, y: 16}, {x: 46, y: 16}, 0, "TileSelector", false);

SpritesToDraw.push(Wizard, Dwarf, TileSelector);

//A function that runs evrey frame
Repeat();
let ProjectileId = 0;
//Regesters key presses
document.addEventListener("keydown", function(event){

    let StartMusic = new Audio("Sounds/FireSoundEffect.wav");

    if(event.key === "w"){
        TileSelector.position.y -= GridTileSize;
    }
    if(event.key === "s"){
        TileSelector.position.y += GridTileSize;
        TileSelector.ImageSrc = "Sprites/Wizard.png"
    }
    if(event.key === " "){
        StartMusic.play();
        let TempProjectile = SpawnFrendleyUnit(1, "Sprites/FireProjectile.png", 97, {x: TileSelector.position.x, y: TileSelector.position.y}, {x: 32, y: 16}, 2, "FireProjectile" + ProjectileId, false);
        ProjectileId += 1;
    }
});

// //DragonAnimations
 const DragonAnimations = [
     { AnimationName: "DragonDeath", Duration: "0.75s", Steps: "steps(13)", Iterations: "1"},
     { AnimationName: "DragonIdleFly", Duration: "0.5s", Steps: "steps(7)", Iterations: "infinite"},
     { AnimationName: "DragonAttack", Duration: "0.75s", Steps: "steps(8)", Iterations: "infinite"},
     { AnimationName: "DragonSleep", Duration: "2s", Steps: "steps(20)", Iterations: "infinite"}
];