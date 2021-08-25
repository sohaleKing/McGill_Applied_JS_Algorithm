// 1. Identify edge cases
// 2. Identify loop structure


function removeDuplicatesInPlace(arr, n)
{
    if (n===0 || n===1)
    {
        return n
    }

   let  temp = new Array(n)

    let j = 0

    for (let i = 0; i < n - 1; i++)
    {
        if (arr[i] !== arr[i+1]) {
            temp[j++] = arr[i]
        }

    }
    temp[j++] = arr[n-1];

    for(let k = 0; k < j; k++)
    {
        arr[k] = temp[k]
    }

    return j
}

let arr = [1, 2, 2, 2]
let n = arr.length // 4

n = removeDuplicatesInPlace(arr, n) // n should be "3"

console.log(n)
console.log(arr)

for(let x = 0; x < n; x++)
{
    console.log(arr[x])
}