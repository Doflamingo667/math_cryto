#include <iostream>

using namespace std;
int power(int base, int expo, int m){
    int result = 1;
    base = base % m;

    while(expo > 0){
        if(expo & 1){
            result = (base * result) % m;
        }
        // Base square
        base = (base * base) % m;
        expo = expo / 2;
    }
    return result;
}


int main(){

    cout << power(3, 5, 7);

    return 0;
}

