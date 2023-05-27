// -2, -3, 4, -1, -2, 1, 5, -3
// maxEndingHere 7
// maxSoFar 4
// start: 2
// end: 2
// s: 2

function getLargetSubArrSum(arr, size) {
  let maxSoFar = Number.MIN_VALUE;
  let maxEndingHere = 0;
  let start = 0;
  let end = 0;
  let s = 0;

  for (let i = 0; i < arr.length; i++) {
    const element = arr[i];
    maxEndingHere += element;

    if (maxSoFar < maxEndingHere) {
      maxSoFar = maxEndingHere;

      start = s;
      end = i;
    }

    // 肯定要大于0 所以负数就舍弃了
    if (maxEndingHere < 0) {
      maxEndingHere = 0;
      s = i + 1;
    }
  }
}

// function getLargetSubArrSum(arr, size) {
//     let maxSoFar = arr[0]
//     let maxEndingHere = arr[0]

//     for(let i = 1; i < arr.length; i++) {
//         maxEndingHere = Math.max(arr[i], maxEndingHere + arr[i])
//         maxSoFar = Math.max(maxEndingHere, maxSoFar)
//     }

// }

// function getLargetSubArrSum(arr, size) {

//     let maxSoFar = Number.MIN_VALUE

//     let maxEndingHere = 0

//     for(let i = 0 ; i < arr.length; i++) {
//         // 如果和累积 则继续添加
//         if( maxEndingHere + arr[i] >= arr[i]) {
//             maxEndingHere += arr[i]
//         }
//         // 否则重新开始
//         else {
//             maxEndingHere = arr[i]
//         }

//         if(maxEndingHere > maxSoFar) {
//             maxSoFar = maxEndingHere
//         }
//     }

//     return maxSoFar
// }
// function getLargetSubArrSum(arr, size) {
//     let maxint = Math.pow(2, 53)
//     let maxSoFar = -maxint - 1
//     let maxEndingHere = 0
//     for (let index = 0; index < arr.length; index++) {
//         maxEndingHere = maxEndingHere + arr[index]
//         if(maxSoFar < maxEndingHere) {
//             maxSoFar = maxEndingHere
//         }
//         if(maxEndingHere < 0) {
//             maxEndingHere = 0
//         }
//     }
//     return maxSoFar
// }
