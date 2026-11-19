# Libft, Égalité, Fraternité

Manuel interactif des fonctions de Libft et des fonctions voisines du langage C. Pensé pour comprendre **ce que fait une fonction, pourquoi son implémentation marche et comment éviter les pièges**, plutôt que pour recopier du code.

**[Ouvrir le site](https://borishnt.github.io/libft-egalite-fraternite/)**

## Contenu du manuel

- **43 fonctions Libft** : chaînes, caractères, mémoire, conversions, allocations, listes chaînées et sorties.
- **14 fonctions cousines** pour comparer les interfaces de la bibliothèque C, de POSIX et de BSD.
- **57 fiches approfondies** : signature, paramètres, valeur de retour, invariants de boucle, comportement mémoire, préconditions, complexité et cas limites.
- Des exemples à examiner avant de révéler leur résultat et **10 parcours visuels interactifs** pour la mémoire et les listes.
- Une **page de lecture centrale** pour chaque fonction, avec sommaire, URL directe et navigation précédente/suivante.
- Une **implémentation pédagogique de référence** pour chaque fonction Libft. Le code est masqué jusqu'au clic sur « Révéler le code ».
- Recherche dans les fiches, filtres, interface responsive en bleu pastel et aucune dépendance côté navigateur.

Les explications sont indépendantes des sujets officiels 42, qui ne sont ni reproduits ni intégrés.

## Testeur Fedora — v0.1.0

Le testeur Fedora est inclus dans le même dépôt : [voir les sources](https://github.com/BorisHnt/libft-egalite-fraternite/tree/main/tester).

**[Télécharger le testeur Fedora (ZIP)](https://github.com/BorisHnt/libft-egalite-fraternite/raw/refs/heads/main/downloads/libft-egalite-fraternite-tester-v0.1.0.zip)**

Décompresser le ZIP, placer les fichiers de sa Libft directement dans `libft/`, puis lancer :

```sh
./test.sh
./test.sh --mode hardcore --function ft_itoa
```

Les tests vérifient notamment le Makefile, `libft.h`, les fonctions et les cas limites. Les rapports TXT restent dans `results/`.
Le testeur travaille localement sur Fedora, sans envoyer les sources au site. Ne jamais le lancer avec `sudo` et n'utiliser que du code de confiance.
Ce testeur indépendant ne prédit pas la note de 42.

## Utilisation

Le site fonctionne directement avec `index.html` dans un navigateur, ou depuis GitHub Pages. Pour ouvrir une fonction spécifique, les URL ressemblent à :

```text
https://borishnt.github.io/libft-egalite-fraternite/#/fonction/ft_memmove
```

La navigation entre fonctions reste dans la page principale, sans fenêtre latérale masquant le contenu.

## Contrôle des références C

```sh
node scripts/export-references.mjs
cc -std=c99 -Wall -Wextra -Werror -I generated \
  generated/ft_*.c tests/smoke.c -o generated/verify
./generated/verify
norminette generated/ft_*.c
```

La CI vérifie également la syntaxe JavaScript, la couverture des fiches, des scénarios de bord supplémentaires et des tests sous AddressSanitizer et UndefinedBehaviorSanitizer. Les contrôles réussis **ne constituent pas une preuve absolue de correction** sur toutes les architectures ou toutes les entrées possibles.

Les fonctions sont décrites selon leurs contrats respectifs : ISO C, POSIX, BSD ou conventions de Libft. La présence d'une implémentation de référence ne signifie pas qu'il s'agit de l'unique manière correcte de procéder.

## Sources techniques et normes

- [La Norminette officielle 42](https://github.com/42School/norminette)
- [Les pages de manuel Linux](https://man7.org/linux/man-pages/)
- [Manuel OpenBSD de strlcpy/strlcat](https://man.openbsd.org/strlcpy.3)
- [Document de travail C23 (WG14 N3220)](https://www.open-std.org/jtc1/sc22/wg14/www/docs/n3220.pdf)
