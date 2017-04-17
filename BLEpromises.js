/**
 * Created by sokoler on 04/08/16.
 */


//require("babel-polyfill");


var myCharacteristic;


function onStartButtonClick() {
    let serviceUuid = document.querySelector('#service').value;
    if (serviceUuid.startsWith('0x')) {
        serviceUuid = parseInt(serviceUuid);
    }

    let characteristicUuid = document.querySelector('#characteristic').value;
    if (characteristicUuid.startsWith('0x')) {
        characteristicUuid = parseInt(characteristicUuid);
    }

    log('Requesting Bluetooth Device...');
    navigator.bluetooth.requestDevice({filters: [{services: [serviceUuid]}]})
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
    let b = value.getUint8(0).toString();
    log('> ' + b);

}
