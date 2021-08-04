
// Return the sum of all negative numbers.
// Return 0 if there are NO negative numbers.
getSumNegative = function(inputList)
{
    let sum = 0

    for(let currentValue of inputList)
    {
        if(currentValue < 0)
        {
            sum += currentValue
        }
    }

    return sum
}


sampleList = [1, -2, 2, 4]

console.log(getSumNegative(sampleList))
