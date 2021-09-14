let stack = ["A", "B", "C"]
let len = stack.length;


let _reverse = (index) => {
    if(index !==0 ) {
        _reverse(index - 1)
    }
    console.log(stack[index])
}
let reverse = () => {
    _reverse(len - 1)
}

console.log(reverse())