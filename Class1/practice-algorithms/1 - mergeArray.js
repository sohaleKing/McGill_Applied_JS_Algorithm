mergeArray = function(arrA, arrB) {

    if (arrB == null) {
        arrB = arrA.slice()
    }

    for (let val of arrB)
    {
        arrA.push(val)
    }

    return arrA
}

a1 = [1,2,3]
a2 = [7,8,9]

console.log(mergeArray(a1, a2))
