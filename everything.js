if (localStorage.getItem('sessionnumber') == null){ //session number is used later, and will fail if not defined yet
  localStorage.setItem('sessionnumber',0)
}
var ctx = document.getElementById("draw").getContext("2d"); //canvas, under the id 'draw' in all sites
function rightfont(txt,size){//fit text into size
    ctx.font = "30px Arial"
    var fsize = 30*size/(ctx.measureText(txt).width) //size of text proportional to font size, so measured against size of text at font 30
    return fsize
}
function whattime(){//this finds the current time for timer functions
    const d = new Date() //date right now
    let current = d.toString()//turns it to string and below turns it to hours, minutes, seconds
    let hour = current.slice(-52,-50) //slices Date(), which would be like Sun Sep 18 2022 16:02:26 GMT+0800 (Australian Western Standard Time)
    let minute = current.slice(-49,-47)
    let second = current.slice(-46,-44)
    let Time = parseInt(hour)*3600+parseInt(minute)*60+parseInt(second)//this is a "time-score" of sorts (hour*3600+min*60+sec*60) to measure time elapsed
    return Time
  }
function dothing(text, ind, id, font){ //This is just for flush text, it takes the text, the current index and font
  if (ind > text.length){return}//stop recursion
  if (id =='videobox'){ //depending on the size of the display box in each website, font size is tailored to that
    var font = rightfont(text,600)
  }
  if (id == 'videobox1'){
    var font = rightfont(text,400)
  }
  if (id == 'videobox2'){
    var font = rightfont(text,266)
  }
  if (id == 'videobox3'){
    var font = rightfont(text,266)
  }
    var writing = document.getElementById(id)//otherwise, it gets information from videobox id (the main screen)
    writing.style.color = 'white'
    writing.innerHTML = text.slice(0,ind) //writes the first ind letters of the text
    writing.setAttribute('style','font-size:'+font+'px') //changes font-size in CSS styling
    setTimeout(function(){dothing(text, ind+1, id, font)},50)//recursion! it writes out the next letter...otherwise it won't refresh page
}
var mentalLines = ['Your name is Henry Bird',"Today you're off to France.","So of course, you'll be eating snails.","But how much will they cost?"
,"Every mathematical operation is deeply tied to your appetite for snails","Bon appetite"];//current lines of dialogue for mental math website
var montelines = ['Monte Carlo was some math guy.',
"His most famous contribution is in the idea that...",
"a set of randomly chosen points could be used to compute π",
"Let's see how good of a π value you'll get",
"Enter a big number below",''];//current lines of dialogue for Monte Carlo website
var homelines = ['Faster than a calculator?',"Let's see what you got.","Click the equal button to get started!"];
function timeWait(lines){ //time taken to write using above function
    var timeToWait = 4000; //4 second added delay
    for (let i = 0; i<lines.length; i++){
        timeToWait = timeToWait + 50*lines[i].length+1000 //time taken for functions inside saydialogue()
    }
    return timeToWait //returns delay
}
var calledStop = 0;
function saydialogue(line,lines, id, rep){ //function for saying dialogue
if (rep == 'yes'){ //specifies if rep
  if (line == 0){
    setTimeout(function(){saydialogue(0,lines,id,rep)},timeWait(lines)) //Repeats from the beginning after calculated delay
}}
  if (line > lines.length){ //when all lines written, it will stop
    if (rep == 'yes'){ //unless repeat is specified
        setTimeout(function(){saydialogue(0, lines, id, rep)}, 2000)
    }
    else{return}
  };//doesn't run if the number of line is not in the lines of dialogue
  dothing(lines[line],0,id)//calls the flush text for that line
  if (document.getElementById('skip') != null){
    if (document.getElementById('skip').innerHTML == 'stop'){ //when stop button pressed, button's inner HTML changes to 'stop' as trigger
      if (calledStop < 1){ //has it been asked to stop yet?
      setTimeout(function(){saydialogue(lines.length-1,lines,id, rep)},50*lines[line].length+1000) //writes last line
    var calledStop = calledStop + 1}
    }
    else{
      setTimeout(function(){saydialogue(line+1,lines,id, rep)},50*lines[line].length+1000) //recursion
    }}
  else {
    setTimeout(function(){saydialogue(line+1,lines,id, rep)},50*lines[line].length+1000)//recursion makes the next line run, so on...otherwise won't refresh page
  }}
  //time delay is (amount of writing time)+1 second because delay is from last function (i.e. a real delay of 1 second)
