//Output the next power of two that is equal to or greater than the input number.
// If n = 5, then output = 8 (2^3)

let pow2 = function (input) {
    let output = 1;
    while (output < input) {
        output *= 2;
    }
    return output


}
const testCase = [5, 14, 32, 33, 90, 0, -10, 250, 1200]

testCase.forEach((element) => {
    console.log("The next power of two which is equal to or greater than ",element," is ",pow2(element))
});

// TIME COMPLEXITY = O(n)
// SPACE COMPLEXITY = O(1)