let calculatedvalue = function (arr, method)
{
    let min = function(arr)
    {
        let min_value = arr[0]
        for (let x = 1; x < arr.length; x++)
        {
            if (arr[x] < min_value)
            {
                min_value = arr[x]
            }
        }
        return min_value
    }

    let max = function(arr)
    {
        let max_value = arr[0]
        for (let x = 1; x < arr.length; x++)
        {
            if (arr[x] > max_value)
            {
                max_value = arr[x]
            }
        }
        return max_value
    }

    let sum = function(arr)
    {
        let total = 0
        for (let x = 0; x < arr.length; x++)
        {
            total += arr[x]
        }
        return total
    }

    let avg = function(arr)
    {
        // sum / total number of items

        return sum(arr) / arr.length
    }

    if (arr.length === 0) { return null }

    if(method === "min")
    {
        return min(arr)
    }

    if(method === "max")
    {
        return max(arr)
    }

    if(method === "sum")
    {
        return sum(arr)
    }

    if(method === "avg")
    {
        return avg(arr)
    }

    return "Error"
}

my_array = []

console.log(calculatedvalue(my_array, "sum"))