let string = ''//string that appends the current time
var stop = 'no'//has the game ended boolean basically
var limit = 5000;//limit to number of seconds game can be played...arbitrary number.
function quit(){//quit function to stop game, triggered by button
  document.getElementById('replay').setAttribute('style','display: block')
  questions = finished //stops 'makenew' function by stopping loop
  for (let i = 1; i < 5; i++){
    document.getElementById('option'+i.toString()).innerHTML = ''
  }
  document.getElementById('stopper').innerHTML = 'Game Ends!' //changes button text, also used later
  let limit = whattime()-string.slice(0,5)//the value is the current time minus the start time-timescore
}
var started = false; //has the game started
function writetime(ind,limit){
    started = true;
    string += whattime()//the string keeps appending the current time-score.
    let start_loaded = string.slice(0,5) //start time is the first time-score appended
    if (document.getElementById('stopper').innerHTML == 'Game Ends!'){//quit function -> text change -> text change is read
      limit = ind-1; //stops recursion by setting limit less than index
    }
    if (ind > limit){return} //stops recursion when limit exceeded
    if (ind <= limit){
    var text = document.getElementById("scary"); //please excuse my naming of variables, it is an art form
    let ans = whattime()-start_loaded //this is the time-elapsed in time-score seconds
    let hours = Math.floor(ans/3600) //floor(hour/60) gives the number of hours, same for minutes & seconds
    let minutes = Math.floor((ans-hours*3600)/60)
    let seconds = ans-hours*3600-minutes*60
    text.innerHTML = ''+hours.toString()+' hrs, '+minutes.toString()+' mins and '+seconds.toString()+' secs.' //text for writing
    setTimeout(function(){writetime(ind+1,limit)},1000)}}//function re-called with increased index
