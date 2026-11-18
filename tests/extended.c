#include "libft.h"
#include <assert.h>
#include <limits.h>
#include <stdio.h>
#include <string.h>

static int	sign(int x)
{
	return ((x > 0) - (x < 0));
}

static void	test_characters(void)
{
	int	i;

	i = -10;
	while (i < 260)
	{
		assert(!!ft_isalpha(i) == ((i >= 'a' && i <= 'z')
				|| (i >= 'A' && i <= 'Z')));
		assert(!!ft_isdigit(i) == (i >= '0' && i <= '9'));
		assert(!!ft_isalnum(i) == (!!ft_isalpha(i) || !!ft_isdigit(i)));
		assert(!!ft_isascii(i) == (i >= 0 && i < 128));
		assert(!!ft_isprint(i) == (i >= 32 && i <= 126));
		assert(ft_toupper(i) == ((i >= 'a' && i <= 'z') ? i - 32 : i));
		assert(ft_tolower(i) == ((i >= 'A' && i <= 'Z') ? i + 32 : i));
		i++;
	}
}

static void	test_memory(void)
{
	unsigned char	a[64];
	unsigned char	b[64];
	unsigned char	src[64];
	size_t			i;
	size_t			n;

	i = 0;
	while (i < sizeof(src))
	{
		src[i] = (unsigned char)(i * 11u);
		i++;
	}
	n = 0;
	while (n <= sizeof(src))
	{
		memset(a, 0x55, sizeof(a));
		memset(b, 0x55, sizeof(b));
		assert(ft_memcpy(a, src, n) == a);
		memcpy(b, src, n);
		assert(memcmp(a, b, sizeof(a)) == 0);
		assert(ft_memcmp(a, b, n) == 0);
		assert(ft_memchr(src, src[n ? n - 1 : 0], 0) == NULL);
		ft_memset(a, 0xAB, n);
		memset(b, 0xAB, n);
		assert(memcmp(a, b, sizeof(a)) == 0);
		ft_bzero(a, n);
		memset(b, 0, n);
		assert(memcmp(a, b, sizeof(a)) == 0);
		n++;
	}
	assert(ft_memchr(src, src[23], 24) == src + 23);
	assert(ft_memcmp("a\0b", "a\0c", 3) < 0);
	assert(ft_memcmp("x", "x", 0) == 0);
}

static void	test_memmove_overlap(void)
{
	unsigned char	a[64];
	unsigned char	b[64];
	int				src;
	int				dst;
	int				n;
	int				k;

	src = 0;
	while (src <= 31)
	{
		dst = 0;
		while (dst <= 31)
		{
			n = 0;
			while (n <= 32)
			{
				k = -1;
				while (++k < 64)
					a[k] = (unsigned char)k;
				memcpy(b, a, sizeof(a));
				assert(ft_memmove(a + dst, a + src, (size_t)n) == a + dst);
				memmove(b + dst, b + src, (size_t)n);
				assert(memcmp(a, b, sizeof(a)) == 0);
				n++;
			}
			dst++;
		}
		src++;
	}
}

static void	test_strings(void)
{
	const char	*values[] = {"", "a", "ab", "abc", "abd", "abcxyz"};
	int			i;
	int			j;
	size_t		n;
	char		out[20];

	i = 0;
	while (i < 6)
	{
		assert(ft_strlen(values[i]) == strlen(values[i]));
		j = 0;
		while (j < 6)
		{
			n = 0;
			while (n < 9)
			{
				assert(sign(ft_strncmp(values[i], values[j], n))
					== sign(strncmp(values[i], values[j], n)));
				n++;
			}
			j++;
		}
		i++;
	}
	assert(ft_strchr("banana", 'a') != NULL);
	assert(ft_strrchr("banana", 'a') != NULL);
	assert(ft_strchr("banana", 'x') == NULL);
	assert(ft_strchr("banana", 0) == "banana" + 6 || 
		*ft_strchr("banana", 0) == '\0');
	assert(ft_strnstr("bonjour", "jour", 7) != NULL);
	assert(ft_strnstr("bonjour", "jour", 5) == NULL);
	assert(ft_strnstr("bonjour", "", 0) != NULL);
	n = 0;
	while (n < 13)
	{
		memset(out, '?', sizeof(out));
		assert(ft_strlcpy(out, "bonjour", n) == 7);
		if (n > 0)
		{
			assert(out[n < 8 ? n - 1 : 7] == '\0');
			assert(strncmp(out, "bonjour", n < 8 ? n - 1 : 7) == 0);
		}
		n++;
	}
}

