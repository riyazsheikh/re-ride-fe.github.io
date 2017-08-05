var sensor_data_x = [];
var sensor_data_y = [];
var xoff1=0.0;
var xoff2=0.0;

function setup() {
createCanvas(displayWidth, displayHeight);
frameRate(1);
background(255);
}

function draw() {
background( 255, 255, 255, 150);
xoff1+=1;
xoff2+=0.5;
  for (var i=99; i>0; i--) {
    //temp=
    sensor_data_x[i]=sensor_data_x[i-1];
  }
sensor_data_x[0]=noise(xoff1)*100;

 for (var i=99; i>0; i--) {
    //temp=
    sensor_data_y[i]=sensor_data_y[i-1];
  }
sensor_data_y[0]=noise(xoff2)*100;
  


var y3 = sensor_data_y [i]- sensor_data_x [i];
/*var y1= random(900, 1023);
var y2= random(900, 1023);
var y3= y2-y1;*/

stroke(0);
//line((width/2)-150, (height/2)-y3 , (width/2)+150, (height/2)+y3);
line((width/2)-150, (height/2)-y3 , (width/2)+150, (height/2)+ y3);
}