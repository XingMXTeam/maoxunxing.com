//i
// asddsa
//ls i   h

function logestPStr(str) {
    let n = str.length
    if(n < 2) return n
    
    let maxLength = 1, start = 0
    let low, high 
    for (let index = 0; index < n; index++) {
        low = index - 1
        high = index + 1
        while( high < n && str[high] == str[index]){
            high++
        }
        while( low >= 0 && str[low] == str[index]) {
            low--
        }
        while( low >= 0 && high < n && str[low] == str[high]) {
            low--
            high++
        }
        let length = high - low - 1
        if(maxLength < length) {
            maxLength = length
            start = low + 1
        }
    }
    return maxLength
}