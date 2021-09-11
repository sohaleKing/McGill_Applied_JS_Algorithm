/*
* s, d, e represents three pegs (source, destination and extra).
* n is number of discs (All initially in s)
*/

resolver_tower_of_hanoi = function (s, d, e, n) {

    // terminating condition
    if (n <= 0) {
        return
    }

    resolver_tower_of_hanoi(s, e, d, n - 1)

    console.log(`Move Disk-${n} FROM ${s} TO ${d}`);

    resolver_tower_of_hanoi(e, d, s, n - 1);
}

resolver_tower_of_hanoi('s', 'd', 'e', 1)