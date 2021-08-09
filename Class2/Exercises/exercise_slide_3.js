// Given an array of integers nums and an integer target,
// return indices of the two numbers such that they add up to target.
// You may assume that each input would have exactly one solution, and you may not use the same element twice.
// You can return the answer in any order.

twoSum = function(numbers, target) {
    for(let i = 0; i < numbers.length; i++) {
        for(let j = i + 1; j < numbers.length; j++) {
            if (numbers[j] === (target - numbers[i])) {
                return [i, j]
            }
        }
    }
    return null // Cases where both numbers DO NOT add up to target.
}

myArray = [3, 2, 4]
myTarget = 6

console.log(twoSum(myArray, myTarget))
