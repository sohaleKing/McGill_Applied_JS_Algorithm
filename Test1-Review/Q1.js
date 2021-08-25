is_sorted = function(check_array) {

    for (let x = 0; x < check_array.length; x++)
    {
        if(check_array[x] < check_array[x-1] )
        {
            return x
        }
    }

    return true
}



test_array = [2,2,3]

console.log(is_sorted(test_array))