#include "harness.h"

/* Each function is compiled separately (-DTEST_ft_xxx). This keeps failures
   in unfinished libraries from hiding successful functions. */

#if defined(TEST_ft_isalpha)
static void checks(void) {
    int c;
    for(c=-10;c<300;c++) EXPECT(ft_isalpha(c)==((c>='a'&&c<='z')||(c>='A'&&c<='Z')));
}
void test_suite(void){CASE("ASCII et bornes exactes", checks);}
#elif defined(TEST_ft_isdigit)
static void checks(void) {
    int c;
    for(c=-10;c<300;c++) EXPECT(ft_isdigit(c)==(c>='0'&&c<='9'));
}
void test_suite(void){CASE("Chiffres ASCII et bornes", checks);}
#elif defined(TEST_ft_isalnum)
static void checks(void) {
    int c;
    for(c=-10;c<300;c++) EXPECT(ft_isalnum(c)==((c>='a'&&c<='z')||(c>='A'&&c<='Z')||(c>='0'&&c<='9')));
}
void test_suite(void){CASE("Lettres, chiffres et séparateurs", checks);}
#elif defined(TEST_ft_isascii)
static void checks(void) {
    int c;
    for(c=-10;c<300;c++) EXPECT(ft_isascii(c)==(c>=0&&c<=127));
}
void test_suite(void){CASE("Intervalle ASCII 0..127", checks);}
#elif defined(TEST_ft_isprint)
static void checks(void) {
    int c;
    for(c=-10;c<300;c++) EXPECT(ft_isprint(c)==(c>=32&&c<=126));
}
void test_suite(void){CASE("Caractères imprimables ASCII", checks);}
#elif defined(TEST_ft_toupper)
static void checks(void) {
    int c, expected;
    for(c=0;c<300;c++) {expected = (c>='a'&&c<='z')?c-32:c;EXPECT(ft_toupper(c)==expected);}
}
void test_suite(void){CASE("Conversions en majuscules ASCII", checks);}
#elif defined(TEST_ft_tolower)
static void checks(void) {
    int c, expected;
    for(c=0;c<300;c++) {expected = (c>='A'&&c<='Z')?c+32:c;EXPECT(ft_tolower(c)==expected);}
}
void test_suite(void){CASE("Conversions en minuscules ASCII", checks);}
#elif defined(TEST_ft_strlen)
static void basic(void) {
    const char *samples[]={"","a","ab","bonjour","42 Marseille","a\0b","école"};
    size_t i;
    for(i=0;i<sizeof(samples)/sizeof(samples[0]);i++) EXPECT(ft_strlen(samples[i])==strlen(samples[i]));
}
static void random_strings(void) {
    char a[1024];
    int loops=NLOOPS(12,140,2800),k,n;
    for(k=0;k<loops;k++) {
        n=(int)(rnd_u32()%1023);
        memset(a,'A',sizeof(a));a[n]=0;
        EXPECT(ft_strlen(a)==(size_t)n);
    }
}
void test_suite(void){CASE("Chaînes vides, NUL internes, UTF-8 en octets",basic);CASE("Longueurs aléatoires reproductibles",random_strings);}
#elif defined(TEST_ft_strchr)
static void checks(void) {
    const char *s="banane";
    int c;
    for(c=0;c<255;c++) {
        char *a=ft_strchr(s,c);
        char *b=strchr(s,c);
        EXPECT((a==NULL)==(b==NULL));
        if(a&&b) EXPECT(a-s==b-s);
    }
}
void test_suite(void){CASE("Première occurrence et terminateur NUL",checks);}
#elif defined(TEST_ft_strrchr)
static void checks(void) {
    const char *s="banane";
    int c;
    for(c=0;c<255;c++) {
        char *a=ft_strrchr(s,c);
        char *b=strrchr(s,c);
        EXPECT((a==NULL)==(b==NULL));
        if(a&&b) EXPECT(a-s==b-s);
    }
}
void test_suite(void){CASE("Dernière occurrence et terminateur NUL",checks);}
#elif defined(TEST_ft_strncmp)
static int sign(int n){return (n>0)-(n<0);}
static void samples(void) {
    const char *v[]={"","a","ab","abc","abd","a\0b","z","é","A"};
    size_t a,b,n;
    for(a=0;a<sizeof(v)/sizeof(v[0]);a++)
      for(b=0;b<sizeof(v)/sizeof(v[0]);b++)
        for(n=0;n<12;n++) EXPECT(sign(ft_strncmp(v[a],v[b],n))==sign(strncmp(v[a],v[b],n)));
}
void test_suite(void){CASE("Comparaison bornée, signe et NUL",samples);}
#elif defined(TEST_ft_atoi)
static void checks(void) {
    const char *v[]={"0","+0","-0","123"," -42xyz","\t\r\n 123","+2147483647","-2147483648","+","abc"," -0012"};
    size_t i;
    for(i=0;i<sizeof(v)/sizeof(v[0]);i++) EXPECT(ft_atoi(v[i])==atoi(v[i]));
}
void test_suite(void){CASE("Espaces, signes, INT_MIN et suffixe",checks);}
#elif defined(TEST_ft_memset)
static void checks(void) {
    unsigned char a[256],b[256];
    int k,n,c;
    for(k=0;k<NLOOPS(50,300,2500);k++) {
        n=(int)(rnd_u32()%257);c=(int)(rnd_u32()%1024);
        memset(a,0xCC,sizeof(a));memset(b,0xCC,sizeof(b));
        EXPECT(ft_memset(a,c,(size_t)n)==a);
        memset(b,c,(size_t)n);EXPECT(memcmp(a,b,sizeof(a))==0);
    }
}
void test_suite(void){CASE("Remplissage byte à byte et sentinelles",checks);}
#elif defined(TEST_ft_bzero)
static void checks(void) {
    unsigned char a[256],b[256];int n;
    for(n=0;n<256;n++) {
        memset(a,0xA5,sizeof(a));memset(b,0xA5,sizeof(b));
        ft_bzero(a+1,(size_t)n);memset(b+1,0,(size_t)n);
        EXPECT(memcmp(a,b,sizeof(a))==0);
    }
}
void test_suite(void){CASE("Initialisation à zéro et octets sentinelles",checks);}
#elif defined(TEST_ft_memcpy)
static void checks(void) {
    unsigned char src[512], a[512], b[512];
    int k,n,i;
    for(i=0;i<512;i++)src[i]=(unsigned char)(i*37);
    for(k=0;k<NLOOPS(30,350,3000);k++) {
        n=(int)(rnd_u32()%513);
        memset(a,0xC3,sizeof(a));memset(b,0xC3,sizeof(b));
        EXPECT(ft_memcpy(a,src,(size_t)n)==a);
        memcpy(b,src,(size_t)n);
        EXPECT(memcmp(a,b,sizeof(a))==0);
    }
}
void test_suite(void){CASE("Mémoire non chevauchante et tailles variables",checks);}
#elif defined(TEST_ft_memmove)
static void overlap(void) {
    unsigned char a[96],b[96];
    int source,destination,n,k,i;
    int loops=NLOOPS(150,1800,12000);
    for(k=0;k<loops;k++) {
        source=(int)(rnd_u32()%64);destination=(int)(rnd_u32()%64);
        n=(int)(rnd_u32()%33);
        for(i=0;i<96;i++)a[i]=(unsigned char)(i*13u);
        memcpy(b,a,sizeof(a));
        EXPECT(ft_memmove(a+destination,a+source,(size_t)n)==a+destination);
        memmove(b+destination,b+source,(size_t)n);
        EXPECT(memcmp(a,b,sizeof(a))==0);
    }
}
void test_suite(void){CASE("Chevauchements avant/arrière, seed reproductible",overlap);}
#elif defined(TEST_ft_memchr)
static void checks(void) {
    unsigned char b[256];size_t i,n;
    for(i=0;i<sizeof(b);i++)b[i]=(unsigned char)i;
    for(n=0;n<=sizeof(b);n++) {
        EXPECT(ft_memchr(b,128,n)==memchr(b,128,n));
        EXPECT(ft_memchr(b,0,n)==memchr(b,0,n));
    }
}
void test_suite(void){CASE("Recherche binaire et présence de NUL",checks);}
#elif defined(TEST_ft_memcmp)
static int sign(int n){return (n>0)-(n<0);}
static void checks(void) {
    unsigned char a[256],b[256];size_t n;int k;
    for(k=0;k<NLOOPS(60,350,2000);k++) {
        n=(size_t)(rnd_u32()%257);
        for(size_t i=0;i<256;i++)a[i]=b[i]=(unsigned char)rnd_u32();
        if(n && (rnd_u32()%2)) b[rnd_u32()%n] ^= 0x10;
        EXPECT(sign(ft_memcmp(a,b,n))==sign(memcmp(a,b,n)));
    }
}
void test_suite(void){CASE("Comparaisons binaires et différences d'octets",checks);}
#elif defined(TEST_ft_strlcpy)
static void checks(void) {
    char b[32];size_t cap;
    for(cap=0;cap<=31;cap++) {
        memset(b,'?',sizeof(b));
        EXPECT(ft_strlcpy(b,"bonjour",cap)==7);
        if(cap) {
            size_t len=(cap-1)<7?cap-1:7;
            EXPECT(b[len]=='\0');EXPECT(memcmp(b,"bonjour",len)==0);
        } else EXPECT(b[0]=='?');
    }
}
void test_suite(void){CASE("Capacité totale, terminaison, troncature",checks);}
#elif defined(TEST_ft_strlcat)
static void checks(void) {
    char b[24];size_t cap,expect;
    for(cap=0;cap<24;cap++) {
        memset(b,'?',sizeof(b));b[0]='a';b[1]='b';b[2]=0;
        expect=(cap<=2?cap:2)+4;
        EXPECT(ft_strlcat(b,"cdef",cap)==expect);
        if(cap<=2) EXPECT(strcmp(b,"ab")==0);
        else {
            size_t len=(cap-1<6?cap-1:6);
            EXPECT(memcmp(b,"abcdef",len)==0);EXPECT(b[len]==0);
        }
    }
}
void test_suite(void){CASE("Concaténation bornée, tailles 0..23",checks);}
#elif defined(TEST_ft_strnstr)
static void checks(void) {
    const char *text="bananabanane";
    size_t n;
    for(n=0;n<=strlen(text);n++) {
        char *p=ft_strnstr(text,"naba",n);
        if(n>=8) EXPECT(p==text+4);
        else EXPECT(p==NULL);
        EXPECT(ft_strnstr(text,"",n)==text);
        EXPECT(ft_strnstr(text,"introuvable",n)==NULL);
    }
}
void test_suite(void){CASE("Correspondance complète dans la fenêtre len",checks);}
#elif defined(TEST_ft_calloc)
static void normal(void) {
    size_t n;
    for(n=1;n<=64;n++) {
        unsigned char *p=ft_calloc(n,3);
        EXPECT(p!=NULL);
        for(size_t i=0;i<n*3;i++)EXPECT(p[i]==0);
        free(p);
    }
}
static void overflow(void) {
    EXPECT(ft_calloc((size_t)-1,2)==NULL);
    EXPECT(ft_calloc(2,(size_t)-1)==NULL);
}
static void zero(void) {
    void *a=ft_calloc(0,32);
    void *b=ft_calloc(32,0);
    EXPECT(a!=NULL && b!=NULL);
    EXPECT(a!=b);
    free(a);free(b);
}
void test_suite(void){CASE("Blocs initialisés",normal);CASE("Produit size_t débordant",overflow);CASE("Allocation de taille nulle (sujet v1.1)",zero);}
#elif defined(TEST_ft_strdup)
static void checks(void) {
    const char *samples[]={"","abc","a\0bc","hello world"};
    for(size_t i=0;i<sizeof(samples)/sizeof(samples[0]);i++) {
        char *p=ft_strdup(samples[i]);EXPECT(p!=NULL);
        EXPECT(strcmp(p,samples[i])==0);EXPECT(p!=samples[i]);free(p);
    }
}
void test_suite(void){CASE("Copies indépendantes et chaînes vides",checks);}
#elif defined(TEST_ft_substr)
static void checks(void) {
    char *p;
    p=ft_substr("abcdef",2,3);EXPECT(p && strcmp(p,"cde")==0);free(p);
    p=ft_substr("abcdef",0,0);EXPECT(p && strcmp(p,"")==0);free(p);
    p=ft_substr("abc",100,3);EXPECT(p && strcmp(p,"")==0);free(p);
    p=ft_substr("abc",1,(size_t)-1);EXPECT(p && strcmp(p,"bc")==0);free(p);
}
void test_suite(void){CASE("Tranches, indices hors chaîne et tailles extrêmes",checks);}
#elif defined(TEST_ft_strjoin)
static void checks(void) {
    const char *a[]={"","a","hello","\t"};
    const char *b[]={"","b"," world","x\n"};
    for(size_t i=0;i<4;i++)for(size_t j=0;j<4;j++) {
        char *p=ft_strjoin(a[i],b[j]);EXPECT(p!=NULL);
        size_t la=strlen(a[i]),lb=strlen(b[j]);
        EXPECT(strlen(p)==la+lb);EXPECT(memcmp(p,a[i],la)==0);
        EXPECT(memcmp(p+la,b[j],lb+1)==0);free(p);
    }
}
void test_suite(void){CASE("Concaténation et propriété mémoire",checks);}
#elif defined(TEST_ft_strtrim)
static void checks(void) {
    const char *input[]={"  bonjour   ","xxxxx","abHelloabb","abc",""};
    const char *set[]={" ","x","ab","","x"};
    const char *expected[]={"bonjour","","Hello","abc",""};
    for(size_t i=0;i<5;i++) {
        char *p=ft_strtrim(input[i],set[i]);
        EXPECT(p && strcmp(p,expected[i])==0);free(p);
    }
}
void test_suite(void){CASE("Retrait aux deux extrémités et chaînes vides",checks);}
#elif defined(TEST_ft_split)
static void cleanup(char **v) {size_t i=0;if(!v)return;while(v[i])free(v[i++]);free(v);}
static void checks(void) {
    char **v=ft_split(",,a,,bc,",',');
    EXPECT(v && v[0] && v[1] && !v[2]);
    EXPECT(strcmp(v[0],"a")==0 && strcmp(v[1],"bc")==0);
    EXPECT(v[0]!=v[1]);cleanup(v);
    v=ft_split(",,,",',');EXPECT(v && !v[0]);cleanup(v);
    v=ft_split("hello",',');EXPECT(v && v[0] && !v[1]);
    EXPECT(strcmp(v[0],"hello")==0);cleanup(v);
    v=ft_split("",',');EXPECT(v && !v[0]);cleanup(v);
}
static void stress(void) {
    char text[512];int rounds=NLOOPS(10,100,700);
    for(int n=0;n<rounds;n++) {
        for(size_t i=0;i<sizeof(text)-1;i++)text[i]=(rnd_u32()%5==0)?',':'x';
        text[sizeof(text)-1]=0;
        char **v=ft_split(text,',');EXPECT(v!=NULL);
        size_t cursor=0,k=0;
        while(text[cursor]) {
            while(text[cursor]==',')cursor++;
            if(!text[cursor])break;
            size_t start=cursor;
            while(text[cursor] && text[cursor]!=',')cursor++;
            EXPECT(v[k]!=NULL);EXPECT(strlen(v[k])==cursor-start);
            EXPECT(memcmp(v[k],text+start,cursor-start)==0);k++;
        }
        EXPECT(v[k]==NULL);cleanup(v);
    }
}
void test_suite(void){CASE("Séparateurs répétés et tableau NULL final",checks);CASE("Découpage aléatoire reproductible",stress);}
#elif defined(TEST_ft_itoa)
static void checks(void) {
    const int values[]={0,1,-1,42,-422,1000,INT_MIN,INT_MAX,100000000,-100000000};
    for(size_t i=0;i<sizeof(values)/sizeof(values[0]);i++) {
        char *p=ft_itoa(values[i]);char ref[64];
        snprintf(ref,sizeof(ref),"%d",values[i]);
        EXPECT(p && strcmp(p,ref)==0);free(p);
    }
}
static void randomized(void) {
    int loops=NLOOPS(20,300,5000);
    for(int i=0;i<loops;i++) {
        int n=(int)rnd_u32();char ref[64];
        snprintf(ref,sizeof(ref),"%d",n);
        char *p=ft_itoa(n);EXPECT(p && strcmp(p,ref)==0);free(p);
    }
}
void test_suite(void){CASE("Entiers limites, zéro et signe",checks);CASE("Valeurs aléatoires reproductibles",randomized);}
#elif defined(TEST_ft_strmapi)
static char mutate(unsigned int i,char c){return (char)(c+(char)(i%3));}
static void checks(void) {
    const char *src="aaaaaa";
    char *p=ft_strmapi(src,mutate);
    EXPECT(p && strcmp(p,"abcabc")==0);free(p);
    p=ft_strmapi("",mutate);EXPECT(p && !p[0]);free(p);
}
void test_suite(void){CASE("Callback indexé, copie indépendante et vide",checks);}
#elif defined(TEST_ft_striteri)
static void mutate(unsigned int i,char *c){*c=(char)(*c+(char)(i%3));}
static void checks(void) {
    char s[]="aaaaaa";
    ft_striteri(s,mutate);EXPECT(strcmp(s,"abcabc")==0);
    char empty[]="";ft_striteri(empty,mutate);EXPECT(!empty[0]);
}
void test_suite(void){CASE("Callback modifiant une chaîne en place",checks);}
#elif defined(TEST_ft_putchar_fd)
static void check(void) {
    int fds[2];char c=0;EXPECT(pipe(fds)==0);
    ft_putchar_fd('X',fds[1]);close(fds[1]);
    EXPECT(read(fds[0],&c,1)==1 && c=='X');
    EXPECT(read(fds[0],&c,1)==0);close(fds[0]);
}
void test_suite(void){CASE("Écriture d'un octet sur pipe POSIX",check);}
#elif defined(TEST_ft_putstr_fd)
static void check(void) {
    int fds[2];char a[32]={0};EXPECT(pipe(fds)==0);
    ft_putstr_fd("hello",fds[1]);close(fds[1]);
    EXPECT(read(fds[0],a,sizeof(a))==5 && memcmp(a,"hello",5)==0);
    close(fds[0]);
}
void test_suite(void){CASE("Écriture binaire de chaîne, sans NUL",check);}
#elif defined(TEST_ft_putendl_fd)
static void check(void) {
    int fds[2];char a[32]={0};EXPECT(pipe(fds)==0);
    ft_putendl_fd("hello",fds[1]);close(fds[1]);
    EXPECT(read(fds[0],a,sizeof(a))==6 && memcmp(a,"hello\n",6)==0);
    close(fds[0]);
}
void test_suite(void){CASE("Saut de ligne supplémentaire",check);}
#elif defined(TEST_ft_putnbr_fd)
static void check(void) {
    const int values[]={0,42,-42,INT_MIN,INT_MAX};
    for(size_t i=0;i<sizeof(values)/sizeof(values[0]);i++) {
        int fd[2];char output[128]={0},ref[128];
        EXPECT(pipe(fd)==0);ft_putnbr_fd(values[i],fd[1]);close(fd[1]);
        ssize_t n=read(fd[0],output,sizeof(output));close(fd[0]);
        snprintf(ref,sizeof(ref),"%d",values[i]);
        EXPECT(n==(ssize_t)strlen(ref) && memcmp(output,ref,strlen(ref))==0);
    }
}
void test_suite(void){CASE("Écriture numérique, signe et INT_MIN",check);}
#elif defined(TEST_ft_lstnew)
static void check(void) {
    int value=42;
    t_list *p=ft_lstnew(&value);
    EXPECT(p && p->content==&value && p->next==NULL);free(p);
    p=ft_lstnew(NULL);EXPECT(p && !p->content && !p->next);free(p);
}
void test_suite(void){CASE("Maillon autonome, contenu NULL et next",check);}
#elif defined(TEST_ft_lstadd_front)
static void check(void) {
    t_list a={0},b={0},c={0};t_list *head=&b;
    b.next=&c;ft_lstadd_front(&head,&a);
    EXPECT(head==&a && a.next==&b && b.next==&c && !c.next);
    head=NULL;t_list d={0};ft_lstadd_front(&head,&d);
    EXPECT(head==&d && !d.next);
}
void test_suite(void){CASE("Insertion en tête vide et non vide",check);}
#elif defined(TEST_ft_lstadd_back)
static void check(void) {
    t_list a={0},b={0},c={0};t_list *head=&a;
    a.next=&b;ft_lstadd_back(&head,&c);
    EXPECT(head==&a && a.next==&b && b.next==&c && !c.next);
    head=NULL;t_list d={0};ft_lstadd_back(&head,&d);
    EXPECT(head==&d && !d.next);
}
void test_suite(void){CASE("Insertion en fin et tête vide",check);}
#elif defined(TEST_ft_lstsize)
static void check(void) {
    t_list a={0},b={0},c={0};
    EXPECT(ft_lstsize(NULL)==0);EXPECT(ft_lstsize(&a)==1);
    a.next=&b;b.next=&c;EXPECT(ft_lstsize(&a)==3);
}
void test_suite(void){CASE("Comptage exact des maillons",check);}
#elif defined(TEST_ft_lstlast)
static void check(void) {
    t_list a={0},b={0},c={0};
    EXPECT(ft_lstlast(NULL)==NULL);EXPECT(ft_lstlast(&a)==&a);
    a.next=&b;b.next=&c;EXPECT(ft_lstlast(&a)==&c);
}
void test_suite(void){CASE("Dernier maillon sans allocation",check);}
#elif defined(TEST_ft_lstdelone)
static int deleted=0;
static void deleter(void *p){deleted++;free(p);}
static void check(void) {
    t_list *a=malloc(sizeof(*a));t_list b={0};
    int *value=malloc(sizeof(*value));EXPECT(a && value);
    *value=42;a->content=value;a->next=&b;
    ft_lstdelone(a,deleter);EXPECT(deleted==1);
    EXPECT(b.next==NULL);
}
void test_suite(void){CASE("Détruire seulement le maillon demandé",check);}
#elif defined(TEST_ft_lstclear)
static int deleted=0;
static void deleter(void *p){deleted++;free(p);}
static void check(void) {
    t_list *head=NULL,*tail=NULL;
    for(int i=0;i<4;i++) {
        t_list *node=malloc(sizeof(*node));int *v=malloc(sizeof(*v));
        EXPECT(node && v);*v=i;node->content=v;node->next=NULL;
        if(tail)tail->next=node;else head=node;tail=node;
    }
    ft_lstclear(&head,deleter);
    EXPECT(head==NULL && deleted==4);
    ft_lstclear(&head,deleter);EXPECT(head==NULL && deleted==4);
}
void test_suite(void){CASE("Libération complète, tête NULL et deuxième appel",check);}
#elif defined(TEST_ft_lstiter)
static int sum=0;
static void visit(void *p){sum+=*(int *)p;}
static void check(void) {
    int a=3,b=5,c=7;
    t_list n1={&a,NULL},n2={&b,NULL},n3={&c,NULL};
    n1.next=&n2;n2.next=&n3;
    ft_lstiter(&n1,visit);EXPECT(sum==15);
    ft_lstiter(NULL,visit);EXPECT(sum==15);
}
void test_suite(void){CASE("Rappel une fois par maillon",check);}
#elif defined(TEST_ft_lstmap)
static void *transform(void *p) {
    int *value=malloc(sizeof(int));
    if(value)*value=*(int *)p+1;
    return value;
}
static int cleared=0;
static void deleter(void *p){cleared++;free(p);}
static void check(void) {
    int a=7,b=8;
    t_list n1={&a,NULL},n2={&b,NULL};
    n1.next=&n2;
    t_list *copy=ft_lstmap(&n1,transform,deleter);
    EXPECT(copy && copy->next && copy->next->next==NULL);
    EXPECT(copy!=&n1 && copy->next!=&n2);
    EXPECT(*(int *)copy->content==8 && *(int *)copy->next->content==9);
    EXPECT(a==7 && b==8);
    t_list *p=copy;
    while(p) {t_list *next=p->next;deleter(p->content);free(p);p=next;}
    EXPECT(cleared==2);
    EXPECT(ft_lstmap(NULL,transform,deleter)==NULL);
}
void test_suite(void){CASE("Nouvelle liste indépendante et gestion des contenus",check);}
#else
#error "Compile using -DTEST_ft_name for one supported function"
#endif