static void	test_strlcat(void)
{
	char	b[30];
	size_t	n;
	size_t	expected;

	n = 0;
	while (n < 16)
	{
		memset(b, '?', sizeof(b));
		b[0] = 'a';
		b[1] = 'b';
		b[2] = '\0';
		expected = (n <= 2) ? n + 4 : 6;
		assert(ft_strlcat(b, "cdef", n) == expected);
		if (n > 2)
		{
			assert(strncmp(b, "abcdef", (n - 1 < 6) ? n - 1 : 6) == 0);
			assert(b[n < 7 ? n - 1 : 6] == '\0');
		}
		else
			assert(strcmp(b, "ab") == 0);
		n++;
	}
}

static void	test_allocations(void)
{
	char	*a;
	char	*b;
	char	**words;
	int		nums[] = {0, -1, 1, INT_MIN, INT_MAX, 42, -1000};
	size_t	i;
	char	expected[40];

	a = ft_strdup("hello");
	assert(a && strcmp(a, "hello") == 0 && a != "hello");
	free(a);
	a = ft_substr("012345", 2, 3);
	assert(a && strcmp(a, "234") == 0);
	free(a);
	a = ft_substr("hi", 99, 10);
	assert(a && strcmp(a, "") == 0);
	free(a);
	a = ft_strtrim("\t-abc-\t", "\t-");
	assert(a && strcmp(a, "abc") == 0);
	free(a);
	a = ft_strtrim("xxxx", "x");
	assert(a && strcmp(a, "") == 0);
	free(a);
	a = ft_strjoin("hello", "world");
	assert(a && strcmp(a, "helloworld") == 0);
	free(a);
	i = 0;
	while (i < sizeof(nums) / sizeof(nums[0]))
	{
		a = ft_itoa(nums[i]);
		snprintf(expected, sizeof(expected), "%d", nums[i]);
		assert(a && strcmp(a, expected) == 0);
		free(a);
		i++;
	}
	assert(ft_atoi(" +2147483647abc") == INT_MAX);
	assert(ft_atoi(" -2147483648x") == INT_MIN);
	b = ft_calloc(7, 1);
	assert(b != NULL);
	i = 0;
	while (i < 7)
		assert(b[i++] == 0);
	free(b);
	assert(ft_calloc((size_t)-1, 2) == NULL);
	words = ft_split(",a,,bc,", ',');
	assert(words && words[0] && words[1] && !words[2]);
	assert(strcmp(words[0], "a") == 0);
	assert(strcmp(words[1], "bc") == 0);
	free(words[0]);
	free(words[1]);
	free(words);
	words = ft_split(",,,", ',');
	assert(words && !words[0]);
	free(words);
}

static char	letter_plus_index(unsigned int i, char c)
{
	return (char)(c + (char)(i % 2u));
}

static void	change_letter(unsigned int i, char *c)
{
	*c = (char)(*c + (char)(i % 2u));
}

static void	test_callbacks(void)
{
	char	buf[] = "aaa";
	char	*copy;

	copy = ft_strmapi(buf, letter_plus_index);
	assert(copy && strcmp(copy, "aba") == 0);
	assert(strcmp(buf, "aaa") == 0);
	free(copy);
	ft_striteri(buf, change_letter);
	assert(strcmp(buf, "aba") == 0);
}

static void	*clone_plus_one(void *p)
{
	int	*result;

	result = malloc(sizeof(int));
	if (result != NULL)
		*result = *(int *)p + 1;
	return (result);
}

static void	test_lists(void)
{
	t_list	*head;
	t_list	*next;
	t_list	*mapped;
	int		*a;
	int		*b;

	a = malloc(sizeof(int));
	b = malloc(sizeof(int));
	assert(a && b);
	*a = 7;
	*b = 8;
	head = ft_lstnew(a);
	next = ft_lstnew(b);
	assert(head && next);
	ft_lstadd_front(&head, next);
	assert(ft_lstsize(head) == 2);
	assert(ft_lstlast(head)->content == a);
	mapped = ft_lstmap(head, clone_plus_one, free);
	assert(mapped && mapped->next);
	assert(*(int *)mapped->content == 9);
	assert(*(int *)mapped->next->content == 8);
	ft_lstclear(&mapped, free);
	assert(mapped == NULL);
	ft_lstclear(&head, free);
	assert(head == NULL);
}

int	main(void)
{
	test_characters();
	test_memory();
	test_memmove_overlap();
	test_strings();
	test_strlcat();
	test_allocations();
	test_callbacks();
	test_lists();
	puts("Extended Libft reference checks passed.");
	return (0);
}
