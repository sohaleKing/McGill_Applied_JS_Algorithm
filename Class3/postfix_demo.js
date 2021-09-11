Stack = function () {
    this.top = null;
    this.size = 0;
};

let Node = function (data) {
    this.data = data;
    this.previous = null;
};

Stack.prototype.push = function(data) {
    let node = new Node(data);
    node.previous = this.top;
    this.top = node;
    this.size += 1;
    return this.top;
};

Stack.prototype.pop = function() {
    if (this.isEmpty()) {return "UnderFlow"}
    let temp = this.top;
    this.top = this.top.previous;
    this.size -= 1;
    return temp;
};

Stack.prototype.peek = function () {
    return this.top.data
}

Stack.prototype.isEmpty = function()
{
    return this.size === 0
}

function postFixCalc(expression) {
    //create new stack

    let stack = new Stack();

    //loop through each character in provided expression
    for (let idx = 0; idx < expression.length; idx++) {
        //store each character
        let token = expression[idx];

        //if it's a number, push to stack
        //else pop right side and left side, perform operation and push to stack
        if (!isNaN(token)) {
            stack.push(Number(token));
        } else {
            let rhs = stack.pop().data;
            let lhs = stack.pop().data;
            //if right or left side is not available
            if (rhs === "UnderFlow" || lhs === "UnderFlow" ) {
                return "Can't perform postfix calculation - Format incorrect";
            }
            switch (token) {
                case '%':
                    stack.push(lhs % rhs);
                    break;
                case '+':
                    stack.push(lhs + rhs);
                    break;
                case '-':
                    stack.push(lhs - rhs);
                    break;
                case '*':
                    stack.push(lhs * rhs);
                    break;
                case '/':
                    if (rhs === 0) { return "Cannot divide by zero." }
                    stack.push(lhs / rhs);
                    break;
            }
        }

    }
    //return result of calculation
    return stack.pop().data;
}

console.log(postFixCalc("75%"))