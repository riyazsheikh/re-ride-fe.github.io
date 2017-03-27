"use strict";

/**
 * Created by sokoler on 04/08/16.
 */

var serviceUuid = "battery_service";
var characteristicUuid = "battery_level";
var deviceName = "ReRide";

var myCharacteristic;
var gauge;

function initGauge() {
    gauge = new JustGage({
        id: "gauge",
        value: 0,
        min: 0,
        max: 255,
        title: "Visitors"
    });
}

function setGauge(currentValue) {
    gauge.refresh(currentValue);
}

function onStartButtonClick() {

    log('Requesting Bluetooth Device...');
    navigator.bluetooth.requestDevice({ filters: [{ name: deviceName }], optionalServices: [serviceUuid] }).then(function (device) {
        log('Connecting to GATT Server...');
        return device.gatt.connect();
    }).then(function (server) {
        log('Getting Service...');
        return server.getPrimaryService(serviceUuid);
    }).then(function (service) {
        log('Getting Characteristic...');
        //tst = service.getCharacteristic(characteristicUuid);
        return service.getCharacteristic(characteristicUuid);
    }).then(function (characteristic) {
        myCharacteristic = characteristic;
        return myCharacteristic.startNotifications().then(function (_) {
            log('> Notifications started');
            myCharacteristic.addEventListener('characteristicvaluechanged', handleNotifications);
        });
    }).catch(function (error) {
        log('Argh! ' + error);
    });
}

function onStopButtonClick() {
    if (myCharacteristic) {
        myCharacteristic.stopNotifications().then(function (_) {
            log('> Notifications stopped');
            myCharacteristic.removeEventListener('characteristicvaluechanged', handleNotifications);
        }).catch(function (error) {
            log('Argh! ' + error);
        });
    }
}

function handleNotifications(event) {
    var value = event.target.value;
    /*   let b = value.getUint8(0).toString();
        // now do stuff with the data received !
       log('> ' + b);
    */
    var x = value.getUint8(0);
    setGauge(x);
}
initGauge();

//# sourceMappingURL=ReRideBLEpromises-compiled.js.map