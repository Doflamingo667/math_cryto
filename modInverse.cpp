#include <iostream>

using namespace std;

int modInverse(int A, int M){
    for(int x = 1; x < M; x++){
        if(((A % M) * (x % M)) % M == 1){
            return x;
        }
    }
    return -1;
}


int modInverse_2(int A,int M){
    int x = 1, y = 0;
    int m0 = M;

    if(M == 1){
        return 0;
    }

    while(A > 1){
        int q = A / M;
        int t = M;

        //Apply Euclidean's algorithms.
        M = A % M; // Now M is the new remaider.
        A = t;   // Update A = M by t
        t = y;   // 

        //Create the equation.
        y = x - q * y;
        x = t;
    }
    if(x < 0){
        x += m0;
    }
    return x;
}

int main(){

    cout << modInverse_2(7, 40);
    cout << endl;
    cout << modInverse(7, 40);

    return 0;
}