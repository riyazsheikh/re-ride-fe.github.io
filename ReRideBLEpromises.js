
/**
 * Created by sokoler on 04/08/16.
 */



const serviceUuid = "user_data";
const characteristicWeight = "weight";
const characteristicAge = "age";
const deviceName = "ReRide";

var myAgeCharacteristic;
var myWeightCharacteristic;
var gauge_w;
var gauge_a;

function initGauge() {
    gauge_w = new JustGage({
        id: "gauge_w",
        value: 0,
        min: 0,
        max: 255,
        title: "Weight"
    });
    gauge_a = new JustGage({
        id: "gauge_a",
        value: 0,
        min: 0,
        max: 255,
        title: "Age"
    });
}

function setGauge_a(currentValue) {
    gauge_a.refresh(currentValue);
}

function setGauge_w(currentValue) {
    gauge_w.refresh(currentValue);
}

function onStartButtonClick() {

    log('Requesting Bluetooth Device...');
    navigator.bluetooth.requestDevice({ filters: [{ name: deviceName }], optionalServices: [serviceUuid] })
        .then(device => {
            log('Connecting to GATT Server...');
            return device.gatt.connect();
        })
        .then(server => {
            log('Getting Service...');
            return server.getPrimaryService(serviceUuid);
        })
        .then(service => {
            log('Getting Characteristic...');
            var weight = service.getCharacteristic(characteristicWeight);
            var age = service.getCharacteristic(characteristicAge);
            return { weight: weight, age: age };
        })
        .then(characteristic => 
         {
            myWeightCharacteristic = characteristicWeight;
            myAgeCharacteristic = characteristicAge;
        
            var p1 = myWeightCharacteristic.startNotifications()
            .then(_ => {
                log('> Notifications started');
<<<<<<< HEAD
                myWeightCharacteristic.addEventListener('characteristicweightchanged',
=======
                myCharacteristic.weight.addEventListener('characteristicweightchanged',
>>>>>>> parent of bc296c1... Update ReRideBLEpromises.js
                    handleWeightNotifications);
            });

            var p2 = myAgeCharacteristic.startNotifications().then(_ => {
                log('> Notifications started');
<<<<<<< HEAD
                myAgeCharacteristic.addEventListener('characteristicagechanged',
=======
                myCharacteristic.age.addEventListener('characteristicagechanged',
>>>>>>> parent of bc296c1... Update ReRideBLEpromises.js
                    handleAgeNotifications);
            });

        })
        .catch(error => {
            log('Argh! ' + error);
        });    
}

function onStopButtonClick() {
    if (myCharacteristic) {
        myCharacteristic.stopNotifications()
            .then(_ => {
                log('> Notifications stopped');
                myCharacteristic.removeEventListener('characteristicweightchanged',
                    handleWeightNotifications);

                myCharacteristic.removeEventListener('characteristicagechanged',
                    handleAgeNotifications);
            })
            .catch(error => {
                log('Argh! ' + error);
            });
    }
}

function handleWeightNotifications(event) {
    let value = event.target.value;
    /*   let b = value.getUint8(0).toString();
   
       // now do stuff with the data received !
       log('> ' + b);
    */
    let x = value.getUint8(0);
    setGauge_w(x);

}

function handleAgeNotifications(event) {
    let value = event.target.value;
    /*   let b = value.getUint8(0).toString();
   
       // now do stuff with the data received !
       log('> ' + b);
    */
    let x = value.getUint8(0);
    setGauge_a(x);

}
initGauge();
