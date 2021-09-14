let f = () => {
    let z= 100
    let g =() => {
        return z
    }
    return g
}
let p = f();
console.log(p)
let q = p();
console.log(q)