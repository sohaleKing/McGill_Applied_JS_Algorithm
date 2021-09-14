//Create a function which prints out all the combinations of the input array (as arrays).
// For example, given [2, 3, 4, 5], output would be.
// [2, 3]
// [2, 4]
// [2, 5]
// [3, 4]
// [3, 5]
// [4, 5]
// Note, there are no duplicates in the output, so [2,2] is not an option.
// As a guideline, an array with 3 elements in it will give 3 results.
// An array with 4 elements in it will give 6 results. (and so on…)
// Tip: Several “for” loop(s) will help you achieve this task.
//====================================================================================
// ========================== Question #2 ============================================

Combination = function (arr) {
    //lets remove the duplication
        let newArray = [];
        for (let k = 0; k < arr.length; k++) {
            if (newArray.indexOf(arr[k]) === -1 && arr[k] !== '') {
                newArray.push(arr[k]);
            }
        }

        //now lets show the combination
        let len = newArray.length;
        for (let i = 0; i < len; i++) {
            for (let j = i + 1; j < len; j++) {
     //           if (newArray[i] !== newArray[j]) {
                    console.log("[" + newArray[i] + ", " + newArray[j] + "]")
     //           }
            }
        }
}

const array1 = [2, 3, 4, 5];
const array2 = [5, 8, 8, 9];
const array3 = [1, 8, 8, 1];

//first lets check if its not duplications:


console.log("testCase#1 => array1 = ", array1, "so the combination would be as following:");
Combination(array1);
//
// console.log("testCase#2 => array1 = ", array2, "so the combination would be as following:");
// Combination(array2);
//
// console.log("testCase#3 => array1 = ", array3, "so the combination would be as following:");
// Combination(array3);