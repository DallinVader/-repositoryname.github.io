//DragonAnimation
const DragonAnimations = [
    { AnimationName: "DragonDeath", Duration: "0.75s", Steps: "steps(13)", Iterations: "1"},
    { AnimationName: "DragonIdleFly", Duration: "0.5s", Steps: "steps(7)", Iterations: "infinite"},
    { AnimationName: "DragonAttack", Duration: "0.75s", Steps: "steps(8)", Iterations: "infinite"},
    { AnimationName: "DragonSleep", Duration: "2s", Steps: "steps(20)", Iterations: "infinite"}
  ];

function SetDragonAnim(){
    let SelectedState = document.getElementById("ChangeDragonAnim").value;
    if(SelectedState <= DragonAnimations.length && SelectedState >= 0){
        PlayAnimation(DragonAnimations[SelectedState]);
    }
}

function PlayAnimation(obj){
    let DragonStyleSheet = document.getElementById("Dragon").style;

    DragonStyleSheet.animationName = obj.AnimationName;
    DragonStyleSheet.animationTimingFunction = obj.Steps;
    DragonStyleSheet.animationDuration = obj.Duration;
    DragonStyleSheet.animationIterationCount = obj.Iterations;
}

