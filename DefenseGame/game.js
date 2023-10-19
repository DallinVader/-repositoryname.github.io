const Canvas = document.getElementById("Canvas");
const ctx = Canvas.getContext("2d");

const HotBarSize = 25;
const GridTileSize = 10;
const GameTiles = [];

class GridTile {
    constructor(x, y){
        this.x = x;
        this.y = y;
    }
}

class Tile {
    constructor(x, y){
        this.x = x;
        this.y = y;
        this.width = GridTileSize;
        this.height = GridTileSize;
        this.id = "Dragon";
    }
    Draw(){
        ctx.strokeStyle = "black";
        ctx.lineWidth = 1;
        ctx.strokeRect(this.x, this.y, this.width, this.height);
    }
}

function CreateGrid(){
    for(let y = 0; y < Canvas.height - HotBarSize; y += GridTileSize){
        for(let x = 0; x < Canvas.width; x += GridTileSize){
            GameTiles.push(new Tile(x, y));
        }
    }
}

function DrawGridTiles(){
    for(let i = 0; i < GameTiles.length; i++){
        GameTiles[i].Draw();
    }
}

function Repeat(){
    DrawGridTiles();
    requestAnimationFrame(Repeat);
}

CreateGrid();
Repeat();


//DragonAnimations
const DragonAnimations = [
    { AnimationName: "DragonDeath", Duration: "0.75s", Steps: "steps(13)", Iterations: "1"},
    { AnimationName: "DragonIdleFly", Duration: "0.5s", Steps: "steps(7)", Iterations: "infinite"},
    { AnimationName: "DragonAttack", Duration: "0.75s", Steps: "steps(8)", Iterations: "infinite"},
    { AnimationName: "DragonSleep", Duration: "2s", Steps: "steps(20)", Iterations: "infinite"}
];
