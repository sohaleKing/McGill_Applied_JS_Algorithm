let division = {3: "Fizz", 5: "Buzz", 7: "Jazz", 9:"Sup"};

for(let i = 1; i <= 100; i++) {
    let output = "";

    for (let x in division) {
        if(i % x === 0) output += division[x];
    }

    console.log(output === "" ? i : output);
}
