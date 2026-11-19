/* This file is a build-time contract check, not part of the student's code. */
#include "libft.h"

int main(void)
{
    int (*isalpha_)(int) = &ft_isalpha;
    int (*isdigit_)(int) = &ft_isdigit;
    int (*isalnum_)(int) = &ft_isalnum;
    int (*isascii_)(int) = &ft_isascii;
    int (*isprint_)(int) = &ft_isprint;
    int (*toupper_)(int) = &ft_toupper;
    int (*tolower_)(int) = &ft_tolower;
    size_t (*strlen_)(const char *) = &ft_strlen;
    void *(*memset_)(void *, int, size_t) = &ft_memset;
    void (*bzero_)(void *, size_t) = &ft_bzero;
    void *(*memcpy_)(void *, const void *, size_t) = &ft_memcpy;
    void *(*memmove_)(void *, const void *, size_t) = &ft_memmove;
    size_t (*strlcpy_)(char *, const char *, size_t) = &ft_strlcpy;
    size_t (*strlcat_)(char *, const char *, size_t) = &ft_strlcat;
    char *(*strchr_)(const char *, int) = &ft_strchr;
    char *(*strrchr_)(const char *, int) = &ft_strrchr;
    int (*strncmp_)(const char *, const char *, size_t) = &ft_strncmp;
    void *(*memchr_)(const void *, int, size_t) = &ft_memchr;
    int (*memcmp_)(const void *, const void *, size_t) = &ft_memcmp;
    char *(*strnstr_)(const char *, const char *, size_t) = &ft_strnstr;
    int (*atoi_)(const char *) = &ft_atoi;
    void *(*calloc_)(size_t, size_t) = &ft_calloc;
    char *(*strdup_)(const char *) = &ft_strdup;
    char *(*substr_)(const char *, unsigned int, size_t) = &ft_substr;
    char *(*strjoin_)(const char *, const char *) = &ft_strjoin;
    char *(*strtrim_)(const char *, const char *) = &ft_strtrim;
    char **(*split_)(const char *, char) = &ft_split;
    char *(*itoa_)(int) = &ft_itoa;
    char *(*strmapi_)(const char *, char (*)(unsigned int, char)) = &ft_strmapi;
    void (*striteri_)(char *, void (*)(unsigned int, char *)) = &ft_striteri;
    void (*putchar_fd_)(char, int) = &ft_putchar_fd;
    void (*putstr_fd_)(char *, int) = &ft_putstr_fd;
    void (*putendl_fd_)(char *, int) = &ft_putendl_fd;
    void (*putnbr_fd_)(int, int) = &ft_putnbr_fd;
    t_list *(*lstnew_)(void *) = &ft_lstnew;
    void (*lstadd_front_)(t_list **, t_list *) = &ft_lstadd_front;
    int (*lstsize_)(t_list *) = &ft_lstsize;
    t_list *(*lstlast_)(t_list *) = &ft_lstlast;
    void (*lstadd_back_)(t_list **, t_list *) = &ft_lstadd_back;
    void (*lstdelone_)(t_list *, void (*)(void *)) = &ft_lstdelone;
    void (*lstclear_)(t_list **, void (*)(void *)) = &ft_lstclear;
    void (*lstiter_)(t_list *, void (*)(void *)) = &ft_lstiter;
    t_list *(*lstmap_)(t_list *, void *(*)(void *), void (*)(void *)) = &ft_lstmap;
    t_list node = {0};
    (void)isalpha_;(void)isdigit_;(void)isalnum_;(void)isascii_;
    (void)isprint_;(void)toupper_;(void)tolower_;(void)strlen_;
    (void)memset_;(void)bzero_;(void)memcpy_;(void)memmove_;
    (void)strlcpy_;(void)strlcat_;(void)strchr_;(void)strrchr_;
    (void)strncmp_;(void)memchr_;(void)memcmp_;(void)strnstr_;
    (void)atoi_;(void)calloc_;(void)strdup_;(void)substr_;
    (void)strjoin_;(void)strtrim_;(void)split_;(void)itoa_;
    (void)strmapi_;(void)striteri_;(void)putchar_fd_;
    (void)putstr_fd_;(void)putendl_fd_;(void)putnbr_fd_;
    (void)lstnew_;(void)lstadd_front_;(void)lstsize_;(void)lstlast_;
    (void)lstadd_back_;(void)lstdelone_;(void)lstclear_;
    (void)lstiter_;(void)lstmap_;
    node.content = 0;
    node.next = 0;
    return (node.content != 0 || node.next != 0);
}
