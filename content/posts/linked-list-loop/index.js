function detectCycle(A) {
    let unset = new Set()
    let ptr = A

    while(ptr !== null) {
        if(unset.has(ptr)) {
            return ptr
        }
        else {
            unset.add(ptr)
        }
        ptr = ptr.next
    }
    return null
}