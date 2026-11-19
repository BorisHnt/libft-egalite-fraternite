#define _POSIX_C_SOURCE 200809L
#include "harness.h"

int g_mode = 0;
unsigned long long g_seed = 42;
static int g_count = 0;

unsigned int rnd_u32(void)
{
    g_seed ^= g_seed << 13;
    g_seed ^= g_seed >> 7;
    g_seed ^= g_seed << 17;
    return (unsigned int)(g_seed >> 16);
}

void tester_fail(const char *expr, const char *file, int line)
{
    fprintf(stderr, "Expression non respectée : %s (%s:%d)\n", expr, file, line);
    fflush(stderr);
    _exit(22);
}

static void duration_limit(void)
{
    struct rlimit core;
    struct rlimit mem;
    core.rlim_cur = 0;
    core.rlim_max = 0;
    (void)setrlimit(RLIMIT_CORE, &core);
    /* 512 MiB for normal tests; Valgrind/ASan reserve much larger virtual address spaces. */
    if (getenv("LIBFT_TEST_SANITIZE") == NULL)
    {
        mem.rlim_cur = 512U * 1024U * 1024U;
        mem.rlim_max = 512U * 1024U * 1024U;
        (void)setrlimit(RLIMIT_AS, &mem);
    }
}

void run_test(const char *label, void (*test)(void))
{
    pid_t pid;
    FILE *logfile;
    int status = 0;
    int finished = 0;
    int waited = 0;
    char detail[320];
    size_t bytes;
    struct timespec pause = {0, 10000000};
    int max_ticks = g_mode == 2 ? 1000 : 400;

    ++g_count;
    logfile = tmpfile();
    if (!logfile)
    {
        printf("FAIL\t%s\ttmpfile impossible\n",label);
        fflush(stdout);
        return;
    }
    pid = fork();
    if (pid < 0)
    {
        fclose(logfile);
        printf("FAIL\t%s\tfork impossible\n",label);
        fflush(stdout);
        return;
    }
    if (pid == 0)
    {
        (void)dup2(fileno(logfile), STDERR_FILENO);
        fclose(logfile);
        duration_limit();
        test();
        /* exit (not _exit) runs LeakSanitizer exit-time leak checks. */
        exit(0);
    }
    while (waited < max_ticks)
    {
        pid_t w = waitpid(pid, &status, WNOHANG);
        if (w == pid) {finished = 1;break;}
        if (w < 0) break;
        nanosleep(&pause, NULL);
        ++waited;
    }
    if (!finished)
    {
        kill(pid,SIGKILL);
        (void)waitpid(pid,&status,0);
    }
    memset(detail,0,sizeof(detail));
    rewind(logfile);
    bytes = fread(detail,1,sizeof(detail)-1,logfile);
    fclose(logfile);
    if (bytes > 0)
    {
        size_t i;
        for (i=0;i<(size_t)bytes;i++)
            if (detail[i]=='\n' || detail[i]=='\r' || detail[i]=='\t') detail[i]=' ';
    }
    if (!finished)
        printf("FAIL\t%s\tTimeout ou erreur d'attente\n",label);
    else if (WIFSIGNALED(status))
        printf("FAIL\t%s\tSignal %d : %s\n",label,WTERMSIG(status),detail);
    else if (WIFEXITED(status) && WEXITSTATUS(status) == 0)
        printf("PASS\t%s\tOK\n",label);
    else
        printf("FAIL\t%s\t%s\n",label,detail[0]?detail:"Code de sortie non nul");
    fflush(stdout);
}

/* Defined only by a single selected suite module. */
void test_suite(void);
int main(int argc,char **argv)
{
    if (argc >= 2) g_mode = atoi(argv[1]);
    if (argc >= 3) g_seed = strtoull(argv[2],NULL,10);
    if (!g_seed) g_seed = 42;
    test_suite();
    return (0);
}
