//Given a staircase with “n” steps, you are told you can climb 1 or 2 steps at a time.
// Given a staircase with 3 steps, you can do this:
// 1,1,1 (climb the 3 steps one by one)
// 1,2 (first climb one step, then skip 1 step)
// 2,1 (Skip a step, then take a normal step)

function skipSteps(arr, n, i)
{
    let maxAllowedStepsToTake = 2;
    if (n == 0) {
        combination(arr, i);
    }
    else if(n > 0) {
        for(let k = 1; k <= maxAllowedStepsToTake; k++) {
            arr[i] = k;
            skipSteps(arr, n - k, i + 1);
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
//SHOW TIME
let Output = [];

console.log("=============test case 1 stair===============")
skipSteps(Output, 1, 0);

console.log("=============test case 2 stairs===============")
skipSteps(Output, 2, 0);

console.log("=============test case 3 stairs===============")
skipSteps(Output, 3, 0);

console.log("=============test case 4 stairs===============")
skipSteps(Output, 4, 0);

console.log("=============test case 5 stairs===============")
skipSteps(Output, 5, 0);

// TIME COMPLEXITY = O(n^3)
// SPACE COMPLEXITY = O(1)