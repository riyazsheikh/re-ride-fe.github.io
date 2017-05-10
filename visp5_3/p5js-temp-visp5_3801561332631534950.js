// PGraphics object -- pf:Primary Feedback
var pf;

// PGraphics object -- aux:Auxillary Feedback
var aux;

// Sensor cache
var sensor_data=[];

// X offset to create noise to simulate realistic sensor values
var xoff = 0.0;

// Set time to 0
var t=0;

// Time Counters
var total_time=0;
var ridetime=[];

// Color Legend
var myfill=[];

var obj;

var x;

function preload() {
  getDatafromAWS();
  //console.log(obj);
  //httpDo("https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY",print);
}

function setup() {

  // Main canvas
  createCanvas(windowWidth, windowHeight);

  // Create sub-canvas
  pf = createGraphics(windowWidth/2, windowHeight);
  aux = createGraphics(windowWidth/2, windowHeight);

  // Set color legend
  myfill[0]=color(66, 165, 245);
  myfill[1]=color(144, 202, 249);
  myfill[2]=color(214, 238, 252);
  myfill[3]=color(243, 251, 255);

  // Reset time counters
  ridetime[0]=0;
  ridetime[1]=0;
  ridetime[2]=0;
  ridetime[3]=0;

  // Load simulation data
  load_data();

  frameRate(1);
}

function draw() {
  pf.background(0);
  drawPrimaryFeedback();
  drawAuxFeedback();
  refresh_data();
}

function drawline() {

  for (var i=0; i<100; i++) {
    var x=pf.width-i*10-5;

    if (sensor_data[i]>map(3, 0, 4, 0, 1023)) {
      pf.stroke(myfill[0]);
    } else if (sensor_data[i]>map(2, 0, 4, 0, 1023)) {
      pf.stroke(myfill[1]);
    } else if (sensor_data[i]>map(1, 0, 4, 0, 1023)) {
      pf.stroke(myfill[2]);
    } else {
      pf.stroke(myfill[3]);
    }
    pf.line(x, height, x, 0);
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
  updateCounter(sensor_data[0]);
}

function pieChart(diameter, data) {
  var lastAngle = 0;

  for (var i = 0; i < 4; i++) {
    aux.fill(myfill[i]);
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

function updateCounter(lastdata) {
  if (lastdata>map(3, 0, 4, 0, 1023)) {
    ridetime[0]++;
  } else if (lastdata>map(2, 0, 4, 0, 1023)) {
    ridetime[1]++;
  } else if (lastdata>map(1, 0, 4, 0, 1023)) {
    ridetime[2]++;
  } else {
    ridetime[3]++;
  }
  total_time++;
}

function pad(n) {
  return (n < 10) ? ("0" + n) : n;
}

// Set horizontal lines for graph at Primary Feedback display
function drawPrimaryFeedback() {
  pf.strokeCap(SQUARE);
  pf.strokeWeight(1);
  pf.stroke(myfill[0], 100);
  pf.line(0, map(1, 0, 4, 0, pf.height), pf.width, map(1, 0, 4, 0, pf.height));
  pf.stroke(myfill[1], 100);
  pf.line(0, map(2, 0, 4, 0, pf.height), pf.width, map(2, 0, 4, 0, pf.height));
  pf.stroke(myfill[2], 100);
  pf.line(0, map(3, 0, 4, 0, pf.height), pf.width, map(3, 0, 4, 0, pf.height));
  pf.strokeWeight(10);
  drawline();
}

function drawAuxFeedback() {
  aux.clear();
  aux.background(0);
  aux.fill(255);
  aux.textAlign(CENTER, CENTER);

  aux.textSize(16);
  aux.text("RIDE TIME", aux.width/2, -40+0.8*aux.height/4);
  //total_time=frameCount;
  aux.textSize(48);
  aux.text(floor(total_time/60)+":"+pad(total_time%60), aux.width/2, 0.8*aux.height/4);

  aux.textSize(16);
  aux.text("YOUR POSTURE THIS RIDE", aux.width/2, -90+aux.height/2);

  var timedata=[];
  timedata[0]=map(ridetime[0], 0, total_time, 0, 360);
  timedata[1]=map(ridetime[1], 0, total_time, 0, 360);
  timedata[2]=map(ridetime[2], 0, total_time, 0, 360);
  timedata[3]=map(ridetime[3], 0, total_time, 0, 360);

  pieChart(150, timedata);
  aux.textSize(26);
  aux.textAlign(LEFT);
  for (var i=0; i<4; i++) {
    aux.fill(myfill[i]);
    aux.ellipse(1.8*aux.width/4, i*40+2.1*aux.height/3, 10, 10);
    aux.text(floor(ridetime[i]/60)+":"+pad(ridetime[i]%60), aux.width/2, i*40+2.1*aux.height/3);
  }

  image(pf, 0, 0);
  image(aux, windowWidth/2, 0);
}

function getDatafromAWS() {
  var datatype="json";
  var id="id="+1234;
  var from="from="+120;
  var to="to="+60;
  var timezone="2";
  var api_key="WmDsguzavl83nutOxZj3L9JLi5g29hlg1Nc86LKu";
  var path="https://rzx2umf8a9.execute-api.eu-central-1.amazonaws.com/beta/ride-data";
  var requestString=path+"?"+id+"&"+from+"&"+to+"&"+timezone;

  httpDo(requestString, 
  {
  method: 
    'GET', 
    params: 
    {
    'id':
      '1234', 
      'from':
      '120', 
      'to':
      '60'
    }
    , 
    headers: 
    {
    'Content-Type':
      'application/json', 
      'x-api-key':
      api_key
    }
  }
  , print
    );
}
