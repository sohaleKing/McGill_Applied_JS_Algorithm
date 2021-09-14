//Use the following pseudocode, implement this sort using JavaScript.
// sort_array(input_array)
//  n <- Assign the size of the input_array and put it in n
//  max_val <- find the largest element in input_array and assign it to max_val.
//  create a new count_array of size (max_val + 1)
//  initialize count_array with all 0's
//  for i <- 0 to n
//  Increase the value in the count array at position found in “input_array[i]”
//  Create a new output_array with a dynamic size, eg: []
//  Create a new counter called y
//  for i <- 0 to n
//  set the value of y to the value of the count_array at position i
//  WHILE y is not equal to 0
//  PUSH the value of I to the output_array
//  Decrease the value of y by 1
//  Finally, return the output array which is sorted.
//====================================================================================
// ========================== Question #3B ===========================================

sortArray =  function (inputArray) {
    let n = inputArray.length;
    let maxVal = -Infinity;
    for (let i = 0; i < n; i++) {
        if (!maxVal) {
            maxVal = inputArray[i] // protect against an array of values less than 0
        }
        if (inputArray[i] > maxVal) {
            maxVal = inputArray[i];
        }
    }
    let countArray = new Array(maxVal + 1).fill(0);
   for (let i = 0; i < n; i++) {
        countArray[inputArray[i]]++
    }
    let outputArray = [];
    let counter_y;
    for (let i = 0; i < countArray.length; i++) {
        counter_y = countArray[i];
        while (counter_y !== 0) {
            outputArray.push(i)
            counter_y--;
        }
    }
    console.log("countArray = ", countArray)
    console.log("sortedArray = " , outputArray)
}
const array1= [5, 3, 10, 4, 12, 40, 13, 12, 20, 15, 10, 30];
console.log("array1 = ", array1)
sortArray(array1);