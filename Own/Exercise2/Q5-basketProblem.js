//You are given two arrays which give you the weight and the value of things.
// The basket has a max weight it can carry.
// Your job is to fill the basket with the highest value of things, as long as it can hold the weight. You want
// to maximize the value. You can use unlimited values of each.

function basketProblem(capacity, weight, value, n) {
    let max = function (a, b) {
        return (a > b) ? a : b;
    }
    if (n == 0 || capacity == 0) return 0;
    if (weight[n - 1] > capacity) {
        return basketProblem(capacity, weight, value, n - 1);
    }
    else {
        return max(value[n - 1] +
            basketProblem(capacity - weight[n - 1], weight, value, n - 1),
            basketProblem(capacity, weight, value, n - 1));
    }
}

let value = [ 10, 50, 200 ];
let weight = [ 10, 20, 30 ];
let capacity = 50;
let n = value.length;

console.log((basketProblem(capacity, weight, value, n)));


// TIME COMPLEXITY = O(2^n)
// SPACE COMPLEXITY = O(1)