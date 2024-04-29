#include <bits/stdc++.h>
using namespace std;
void min_heap(int index, int* heap, int size)
{
    int least = index;
    int left = (2 * index) + 1;
    int right = left + 1;
    if (left < size && heap[left] < heap[least])
    {
        least = left;
    }
    if (right < size && heap[right] < heap[least])
    {
        least = right;
    }
    if (least != index)
    {
        swap(heap[least], heap[index]);
        min_heap(least, heap, size);
    }
}
void start_sort(int size, int* heap)
{
    for (int i = (size - 1) / 2; i >= 0; --i)
    {
        min_heap(i, heap, size);
    }
}
int main(){
    int test[10] = {12,6,5,4,0,99,3,20,9,32};
    int size = 10;
    start_sort(size,test);
    while(size > 1){  
         swap(test[0],test[size-1]);
         min_heap(0,test,--size);
    }
    for(auto i:test) cout << i << " ";
}