//Actual stuff
let diff = parseInt(localStorage.getItem('diff'))//difficulty level; the length of numbers that are multiplied
let questions = 5000//no. of questions
let finished = -1//no. of questions finished
let correct = 0//no. of correct answers
let livesLost = 0//number of lives lost
function makenew() {//the making new function
var mode = localStorage.getItem('mode')//mode = multiply. Division, subtraction, addition, percentage and squares may be added later
var checkMixed = '';
checkMixed = checkMixed + mode
  let rightone = Math.floor(Math.random()*4)+1//the correct spot among the four buttons, chosen randomly of course
  if (finished < questions) { //checks how many questions solved so far
    if (livesLost <= 2){ //are you still alive?
    var twonumbers = [];
    while (twonumbers.length != 2){
      let fir = Math.round(Math.pow(10,diff)*Math.random()); //first number try
      let sec =  Math.round(Math.pow(10,diff)*Math.random());//second number try
      if (fir >  Math.pow(10,diff-1)){ //checks that the numbers are reasonably large for the difficulty level
        if (sec > Math.pow(10, diff-1)){
          if (fir.toString().slice(-1) != 0){
            if (sec.toString().slice(-1) != 0){
              twonumbers.push(fir,sec)
            }
          }
        }
      }
    var first = twonumbers[0]; //final two numbers chosen
    var second = twonumbers[1];
    }
    var options = ['mult','sub','add','div']
    if (checkMixed == 'mix'){
      var mode = options[Math.floor(Math.random()*4)] //when in mixed mode, the mode changes at random
    }
    if (mode == 'mult') { //Based on operation, it writes     //depending on mode, it's rather self-explanatory on the answer
      document.getElementById("videobox").innerHTML = 'Compute '+first.toString()+'*'+second.toString()//gets videobox id and writes numbers
      var answer = first * second
      console.log(answer)}
    if (mode == 'sub'){
      document.getElementById("videobox").innerHTML = 'Compute '+Math.max(first,second).toString()+'-'+Math.min(first,second).toString()
      var answer = Math.max(first,second)-Math.min(first,second)}
    if (mode == 'add'){
      document.getElementById("videobox").innerHTML = 'Compute '+first.toString()+'+'+second.toString()
      var answer = first + second
    }
    if (mode == 'div'){
      document.getElementById("videobox").innerHTML = 'Compute '+(first*second).toString()+'÷'+second.toString()
      var answer = first
    }
    var display = document.getElementById('videobox');
    display.setAttribute('style','font-size:'+rightfont(display.innerHTML, 600).toString()+'px')
      let wronged_written = 0//how many wrong answers have been written down on buttons
      for (let i = 1; i < 5; i++){
        let current_element = document.getElementById("option"+i.toString());
        if (i != rightone) {//the button will contain a wrong answer...below, we generate this wrong answer
          var lis_answers = []//list of false answers
          let loops = 0//how many loops the below function has run
          let nudge = diff//nudges the wrong answer by some amount
          while (lis_answers.length < 3) {//loops until 3 incorrect answers have been added
          if (mode != 'mult'){
           var falseAnswer = Math.abs(answer+10*Math.floor(Math.floor((Math.random()-0.5)*(10**(Math.max(1,nudge-2))))/10))}
          if (mode == 'mult'){
            var falseAnswer = Math.abs(answer+10*Math.floor(Math.floor((Math.random()-0.5)*(2**(nudge)))/10))}
           //the nudge is on the order of 10**(nudge) and made so that the last digit is the same as the correct answer
           if (lis_answers.includes(falseAnswer) != true){//if the wrong answer has not yet been placed, append it
           if (falseAnswer != answer){//checks the wrong answer isn't correct by mistake
            lis_answers.push(falseAnswer)}}
           if (loops > 10){//if finding incorrect answers is taking a while
            nudge += 1//increases nudge to make answers spread out wider
           }
           loops += 1//increases loop count by 1
          }
        let toWrite = lis_answers[wronged_written]
        current_element.innerHTML = toWrite//writes the wrong answer
        wronged_written += 1//increases number of wrong answers written so far
      }
        if (i == rightone) {
           current_element.innerHTML = answer; //writes the answer
        }
      for (let i=1; i < 5; i++) {//checking through function
        function checkAnswer(elem){
          let value = elem.innerHTML; //checks value of the element
          if (value == answer) {
            elem.setAttribute('style','background-color:green')//green if correct
            correct += 1 //correct answers increases
          }
          if (value != answer) {
            if (value != ''){
            elem.setAttribute('style','background-color:red')//red because wrong
            livesLost += 1//lose a life
            }}
          setTimeout(makenew,100)//200ms before next question otherwise seizure inducing
          var lifestring = '';
          for (let i=0; i < 3-livesLost; i++){
            lifestring += '♥';
          }
          document.getElementById('qa').innerHTML = 'Questions Answered: '+(finished+1).toString(); //writes down questions answered
          document.getElementById('ca').innerHTML = 'Correctly Answered: '+Math.min(correct,finished+1).toString(); //writes down correct answers
          document.getElementById('pc').innerHTML = 'Percentage Correct: '+Math.min(Math.round(correct/(finished+1) * 100),100).toString()+'%';//percent correct display
          document.getElementById('lr').innerHTML = 'Lives Remaining: '+lifestring;
          }
        current_element.onclick = function() {checkAnswer(current_element)}//runs checkanswer when clicked
        }
      }}
      if (livesLost > 2){
        quit() //runs quit function if you've lost 3 lives
      }
  }
  document.getElementById('option1').setAttribute('style', 'background-color:lightgray') //makes buttons inactive
  document.getElementById('option2').setAttribute('style', 'background-color:lightgray')
  document.getElementById('option3').setAttribute('style', 'background-color:lightgray')
  document.getElementById('option4').setAttribute('style', 'background-color:lightgray')
  finished += 1//increases finished questions
}
if (document.getElementById('savescore') != null){ //checks if on right pag
document.getElementById('savescore').onclick = function(){savescor()}}//triggers savescor() function


