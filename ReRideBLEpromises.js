/**
 * Created by sokoler on 04/08/16.
 */

const serviceUuid = "user_data";
const characteristicUuid = "age";
const characteristicUuid1 = "weight";
const deviceName = "ReRide";

var myCharacteristic;
var myCharacteristic1;
var gauge;
var gauge1;

function initGauge()
{
    gauge = new JustGage({
        id: "gauge",
        value: 0,
        min: 0,
        max: 255,
        title: "Visitors"
    });
}

function initGauge1()
{
    gauge1 = new JustGage({
        id: "gauge1",
        value: 0,
        min: 0,
        max: 255,
        title: "Visitors1"
    });
}

function setGauge(currentValue)
{
    gauge.refresh(currentValue);
}

function setGauge1(currentValue)
{
    gauge1.refresh(currentValue);
}

function onStartButtonClick() {

    log('Requesting Bluetooth Device...');
    navigator.bluetooth.requestDevice({filters: [{name: deviceName}], optionalServices:[serviceUuid]})
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
            //tst = service.getCharacteristic(characteristicUuid);
            return service.getCharacteristic(characteristicUuid);
        })
        .then(service => {
            log('Getting Characteristic...');
            //tst = service.getCharacteristic(characteristicUuid);
            return service.getCharacteristic(characteristicUuid1);
        })
        .then(characteristic => {
            myCharacteristic = characteristic;
            return myCharacteristic.startNotifications().then(_ => {
                log('> Notifications started');
                myCharacteristic.addEventListener('characteristicvaluechanged',
                    handleNotifications);
            })
            .then(characteristic1 => {
                myCharacteristic1 = characteristic1;
                return myCharacteristic1.startNotifications().then(_ => {
                    log('> Notifications started');
                    myCharacteristic1.addEventListener('characteristicvaluechanged',
                        handleNotifications1);
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
                myCharacteristic.removeEventListener('characteristicvaluechanged',
                    handleNotifications);
            })
            .catch(error => {
                log('Argh! Sensor 1! ' + error);
            });
    }

    if (myCharacteristic1) {
        myCharacteristic1.stopNotifications()
            .then(_ => {
                log('> Notifications stopped');
                myCharacteristic1.removeEventListener('characteristicvaluechanged',
                    handleNotifications1);
            })
            .catch(error => {
                log('Argh! Sensor 2!' + error);
            });
    }
}

function handleNotifications(event) {
    let value = event.target.value;
 /*   let b = value.getUint8(0).toString();

    // now do stuff with the data received !
    log('> ' + b);
 */
    let x = value.getUint8(0);
    setGauge(x);

}

function handleNotifications1(event) {
    let value = event.target.value;
 /*   let b = value.getUint8(0).toString();

    // now do stuff with the data received !
    log('> ' + b);
 */
    let x = value.getUint8(0);
    setGauge1(x);

}

initGauge();
initGauge1();
