#include "libft.h"
#include <assert.h>
#include <limits.h>
#include <stdio.h>
#include <string.h>

static void	*increment_copy(void *ptr)
{
	int	*value;

	value = malloc(sizeof(int));
	if (value != NULL)
		*value = *(int *)ptr + 1;
	return (value);
}

int	main(void)
{
	char			dest[16];
	char			overlap[8];
	char			expected[32];
	char			**words;
	char			*integer;
	unsigned char	*zero;
	t_list			*head;
	t_list			*mapped;
	int				number;

	assert(ft_strlen("chat") == 4);
	assert(ft_isalpha('z') && !ft_isalpha('2'));
	assert(ft_isdigit('2') && !ft_isdigit(2));
	assert(ft_strncmp("abc", "abd", 2) == 0);
	assert(ft_strncmp("abc", "abd", 3) < 0);
	assert(ft_strchr("abc", '\0') == "abc" + 3);
	assert(ft_strnstr("bonjour", "jour", 7) != NULL);
	assert(ft_strnstr("bonjour", "jour", 5) == NULL);
	memset(dest, 'x', sizeof(dest));
	assert(ft_strlcpy(dest, "bonjour", 4) == 7);
	assert(strcmp(dest, "bon") == 0);
	memset(dest, 'x', sizeof(dest));
	assert(ft_strlcat(dest, "fin", 3) == 6);
	assert(ft_strlcpy(dest, "ab", sizeof(dest)) == 2);
	assert(ft_strlcat(dest, "cd", sizeof(dest)) == 4);
	assert(strcmp(dest, "abcd") == 0);
	strcpy(overlap, "abcdef");
	ft_memmove(overlap + 1, overlap, 5);
	assert(strcmp(overlap, "aabcde") == 0);
	zero = ft_calloc(4, 1);
	assert(zero != NULL);
	assert(zero[0] == 0 && zero[3] == 0);
	free(zero);
	assert(ft_calloc((size_t)-1, 2) == NULL);
	assert(ft_atoi(" \t-42a") == -42);
	integer = ft_itoa(INT_MIN);
	assert(integer != NULL);
	snprintf(expected, sizeof(expected), "%d", INT_MIN);
	assert(strcmp(integer, expected) == 0);
	free(integer);
	words = ft_split("a,,bc,", ',');
	assert(words != NULL && words[0] != NULL);
	assert(strcmp(words[0], "a") == 0);
	assert(strcmp(words[1], "bc") == 0);
	assert(words[2] == NULL);
	free(words[0]);
	free(words[1]);
	free(words);
	number = 42;
	head = ft_lstnew(&number);
	assert(head != NULL);
	mapped = ft_lstmap(head, increment_copy, free);
	assert(mapped != NULL && *(int *)mapped->content == 43);
	ft_lstclear(&mapped, free);
	ft_lstdelone(head, NULL);
	puts("Tests de fumée Libft réussis.");
	return (0);
}
