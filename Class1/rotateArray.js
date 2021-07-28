rotateArr = function(inputArray)
{
    let lastElement = sampleList[sampleList.length - 1]

    for (let i = sampleList.length - 1; i > 0; i--) {
        inputArray[i] = inputArray[i - 1]
    }

    inputArray[0] = lastElement

    return inputArray
}

rotateArrMult = function(inputArray, positions)
{
    for (let x = 0; x < positions; x++)
    {
        rotateArr(inputArray)
    }

    return inputArray
}

sampleList = ["A", "B", "C", "D"]

// Expected result = [4, 1, 2, 3]
console.log(rotateArrMult(sampleList, 2))
