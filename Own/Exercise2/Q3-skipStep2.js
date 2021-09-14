//Suppose in problem 2, you are told that you can choose the steps you can skip based on an input array.
// So, if you pass in an array of [1, 2, 4] you can use 1, 2 (like above) but also 4).

function skipSteps(arr, n, i, steps)
{
    let maxAllowedStepsToTake = steps;
    if (n == 0) {
        combination(arr, i);
    }
    else if(n > 0) {
        for(let k = 1; k <= maxAllowedStepsToTake; k++) {
            arr[i] = k;
            skipSteps(arr, n - k, i + 1, steps);
        }
    }
}

function combination(arr, m) {
    let combination = []
    for(let i = 0; i < m; i++) {
        combination.push(arr[i]);
    }
    console.log(combination)
}
//SHOW TIME for the test case of 6 stairs and the array of steps
let Output = [];
// n = number of steps   the stepArray would be step which are allowed to be taken
const stepArray = [1,2,4]
stepArray.forEach((element) => {
    skipSteps(Output, 5, 0, element);
    console.log("=====================================================================" +
        "\nAll combinations when only", element, " steps is allowed to be taken to climb\n" +
        "=====================================================================" )
})

// TIME COMPLEXITY = O(n^3)
// SPACE COMPLEXITY = O(1)