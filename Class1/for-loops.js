array1 = ["A", "B", "C", "D"]

// By index
for (let currentIndex in array1) {
    //console.log(currentIndex)
    console.log(array1[currentIndex])
}

// By object
for (let currentItem of array1)
{
    console.log(currentItem)
}