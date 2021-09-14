//Create a function which returns true or false, which tells us if an array is sorted.
// If it is sorted, return true.
// Therefore: [1, 2, 3, 4, 3, 6] would return “false”.
// If it is not sorted, return the index of the first element where it’s not sorted.
// Tip: A for loop will help you compare the previous and current number.
//====================================================================================
// ========================== Question #1 ============================================

let isSorted = (arr) => {
    for(let i =0; i < arr.length-1; i++) {
        console.log(arr[i]);
        console.log(arr[i+1]);
       if(arr[i] > arr[i+1]){
     //      return i + 1;


       }
    }
    return true
}

const array1 = [1, 2 , 3, 4, 3, 6];
const array2 = [4, 1, 10, 12, 12];
const array3 = [3, 5, 7, 9, 11];

//console.log("testCase#1 => array1 = ", array1, "is sorted? no? the index of the first not sorted element then!", isSorted(array1));
//console.log("testCase#1 => array1 = ", array2, "is sorted? no? the index of the first not sorted element then!", isSorted(array2));
console.log("testCase#1 => array1 = ", array3, "is sorted? no? the index of the first not sorted element then!", isSorted(array3));