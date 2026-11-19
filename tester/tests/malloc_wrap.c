#include <stddef.h>

/* GNU ld --wrap=malloc: only relocations from tested object files are
   intercepted. No system-wide allocation interception is claimed. */
static int fail_at = -1;
static int call_number = 0;
static size_t last_requested = 0;
extern void *__real_malloc(size_t size);

void fault_malloc_at(int nth)
{
    fail_at = nth;
    call_number = 0;
    last_requested = 0;
}

void fault_malloc_disable(void)
{
    fail_at = -1;
    call_number = 0;
    last_requested = 0;
}

size_t fault_last_requested(void)
{
    return last_requested;
}

void *__wrap_malloc(size_t size)
{
    last_requested = size;
    call_number++;
    if (fail_at > 0 && call_number == fail_at)
        return NULL;
    return __real_malloc(size);
}
