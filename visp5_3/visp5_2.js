
var pf;  //Pressure Feedback
var aux; //Auxillary Feedback
var sensor_data=[];
var xoff = 0.0;
var t=0;

var first_color;
var second_color;
var third_color;
var fourth_color;

var starts, startm;
var redtime=0;
var yellowtime=0;
var greentime=0;
var bluetime=0;
var nows=0, nowm=0;

var myfill=[];

function setup() {
  createCanvas(windowWidth, windowHeight);
  pf = createGraphics(windowWidth/2, windowHeight);
  aux = createGraphics(windowWidth/2, windowHeight);
  //sensor_data = new var[20];
  load_data();
  frameRate(1);
  //iosevka32 = loadFont("iosevka.vlw");

  redtime=0;
  yellowtime=0;
  greentime=0;
  bluetime=0;
  starts = second();
  startm = minute();

//  first_color=color(66, 165, 245);
//  second_color=color(144, 202, 249);
//  third_color=color(214, 238, 252);
//  fourth_color=color(243, 251, 255);
  
  first_color=color(66, 165, 245);
  second_color=color(144, 202, 249);
  third_color=color(214, 238, 252);
  fourth_color=color(243, 251, 255);

  myfill[0]=first_color;
  myfill[1]=second_color;
  myfill[2]=third_color;
  myfill[3]=fourth_color;
}

function draw() {
  //pf.beginDraw();
  pf.background(0);
  pf.strokeCap(SQUARE);
  pf.strokeWeight(1);
  pf.stroke(first_color, 100);
  pf.line(0, map(1, 0, 4, 0, pf.height), pf.width, map(1, 0, 4, 0, pf.height));
  pf.stroke(second_color, 100);
  pf.line(0, map(2, 0, 4, 0, pf.height), pf.width, map(2, 0, 4, 0, pf.height));
  pf.stroke(third_color, 100);
  pf.line(0, map(3, 0, 4, 0, pf.height), pf.width, map(3, 0, 4, 0, pf.height));
  pf.strokeWeight(10);
  drawline();
  //println(sensor_data[0]);
  //pf.endDraw();

  //aux.beginDraw();
  aux.clear();
  aux.background(0);
  aux.fill(255);
  aux.textAlign(CENTER, CENTER);
  //aux.textFont(iosevka32);
  //text("word", 12, 60);
  aux.textSize(16);
  aux.text("RIDE TIME", aux.width/2, -40+0.8*aux.height/4);
  aux.textSize(48);
  nows=frameCount%60;
  if (abs(frameCount)==60)
  { 
    nowm++;
  }
  aux.text(nowm+":"+(nows), aux.width/2, 0.8*aux.height/4);


  aux.textSize(16);
  aux.text("YOUR POSTURE THIS RIDE", aux.width/2, -90+aux.height/2);
  var total_time=redtime + yellowtime + greentime + bluetime;
  var timedata=[];
  timedata[0]=map(redtime, 0, total_time, 0, 360);
  timedata[1]=map(yellowtime, 0, total_time, 0, 360);
  timedata[2]=map(greentime, 0, total_time, 0, 360);
  timedata[3]=map(bluetime, 0, total_time, 0, 360);

  pieChart(150, timedata);
  aux.textSize(26);
  aux.textAlign(LEFT);
  for (var i=0; i<4; i++) {
    aux.fill(myfill[i]);
    aux.ellipse(1.8*aux.width/4, i*40+2.1*aux.height/3, 10, 10);
    var mytime=map(timedata[i],0,360,0,frameCount);
    aux.text((mytime/60).toFixed(0)+":"+(mytime%60).toFixed(0), aux.width/2, i*40+2.1*aux.height/3);
  }
  //aux.endDraw();
  image(pf, 0, 0);
  image(aux, windowWidth/2, 0);
  refresh_data();
}

function drawline() {
  for (var i=0; i<100; i++) {
    var x=pf.width-i*10-5;

    if (sensor_data[i]>map(3, 0, 4, 0, 1023)) {
      pf.stroke(first_color);
      redtime++;
    } else if (sensor_data[i]>map(2, 0, 4, 0, 1023)) {
      yellowtime++;
      pf.stroke(second_color);
    } else if (sensor_data[i]>map(1, 0, 4, 0, 1023)) {
      greentime++;
      pf.stroke(third_color);
    } else {
      bluetime++;
      pf.stroke(fourth_color);
    }
    //pf.line(x, height, x, map(sensor_data[i], 0, 1023, height, 0));

    pf.line(x, height, x, 0);
    //pf.stroke(255);
    //pf.noFill();
    //pf.strokeWeight(5);
    //pf.beginShape(POINTS);
    //pf.strokeWeight(10);
    //pf.vertex(x, sensor_data[i]);
  }
}

function load_data() {
  for (var i=0; i<100; i++) {
    sensor_data[i]=0;
  }
}
function refresh_data() {
  xoff+=1;
  for (var i=99; i>0; i--) {
    //temp=
    sensor_data[i]=sensor_data[i-1];
  }
  sensor_data[0]=noise(xoff)*1000;
  //sensor_data[0]=random(1023);
}

function pieChart(diameter, data) {
  var lastAngle = 0;

  for (var i = 0; i < 4; i++) {
    //switch(i) {
    //case 0:  
    //  aux.fill(red);
    //  break;
    //case 1:  
    //  aux.fill(yellow);
    //  break;
    //case 2:  
    //  aux.fill(#ff0000);
    //  break;
    //case 3:  
    //  aux.fill(blue);
    //  break;
    //}
    //aux.noFill();
    aux.fill(myfill[i]);
    //println(i+":"+data[i]);
    aux.arc(aux.width/2, 10+aux.height/2, diameter, diameter, lastAngle, lastAngle+radians(data[i]));
    lastAngle += radians(data[i]);
  }
}
function displayPressureData() {
  aux.textSize(16);
  aux.text("PRESSURE SENSOR READING", aux.width/2, (3.4*aux.height/4) - 40);
  aux.textSize(48);
  aux.text(sensor_data[0].toFixed(2), aux.width/2, 3.4*aux.height/4);
}
