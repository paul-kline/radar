"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var pigpio_1 = __importDefault(require("pigpio"));
// The number of microseconds it takes sound to travel 1cm at 20 degrees celcius
var MICROSECDONDS_PER_CM = 1e6 / 34321;
var trigger = new pigpio_1.default(23, { mode: pigpio_1.default.OUTPUT });
var echo = new pigpio_1.default(24, { mode: pigpio_1.default.INPUT, alert: true });
trigger.digitalWrite(0); // Make sure trigger is low
var watchHCSR04 = function () {
    var startTick;
    echo.on("alert", function (level, tick) {
        if (level == 1) {
            startTick = tick;
        }
        else {
            var endTick = tick;
            var diff = (endTick >> 0) - (startTick >> 0); // Unsigned 32 bit arithmetic
            console.log(diff / 2 / MICROSECDONDS_PER_CM);
        }
    });
};
watchHCSR04();
// Trigger a distance measurement once per second
setInterval(function () {
    trigger.trigger(10, 1); // Set trigger high for 10 microseconds
}, 1000);
//# sourceMappingURL=main.js.map