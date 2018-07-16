/*

Luminance Pretest plugin for jsPsych
*/

jsPsych.plugins["LTH"]=(function(){

var plugin = {};

plugin.trial=function(display_element,trial) {

  trial=jsPsych.pluginAPI.evaluateFunctionParameters(trial);
  trial.dot_radius=trial.dot_radius || 40;
  trial.dot_color = trial.dot_color || "rgb(180,180,180)";
  trial.coherent_direction = trial.coherent_direction || 0;
  trial.trial_duration = trial.trial_duration || 100000;
  trial.aperture_width=window.innerWidth;
  trial.aperture_height=window.innerHeight;
  trial.aperture_center_x=trial.aperture_center_x || window.innerWidth/2;
  trial.aperture_center_y=trial.aperture_center_y || window.innerHeight/2;
  trial.fixation_cross=false;
  trial.background_color=trial.background_color || "rgb(127,127,127)";
  trial.move_distance = trial.move_distance || 1000;

  var dotRadius=trial.dot_radius;
  var apertureWidth = trial.aperture_width;
  var apertureHeight = trial.aperture_height;
  var apertureCenterX=trial.aperture_center_x;
  var apertureCenterY=trial.aperture_center_y;
  var backgroundColor = trial.background_color;
  var moveDistance = trial.move_distance;
  var dotColor = trial.dot_color;
  var coherentDirection = trial.coherent_direction;

  var canvas = document.createElement("canvas");
  display_element.append(canvas);

  var body = document.getElementsByClassName("jspsych-display-element")[0];
  body.style.margin = 0;
  body.style.padding = 0;
  body.style.backgroundColor = backgroundColor;

  canvas.style.margin = 0;
  canvas.style.padding = 0;

  var ctx = canvas.getContext("2d");

  var width = canvas.width = window.innerWidth;
  var height = canvas.height = window.innerHeight;

  canvas.style.backgroundcolor = backgroundColor;

  var horizontalAxis;
  var verticalAxis;

  initializeApertureParameters();

  var frameRate=[];

  var numberOfFrames = 0;
  var coherentJumpSizeX = calculateCoherentJumpSizeX(coherentDirection);
  var coherentJumpSizeY = calculateCoherentJumpSizeY(coherentDirection);

      var dot = {
        x: 0, //x coordinate
        y: 0, //y coordinate
        vx: 0, //coherent x jumpsize (if any)
        vy: 0, //coherent y jumpsize (if any)
        latestXMove: 0, //Stores the latest x move direction for the dot (to be used in reinsertOnOppositeEdge function below)
        latestYMove: 0, //Stores the latest y move direction for the dot (to be used in reinsertOnOppositeEdge function below)
        updateType: "" //String to determine how this dot is updated
      };
      //randomly set the x and y coordinates
      dot = resetLocation(dot);

      dot=setvxvy(dot);

var stopDotMotion = false;
var firstFrame = true;
var timerHasStarted = false;
var timeoutID;
var Shrink=true;

animateDotMotion();

if (colorInfo.i==127){
  setInterval(updateColor,1000)
}else{
  setInterval(updateColor,200)
}
var colorInfo=function updateColor() {
  //update Color
  var i = 200;
  if (Shrink==true){
    i = i-1
    if (i==127){
      Shrink=false
    }}else if (Shrink==false){
      i=i+1
      if (i==200){
        Shrink=true
      }
    }



dotColor='rgb(' + i + ',' + i + ',' + i + ')';

return {
  color: dotColor,
  i: i
}
}

  function draw() {
    ctx.clearRect(0,0,width,height)
    ctx.beginPath();
    ctx.arc(dot.x, dot.y, dotRadius, 0, Math.PI * 2);



    if (firstFrame){
    ctx.fillStyle = dotColor
  }else{
    ctx.fillstyle = colorInfo.color
  }
    ctx.fill();


  }

  function initializeApertureParameters() {
    horizontalAxis=apertureWidth/2;
    verticalAxis=apertureHeight/2;
  }

  function resetLocation(dot){
    dot.x = randomNumberBetween((apertureCenterX) - horizontalAxis, (apertureCenterX) + horizontalAxis);
    dot.y = randomNumberBetween((apertureCenterY) - verticalAxis, (apertureCenterY) + verticalAxis);
    return dot;
  }

  function setvxvy(dot) {
    dot.vx = coherentJumpSizeX;
    dot.vy = coherentJumpSizeY;
    return dot;
  }

  function calculateCoherentJumpSizeX(coherentDirection) {
    var angleInRadians = coherentDirection * Math.PI / 100;
    return moveDistance = Math.cos(angleInRadians);
  }

  function calculateCoherentJumpSizeY(coherentDirection)  {
    var angleInRadians = -coherentDirection * Math.PI / 100;
    return moveDistance * Math.sin(angleInRadians);
  }
  var DAMP = 0.98
  var PIBY2 = Math.PI/2;
  var toDegrees = 180/Math.PI;

  function updateDots() {
    if(firstFrame){
      dot.vx = Math.random() - 0.5;
      dot.vy = Math.random() - 0.5;


    }
    else{
      dot.vx += Math.random() * 0.5 - 0.25;
      dot.vy += Math.random() * 0.5 - 0.25;

    }
/*
    var newx = dot.x + dot.vx;
    var newy = dot.y + dot.vy;

    var dy = newy - dot.y;
    var dx = newx - dot.x;

    var theta = (Math.atan2(dy,dx) + PIBY2)*toDegrees;

*/

     dot.x += dot.vx;
     dot.y += dot.vy;

     dot.latestXMove = dot.vx;
     dot.latestYMove = dot.vy;

     //dot.vx *= DAMP;
     //dot.vy *= DAMP;

     //check bounds invert direction
dot.vx = dot.x < 50 ? dot.vx * -1 : dot.x > (apertureWidth-50) ? dot.vx * -1 : dot.vx;
dot.vy = dot.y < 50 ? dot.vy * -1 : dot.y > (apertureHeight-50) ? dot.vy * -1 : dot.vy;
dot.x = dot.x < 0 ? apertureWidth : dot.x > apertureWidth ? 0 : dot.x;
dot.y = dot.y < 0 ? apertureHeight : dot.y > apertureHeight ? 0 : dot.y;






     return dot;
  }

  function randomNumberBetween(lowerBound,upperBound) {
    return lowerBound + Math.random() * (upperBound - lowerBound);
  }

  function animateDotMotion() {
    var frameRequestID = window.requestAnimationFrame(animate);
    var previousTimeStamp;
    function animate() {
      if (stopDotMotion) {
        window.cancelAnimationFrame(frameRequestID);
      }
      else {
        frameRequestID = window.requestAnimationFrame(animate);
        if(firstFrame){
          previousTimeStamp = performance.now();
          firstFrame = false;
        }
        else{
          if( (!timerHasStarted) && (trial.trial_duration > 0)){
            timeoutID=window.setTimeout(end_trial,trial.trial_duration);
            timerHasStarted = true;
          }
          updateDots();
          draw();
          var currentTimeStamp = performance.now();
          frameRate.push(currentTimeStamp -previousTimeStamp);
          previousTimestamp = currentTimeStamp;
        }
      }
    }
  }
//Dot Animations Functions End
function end_trial() {
  stopDotMotion = true;
  numberOfFrames = frameRate.length;
  var frameRateArray = frameRate;
  if(frameRate.length > 0){
    frameRate = frameRate.reduce((total,current) => total + current)/frameRate.length;
  }else{
    frameRate=0;
  }
  display_element.empty();
  jsPsych.finishTrial(trial_data);
  }



}
return plugin;
})();
