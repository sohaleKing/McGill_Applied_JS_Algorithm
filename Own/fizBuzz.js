division = {3: "Fizz", 5: "Buzz", 7: "Jazz"};

for(var i = 1; i <= 100; i++) {
    var output = "";

    for (var x in division) {
        if(i % x == 0) output += division[x];
    }

    console.log(output == "" ? i : output);
}