function savescor(){
  if (document.getElementById('savescore').innerHTML != 'Stats Saved!'){
    if (started == true){//checks if stats already saved, so as not to log twice
  var sessionnumber = parseInt(localStorage.getItem('sessionnumber'))+1 //adds 1 to existing session number and returns it to localStorage
  localStorage.setItem('sessionnumber',sessionnumber.toString())
    ////
  var time = (document.getElementById('scary').innerHTML).toString(); //time conversion from 'x hrs y mins z seconds' back to time-score
  let result = time.replace('hrs, ','').replace('mins and ','').replace('secs.','')
  let array = result.split(' ')
  let converted = parseInt(array[0])*3600+parseInt(array[1]*60)+parseInt(array[2])
  ///
  var arrays = Date().toString().split(' ');
  var timeFinished = arrays[1]+' '+arrays[2]+' '+arrays[3]+' '+arrays[4] //Date and time
  var information = localStorage.getItem('information')+correct.toString()+' '+finished.toString()+' '+livesLost.toString()+' '+converted.toString()+' '+timeFinished.toString()+' '+diff+' '+
  localStorage.getItem('mode')+' ' //localStorage information is saved to use in statistics, with those parameters
  localStorage.setItem('information',information)
  document.getElementById('savescore').innerHTML = 'Stats Saved!' //prevents double-logging of same stats
   }}}
var checked = false //has check() been called yet?
function check(){ //checks values of form entries
    var dif = document.querySelector('#diff') //name 'diff' form
    localStorage.setItem('diff',dif.value)
    var mod = document.querySelector('#mode')
    localStorage.setItem('mode',mod.value) //stores values into localStorage for use in next website
    checked = true
}
if (document.getElementById('submit') != null){ //
document.getElementById('submit').onclick = function(){check()}}
var montePressed = 0; //how many times has monte drawing been called?
function clear(montePressed){
  if (montePressed > 0){
  ctx.clearRect(0,0,1000,1000)
  }}
function monteDrawing(circcent, form, side, writing, ref){
    var cx = circcent[0] //gets (x,y) coordinates of circle centre from input
    var cy = circcent[1]
    var ctx = document.getElementById("draw").getContext("2d"); //canvas
    ctx.beginPath()
    ctx.arc(cx, cy, side/2, 0, 2*Math.PI) //draws the circle in monte carlo
    ctx.rect(cx-side/2,cy-side/2,side,side) //draws square in monte carlo
    ctx.stroke()
    var inside_circ = 0 //counts inside circle and outside circle from random points
    var outside_circ = 0
    if (form == 'yes'){ //is the number of points from a form or otherwise
    var num = parseInt(document.querySelector('#numberPoints').value);}
    else {
        var num = form //in other website, number is pre-determined (monte carlo for display in home page)
    }
    var curren = 0; //counts the number of displayed pi values so far
    function draw(ind){//recursive drawing function (so it reloads)
        if (ind >= num){return}
        if (ind < num){
        var x = Math.random(); //random x,y coordinate here
        var y = Math.random();
        function monteCircle(colour){
          ctx.fillStyle = colour
          ctx.beginPath()
          ctx.arc(cx+x*side/2,cy+y*side/2,2,0,2*Math.PI) //coordinates of centre based on circle centre and x,y coordinates scaled to side
          ctx.arc(cx-x*side/2,cy+y*side/2,2,0,2*Math.PI)
          ctx.fill()
          ctx.beginPath()
          ctx.arc(cx+x*side/2,cy-y*side/2,2,0,2*Math.PI)
          ctx.arc(cx-x*side/2,cy-y*side/2,2,0,2*Math.PI)
          ctx.fill()}
        if (x*x+y*y <= 1) { //x^2+y^2 <= 1 to check if inside circle
            inside_circ = inside_circ + 1
            //draws a light-green circle point
            monteCircle('lightgreen')
        } else {
            outside_circ = outside_circ + 1 //the same occurs, except for red points
            monteCircle('red')
        }
        if (writing == 'yes'){
        if (ind > curren*Math.floor(Math.sqrt(num))){ //for every time the number of points drawn is > sqrt(num)*number of displays
            var fon = rightfont('π='+(inside_circ/(inside_circ+outside_circ))*4, 350) //writes out pi value based on inside, outside circle
            document.getElementById('videobox1').innerHTML = 'π='+(inside_circ/(inside_circ+outside_circ))*4
            document.getElementById('videobox1').setAttribute('style','font-size:'+fon+'px')
            curren = curren+1
        }}
    }
        setTimeout(function(){draw(ind+1)},ref/(num)) //recursive, with index+1 and delay based on refresh rate input
    }
    draw(0) //starts recursion
    montePressed += 1
  }
