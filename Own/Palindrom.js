isPalindrome = function(candidate)
{
    let mirror = true

    for (let idx = 0; idx < candidate.length / 2; idx++)
    {
        if (candidate[idx] !== candidate[ candidate.length - 1 - idx] )
        {
            mirror = false
        }
    }

    return mirror
}


string = "AQUA" // one million
console.log(isPalindrome(string))
