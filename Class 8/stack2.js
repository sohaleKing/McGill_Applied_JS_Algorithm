class Stack {

    constructor() {
        this.data = [];
        this.top = 0;
    }

    // O(2) -> O(1)
    push(element) {
        this.data[this.top] = element;
        this.top += 1;
    }

    // O(1)
    peek() {
        return this.data[this.top - 1];
    }

    // O(1)
    // Return a boolean "true" if empty.
    isEmpty() {
        return this.top === 0;
    }

    // pop() here is a user method.  But you can use the system pop() method within.
    // O(1) + O(1) + O(n)
    // O(n)

    pop() {
        if (!this.isEmpty()) {
            this.top = this.top - 1
            return this.data.pop() // To verify
        } else {
            return null
        }
    }

    print() {
        let returnString = ""

        if (this.isEmpty()) {
            returnString = "-- Empty Stack --"
        }

        // First, use a local variable to control the index, not the class variable.
        let t = this.top - 1

        while (t >= 0) {
            returnString += this.data[t];
            returnString += "\n";
            t--
        }

        return returnString
    }

    //O(3n + 1)

    // O(1)
    reverse() {
        // O(3n)
        this._reverse(this.top - 1)
    }

    _reverse(index) {
        if (index !== 0) {
            this._reverse(index - 1)
        }

        console.log(this.data[index])
    }
}


let stack1 = new Stack()

stack1.push("A")
stack1.push("B")
stack1.push("C")

//console.log(stack1.print())

stack1.reverse()

// console.log(stack1.peek()) // B
// console.log(stack1.pop()) // B
// console.log(stack1.peek()) // A
// console.log(stack1.pop())
// console.log(stack1.pop())


