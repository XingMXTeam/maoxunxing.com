// 
// 3   { 4   5  7 } 8
// subArrEndIndex 3
function miniJumpsToEnd(arr) {
    const n = arr.length 
    if(n==1) return 0
    if(arr[0] == 0) return -1

    let jump = 1
    
    let subArrEndIndex = arr[0]
    let i = 1

    let subArrFirstHalfMaxSteps = 0
    let subArrSecondHalfMaxSteps = 0

    for(i = 1; i < n; ) {
        subArrEndIndex = i + subArrEndIndex      // 最长的跨度   
        if(subArrEndIndex >= n) {
            return jump
        }

        let firstHalfMaxStepIndex = 0
        for(; i < subArrEndIndex; i++ ) {
            let stepsCanCover = arr[i] + i
        }
    }
}