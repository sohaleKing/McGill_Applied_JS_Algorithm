function recSearch(arr, l, r, x)
{
    if (r < l)
        return -1;
    if (arr[l] === x)
        return l;
    if (arr[r] === x)
        return r;
    return recSearch(arr, l+1, r-1, x);
}

// Driver Code
let arr = [12, 34, 2, 2, 3];
let i;
let n = arr.length;
let x = 2;
let index = recSearch(arr, 0, n - 1, x);

if (index !== -1){
    console.log(`Element ${x} is present at index ${index}`);
}
else{
    console.log("Element is not present " + x);
}



