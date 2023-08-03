import { getCustomProperty, incrementCustomProperty, setCustomProperty } from "./updateCustomProperty.js"

// set ground speed and select ground elements in HTML
const SPEED = 0.05
const groundElems = document.querySelectorAll("[data-ground]")

// function for aligning the ground on a new game
export function setupGround() {
    setCustomProperty(groundElems[0], "--left", 0)
    setCustomProperty(groundElems[1], "--left", 300)
}

// function for incrementing our ground position left/right while a game is in progress
// we use 2 ground objects stitched together, the if statement catches a ground tile that has moved off screen and moves it back to the other side in a loop
export function updateGround(delta, speedScale) {
    groundElems.forEach(ground => {
        incrementCustomProperty(ground, "--left", delta * speedScale * SPEED * -1)
        if (getCustomProperty(ground, "--left") <= -300) {
            incrementCustomProperty(ground, "--left", 600)
        }
    })
}
