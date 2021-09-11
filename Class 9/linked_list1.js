class Node {

    constructor(element) {
        this.element = element
        this.next = null
    }
}

class LinkedList {
    constructor() {
        this.head = null
        this.size = 0;
    }

    isEmpty()
    {
        return this.size === 0;
    }

    get length()
    {
        return this.size
    }

    add(element) {
        let node = new Node(element)

        let current;

        if (this.head == null) {
            this.head = node;
        } else {
            current = this.head
            while (current.next) {
                current = current.next
            }

            current.next = node
        }

        this.size++;
    }

    remove(element)
    {
        let current = this.head;
        let prev = null;

        while(current != null)
        {
            if (current.element === element)
            {
                if (prev == null)
                {
                    this.head = current.next
                }
                else
                {
                    prev.next = current.next
                }
                this.size--
                return current.element
            }
            prev = current
            current = current.next
        }
        return -1
    }
}


ll = new LinkedList();
ll.add("A")
ll.add("B")
ll.add("C")
ll.remove("B")

