# Libft, Égalité, Fraternité

Un manuel interactif et pédagogique des fonctions C, dans l'esprit de SwimmingPy et SysAndNetAdmin.

**Site en ligne :** [Ouvrir le site](https://borishnt.github.io/libft-egalite-fraternite/)

## Au programme

- **43 fonctions Libft** identifiées dans l'archive fournie, datée de novembre 2025 ;
- **14 fonctions cousines**, clairement distinguées des fonctions de l'archive ;
- **57 fiches approfondies** avec paramètres expliqués, déroulement pas à pas, exemple à révéler, résultat à deviner, cas limites, complexité, normes et fonctions liées ;
- **10 visualisations de mémoire interactives**, notamment `ft_strlen`, `ft_memmove`, `ft_strlcpy`, `ft_split` et les listes chaînées ;
- une implémentation de référence pour chacune des 43 fonctions, **masquée derrière un voile flouté** ;
- recherche, filtre par famille/niveau, navigation responsive, thème bleu pastel ;
- zéro bibliothèque externe et zéro compte requis.

Les exemples sont originaux. Les sujets officiels 42 ne sont pas inclus ni recopiés. Le code de l'archive originale n'est pas présenté comme un modèle irréprochable.

## Consulter le site

Ouvrir `index.html` localement dans un navigateur ou utiliser GitHub Pages.

Les implémentations sont volontairement **cachées au premier affichage** pour favoriser la réflexion avant de regarder la solution. Cliquer sur « Révéler le code » pour les lire ou les copier, puis « Masquer à nouveau » pour revenir à l'état initial.

## Vérifier les références C

```sh
node scripts/export-references.mjs
cc -std=c99 -Wall -Wextra -Werror -I generated \
    generated/ft_*.c tests/smoke.c -o generated/verify
./generated/verify
norminette generated/ft_*.c
```

La CI GitHub Actions exécute automatiquement ces vérifications, ainsi qu'un contrôle de syntaxe JavaScript. Elle compile les 43 sources et lance un premier jeu de tests ciblés, mais **ne remplace pas une campagne exhaustive** de tests différentiels, de sanitizers et de cas limites.

Certaines fonctions (notamment `ft_atoi` en cas de dépassement et `ft_memmove` pour l'ordre d'adresses d'objets distincts) ont des subtilités de portabilité : l'objectif est de documenter ces limites explicitement, plutôt que de promettre une « perfection » universelle.

## Sources de référence

- [La Norme officielle 42](https://github.com/42School/norminette)
- Normes ISO C et pages de manuel pour les fonctions pertinentes, selon leur disponibilité
- Code Libft fourni par l'auteur (utilisé pour recenser les interfaces, pas recopié tel quel)


## Principes éditoriaux

Une **fonction présente dans Libft** ne signifie pas automatiquement que l'implémentation archivée est correcte. Les fiches privilégient le contrat de l'API et une réalisation pédagogique distincte. La comparaison avec les standards distingue toujours :

- **ISO C** : fonctions garanties par le langage, selon l'édition du standard ;
- **POSIX/BSD** : extensions disponibles selon le système et la bibliothèque C ;
- **Libft / 42** : fonctions pédagogiques ft_ avec leur propre interface.

Les exemples visibles dans les leçons sont des fragments de C, pas forcément des programmes autonomes. Tous les blocs d'implémentation de référence sont masqués au premier affichage.

## Repères et références

- [La Norminette officielle](https://github.com/42School/norminette) — outil de vérification de la Norme 42 ;
- [Manuel OpenBSD strlcpy / strlcat](https://man.openbsd.org/strlcpy.3) — sémantique et valeurs de retour ;
- [Man-pages Linux](https://man7.org/linux/man-pages/) — pages de manuels C et POSIX ;
- [Document de travail C23 (N3220)](https://www.open-std.org/jtc1/sc22/wg14/www/docs/n3220.pdf) — utile pour distinguer les éditions de la norme C.

**Prochain niveau de rigueur** : tests de propriétés génératifs, validation croisée sur plusieurs libc/architectures et revue des cas sous-spécifiés de \`atoi\`, des pointeurs et des allocations extrêmes.
