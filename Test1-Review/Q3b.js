count_sort = function(in_array) {
    let max_val = 0
    let n = in_array.length

    // Find the max value.
    for (let x = 0; x < n; x++) {
        if (in_array[x] > max_val)
        {
            max_val = in_array[x]
        }
    }

    // Create new array used for counting.
    let count_array = new Array(max_val + 1)

    // Initialize all array elements to 0
    for (let x = 0; x < count_array.length; x++)
    {
        count_array[x] = 0
    }

    for (let x = 0; x < n; x++)
    {
        count_array[in_array[x]]++
    }

    let out_array = []

    for(let x = 0; x < count_array.length; x++)
    {
        let y = count_array[x]
        while(y !== 0)
        {
            out_array.push(x)
            y--
        }
    }
    return out_array
}


sorted_arr = count_sort([2, 4, 4, 1])

console.log(sorted_arr)