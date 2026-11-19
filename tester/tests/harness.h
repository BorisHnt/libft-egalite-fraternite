#ifndef LIBFT_TESTER_HARNESS_H
# define LIBFT_TESTER_HARNESS_H
# include <stdio.h>
# include <stdlib.h>
# include <stdint.h>
# include <string.h>
# include <limits.h>
# include <unistd.h>
# include <errno.h>
# include <sys/types.h>
# include <sys/wait.h>
# include <sys/resource.h>
# include <signal.h>
# include <time.h>
# include "libft.h"

extern int g_mode;
extern unsigned long long g_seed;
void run_test(const char *label, void (*test)(void));
unsigned int rnd_u32(void);
void tester_fail(const char *expr, const char *file, int line);

# define EXPECT(x) do { if (!(x)) tester_fail(#x,__FILE__,__LINE__); } while (0)
# define CASE(label,func) run_test(label,func)
# define NLOOPS(normal,strict,hardcore) (g_mode==0?(normal):g_mode==1?(strict):(hardcore))

#endif
