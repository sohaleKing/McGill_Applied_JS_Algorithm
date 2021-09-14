class Stack {
    constructor() {
        this.data = [];
        this.top = 0;  //index
    }
    push(element) {
        this.data[this.top] = element;
        this.top += 1;
    }
    peek(){
        return this.data[this.top - 1]
    }

    isEmpty() {
        return this.top === 0;
    }
    pop() {
        if(!this.isEmpty()){            //
            this.top -= 1;
            return this.data.pop()      //this pop is the system pop
        } else {
            return null
        }
    }
    print() {
       let topIndex =  this.top -1

        while(topIndex >=0) {
           console.log(this.data[topIndex])
           topIndex --
        }
    }
    reversePrint() {
        this._reversePrint(this.top -1)
    }
    _reversePrint(index) {
        if(index !==0 ) {
            this._reversePrint(index -1)
        }
        console.log(this.data[index])
    }
}

let stack1 = new Stack();
stack1.push(4);
stack1.push(5);
stack1.push(0);
//console.log(stack1.peek())
//console.log(stack1.isEmpty())
//console.log(stack1.data)
console.log(stack1.reversePrint())


//there are all layered --> each have tears--> within these tears everything cohision --> cohesion vs coupling  !!