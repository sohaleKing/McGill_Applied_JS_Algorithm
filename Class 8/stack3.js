// Stack
// push / pop / min
// O(1) time


class MinStack
{
    constructor() {

        this.data = [];
        this.mindata = [];
        this.top = null;
    }

    push(value)
    {
        this.top = (this.top === null) ? 0 : ++this.top
        this.data.push(value)
        if (this.isMin(value))
            this.mindata.push(value)
        else
            this.mindata.push(this.mindata[this.top - 1]);

        return value;
    }

    isMin(value)
    {
        if (this.mindata.length === 0)
        {
            return true;
        }
        return (value < this.mindata[this.top - 1])
    }

    getMin()
    {
        // check if anything is on the stack?
        if (this.top === null)
        { return null }

        return this.mindata[this.top]
    }

}



ms = new MinStack()

ms.push(210)
ms.push(39)
console.log(ms.getMin())
