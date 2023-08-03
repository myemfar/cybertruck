import { setupGround, updateGround } from './ground.js'
import { getTruckRect, setTruckLose, setupTruck, updateTruck } from './truck.js'
import { getObstacleRects, setupObstacle, updateObstacle } from './obstacle.js'

// set our constants for initialization
const WORLD_WIDTH = 100
const WORLD_HEIGHT = 30
const SPEED_SCALE_INCREASE = 0.00001

// set hooks to our HTML elements so we can modify each element later
const worldElem = document.querySelector('[data-world]')
const scoreElem = document.querySelector('[data-score]')
const startScreenElem = document.querySelector('[data-start-screen]')

// update our world scale anytime the window is resized
setPixelToWorldScale()
window.addEventListener("resize", setPixelToWorldScale)

// make it so the first keypress, and only the first keypress, starts our game. we trigger a refresh on once:true when the game is lost so you can restart
document.addEventListener("keydown", handleStart, { once: true})

// creating variables that are used later
let lastTime
let speedScale
let score

// update function that runs all our smaller update functions based on elapsed time
function update(time) {
    if (lastTime == null){
        lastTime = time
        window.requestAnimationFrame(update)
        return
    } // sets our current time based on when we start the game for the purposes of calculating delta
    const delta = time - lastTime // sets time elapsed
    // run all of our update functions each frame
    updateGround(delta, speedScale)
    updateTruck(delta, speedScale)
    updateSpeedScale(delta)
    updateScore(delta)
    updateObstacle(delta, speedScale)
    // check if player loses, run lose function
    if (checkLose()) return handleLose()
    lastTime = time // set a new lastTime for the next loop of this function
    window.requestAnimationFrame(update) // causes this function to run itself again (loop) any time a frame can be rendered (requestAnimationFrame)
}

// gets the location of truck and obstacles, then runs function to check for collisions based on where the rectangles containing the images are located
function checkLose() {
    const truckRect = getTruckRect()
    return getObstacleRects().some(rect => isCollision(rect, truckRect))
}

// compares any two elements on the page to check if there is overlap. fed into the previous function to check for collissions between truck + obstacle
function isCollision(rect1, rect2) {
    return (rect1.left < rect2.right && rect1.top < rect2.bottom && rect1.right > rect2.left && rect1.bottom > rect2.top)
}

// increases the speed of the game the longer it is running. speed_scale_increase is our accelleration while speedscale is the velocity
function updateSpeedScale(delta) {
    speedScale += delta * SPEED_SCALE_INCREASE
}

// updates our score alongside time elapsed
function updateScore(delta) {
    score += delta * .01
    scoreElem.textContent = Math.floor(score)
}

// initial loadstate for the game. setup functions set initial positions and speeds for various objets, hides start screen, then initializes our update function at the end to handle 'mid-game' functions
function handleStart() {
    lastTime = null
    speedScale = 1
    score = 0
    setupGround()
    setupTruck()
    setupObstacle()
    startScreenElem.classList.add("hide")
    window.requestAnimationFrame(update)

}

// what to do when a collision is detected, then sets a timeout before you can start a new game. adds a new event listener to start the next game and shows the start new game element again
function handleLose() {
    setTruckLose()
    setTimeout(() => {
        document.addEventListener("keydown", handleStart, { once: true })
        startScreenElem.classList.remove("hide")
    }, 1000)
}

// scales our game based on window size. first checks height/width ratio to determine which is the limiting constraint, then scales based on the dimension of the more limiting factor
function setPixelToWorldScale() {
    let worldToPixelScale
    if (window.innerWidth / window.innerHeight < WORLD_WIDTH/WORLD_HEIGHT)
    {
        worldToPixelScale = window.innerWidth / WORLD_WIDTH
    } else {
        worldToPixelScale = window.innerHeight / WORLD_HEIGHT
    }
    worldElem.style.width = `${WORLD_WIDTH * worldToPixelScale}px`
    worldElem.style.height = `${WORLD_HEIGHT * worldToPixelScale}px`
}
