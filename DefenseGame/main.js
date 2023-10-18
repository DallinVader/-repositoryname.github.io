const canvas = getElementById("Canvas1st")




//Dragon Stuff
let DragonStyleSheet = document.getElementById("Dragon").style;

PlayAnimation(DragonAnimations[1]);

function PlayAnimation(obj){
    
    DragonStyleSheet.animationName = obj.AnimationName;
    DragonStyleSheet.animationTimingFunction = obj.Steps;
    DragonStyleSheet.animationDuration = obj.Duration;
    DragonStyleSheet.animationIterationCount = obj.Iterations;
}
const DragonAnimations = [
    { AnimationName: "DragonDeath", Duration: "0.75s", Steps: "steps(13)", Iterations: "1"},
    { AnimationName: "DragonIdleFly", Duration: "0.5s", Steps: "steps(7)", Iterations: "infinite"},
    { AnimationName: "DragonAttack", Duration: "0.75s", Steps: "steps(8)", Iterations: "infinite"},
    { AnimationName: "DragonSleep", Duration: "2s", Steps: "steps(20)", Iterations: "infinite"}
];