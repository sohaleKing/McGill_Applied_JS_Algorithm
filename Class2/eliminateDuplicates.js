// This function walks an array and eliminates duplicates.
// It returns a "set" back to you.
removeDup = function(inputArray)
{
    inputArray.sort()

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
a1 = [1, 2, 3, 2]
a2 = removeDup(a1)
console.log(a2)
