# Libft, Égalité, Fraternité

Un manuel interactif et pédagogique des fonctions C, dans l'esprit de SwimmingPy et SysAndNetAdmin.

**Site :** https://borishnt.github.io/libft-egalite-fraternite/

## Au programme

- **43 fonctions Libft** identifiées dans l'archive fournie, datée de novembre 2025 ;
- **14 fonctions cousines**, clairement distinguées des fonctions de l'archive ;
- 57 fiches avec prototype, mécanisme, valeur de retour, erreurs fréquentes et fonctions liées ;
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
