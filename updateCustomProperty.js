// these are our recycled functions in all the other scripts.

// fetches the property we request from a given element, using the built in getComputedStyle and getPropertyValue functions. returns 0 otherwise
export function getCustomProperty(elem, prop) {
    return parseFloat(getComputedStyle(elem).getPropertyValue(prop)) || 0

}

// uses setProperty to set a given property of a given element to the value we want
export function setCustomProperty(elem, prop, value) {
    elem.style.setProperty(prop, value)
}

// stitches the last two functions together, allowing us to set a property we fetched to the old property + our increments. key in getting everything else to function
export function incrementCustomProperty(elem, prop, inc) {
    setCustomProperty(elem, prop, getCustomProperty(elem, prop) + inc)
}
