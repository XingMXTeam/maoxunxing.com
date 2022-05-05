// function hasPair(node, target) {
//     let a1 = []
//     // 这个是排序后的数组
//     let a2 = treeToList(node, a1)
//     let start = 0
//     let end = a2.length - 1
//     while(start < end) {
//         if(a2[start] + a2[end] == target) {
//             return true
//         }
//         if(a2[start] + a2[end] > target) {
//             end--
//         }
//         if(a2[start] + a2[end] < target) {
//             start++
//         }
//     }
//     return false
// }

function hasPair(node, val) {
    let s1 = createStack(100)
    let s2 = createStack(100)

    let done1 = false;
    let done2 = false;
    let val1 = 0;
    let val2 = 0
    let cur1 = root
    let cur2 = root

    while(true) {
        // 正常中序遍历
        while (done1 == false)
        {
            if (curr1 != null)
            {
                push(s1, curr1);
                curr1 = curr1.left;
            }
            else
            {
                if (isEmpty(s1) == 1)
                    done1 = true;
                else
                {
                    curr1 = pop(s1);
                    val1 = curr1.val;
                    curr1 = curr1.right;
                    done1 = true;
                }
            }
        }

        // 逆序中序遍历
        while (done2 == false)
        {
            if (curr2 != null)
            {
                push(s2, curr2);
                curr2 = curr2.right;
            }
            else {
                if (isEmpty(s2) == 1)
                    done2 = true;
                else {
                    curr2 = pop(s2);
                    val2 = curr2.val;
                    curr2 = curr2.left;
                    done2 = true;
                }
            }
        }

        if ((val1 != val2) && (val1 + val2) == target)
        {
            return true;
        }
        else if ((val1 + val2) < target)
            done1 = false;
        else if ((val1 + val2) > target)
            done2 = false;
        
        if (val1 >= val2)
            return false;

    }
}