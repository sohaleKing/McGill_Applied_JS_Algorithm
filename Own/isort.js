insertSort = function(arr) {
    let len = arr.length
    let key, i, j
    for (i = 1; i < len; i++)
    {
        key = arr[i];
        j = i - 1;
        while (j >= 0 && arr[j] > key)
        {
            arr[j + 1] = arr[j];
            j--;
        }
        arr[j + 1] = key;
    }

    return arr
}



let array1 = [5,8,11,6,1,9,3]
let array2 = insertSort(array1)
console.log(array2)