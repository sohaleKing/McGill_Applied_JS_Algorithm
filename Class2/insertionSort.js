


function iSort(array)
{
    let len = array.length
    let tmp, i, j

    for(i = 1; i < len; i++)
    {
        tmp = array[i]
        j = i - 1

        while (j >= 0 && array[j] > tmp)
        {
            array[j+1] = array[j]
            j--
        }
        array[j + 1] = tmp
    }

    return array
}


let a1 = [8, 2, 4, 9, 3, 6]

a2 = iSort(a1)
console.log(a2)