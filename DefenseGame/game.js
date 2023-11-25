const Canvas = document.getElementById("Canvas");
const ctx = Canvas.getContext("2d");

//Canvas size
Canvas.width = 512;
Canvas.height = 240;
Canvas.style.scale = "relative";

//Hot bar variables
const HotBarSize = 32;
let CurrentWave = 0;
let CurrentWaveForBoses = 0;
let CurrentGold = 120;
let ElapsedTime = 0;
let CurrentMalice = 50;

//Grid variables
const GridTileSize = 16;
const GameTiles = [];

//Stores all the game objects that display sprites
let SpritesToDraw = [];
let Enemys = [];
let PlayerProjectiles = [];
let BoulderProjectiles = [];

//Other varables
let ProjectileId = 0;

//Checks if the game is over
function GameOver(){
    Enemys = [];
    PlayerProjectiles = [];
    TileSelector.ImgCrop = {x: 920, y: 0};
}

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
let Cooldown = 0;

let AnimCoolTime = 0.1;

let WizAnimCoolDown = 0.1;
function Repeat() {
    DrawGridTiles();

    Cooldown += 1;

    ElapsedTime += 0.015;

    for(let i = 0; i < SpritesToDraw.length; i++){
        let PossibleWiz = SpritesToDraw[i];

        if(PossibleWiz.health == 2){
            if(ElapsedTime > PossibleWiz.WizAnimCoolDown){
                PossibleWiz.ImgCrop += 16
                PossibleWiz.WizAnimCoolDown = ElapsedTime + 0.1;
            }
            if(PossibleWiz.ImgCrop > 16 * 18){
                PossibleWiz.ImgCrop = 16 * 15;
            }
        }
    }

    if(ElapsedTime > AnimCoolTime){
        AnimCoolTime = ElapsedTime + 0.1;
        if(TileSelector.ImgCrop >= 46 * 5){
            TileSelector.ImgCrop = 0;
        }
        else{
            TileSelector.ImgCrop += 46;
        }
        
    }

    //Draws the menu at the top of the canvas in black
    ctx.drawStyle = "black";
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, Canvas.width, HotBarSize);
    ctx.fillRect(0, Canvas.height - GridTileSize, Canvas.width, GridTileSize);
    ctx.fillStyle = "red";
    ctx.fillRect(0, Canvas.height - GridTileSize + 2, Canvas.width * CurrentMalice * 0.01, GridTileSize - 4);
    ctx.fillStyle = "white";
    ctx.font = "15px Arial";
    ctx.fillText("Wave " + CurrentWave, 0, 25);
    ctx.fillText("Gold " + CurrentGold, 60, 25);
    ctx.fillText("Malice Collected: " + CurrentMalice, 0, 238);
    ctx.fillText("Time: " + Math.round(ElapsedTime), 455, 25);
    ctx.fillText("E", 150, 30);
    ctx.fillText("R", 175, 30);

    for(let i = 0; i < SpritesToDraw.length; i++){
        //Grabs the cuurent object it is looping through and saves it as a var
        let CurrentSprite = SpritesToDraw[i];

        let ObjectsToRemove = [];
        for (let i = 0; i < SpritesToDraw.length; i++) {
            let CurrentSprite = SpritesToDraw[i];
            if (CurrentSprite.Destroy) {
                ObjectsToRemove.push(i);
            }
        }
    
        // Remove marked objects after the loop
        for (let i = ObjectsToRemove.length - 1; i >= 0; i--) {
            SpritesToDraw.splice(ObjectsToRemove[i], 1);
        }
        //Draw the sprites depending on if they should be fliped or not
        CurrentSprite.DrawSprite(CurrentSprite.fliped);
    }

    if(CurrentGold < 0){
        GameOver();
        ctx.font = "48px serif";
        ctx.textAlign = "center";
        ctx.fillText("GameOver", Canvas.width / 2, Canvas.height / 2 + HotBarSize);
        requestAnimationFrame(Repeat);
        return;
    }
    
    if(Enemys.length == 0){
        CurrentWave += 1;
        CurrentWaveForBoses += 1;
        for(let w = 0; w < CurrentWave; w++){
            if(CurrentWaveForBoses == 5){
                SpawnSpriteObject(8, "Sprites/Dwarf.png", {x: Canvas.width, y: HotBarSize + 32}, -0.2, true, true, 3, 0);
            }
            if(CurrentWaveForBoses == 10){
                w++;
                SpawnSpriteObject(8, "Sprites/Dwarf.png", {x: Canvas.width, y: HotBarSize + 32}, -0.2, true, true, 3, 0);
                SpawnSpriteObject(6, "Sprites/Wizard.png", {x: Canvas.width, y: HotBarSize + 48}, -0.25, true, true, 2, 16 * 15);
            }
            if(CurrentWaveForBoses != 5 && CurrentWaveForBoses != 10){
                SpawnSpriteObject(12, "Sprites/Goblin.png", {x: Canvas.width, y: HotBarSize}, -0.5, true, true, 1, 0);
            }
        }
        if(CurrentWaveForBoses >= 10){
            CurrentWaveForBoses = 0;
        }
    }

    for (let b = 0; b < BoulderProjectiles.length; b++){
        let CurrentBoulder = BoulderProjectiles[b];

        if(CurrentBoulder.position.x < Canvas.width){
            CurrentBoulder.position.x += CurrentBoulder.speed;
        }
        else{
            BoulderProjectiles.splice(b, 1);
            CurrentBoulder.Destroy = true;
        }
        for (let e = 0; e < Enemys.length; e++) {
            if(CollisionDetect(CurrentBoulder, Enemys[e])){
                CurrentBoulder.health -= 1;
                Enemys[e].health -= 1;
                if(Enemys[e].health <= 0){
                    Enemys[e].Destroy = true;
                    Enemys.splice(e, 1);
                }
                if(CurrentBoulder.health <= 0){
                    CurrentBoulder.Destroy = true;
                }
            }
        }

        CurrentBoulder.DrawSprite(CurrentBoulder.fliped);

    }

    for (let i = 0; i < PlayerProjectiles.length; i++){
        let CurrentProjectile = PlayerProjectiles[i];
        
        CurrentProjectile.position.x += CurrentProjectile.speed;

        for (let e = 0; e < Enemys.length; e++) {
            if(CollisionDetect(CurrentProjectile, Enemys[e])){
                
                CurrentProjectile.Destroy = true;
                Enemys[e].health -= 1;
                if(Enemys[e].health <= 0){
                    if(CurrentMalice < 100){
                        CurrentMalice += 1;
                    }
                    Enemys[e].Destroy = true;
                    Enemys.splice(e, 1);
                }
                PlayerProjectiles.splice(i, 1);

                let DeathSound = new Audio("Sounds/DeathSound.wav");
                DeathSound.play();

            }
            
        }
        
        CurrentProjectile.DrawSprite(CurrentProjectile.fliped);

    }
    
    for (let i = 0; i < Enemys.length; i++) {
        //Grabs the cuurent object it is looping through and saves it as a var
        let CurrentEnemy = Enemys[i];

        //Moves the objects to 0 if they go past the canvas width
        if(CurrentEnemy.position.x <= Canvas.width && CurrentEnemy.position.x >= 0 && CurrentEnemy.gold == 0){
            CurrentEnemy.position.x += CurrentEnemy.speed;
        }
        else{
            CurrentEnemy.gold = 10;
            CurrentEnemy.fliped = false;
        }

        if(CurrentEnemy.gold > 0){
            CurrentEnemy.position.x += CurrentEnemy.speed * -0.5;
            if(CurrentEnemy.name != "Sprites/Wizard.png"){
                CurrentEnemy.ImgCrop = 16;
            }
        }
        if(CurrentEnemy.gold > 0 && CurrentEnemy.position.x > Canvas.width){
            CurrentGold -= CurrentEnemy.gold;
            RemoveObjByNameFromList(SpritesToDraw, CurrentEnemy.name);
            RemoveObjByNameFromList(Enemys, CurrentEnemy.name);
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
    constructor(ImageSrc, ImgCrop, position, size, scale, speed, name, IsFliped, Health){
        this.position = position;
        this.size = size;
        this.scale = scale;
        this.speed = speed;
        this.name = name;
        this.fliped = IsFliped;
        this.ImgCrop = ImgCrop;
        this.Destroy = false;
        this.health = Health;
        this.IsHitByBoulder = false;

        this.WizAnimCoolDown = 0.1;
        
        this.gold = 0;

        this.img = new Image();
        this.img.src = ImageSrc;
    }
    
    
    //Draws the sprite and flips it if neciscary
    DrawSprite(flip){
        ctx.save()
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
function SpawnSpriteObject(ObjCount, SpritePath, StartSpawnPos, speed, IsFliped, IsEvil, Health, SpriteOff = 0){
    for(let i = 0; i < ObjCount; i++){
        //creates a new sprite and adds it to the proper lists also adds a unique name to each new sprite obj.
        let temp = new Sprite(SpritePath, SpriteOff, {x: StartSpawnPos.x, y: StartSpawnPos.y + (GridTileSize * i)}, {x: 16, y: 16}, {x: 16, y: 16}, Math.random(0, 1) * (0 - 1) + 1 * speed, SpritePath + " " + i + " " + Math.floor(Math.random() * (-100000 - 100000) + 100000), IsFliped, Health);
        SpritesToDraw.push(temp);
        if(IsEvil){
            Enemys.push(temp);
        }
    }
}

function SpawnFrendleyUnit(ObjCount, SpritePath, offset, StartSpawnPos, StartSize, speed, name, IsFliped, IsProjectile, IsBoulder){
    for(let i = 0; i < ObjCount; i++){
        let temp = new Sprite(SpritePath, offset, StartSpawnPos, {x: StartSize.x, y: StartSize.y}, {x: StartSize.x, y: StartSize.y}, speed, name, IsFliped);
        if(IsProjectile){
            PlayerProjectiles.push(temp);
        }
        if(IsBoulder){
            BoulderProjectiles.push(temp);
        }
    }
}

function RemoveObjByNameFromList(List, NameToFind){
    let DidItWork = false;
    for(let w = 0; w < List.length; w++){
        if(List[w].name == NameToFind){
            List.splice(w, 1);
            DidItWork = true;
        }
    }
}

//Uses the spawn function to spawn goblins for testing
SpawnSpriteObject(12, "Sprites/Gold.png", {x: 0, y: HotBarSize}, 0, Math.round(Math.random()), false, 1);

//Test varables
const FireIcon1 = new Sprite("Sprites/FireProjectile.png", 97, {x: 150, y: 2.5}, {x: 32, y: 16}, {x: 16, y: 8}, 0.1, "FireIcon", false, 1);
const FireIcon2 = new Sprite("Sprites/FireProjectile.png", 97, {x: 150, y: 10}, {x: 32, y: 16}, {x: 16, y: 8}, 0.1, "FireIcon", false, 1);
const BoulderIcon = new Sprite("Sprites/Boulder.png", 16, {x: 172.5, y: 2.5}, {x: 16, y: 16}, {x: 16, y: 16}, 0.1, "BoulderIcon", false, 1);
//Dragon varable
const TileSelector = new Sprite("Sprites/Dragon.png", 0, {x: 0, y: HotBarSize}, {x: 46, y: 16}, {x: 46, y: 16}, 0, "TileSelector", false, 1);

SpritesToDraw.push(FireIcon1, FireIcon2, TileSelector, BoulderIcon);

//A function that runs evrey frame
Repeat();

//Regesters key presses
document.addEventListener("keydown", function(event){

    let StartMusic = new Audio("Sounds/FireSoundEffect.wav");

    if(event.key === "w" || event.key === "W"){
        TileSelector.position.y -= GridTileSize;
        if(TileSelector.position.y < HotBarSize){
            TileSelector.position.y += GridTileSize;
        }
    }
    if(event.key === "s" || event.key === "S"){
        TileSelector.position.y += GridTileSize;
        if(TileSelector.position.y > Canvas.height - HotBarSize){
            TileSelector.position.y -= GridTileSize; 
        }
    }

    if(event.repeat){
        return;
    }

    if(event.key === " "){
        StartMusic.play();
        if(Cooldown > 20 - (CurrentWave * 2)){
            let TempProjectile = SpawnFrendleyUnit(1, "Sprites/FireProjectile.png", 97, {x: TileSelector.position.x, y: TileSelector.position.y}, {x: 32, y: 16}, 2, "FireProjectile " + ProjectileId + Math.floor(Math.random() * (-100 - 100) + 100), false, true);
            Cooldown = 0;
        }
        ProjectileId += 1;
    }
    if(CurrentMalice >= 6){
        if(event.key === "e" || event.key === "E"){
            CurrentMalice -= 6;
            StartMusic.play();
            if(Cooldown > 20 - (CurrentWave * 2)){
                let TempProjectile = SpawnFrendleyUnit(1, "Sprites/FireProjectile.png", 97, {x: TileSelector.position.x, y: TileSelector.position.y}, {x: 32, y: 16}, 2, "FireProjectile " + ProjectileId + Math.floor(Math.random() * (-100 - 100) + 100), false, true);
                let TempProjectile2 = SpawnFrendleyUnit(1, "Sprites/FireProjectile.png", 97, {x: TileSelector.position.x, y: TileSelector.position.y + GridTileSize}, {x: 32, y: 16}, 2, "FireProjectile " + ProjectileId + Math.floor(Math.random() * (-100 - 100) + 100), false, true);
                let TempProjectile3 = SpawnFrendleyUnit(1, "Sprites/FireProjectile.png", 97, {x: TileSelector.position.x, y: TileSelector.position.y - GridTileSize}, {x: 32, y: 16}, 2, "FireProjectile " + ProjectileId + Math.floor(Math.random() * (-100 - 100) + 100), false, true);
                Cooldown = 0;
            }
            ProjectileId += 1;
        }
    }

    if(CurrentMalice >= 25){
        if(event.key === "r" || event.key === "R"){
            CurrentMalice -= 25;
            StartMusic.play();
            if(Cooldown > 20 - (CurrentWave * 2)){
                let TempBoulder = SpawnFrendleyUnit(1, "Sprites/Boulder.png", 97, {x: TileSelector.position.x, y: TileSelector.position.y}, {x: 16, y: 16}, 2, "Boulder " + ProjectileId + Math.floor(Math.random() * (-100 - 100) + 100), false, false, true);
                Cooldown = 0;
            }
            ProjectileId += 1;
        }
    }
});



// //DragonAnimations
 const DragonAnimations = [
     { AnimationName: "DragonDeath", Duration: "0.75s", Steps: "steps(13)", Iterations: "1"},
     { AnimationName: "DragonIdleFly", Duration: "0.5s", Steps: "steps(7)", Iterations: "infinite"},
     { AnimationName: "DragonAttack", Duration: "0.75s", Steps: "steps(8)", Iterations: "infinite"},
     { AnimationName: "DragonSleep", Duration: "2s", Steps: "steps(20)", Iterations: "infinite"}
];