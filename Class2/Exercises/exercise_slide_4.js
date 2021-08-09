isPalindrome = function(candidate)
{
    candidate = candidate.replace(/[\W_]/g, "")

    for (let idx = 0; idx < candidate.length / 2; idx++)
    {
            if (candidate[idx] !== candidate[candidate.length - 1 - idx]) {
                return false
            }
    }

    return true
}

// TEST CASES
// MADAM -> TRUE
// BALL -> FALSE
// MADXM -> FALSE
// "" -> TRUE


string = "MAD.AM" // one million
console.log(isPalindrome(string))
