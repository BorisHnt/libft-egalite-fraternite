#include <limits.h>
#include <stddef.h>
#include <stdio.h>
#include <stdlib.h>
#include "libft.h"

void fault_malloc_at(int nth);
size_t fault_last_requested(void);

int main(void)
{
    const int values[] = {-422, 0, INT_MIN};
    const size_t required[] = {5, 2, 12};
    size_t i;

    for (i = 0; i < sizeof(values) / sizeof(values[0]); i++)
    {
        char *p;
        size_t requested;

        fault_malloc_at(0);
        p = ft_itoa(values[i]);
        requested = fault_last_requested();
        if (p == NULL)
            return 1;
        free(p);
        printf("%zu\t%zu\n", requested, required[i]);
    }
    return 0;
}
