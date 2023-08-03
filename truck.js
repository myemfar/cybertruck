import { getCustomProperty, incrementCustomProperty, setCustomProperty } from "./updateCustomProperty.js"

// select our truck object, set initial parameters for other functions
const truckElem = document.querySelector("[data-truck]")
const JUMP_SPEED = .3
const GRAVITY = .0008
const TRUCK_FRAME_COUNT = 2
const FRAME_TIME = 100

let isJumping
let truckFrame
let currentFrameTime
let yVelocity

// sets initial state for truck, including position at the ground (bottom=0) and that it is not jumping. resets the event listener for jumping
export function setupTruck() {
    isJumping = false
    truckFrame = 0
    currentFrameTime = 0
    yVelocity = 0
    setCustomProperty(truckElem, "--bottom", 0)
    document.removeEventListener("keydown", onJump)
    document.addEventListener("keydown", onJump)
}


// update function for truck based on speedscale of the game and time elapsed
export function updateTruck(delta, speedScale) {
    handleRun(delta, speedScale)
    handleJump(delta)
}

// gets the location of the truck with getBoundingClientRect so we can check for collisions in script.js
export function getTruckRect() {
    return truckElem.getBoundingClientRect()
}

// sets what image to show after a loss
export function setTruckLose() {
    truckElem.src = "imgs/crash.png"
}

// sets how our truck moves - alternates the frames of our car moving, and sets the image for jumping and frames for ground movement
// if you want more than 2 animation frames, change TRUCK_FRAME_COUNT and make sure the images are labelled so the backtick source image properly iterates through them
function handleRun(delta, speedScale) {
    if (isJumping) {
        truckElem.src = 'imgs/truck1.png' // change this if you have a jumping image for the truck you want to use
        return
    }

    if (currentFrameTime >= FRAME_TIME) {
        truckFrame = (truckFrame + 1) % TRUCK_FRAME_COUNT //calculates which frame of truck image to use with the modulo function
        truckElem.src = `imgs/truck${truckFrame}.png` //truck image source flips through 0 and 1, but you could add 2, 3, 4, etc.
        currentFrameTime -= FRAME_TIME
    }
    currentFrameTime += delta * speedScale
}

// handles our car jumping
function handleJump(delta) {
    if (!isJumping) return //skips the animation if the car is not jumping

    incrementCustomProperty(truckElem, "--bottom", yVelocity * delta) // change our --bottom alignment on truck incrementally
    if (getCustomProperty(truckElem, "--bottom") <= 0) {
        setCustomProperty(truckElem, "--bottom", 0)
        isJumping = false
    } // this stops the jumping function once the truck hits the ground (bottom is 0) again
    yVelocity -= GRAVITY * delta
}

// checking to start a jump
function onJump(e) {
    if (e.code !== "Space" || isJumping) return // this blocks input other than spacebar, and also blocks you from jumping if you are already jumping

    yVelocity = JUMP_SPEED
    isJumping = true
}
