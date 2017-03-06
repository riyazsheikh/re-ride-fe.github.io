/**
 * Created by sokoler on 04/08/16.
 */



const serviceUuid = "battery_service";
const characteristicUuid ="battery_level";
const deviceName = "ReRide";

var myCharacteristic;
var gauge;

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

function setGauge(currentValue)
{
    gauge.refresh(currentValue);
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
        .then(characteristic => {
            myCharacteristic = characteristic;
            return myCharacteristic.startNotifications().then(_ => {
                log('> Notifications started');
                myCharacteristic.addEventListener('characteristicvaluechanged',
                    handleNotifications);
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
                log('Argh! ' + error);
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
initGauge();