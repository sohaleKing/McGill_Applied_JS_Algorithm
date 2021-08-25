

let combos = function(input_arr) {

    let return_array = []

    for (let x = 0; x < input_arr.length; x++)
    {
        for (let y = x + 1; y < input_arr.length; y++)
        {
            let z = [input_arr[x], input_arr[y]]
            return_array.push(z)
        }
    }
    return return_array
}

arr = [2, 3, 4, 5]

console.log(combos(arr))