if (document.getElementById('submitt') != null){ //checks if correct webpage
document.getElementById('submitt').onclick = function(){clear(montePressed); monteDrawing([720,450],'yes',400,'yes',100)}} //begins drawing at specified size
if (document.getElementById('stopper') != null){ //Writes text based on which website
saydialogue(0, mentalLines, 'videobox','no')}
if (document.getElementById('submitt') != null){
saydialogue(0, montelines, 'videobox1','no')
}
if (document.getElementById('videobox2') != null){
saydialogue(0, homelines, 'videobox2','yes')
}
if (document.getElementById('calc') != null){ //checks if on right page
    document.getElementById('equal').onclick = function(){window.location.href = "level.html"} //equal button in home page link
    var ctx = document.getElementById("draw").getContext("2d");
    monteDrawing([150,150],1000,200,'no',50000)
    ctx.stroke()
}
if (document.getElementById('openside') != null){ //checks if on right page
    document.getElementById('sidecontent').setAttribute('style','width:0px')
    function openbar(){
        document.getElementById('sidecontent').setAttribute('style','width: 250px') //makes side-content appear by changing width
    }
    document.getElementById('openside').onclick = function(){openbar()} //calls function when menu bar is clicked
}
if (document.getElementById('body') != null){
document.getElementById('body').setAttribute('style',"background-image: url('blank.jpeg')")
document.getElementById('body').setAttribute('style',"background-size: 1440px")
document.getElementById('submit').onclick = function(){check()}
}
if (document.getElementById('level') != null){ //This is for the sLiCk animations for the level chooser
  function symbol(x,y,tex){ //writes out the label on the moving squares (mode, e.g. mult/div/sub/add/mix)
    ctx.beginPath()
    ctx.font = '50px Arial'
    ctx.fillStyle = 'black'
    ctx.textAlign = 'center'
    ctx.fillText(tex,x,y)
  }
  function moveUp(x,y,width,height,up,backcolour,colour,ind,text){ //the way the squares move up
    //takes input finishing x,y position, width and height of rectangle, up distance, background colour which squares move over
    //takes colour the rectangle should be
    //text that it should write
  if (ind > 100){return} //100 'frames'
  ctx.beginPath()
  ctx.fillStyle = colour
  ctx.rect(x,y+up*(100-ind)/100,width,height) //draws rectangle of size width, height in colour
  ctx.fill()
  ctx.beginPath()
  ctx.fillStyle = backcolour
  ctx.rect(x,y+up*(100+100*height/up-ind)/100,width,height) //removes all traces of previous rectangle by drawing over it in background colour
  ctx.fill()
  if (text != ''){
    symbol(x+width/2,y+(up*(100-ind)/100+up*(100+100*height/up-ind)/100)/2+20,text) //draws label on the rectangle
  }
  else{}
  setTimeout(function(){moveUp(x,y,width,height,up,backcolour,colour,ind+1,text)},5)
}
moveUp(100,100,200,50,300,'black','#32CD32',0,'')
setTimeout(function(){moveUp(100,200,100,100,200,'black','lightblue',0,'×')},2000) //delays for each square to move up
setTimeout(function(){moveUp(100,300,100,100,200,'black','green',0,'+')},2500)
setTimeout(function(){moveUp(200,200,100,100,200,'black','orange',0,'−')},3000)
setTimeout(function(){moveUp(200,300,100,100,200,'black','red',0,'÷')},3500)
setTimeout(function(){moveUp(150,400,100,100,200,'black','purple',0,'Mix')},3500)
setTimeout(function(){document.getElementById('diff').setAttribute('style','width:150px')},2000) 
document.getElementById('add').setAttribute('style','top:550px') //sets position for the invisible buttons
document.getElementById('sub').setAttribute('style','left:970px')
function startgame(){
  document.getElementById('submit').setAttribute('style','display:block') //when mode is selected, the game can commence, and button appears
}
document.getElementById('mult').onclick = function(){localStorage.setItem('mode','mult'); startgame()} //sets the mode for the game in localStorage and starts game
document.getElementById('add').onclick = function(){localStorage.setItem('mode','add'); startgame()}
document.getElementById('sub').onclick = function(){localStorage.setItem('mode','sub'); startgame()}
document.getElementById('div').onclick = function(){localStorage.setItem('mode','div'); startgame()}
document.getElementById('mix').onclick = function(){localStorage.setItem('mode','mix'); startgame()}
}