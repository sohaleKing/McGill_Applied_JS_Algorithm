/*removeDup = function(arr) {

    if(arr.length == 0) return 0;

    let i = 0;
    for (let j = 1; j < arr.length; j ++){
        if(arr[j] !== arr[i]){
            i++;
            arr[i] = arr[j];
        }
    }

    return i + 1
}


let array1 = [1, 2, 5, 7, 7, 8,]
    console.log(removeDup(array1))
*/
// This function walks an array and eliminates duplicates.
// It returns a "set" back to you.
removeDup = function(inputArray)
{
    let temp = 0
    let newArray = []

    for (let i = 0; i < inputArray.length; i++)
    {
        if (inputArray[i] !== temp)
        {
            newArray.push(inputArray[i])
            temp = inputArray[i]
        }
    }

    return newArray
}

// Start
a1 = [1, 2, 2, 3]
a2 = removeDup(a1)
console.log(a2)
