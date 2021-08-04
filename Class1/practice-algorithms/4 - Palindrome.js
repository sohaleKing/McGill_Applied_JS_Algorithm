palindrome = function (candidate) {

    candidate = candidate.replace(/[\W_]+/g,"") // Replace non-aplha characters.
    //console.log(candidate)
    let mirror = true // Assume it's palindrome until proven wrong.

    for (let n = 0; n < candidate.length / 2; n++)
    {
        if (candidate[n] !== candidate[candidate.length - 1 - n])
        {
            mirror = false
        }
    }

    return mirror
}

string = "m%^%$#^%$adam"
console.log(palindrome(string))
