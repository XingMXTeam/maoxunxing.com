// -2, -3, 4, -1, -2, 1, 5, -3
// maxEndingHere 1
// maxSoFar 7

function getLargetSubArrSum(arr, size) {
    let maxint = Math.pow(2, 53)
    let maxSoFar = -maxint - 1
    let maxEndingHere = 0
    for (let index = 0; index < arr.length; index++) {
        maxEndingHere = maxEndingHere + arr[index]
        if(maxSoFar < maxEndingHere) {
            maxSoFar = maxEndingHere
        }
        if(maxEndingHere < 0) {
            maxEndingHere = 0
        }
    }
    return maxSoFar
}