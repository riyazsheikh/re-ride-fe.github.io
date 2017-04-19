var pf  //Pressure Feedback
var aux //Auxillary Feedback
var sensor_data = [];
var xoff = 0.0;
var t=0;

var rc, yc, gc, bc;
var iosevka32;

function setup() {
  createCanvas(400, 300);
  pf = createGraphics(200, 300);
  aux = createGraphics(200, 300);
  //sensor_data = new float[20];
  load_data();
  frameRate(0.5);
  //iosevka32 = loadFont("data/iosevka.vlw");
  rc=color(255, 0, 0);
  yc=color(255, 255, 0);
  gc=color(0, 255, 0);
  bc=color(0, 0, 255);
}

function draw() {
  //pf.beginDraw();
  pf.background(0);
  pf.strokeCap(SQUARE);
  pf.strokeWeight(10);
  drawline();
  pf.strokeWeight(1);
  pf.stroke(100, 100);
  pf.line(0, map(1, 0, 4, 0, pf.height), pf.width, map(1, 0, 4, 0, pf.height));
  pf.stroke(100, 100);
  pf.line(0, map(2, 0, 4, 0, pf.height), pf.width, map(2, 0, 4, 0, pf.height));
  pf.stroke(100, 100);
  pf.line(0, map(3, 0, 4, 0, pf.height), pf.width, map(3, 0, 4, 0, pf.height));

  //println(sensor_data[0]);
  //pf.endDraw();

  //aux.beginDraw();
  aux.clear();
  aux.background(0);
  aux.fill(255);
  aux.textAlign(CENTER, CENTER);
  //aux.textFont(iosevka32);
  //text("word", 12, 60);
  aux.textSize(32);
  aux.text("t="+frameCount, aux.width/2, aux.height/2);
  aux.textSize(16);
  aux.text(hour()+":"+minute()+"."+second(), aux.width/2, aux.height/3);
  aux.text("p="+sensor_data[0], aux.width/2, 2*aux.height/3);
  //aux.endDraw();
  image(pf, 0, 0);
  image(aux, 201, 0);
  refresh_data();
  //saveFrame("anim/img######.png");
}

function drawline() {
  for (var i=0; i<20; i++) {
    var x=pf.width-i*10-5;

    if (sensor_data[i]>map(3, 0, 4, 0, 1023)) {
      pf.stroke(rc);
    } else if (sensor_data[i]>map(2, 0, 4, 0, 1023)) {
      pf.stroke(yc);
    } else if (sensor_data[i]>map(1, 0, 4, 0, 1023)) {
      pf.stroke(gc);
    } else {
      pf.stroke(bc);
    }
    //pf.line(x, height, x, map(sensor_data[i], 0, 1023, height, 0));
    pf.line(x,height,x,0);
    //pf.stroke(255);
    //pf.noFill();
    //pf.strokeWeight(5);
    //pf.beginShape(POINTS);
    //pf.strokeWeight(10);
    //pf.vertex(x, sensor_data[i]);
  }
}

function load_data() {
  for (var i=0; i<20; i++) {
    sensor_data[i]=0;
  }
}
function refresh_data() {
  xoff+=0.5;
  for (var i=19; i>0; i--) {
    //temp=
    sensor_data[i]=sensor_data[i-1];
  }
  sensor_data[0]=noise(xoff)*1000;
  //sensor_data[0]=random(1023);
}
