//return the sum of all negative numbers
//return 0 if there are no negative number
sumNegative = function (arr) {
    let sum = 0;
    for(let currentValue of arr) {
        if(currentValue <0) {
            sum += currentValue
        }
    }
    return sum
}
Array1 = [-1, -2, 0 , 2, 4];
console.log(sumNegative(Array1))