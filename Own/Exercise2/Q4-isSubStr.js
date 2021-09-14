//Is a string present in another string? Given two strings, write an algorithm to check if the first string
// exists in the second.
// Return true if yes, false if not.
// Example, “ABC” is a substring of “YADDAABCYADDA”.
// “ABC” is NOT a substring of “HELLOBCAHELLO”.

function isSubStr(str1, str2) {
    let j = 0;
    for (let i = 0; i < str2.length && j < str1.length; i++){
        if (str1[j] === str2[i]) {
            j++
        }
    }
    return  (j === str1.length) ? true : false;
}

let str1 = "ABC";
let str2 = "HELLOBCAHELLO";
//SHOW TIME
console.log(isSubStr(str1, str2));

// TIME COMPLEXITY = O(n * m)  n and m are lengths of string1 and string 2
// SPACE COMPLEXITY = O(1)