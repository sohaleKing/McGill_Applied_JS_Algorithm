class Queue {
    constructor() {
        this.items = {};
        this.headIndex = 0;
        this.tailIndex = 0;
    }

    enqueue(item) {
        this.items[this.tailIndex] = item;
        this.tailIndex++;
    }

    peek() {
        return this.items[this.headIndex];
    }

    dequeue() {
        const item = this.items[this.headIndex];
        delete this.items[this.headIndex];
        this.headIndex++;
        return item;
    }
    get length() {
        return this.tailIndex - this.headIndex;
    }
}

q1 = new Queue()

console.log(q1.dequeue())



// q1.enqueue("A")
// q1.enqueue("B")
// console.log(q1.dequeue())
// console.log(q1.length)
