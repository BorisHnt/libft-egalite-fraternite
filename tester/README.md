# Libft, Égalité, Fraternité — Fedora Tester

**Testeur autonome et hors ligne pour le projet Libft de 42**, à utiliser en complément du [manuel interactif](https://borishnt.github.io/libft-egalite-fraternite/).

Il vérifie le projet comme un tout : structure, `Makefile`, `libft.h`, symboles dans `libft.a`, 43 fonctions C, cas limites et, dans les niveaux avancés, compilations instrumentées et échecs simulés de `malloc`.

**Version : 0.1.0 — première version utilisable, encore évolutive.** Ce n'est **pas** la Moulinette officielle, et aucun score de ce testeur ne prédit une note à 42.

## Installation et utilisation — Fedora

Décompresse le ZIP puis place **les fichiers** de ta Libft dans `libft/`. Ne dépose pas un sous-dossier contenant lui-même tous les fichiers : `libft/Makefile` et `libft/libft.h` doivent exister directement.

```text
libft-egalite-fraternite-tester/
├── test.sh
├── libft/
│   ├── Makefile
│   ├── libft.h
│   ├── ft_strlen.c
│   ├── ft_itoa.c
│   └── ...
├── tests/
├── tools/
└── results/
```

Dans un terminal Fedora :

```sh
cd libft-egalite-fraternite-tester
./test.sh
```

Si tu lances la commande depuis un vrai terminal, tu choisis le niveau avec `1`, `2` ou `3`. En fin de session, le rapport TXT est **sauvegardé dans `results/`** et s'ouvre automatiquement avec `less` si ce dernier est installé. Sinon le chemin est affiché.

Lance directement un mode :

```sh
./test.sh --mode standard
./test.sh --mode strict
./test.sh --mode hardcore
```

Ou concentre les tests sur une fonction et une graine reproductible :

```sh
./test.sh --mode hardcore --function ft_memmove --seed 1337
./test.sh --mode strict --function ft_itoa --no-open
./test.sh --list
./test.sh --help
```

Le processus se termine avec le code **0** si aucune vérification exécutée n'a échoué, et **1** s'il y a au moins un `FAIL`. Les étapes indisponibles (`SKIP`) et avertissements (`WARN`) restent indiqués : **SKIP n'est jamais PASS**.

## Dépendances

- Requises : `bash`, `python3`, `gcc`/`cc`, `make`, `ar`, `nm` et les outils POSIX usuels. Python utilise uniquement la bibliothèque standard ; **pas de pip nécessaire**.
- Conseillées : `norminette` pour les règles de style de 42 et `less` pour lire les rapports dans le terminal.
- En modes Strict et Hardcore : `gcc` doit prendre en charge `-fsanitize=address,undefined`. Les tests instrumentés sont compilés depuis les fichiers `.c`.

Sur une installation Fedora où les outils de compilation manquent, installe les paquets de développement adaptés, par exemple `gcc`, `make` et `binutils`. Si tu n'as pas de droits d'administration, rapproche-toi de l'équipe du campus : le testeur ne tente **jamais d'installer des paquets à ta place**.

## Les trois niveaux

| Niveau | Vérifications |
| --- | --- |
| **Standard** | Dossier `libft/`, Makefile, compilation, archive `ar`, relink, changement de source, `clean`, `fclean`, `re`, `libft.h`, prototypes, symboles, Norminette si installée, tests fonctionnels déterministes. |
| **Strict** | Standard + cas aléatoires plus nombreux, simulations d'échec de `malloc` pour 10 fonctions, recompilation ASan/UBSan, vérifications de fuites via LeakSanitizer. |
| **Hardcore** | Strict + campagnes déterministes beaucoup plus longues, notamment sur les chevauchements de `ft_memmove`, le découpage de `ft_split`, la mémoire et les conversions, et un avertissement pédagogique sur d’éventuelles surallocations de `ft_itoa`. |

Le testeur compile **chaque fonction séparément**, si son symbole existe dans la bibliothèque. Ainsi, une fonction manquante n'empêche pas l'exécution des tests des autres fonctions. Les erreurs de compilation ou de liaison de chaque fonction sont signalées dans le rapport.

La fonction `ft_calloc` est testée selon l'exigence particulière du **sujet Libft v1.1 fourni pour ce projet** : quand `nmemb == 0` ou `size == 0`, le résultat doit être un pointeur libérable et non nul.

### Ce que la V1 ne fait pas encore

- Aucun test n'est exhaustif ni équivalent à une notation officielle.
- Le contrôle des commandes et flags du `Makefile` repose partiellement sur `make -n` et peut être ambigu si le Makefile construit indirectement.
- Les pannes simulées de `malloc` interceptent les références reliées par GNU `ld --wrap=malloc`, pas toutes les allocations possibles du système.
- Les tests de la Norme 42 requièrent **l'installation préalable** de Norminette.
- Une allocation supérieure au minimum nécessaire est souvent **parfaitement légale** ; le contrôle expérimental sur `ft_itoa` n'émet donc qu'un **WARN**, jamais un FAIL, et seulement si le schéma de `malloc` est mesurable.
- La vérification des interdictions de fonctions externes, l'injection exhaustive de pannes, la mesure de performance et les tests sous Valgrind pourront être ajoutés dans des versions ultérieures.

## Rapports TXT

Chaque passage produit un fichier distinct :

```text
results/
├── 2026-11-19_15-30-12.txt
└── 2026-11-19_16-02-45.txt
```

Les rapports séparent `PASS`, `FAIL`, `WARN` et `SKIP`. En cas d'échec fonctionnel, ils fournissent le scénario, une piste de correction, un lien vers le manuel et la commande pour reproduire le test avec la même graine.

Les fichiers du dossier `results/` ne sont jamais supprimés automatiquement.

## Sécurité et confidentialité

Le testeur fonctionne **entièrement en local** : il ne transmet ni le code source ni les rapports à un service externe. Il construit une **copie temporaire** de `libft/` pour éviter que `make clean` ou `make fclean` supprime des fichiers de ton dossier de travail.

**Important : une copie temporaire n'est PAS une sandbox de sécurité.** Un `Makefile` ou du code C malveillant peut exécuter des commandes avec les droits de l'utilisateur courant, y compris accéder à des fichiers en dehors de la copie. N'exécute jamais le testeur avec `sudo` et ne teste que des projets dont tu fais confiance à la provenance. Les exécutions sont limitées dans le temps mais ne remplacent pas une vraie isolation par conteneur.

## Développement

```sh
python3 -m py_compile tools/audit.py
./test.sh --list
./test.sh --mode standard --function ft_itoa --no-open
```

Le projet utilise Python 3 (orchestration et rapports), Bash (lanceur), C (tests) et les outils GNU disponibles sur Fedora.

L'implémentation des tests et les explications sont indépendantes des sujets officiels 42 : le sujet est utilisé uniquement comme référence de contrat, sans en reproduire les contenus dans le testeur.

## Licence

MIT. Voir `LICENSE`.
