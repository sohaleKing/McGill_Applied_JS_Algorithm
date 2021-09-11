let dict = {
    "1": {
        "1.1": ["a", "b", "c"],
        "1.2": ["d", "e", "f"]
    },
    "2": {"2.1": ["g", "h", "i"]},
    "3": {"3.1": ["j"]}
}


function isDict(v) {
    return typeof v==='object' && v!==null && !(v instanceof Array) && !(v instanceof Date);
}

function recurse(dict)
{
    for (const[key, value] of Object.entries(dict) )
    {
        if (isDict(value))
        {

            recurse(value)
        }
        else
        {
            console.log (key)
            //console.log(value)
        }
    }
}

recurse(dict)
