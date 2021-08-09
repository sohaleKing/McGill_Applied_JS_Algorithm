const FIZZ = 3
const BUZZ = 5
const FIZZ_PHRASE = "Fizz"
const BUZZ_PHRASE = "Buzz"

fizzbuzz = function(a, b)
{
    let output
    for (let x = a; x <= b; x++) {

        // Format the number to be 2 digits exactly. (include a 0).
        let formattedNumber = ("0" + x).slice(-2);

        output = formattedNumber + ": "
        if (x % FIZZ === 0) {
            output += FIZZ_PHRASE
        }

        if (x % BUZZ === 0) {
            output += BUZZ_PHRASE
        }

        console.log(output)
    }
}

fizzbuzz(1, 20)