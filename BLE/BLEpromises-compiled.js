'use strict';

/**
 * Created by sokoler on 04/08/16.
 */

//require("babel-polyfill");


var myCharacteristic;

function onStartButtonClick() {
    var serviceUuid = document.querySelector('#service').value;
    if (serviceUuid.startsWith('0x')) {
        serviceUuid = parseInt(serviceUuid);
    }

    var characteristicUuid = document.querySelector('#characteristic').value;
    if (characteristicUuid.startsWith('0x')) {
        characteristicUuid = parseInt(characteristicUuid);
    }

    log('Requesting Bluetooth Device...');
    navigator.bluetooth.requestDevice({ filters: [{ services: [serviceUuid] }] }).then(function (device) {
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
    var b = value.getUint8(0).toString();
    log('> ' + b);
}

//# sourceMappingURL=BLEpromises-compiled.js.map