//Write a function that accepts two parameters. One, an array, and two, a string supplied by the user which can
// be “max, min, average, sum”.
// The function thus, will accept two parameters, “inputArray” and “action”.
// The function then does the requested action and returns a value back to you.
// If the action is not recognized, return “Error” as a value.
// If no value is found return “null”.
// If you call “
//====================================================================================
// ========================== Question #3A ===========================================

ArrayAction = function (inputArray, action) {
    let findMax = (arr) => {
        let max = -Infinity;
        for (let i = 0; i < arr.length; i++) {
            if(!max) {
                max = arr[i] // protect against an array of values less than 0
            }
            if (arr[i] > max ) {
                max = arr [i];
            }
        }
        return max
    }

    let findMin = (arr) => {
        let min = Infinity;
        for (let i = 0; i < arr.length; i++) {
            if (arr[i] < min ) {
                min = arr [i];
            }
        }
        return min
    }

    let findSum = (arr) => {
        let sum = 0;
        for (let i = 0; i < arr.length; i++) {
                sum += arr [i];
            }
        return sum;
        }

    let findAverage = (arr) => {
        let average = Math.round(findSum(arr) / arr.length);
        return average;
    }
    switch (action) {
        case "max" :
            return findMax(inputArray);
        case "min" :
            return findMin(inputArray);
        case "average" :
            return findAverage(inputArray);
        case "sum" :
            return findSum(inputArray)
        default:
            return "Error"
    }

}

const array = [4, 3, 1, 13, -1, 46, 10 ,101 ,-8 ,19, 39, 51, 77, 6, 2, 8]

console.log(!array)

console.log("array = ", array);
console.log ("Max = ", ArrayAction(array, "max"));
console.log ("Min = ", ArrayAction(array, "min"));
console.log ("Sum = ", ArrayAction(array, "sum"));
console.log ("Average = ", ArrayAction(array, "average"));
console.log ("test case not Valid operation ==> ", ArrayAction(array, "test"));
console.log('note: max, min, average, sum are not kind of type value to be able as "not found"') ;
