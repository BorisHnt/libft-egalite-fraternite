(()=>{
  "use strict";
  const refs = {
  "ft_isalpha": "int\tft_isalpha(int c)\n{\n\treturn ((c >= 'A' && c <= 'Z') || (c >= 'a' && c <= 'z'));\n}",
  "ft_isdigit": "int\tft_isdigit(int c)\n{\n\treturn (c >= '0' && c <= '9');\n}",
  "ft_isalnum": "int\tft_isalnum(int c)\n{\n\treturn (ft_isalpha(c) || ft_isdigit(c));\n}",
  "ft_isascii": "int\tft_isascii(int c)\n{\n\treturn (c >= 0 && c <= 127);\n}",
  "ft_isprint": "int\tft_isprint(int c)\n{\n\treturn (c >= 32 && c <= 126);\n}",
  "ft_toupper": "int\tft_toupper(int c)\n{\n\tif (c >= 'a' && c <= 'z')\n\t\treturn (c - ('a' - 'A'));\n\treturn (c);\n}",
  "ft_tolower": "int\tft_tolower(int c)\n{\n\tif (c >= 'A' && c <= 'Z')\n\t\treturn (c + ('a' - 'A'));\n\treturn (c);\n}",
  "ft_strlen": "size_t\tft_strlen(const char *str)\n{\n\tsize_t\ti;\n\n\ti = 0;\n\twhile (str[i] != '\\0')\n\t\ti++;\n\treturn (i);\n}",
  "ft_strchr": "char\t*ft_strchr(const char *str, int c)\n{\n\tunsigned char\tneedle;\n\n\tneedle = (unsigned char)c;\n\twhile (*str)\n\t{\n\t\tif ((unsigned char)*str == needle)\n\t\t\treturn ((char *)str);\n\t\tstr++;\n\t}\n\tif (needle == 0)\n\t\treturn ((char *)str);\n\treturn (NULL);\n}",
  "ft_strrchr": "char\t*ft_strrchr(const char *str, int c)\n{\n\tconst char\t\t*last;\n\tunsigned char\tneedle;\n\n\tlast = NULL;\n\tneedle = (unsigned char)c;\n\twhile (1)\n\t{\n\t\tif ((unsigned char)*str == needle)\n\t\t\tlast = str;\n\t\tif (*str == '\\0')\n\t\t\tbreak ;\n\t\tstr++;\n\t}\n\treturn ((char *)last);\n}",
  "ft_strncmp": "int\tft_strncmp(const char *s1, const char *s2, size_t n)\n{\n\tsize_t\ti;\n\n\ti = 0;\n\twhile (i < n && s1[i] && s1[i] == s2[i])\n\t\ti++;\n\tif (i == n)\n\t\treturn (0);\n\treturn ((unsigned char)s1[i] - (unsigned char)s2[i]);\n}",
  "ft_bzero": "void\tft_bzero(void *s, size_t n)\n{\n\tft_memset(s, 0, n);\n}",
  "ft_memset": "void\t*ft_memset(void *dest, int c, size_t count)\n{\n\tunsigned char\t*bytes;\n\tsize_t\t\t\ti;\n\n\tbytes = (unsigned char *)dest;\n\ti = 0;\n\twhile (i < count)\n\t{\n\t\tbytes[i] = (unsigned char)c;\n\t\ti++;\n\t}\n\treturn (dest);\n}",
  "ft_memcpy": "void\t*ft_memcpy(void *dest, const void *src, size_t n)\n{\n\tunsigned char\t\t*dst;\n\tconst unsigned char\t*source;\n\tsize_t\t\t\t\ti;\n\n\tdst = (unsigned char *)dest;\n\tsource = (const unsigned char *)src;\n\ti = 0;\n\twhile (i < n)\n\t{\n\t\tdst[i] = source[i];\n\t\ti++;\n\t}\n\treturn (dest);\n}",
  "ft_memchr": "void\t*ft_memchr(const void *mblck, int schar, size_t s)\n{\n\tconst unsigned char\t*bytes;\n\tsize_t\t\t\t\ti;\n\n\tbytes = (const unsigned char *)mblck;\n\ti = 0;\n\twhile (i < s)\n\t{\n\t\tif (bytes[i] == (unsigned char)schar)\n\t\t\treturn ((void *)(bytes + i));\n\t\ti++;\n\t}\n\treturn (NULL);\n}",
  "ft_memcmp": "int\tft_memcmp(const void *s1, const void *s2, size_t n)\n{\n\tconst unsigned char\t*a;\n\tconst unsigned char\t*b;\n\tsize_t\t\t\t\ti;\n\n\ta = (const unsigned char *)s1;\n\tb = (const unsigned char *)s2;\n\ti = 0;\n\twhile (i < n)\n\t{\n\t\tif (a[i] != b[i])\n\t\t\treturn ((int)a[i] - (int)b[i]);\n\t\ti++;\n\t}\n\treturn (0);\n}",
  "ft_strdup": "char\t*ft_strdup(const char *source)\n{\n\tchar\t*copy;\n\tsize_t\tlen;\n\n\tlen = ft_strlen(source);\n\tcopy = malloc(len + 1);\n\tif (copy == NULL)\n\t\treturn (NULL);\n\tft_memcpy(copy, source, len + 1);\n\treturn (copy);\n}",
  "ft_calloc": "void\t*ft_calloc(size_t count, size_t size)\n{\n\tvoid\t*result;\n\tsize_t\ttotal;\n\n\tif (size != 0 && count > (size_t)-1 / size)\n\t\treturn (NULL);\n\ttotal = count * size;\n\tresult = malloc(total);\n\tif (result == NULL)\n\t\treturn (NULL);\n\tft_bzero(result, total);\n\treturn (result);\n}",
  "ft_strlcpy": "size_t\tft_strlcpy(char *dest, const char *src, size_t size)\n{\n\tsize_t\ti;\n\tsize_t\tsrc_len;\n\n\tsrc_len = ft_strlen(src);\n\tif (size == 0)\n\t\treturn (src_len);\n\ti = 0;\n\twhile (i < size - 1 && src[i])\n\t{\n\t\tdest[i] = src[i];\n\t\ti++;\n\t}\n\tdest[i] = '\\0';\n\treturn (src_len);\n}",
  "ft_strlcat": "size_t\tft_strlcat(char *dest, const char *src, size_t size)\n{\n\tsize_t\tdst_len;\n\tsize_t\tsrc_len;\n\tsize_t\ti;\n\n\tdst_len = 0;\n\tsrc_len = ft_strlen(src);\n\twhile (dst_len < size && dest[dst_len])\n\t\tdst_len++;\n\tif (dst_len == size)\n\t\treturn (size + src_len);\n\ti = 0;\n\twhile (i < size - dst_len - 1 && src[i])\n\t{\n\t\tdest[dst_len + i] = src[i];\n\t\ti++;\n\t}\n\tdest[dst_len + i] = '\\0';\n\treturn (dst_len + src_len);\n}",
  "ft_substr": "char\t*ft_substr(char const *s, unsigned int start, size_t len)\n{\n\tchar\t*result;\n\tsize_t\tavailable;\n\n\tif (s == NULL)\n\t\treturn (NULL);\n\tif ((size_t)start >= ft_strlen(s))\n\t\treturn (ft_strdup(\"\"));\n\tavailable = ft_strlen(s + start);\n\tif (len > available)\n\t\tlen = available;\n\tresult = malloc(len + 1);\n\tif (result == NULL)\n\t\treturn (NULL);\n\tft_memcpy(result, s + start, len);\n\tresult[len] = '\\0';\n\treturn (result);\n}",
  "ft_strjoin": "char\t*ft_strjoin(const char *s1, const char *s2)\n{\n\tchar\t*result;\n\tsize_t\ta;\n\tsize_t\tb;\n\n\tif (s1 == NULL || s2 == NULL)\n\t\treturn (NULL);\n\ta = ft_strlen(s1);\n\tb = ft_strlen(s2);\n\tif (a == (size_t)-1 || b > (size_t)-1 - a - 1)\n\t\treturn (NULL);\n\tresult = malloc(a + b + 1);\n\tif (result == NULL)\n\t\treturn (NULL);\n\tft_memcpy(result, s1, a);\n\tft_memcpy(result + a, s2, b + 1);\n\treturn (result);\n}",
  "ft_strtrim": "char\t*ft_strtrim(char const *s1, char const *set)\n{\n\tsize_t\tbegin;\n\tsize_t\tend;\n\n\tif (s1 == NULL || set == NULL)\n\t\treturn (NULL);\n\tbegin = 0;\n\twhile (s1[begin] && ft_strchr(set, s1[begin]))\n\t\tbegin++;\n\tend = ft_strlen(s1);\n\twhile (end > begin && ft_strchr(set, s1[end - 1]))\n\t\tend--;\n\treturn (ft_substr(s1, (unsigned int)begin, end - begin));\n}",
  "ft_strmapi": "char\t*ft_strmapi(char const *s, char (*f)(unsigned int, char))\n{\n\tchar\t*result;\n\tsize_t\ti;\n\n\tif (s == NULL || f == NULL)\n\t\treturn (NULL);\n\tresult = malloc(ft_strlen(s) + 1);\n\tif (result == NULL)\n\t\treturn (NULL);\n\ti = 0;\n\twhile (s[i])\n\t{\n\t\tresult[i] = f((unsigned int)i, s[i]);\n\t\ti++;\n\t}\n\tresult[i] = '\\0';\n\treturn (result);\n}",
  "ft_striteri": "void\tft_striteri(char *s, void (*f)(unsigned int, char *))\n{\n\tsize_t\ti;\n\n\tif (s == NULL || f == NULL)\n\t\treturn ;\n\ti = 0;\n\twhile (s[i])\n\t{\n\t\tf((unsigned int)i, &s[i]);\n\t\ti++;\n\t}\n}",
  "ft_putchar_fd": "void\tft_putchar_fd(char c, int fd)\n{\n\twrite(fd, &c, 1);\n}",
  "ft_putstr_fd": "void\tft_putstr_fd(char *str, int fd)\n{\n\tssize_t\twritten;\n\tsize_t\ti;\n\tsize_t\tlen;\n\n\tif (str == NULL)\n\t\treturn ;\n\ti = 0;\n\tlen = ft_strlen(str);\n\twhile (i < len)\n\t{\n\t\twritten = write(fd, str + i, len - i);\n\t\tif (written <= 0)\n\t\t\treturn ;\n\t\ti += (size_t)written;\n\t}\n}",
  "ft_putendl_fd": "void\tft_putendl_fd(char *str, int fd)\n{\n\tif (str == NULL)\n\t\treturn ;\n\tft_putstr_fd(str, fd);\n\tft_putchar_fd('\\n', fd);\n}",
  "ft_lstnew": "t_list\t*ft_lstnew(void *content)\n{\n\tt_list\t*node;\n\n\tnode = malloc(sizeof(t_list));\n\tif (node == NULL)\n\t\treturn (NULL);\n\tnode->content = content;\n\tnode->next = NULL;\n\treturn (node);\n}",
  "ft_lstadd_front": "void\tft_lstadd_front(t_list **alst, t_list *new)\n{\n\tif (alst == NULL || new == NULL)\n\t\treturn ;\n\tnew->next = *alst;\n\t*alst = new;\n}",
  "ft_lstsize": "int\tft_lstsize(t_list *lst)\n{\n\tint\tcount;\n\n\tcount = 0;\n\twhile (lst)\n\t{\n\t\tcount++;\n\t\tlst = lst->next;\n\t}\n\treturn (count);\n}",
  "ft_lstlast": "t_list\t*ft_lstlast(t_list *lst)\n{\n\tif (lst == NULL)\n\t\treturn (NULL);\n\twhile (lst->next != NULL)\n\t\tlst = lst->next;\n\treturn (lst);\n}",
  "ft_lstadd_back": "void\tft_lstadd_back(t_list **alst, t_list *new)\n{\n\tt_list\t*last;\n\n\tif (alst == NULL || new == NULL)\n\t\treturn ;\n\tif (*alst == NULL)\n\t{\n\t\t*alst = new;\n\t\treturn ;\n\t}\n\tlast = ft_lstlast(*alst);\n\tlast->next = new;\n}",
  "ft_lstdelone": "void\tft_lstdelone(t_list *lst, void (*del)(void *))\n{\n\tif (lst == NULL)\n\t\treturn ;\n\tif (del != NULL)\n\t\tdel(lst->content);\n\tfree(lst);\n}",
  "ft_lstclear": "void\tft_lstclear(t_list **lst, void (*del)(void *))\n{\n\tt_list\t*next;\n\n\tif (lst == NULL || del == NULL)\n\t\treturn ;\n\twhile (*lst != NULL)\n\t{\n\t\tnext = (*lst)->next;\n\t\tft_lstdelone(*lst, del);\n\t\t*lst = next;\n\t}\n}",
  "ft_lstiter": "void\tft_lstiter(t_list *lst, void (*f)(void *))\n{\n\tif (f == NULL)\n\t\treturn ;\n\twhile (lst != NULL)\n\t{\n\t\tf(lst->content);\n\t\tlst = lst->next;\n\t}\n}"
};
  const examples = {
  "ft_strlen": "char\t*text = \"Liberté\";\nsize_t\tn = ft_strlen(text);\n/* n = 8 en UTF-8 : é occupe 2 octets. */",
  "ft_memcpy": "char\tsource[] = \"abcd\";\nchar\tdest[5];\n\nft_memcpy(dest, source, sizeof(source));\n/* dest = \"abcd\" (y compris le NUL final). */",
  "ft_strlcpy": "char\tdest[4];\nsize_t\tn;\n\nn = ft_strlcpy(dest, \"salut\", sizeof(dest));\n/* dest = \"sal\" et n = 5 : troncature. */",
  "ft_isdigit": "int\tok;\n\nok = ft_isdigit('7');\n/* ok = 1 ; ft_isdigit(7) renvoie 0. */",
  "ft_lstnew": "t_list\t*node;\n\nnode = ft_lstnew(NULL);\n/* node->content == NULL et node->next == NULL. */"
};
  if (!Array.isArray(window.MANUAL)) return;
  for (const entry of window.MANUAL) {
    if (refs[entry.name]) entry.ref = refs[entry.name];
    if (examples[entry.name]) entry.example = examples[entry.name];
  }
})();
