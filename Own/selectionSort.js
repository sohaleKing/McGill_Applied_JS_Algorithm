const selectionSort = (arr) => {
   let len = arr.length;
   let position, i, smallest, temp;
   //sorted part of the array - Initially is unsorted
   for(position = 0; position < len - 1; position++) {
       smallest = position
       //unsorted part of the array -- the inner loop is over the unsorted elements
       for(i = position + 1; i < len; i++) {
        if(arr[i] < arr[smallest]) {
            //select the lowest element in the remaining array
            smallest = i;
        }
       }
       // swapping - bringing it to the starting position
       if (smallest !== position) {
           temp = arr[position];
           arr[position] = arr[smallest];
           arr[smallest] = temp
       }
   }
   return arr
}

const array1 = [8, 4, 6, 9, 2, 3, 1]; //Random Array
const array2 = [5, 20, 132, 10, 8, 5, 4, 12, 10, 22, 33, 12, 5, 33, 12, 33, 20, 12, 100, 1, 0];  //long Array
const array3 = [1, 3, 5, 10 , 12];  //Ascending Order
const array4 = [12, 10, 5, 3, 1];   //Descending Order

console.log("array1 with 7 elements = ", selectionSort(array1))
console.log("========================");
console.log("array2 with 21 elements = ", selectionSort(array1))
console.log("========================");
console.log("array3 with 5 elements = ", selectionSort(array1), "this array has 5 elements all Ascending sorted its the base case but we need " +
    "to go through the array O(n^2) as a time complexity since we have two for loop which is and 5 elements the running time isO(25) ")
console.log("========================");
console.log("array4 with 5 elements = ", selectionSort(array1), "this array has 5 elements so the has O(25) running time")
console.log("========================");

/* very simple and easy to implement, it searches the smallest value number and placing it into the first position
(Ascending) - we are using this technique with two loops, so its always the running complexity O(n^2) even if we have
a sorted one already we still needs to go there! so Selection sort' best and worst case time complexity are the same
but in insertion sort you will go through the inner loop only if its not sorted so in the best case when the array is
already sorted would be only O(n), The inner loop will be aborted even sooner if the array is almost sorted, in average
would be (n^2)/2 and the worst case O(n^2)
================================================================
Insertion sort:
    take the first element of the unsorted list, and then do compare and swap in the sorted list to make
 sure the element goes to the right position, the effort is mostly in step #2 for insertion
 @ Insertion sort you do not swap things. Even though it make use of a temp variable,
 The point of making use of temp var is when we found a value at an index to be less compared
 to the value to its previous index, we shift the greater value to the place of lesser value's
 index which would over write things.
Selection sort:
    compare and mark the smallest element of the unsorted list, and then swap it with the first element of the unsorted list,
     actually include this element as part of the sorted list - the effort is mostly in step #1 for selection
therefore Selection sort incrementally adds an element to the end by finding the minimum element in the unsorted section.
Insertion sort propagates the first element found in the unsorted section into anywhere in the sorted section.
they
=========================================================================
insertion sort time complexity = O(n^2)
space they are using one array (n for the elements)
best-case performance O(n) comparisons O(1) swap
average O(n^2) or you can divide that in 2 also since you are between n and n2  so n^2/2
worst case space complexity O(n) total
**********
selection sort
always(worst case, best case, average) O(n^2)
space ----> O(1)
 */