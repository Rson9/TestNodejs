#include <iostream>
using namespace std;
int main()
{
	int d = 0;
	int f[100010] = {1, 1};
	int p[100010];
	int n;
	cin >> n;
	for (int i = 2; i <= n; i++)
	{
		if (f[i] == 0)
		{ // 如果没被标记过，那么i是质数
			p[d++] = i;
		}
		for (int j = 0; j < d; j++)
		{
			if (p[j] * i <= n)
			{ // 标记以i为最大因数的数为不是素数（除了1和本身）
				f[p[j] * i] = 1;
			}
			else
			{
				break;
			}
			if (i % p[j] == 0)
			{ // 如果p[j]是i的因数，那么后面的数都不是以i为最大因数的
				break;
			}
		}
	}

	for (int i = 0; i < d; i++)
	{ // 打印1到n的质数
		cout << p[i] << " \n"[i == d - 1];
	}
}