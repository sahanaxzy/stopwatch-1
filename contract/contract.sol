// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SimpleStopwatch {
    uint256 public startTime;   // When the stopwatch was started
    uint256 public elapsedTime; // Total time recorded
    bool public isRunning;      // Whether the stopwatch is currently running

    // Start the stopwatch
    function start() public {
        require(!isRunning, "Stopwatch already running");
        isRunning = true;
        startTime = block.timestamp;
    }

    // Stop the stopwatch
    function stop() public {
        require(isRunning, "Stopwatch not running");
        isRunning = false;
        elapsedTime += block.timestamp - startTime;
    }

    // Reset the stopwatch
    function reset() public {
        isRunning = false;
        elapsedTime = 0;
        startTime = 0;
    }

    // Get the current time (even while running)
    function getCurrentTime() public view returns (uint256) {
        if (isRunning) {
            return elapsedTime + (block.timestamp - startTime);
        } else {
            return elapsedTime;
        }
    }
}
