// -2, -3, 4, -1, -2, 1, 5, -3 
// maxSoFar -1
// curMax -2 -2 1

function getLargetSubArrSum(arr, size) {
    
    let maxSoFar = arr[0]
    let currMax = arr[0]

    for (let index = 1; index < arr.length; index++) {
        currMax = Math.max(arr[index], currMax + arr[index])
        maxSoFar = Math.max(currMax, maxSoFar)
    }
    return maxSoFar
}