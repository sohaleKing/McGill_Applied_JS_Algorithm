twoSum = function(inputArray, number)
{
    let matches = []

    for (let x = 0; x < inputArray.length; x++)
    {
        for (let y = x + 1; y < inputArray.length; y++)
        {
            if(inputArray[y] === (number - inputArray[x]))
            {
                return [x, y]
            }
        }
    }
    return null
}

console.log(twoSum([1, 2, 3], 5))
