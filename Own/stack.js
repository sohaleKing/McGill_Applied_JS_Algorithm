let Stack = function() {

    this.top = null;
    this.size = 0;
}

let Node = function(data) {

    this.data = data
    this.previous = null
}

Stack.prototype.push = function(data)
{
    let node = new Node(data)
    node.previous = this.top
    this.top = node
    this.size += 1
    return this.top
}

Stack.prototype.peek = function()
{
    return this.top.data
}

Stack.prototype.isEmpty = function()
{
    return this.size === 0
    //return this.top === null
}


Stack.prototype.pop = function()
{
    if (this.isEmpty()) {return null}
    let temp = this.top.data // ***
    this.top = this.top.previous
    this.size -= 1
    return temp
}

    Stack.prototype.getString = function() {
         let topVal = this.top
         let str = ""
         while(topVal) {
             str = str + topVal.data
             topVal = topVal.previous;
         }
         return str
    }
let Student = function(id, name)
{
    this.id = id
    this.name = name
}

student1 = new Student(123, "Brendan")
student2 = new Student(234, "Mercy")
student3 = new Student(345, "Tahran")

// s1 = new Stack()
// s1.push(student1)
// s1.push(student2)
// s1.push(student3)
//
// //console.log(s1.peek())
//
// console.log(s1)

// TRIALS BELOW

s1 = new Stack()
s1.push("A")
s1.push("B")
s1.push("C")
// console.log(s1.peek())
// console.log(s1.pop())
// console.log(s1.pop())
// console.log(s1.pop())

console.log(s1.getString()) // C B A