import { getCustomProperty, incrementCustomProperty, setCustomProperty } from "./updateCustomProperty.js"

// set our starting speed (note, match this to speed in ground.js unless you want obstacles and road moving at different speeds)
const SPEED = .05
// set parameters for the gap between our obstacles
const OBSTACLE_INTERVAL_MIN = 800
const OBSTACLE_INTERVAL_MAX = 2000
// fetch our world object in the HTML so we can modify it
const worldElem = document.querySelector("[data-world]")

let nextObstacleTime

// when the game starts, this sets our first obstacle interval to MIN, and clears existing obstacles off the screen
export function setupObstacle() {
    nextObstacleTime = OBSTACLE_INTERVAL_MIN
    document.querySelectorAll("[data-obstacle]").forEach(obstacle => {
        obstacle.remove()
    })
}

// this updates the position of obstacles while a game is in progress. increments obstacles from right to left, and removes obstacles that have moved offscreen
export function updateObstacle(delta, speedScale) {
    document.querySelectorAll("[data-obstacle]").forEach(obstacle => {
        incrementCustomProperty(obstacle, "--left", delta * speedScale * SPEED * -1)
        if (getCustomProperty(obstacle, "--left") <= -100) {
            obstacle.remove()
        }
    })
    // if our obstacle interval has elapsed, creates a new obstacle, and then randomly sets the time until a new obstacle is created
    if (nextObstacleTime <= 0) {
        createObstacle()
        nextObstacleTime = randomNumberBetween(OBSTACLE_INTERVAL_MIN, OBSTACLE_INTERVAL_MAX) / speedScale
    }
    // take the random time interval and subtract from it, when it hits zero triggers the creation of next obstacle
    nextObstacleTime -= delta
}

// gets the bounds of the rectangles containing every obstacle (getBoundingClientRect), and feeds it back into script.js so we can check if someone has collided with one and lost
export function getObstacleRects() {
    return [...document.querySelectorAll("[data-obstacle]")].map(obstacle => {
        return obstacle.getBoundingClientRect()
    })
}


// creates a new obstacle, fed into our update function whenever the time to create a new obstacle has elapsed
function createObstacle() {
    const obstacle = document.createElement("img") // create new HTML image element
    obstacle.dataset.obstacle = true // adds data-obstacle property of obstacle to our obstacle element
    obstacle.src = "imgs/stop.png" // set image for obstacle
    obstacle.classList.add("obstacle") // add the class obstacle to this element
    setCustomProperty(obstacle, "--left", 100) // set the origin point for the obstacle
    worldElem.append(obstacle) // append it to our world element
}

// calculates random numbers, used in our obstacle generation function to randomly place objects between our designated minimum and maximum gap between objects
function randomNumberBetween(min, max) {
    return Math.floor(Math.random() * (max-min+1) + min)
}
