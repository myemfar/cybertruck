import { getCustomProperty, incrementCustomProperty, setCustomProperty } from "./updateCustomProperty.js"

const truckElem = document.querySelector("[data-truck]")
const JUMP_SPEED = .3
const GRAVITY = .0008
const TRUCK_FRAME_COUNT = 2
const FRAME_TIME = 100

let isJumping
let truckFrame
let currentFrameTime
let yVelocity
export function setupTruck() {
    isJumping = false
    truckFrame = 0
    currentFrameTime = 0
    yVelocity = 0
    setCustomProperty(truckElem, "--bottom", 0)
    document.removeEventListener("keydown", onJump)
    document.addEventListener("keydown", onJump)
}

export function updateTruck(delta, speedScale) {
    handleRun(delta, speedScale)
    handleJump(delta)
}

export function getTruckRect() {
    return truckElem.getBoundingClientRect()
}

export function setTruckLose() {
    truckElem.src = "imgs/crash.png"
}

function handleRun(delta, speedScale) {
    if (isJumping) {
        truckElem.src = 'imgs/truck1.png'
        return
    }

    if (currentFrameTime >= FRAME_TIME) {
        truckFrame = (truckFrame + 1) % TRUCK_FRAME_COUNT
        truckElem.src = `imgs/truck${truckFrame}.png`
        currentFrameTime -= FRAME_TIME
    }
    currentFrameTime += delta * speedScale
}

function handleJump(delta) {
    if (!isJumping) return

    incrementCustomProperty(truckElem, "--bottom", yVelocity * delta)
    if (getCustomProperty(truckElem, "--bottom") <= 0) {
        setCustomProperty(truckElem, "--bottom", 0)
        isJumping = false
    }
    yVelocity -= GRAVITY * delta
}

function onJump(e) {
    if (e.code !== "Space" || isJumping) return

    yVelocity = JUMP_SPEED
    isJumping = true
}
