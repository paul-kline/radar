"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pigpio_1 = __importDefault(require("pigpio"));
const Gpio = pigpio_1.default.Gpio;
// The number of microseconds it takes sound to travel 1cm at 20 degrees celcius
const MICROSECDONDS_PER_CM = 1e6 / 34321;
const trigger = new Gpio(14, { mode: Gpio.OUTPUT });
const echo = new Gpio(15, { mode: Gpio.INPUT, alert: true });
const minimumMeasureTime = 50; //ms
trigger.digitalWrite(0); // Make sure trigger is low
let current = 0;
const watchHCSR04 = () => {
    let startTick;
    echo.on("alert", (level, tick) => {
        if (level == 1) {
            startTick = tick;
        }
        else {
            const endTick = tick;
            const diff = (endTick >> 0) - (startTick >> 0); // Unsigned 32 bit arithmetic
            current = diff / 2 / MICROSECDONDS_PER_CM;
            console.log(current);
        }
    });
};
watchHCSR04();
// Trigger a distance measurement once per second
// setInterval(() => {
//   trigger.trigger(10, 1); // Set trigger high for 10 microseconds
// }, 1000);
async function burstMeasurements(count = 5, delayAmount = 0) {
    const arr = [];
    for (let i = 0; i < count; i++) {
        arr.push(await getDist());
        if (delayAmount > 0) {
            await delay(delayAmount);
        }
    }
    return arr;
}
function delay(delayAmount) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve();
        }, delayAmount);
    });
}
function getDist() {
    return new Promise((resolve, reject) => {
        trigger.trigger(10, 1);
        setTimeout(() => {
            resolve(current);
        }, minimumMeasureTime);
    });
}
function normalize(arr) {
    const len = arr.length;
    //if 3 or less, just send average.
    if (len < 4) {
        return arr.reduce((acc, cur) => acc + cur) / len;
    }
    //the array has at least 3 elements.
    arr = arr.sort();
    const i = Math.ceil(len / 2);
    let median = arr[i];
    if (len % 2 == 0) {
        //then we need to get middle 2 vals.
        median += arr[i - 1];
        median /= 2;
    }
    return median;
}
async function getMeasurement() {
    const arr = await burstMeasurements();
    return normalize(arr);
}
async function main() {
    const cm = await getMeasurement();
    console.log(cm, "cm");
}
//# sourceMappingURL=main.js.map