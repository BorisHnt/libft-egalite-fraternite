#include "harness.h"

void fault_malloc_at(int nth);
void fault_malloc_disable(void);

#if defined(TEST_ft_itoa)
static void check(void) {
    fault_malloc_at(1);char *s=ft_itoa(42);fault_malloc_disable();
    EXPECT(s==NULL);
}
void test_suite(void){CASE("Échec du premier malloc : retourne NULL",check);}
#elif defined(TEST_ft_strdup)
static void check(void) {
    fault_malloc_at(1);char *s=ft_strdup("hello");fault_malloc_disable();
    EXPECT(s==NULL);
}
void test_suite(void){CASE("Échec du premier malloc : retourne NULL",check);}
#elif defined(TEST_ft_substr)
static void check(void) {
    fault_malloc_at(1);char *s=ft_substr("bonjour",1,3);fault_malloc_disable();
    EXPECT(s==NULL);
}
void test_suite(void){CASE("Échec du premier malloc : retourne NULL",check);}
#elif defined(TEST_ft_strjoin)
static void check(void) {
    fault_malloc_at(1);char *s=ft_strjoin("bonjour","test");fault_malloc_disable();
    EXPECT(s==NULL);
}
void test_suite(void){CASE("Échec du premier malloc : retourne NULL",check);}
#elif defined(TEST_ft_strtrim)
static void check(void) {
    fault_malloc_at(1);char *s=ft_strtrim("  hello  "," ");fault_malloc_disable();
    EXPECT(s==NULL);
}
void test_suite(void){CASE("Échec du premier malloc : retourne NULL",check);}
#elif defined(TEST_ft_strmapi)
static char unchanged(unsigned int i,char c){(void)i;return c;}
static void check(void) {
    fault_malloc_at(1);char *s=ft_strmapi("hello",unchanged);fault_malloc_disable();
    EXPECT(s==NULL);
}
void test_suite(void){CASE("Échec du premier malloc : retourne NULL",check);}
#elif defined(TEST_ft_calloc)
static void check(void) {
    fault_malloc_at(1);void *p=ft_calloc(5,8);fault_malloc_disable();
    EXPECT(p==NULL);
}
void test_suite(void){CASE("Échec du premier malloc : retourne NULL",check);}
#elif defined(TEST_ft_lstnew)
static void check(void) {
    fault_malloc_at(1);t_list *p=ft_lstnew(NULL);fault_malloc_disable();
    EXPECT(p==NULL);
}
void test_suite(void){CASE("Échec du premier malloc : retourne NULL",check);}
#elif defined(TEST_ft_split)
static void failure_first(void) {
    fault_malloc_at(1);char **p=ft_split("a,b,c",',');fault_malloc_disable();
    EXPECT(p==NULL);
}
static void failure_in_middle(void) {
    for(int n=2;n<=4;n++) {
        fault_malloc_at(n);char **p=ft_split("a,b,c",',');fault_malloc_disable();
        EXPECT(p==NULL);
    }
}
void test_suite(void){CASE("Échec du tableau de pointeurs",failure_first);
 CASE("Échecs successifs après des allocations partielles",failure_in_middle);}
#elif defined(TEST_ft_lstmap)
extern void *__real_malloc(size_t size);
static void *create(void *p){int *v=__real_malloc(sizeof(int));if(v)*v=*(int *)p+1;return v;}
static void delete_int(void *p){free(p);}
static void checks(void) {
    int x=4,y=5,z=6;
    t_list a={&x,NULL},b={&y,NULL},c={&z,NULL};a.next=&b;b.next=&c;
    /* The callback uses __real_malloc, so faults target the list-node
       allocations, not the callback's independently owned data. */
    for(int n=1;n<=3;n++) {
        fault_malloc_at(n);
        t_list *mapped=ft_lstmap(&a,create,delete_int);
        fault_malloc_disable();
        EXPECT(mapped==NULL);
    }
}
void test_suite(void){CASE("Allocation échouée durant la construction de liste",checks);}
#else
#error "No malloc fault scenario for this function"
#endif
