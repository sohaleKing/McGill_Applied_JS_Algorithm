function selectSort(inputArr)
{
    for (let i = 0; i < inputArr.length; i++)
    {
        let tempEle = inputArr[i];
        for(let j = i + 1; j < inputArr.length; j++)
        {
            if (tempEle > inputArr[j])
            {
                tempEle = inputArr[j]
            }
        }
        let index = inputArr.indexOf(tempEle)
        let tempVal = inputArr[i]
        inputArr[i] = tempEle
        inputArr[index] = tempVal
    }
}

let inputArr = [8, 4, 6, 9, 2, 3, 1]
console.log("Input  array is ", inputArr)
selectSort(inputArr)
console.log("Sorted array is ", inputArr)
