(() => { "use strict"; window.MANUAL_TRACES = {
  "ft_strlen": {
    "title": "Le curseur avance jusqu’au NUL",
    "subtitle": "Mémoire de la chaîne \"chat\" : le dernier octet ne compte pas.",
    "steps": [
      {
        "label": "Départ",
        "why": "i = 0. On observe la première case : ce n’est pas le NUL.",
        "cells": [
          "c",
          "h",
          "a",
          "t",
          "\\0"
        ],
        "index": 0,
        "metric": "0"
      },
      {
        "label": "Premier pas",
        "why": "Après avoir compté c, le curseur se trouve sur h.",
        "cells": [
          "c",
          "h",
          "a",
          "t",
          "\\0"
        ],
        "index": 1,
        "metric": "1"
      },
      {
        "label": "Deuxième pas",
        "why": "h a été compté, i vaut maintenant 2.",
        "cells": [
          "c",
          "h",
          "a",
          "t",
          "\\0"
        ],
        "index": 2,
        "metric": "2"
      },
      {
        "label": "Troisième pas",
        "why": "a a été compté, on lit t.",
        "cells": [
          "c",
          "h",
          "a",
          "t",
          "\\0"
        ],
        "index": 3,
        "metric": "3"
      },
      {
        "label": "Arrêt",
        "why": "Le curseur rencontre \\0 : la boucle s’arrête. Résultat 4.",
        "cells": [
          "c",
          "h",
          "a",
          "t",
          "\\0"
        ],
        "index": 4,
        "metric": "4"
      }
    ]
  },
  "ft_memmove": {
    "title": "Copie sûre avec chevauchement",
    "subtitle": "Destination = source + 1, quatre octets à copier. On commence par la droite pour sauver les données.",
    "steps": [
      {
        "label": "Avant la copie",
        "why": "Source et destination se chevauchent : copier de gauche à droite écraserait b avant de le lire.",
        "cells": [
          "a",
          "b",
          "c",
          "d",
          "e",
          "\\0"
        ],
        "index": 1,
        "metric": "—"
      },
      {
        "label": "Octet d → index 4",
        "why": "On place d en position 4, sans toucher aux trois octets source restants.",
        "cells": [
          "a",
          "b",
          "c",
          "d",
          "d",
          "\\0"
        ],
        "index": 4,
        "metric": "1/4"
      },
      {
        "label": "Octet c → index 3",
        "why": "On continue vers la gauche.",
        "cells": [
          "a",
          "b",
          "c",
          "c",
          "d",
          "\\0"
        ],
        "index": 3,
        "metric": "2/4"
      },
      {
        "label": "Octet b → index 2",
        "why": "b est préservé jusqu’à son déplacement.",
        "cells": [
          "a",
          "b",
          "b",
          "c",
          "d",
          "\\0"
        ],
        "index": 2,
        "metric": "3/4"
      },
      {
        "label": "Octet a → index 1",
        "why": "La copie est terminée : la chaîne devient aabcd.",
        "cells": [
          "a",
          "a",
          "b",
          "c",
          "d",
          "\\0"
        ],
        "index": 1,
        "metric": "4/4"
      }
    ]
  },
  "ft_memcpy": {
    "title": "Copie d’un bloc binaire",
    "subtitle": "Source ABC\\0, destination de quatre octets sans chevauchement.",
    "steps": [
      {
        "label": "Initialisation",
        "why": "Dest et src pointent vers deux blocs distincts.",
        "cells": [
          "·",
          "·",
          "·",
          "·"
        ],
        "index": -1,
        "metric": "0/4"
      },
      {
        "label": "Copie 0",
        "why": "Le premier octet A est copié.",
        "cells": [
          "A",
          "·",
          "·",
          "·"
        ],
        "index": 0,
        "metric": "1/4"
      },
      {
        "label": "Copie 1",
        "why": "Le deuxième octet B est copié.",
        "cells": [
          "A",
          "B",
          "·",
          "·"
        ],
        "index": 1,
        "metric": "2/4"
      },
      {
        "label": "Copie 2",
        "why": "Le troisième octet C est copié.",
        "cells": [
          "A",
          "B",
          "C",
          "·"
        ],
        "index": 2,
        "metric": "3/4"
      },
      {
        "label": "Copie 3",
        "why": "Le NUL est copié explicitement parce que n vaut 4.",
        "cells": [
          "A",
          "B",
          "C",
          "\\0"
        ],
        "index": 3,
        "metric": "4/4"
      }
    ]
  },
  "ft_strlcpy": {
    "title": "Garder une place pour \\0",
    "subtitle": "src = \"salut\", capacité dest = 4 octets.",
    "steps": [
      {
        "label": "Avant",
        "why": "On dispose de quatre cases ; une est réservée au terminateur.",
        "cells": [
          "·",
          "·",
          "·",
          "·"
        ],
        "index": -1,
        "metric": "5"
      },
      {
        "label": "Premier octet",
        "why": "s est copié dans dest[0].",
        "cells": [
          "s",
          "·",
          "·",
          "·"
        ],
        "index": 0,
        "metric": "5"
      },
      {
        "label": "Deuxième octet",
        "why": "a est copié dans dest[1].",
        "cells": [
          "s",
          "a",
          "·",
          "·"
        ],
        "index": 1,
        "metric": "5"
      },
      {
        "label": "Troisième octet",
        "why": "l est copié dans dest[2].",
        "cells": [
          "s",
          "a",
          "l",
          "·"
        ],
        "index": 2,
        "metric": "5"
      },
      {
        "label": "Fin",
        "why": "dest[3] reçoit \\0 ; retour 5 (longueur source), signe de troncature.",
        "cells": [
          "s",
          "a",
          "l",
          "\\0"
        ],
        "index": 3,
        "metric": "5"
      }
    ]
  },
  "ft_strlcat": {
    "title": "Concaténer sans dépasser",
    "subtitle": "dest = \"ab\", src = \"cdef\", capacité totale = 6.",
    "steps": [
      {
        "label": "Départ",
        "why": "dest occupe 2 octets, plus le NUL. Il reste 3 caractères possibles.",
        "cells": [
          "a",
          "b",
          "\\0",
          "·",
          "·",
          "·"
        ],
        "index": 2,
        "metric": "6"
      },
      {
        "label": "Copie c",
        "why": "On écrase l’ancien terminateur par c.",
        "cells": [
          "a",
          "b",
          "c",
          "·",
          "·",
          "·"
        ],
        "index": 2,
        "metric": "6"
      },
      {
        "label": "Copie d",
        "why": "Le quatrième octet reçoit d.",
        "cells": [
          "a",
          "b",
          "c",
          "d",
          "·",
          "·"
        ],
        "index": 3,
        "metric": "6"
      },
      {
        "label": "Copie e",
        "why": "Le cinquième octet reçoit e. f ne tient pas.",
        "cells": [
          "a",
          "b",
          "c",
          "d",
          "e",
          "·"
        ],
        "index": 4,
        "metric": "6"
      },
      {
        "label": "NUL final",
        "why": "La dernière case est réservée au terminateur ; retour 6.",
        "cells": [
          "a",
          "b",
          "c",
          "d",
          "e",
          "\\0"
        ],
        "index": 5,
        "metric": "6"
      }
    ]
  },
  "ft_calloc": {
    "title": "Allouer puis initialiser",
    "subtitle": "Trois octets de mémoire nouvellement allouée.",
    "steps": [
      {
        "label": "Après l’allocation",
        "why": "Avec malloc seul, le contenu serait indéterminé.",
        "cells": [
          "?",
          "?",
          "?"
        ],
        "index": -1,
        "metric": "3"
      },
      {
        "label": "Initialisation 0",
        "why": "Le premier octet reçoit zéro.",
        "cells": [
          "0",
          "?",
          "?"
        ],
        "index": 0,
        "metric": "3"
      },
      {
        "label": "Initialisation 1",
        "why": "Le deuxième octet reçoit zéro.",
        "cells": [
          "0",
          "0",
          "?"
        ],
        "index": 1,
        "metric": "3"
      },
      {
        "label": "Initialisation 2",
        "why": "Le troisième octet reçoit zéro.",
        "cells": [
          "0",
          "0",
          "0"
        ],
        "index": 2,
        "metric": "3"
      }
    ]
  },
  "ft_atoi": {
    "title": "Lire une chaîne progressivement",
    "subtitle": "Entrée \" -42x\" ; le suffixe x ne fait pas partie du nombre.",
    "steps": [
      {
        "label": "Espaces",
        "why": "On ignore l’espace initial.",
        "cells": [
          " ",
          "-",
          "4",
          "2",
          "x",
          "\\0"
        ],
        "index": 0,
        "metric": "rés. 0"
      },
      {
        "label": "Signe",
        "why": "Le signe négatif met sign à −1.",
        "cells": [
          " ",
          "-",
          "4",
          "2",
          "x",
          "\\0"
        ],
        "index": 1,
        "metric": "sign −1"
      },
      {
        "label": "Chiffre 4",
        "why": "Le calcul intermédiaire devient 4.",
        "cells": [
          " ",
          "-",
          "4",
          "2",
          "x",
          "\\0"
        ],
        "index": 2,
        "metric": "rés. 4"
      },
      {
        "label": "Chiffre 2",
        "why": "Le calcul devient 4 × 10 + 2 = 42.",
        "cells": [
          " ",
          "-",
          "4",
          "2",
          "x",
          "\\0"
        ],
        "index": 3,
        "metric": "rés. 42"
      },
      {
        "label": "Arrêt",
        "why": "x n’est pas un chiffre : résultat final −42.",
        "cells": [
          " ",
          "-",
          "4",
          "2",
          "x",
          "\\0"
        ],
        "index": 4,
        "metric": "−42"
      }
    ]
  },
  "ft_split": {
    "title": "Former un tableau de pointeurs",
    "subtitle": "Texte \"a,,bb,\" et séparateur virgule.",
    "steps": [
      {
        "label": "Avant",
        "why": "La chaîne contient deux mots non vides.",
        "cells": [
          "a",
          ",",
          ",",
          "b",
          "b",
          ","
        ],
        "index": -1,
        "metric": "0 mot"
      },
      {
        "label": "Premier mot",
        "why": "On alloue une chaîne pour a.",
        "cells": [
          "a",
          "—",
          "—",
          "—",
          "—",
          "—"
        ],
        "index": 0,
        "metric": "1 mot"
      },
      {
        "label": "Séparateurs",
        "why": "Deux virgules successives ne créent pas de mot vide.",
        "cells": [
          "a",
          ",",
          ",",
          "b",
          "b",
          ","
        ],
        "index": 2,
        "metric": "1 mot"
      },
      {
        "label": "Deuxième mot",
        "why": "On alloue une chaîne pour bb.",
        "cells": [
          "a",
          ",",
          ",",
          "b",
          "b",
          ","
        ],
        "index": 3,
        "metric": "2 mots"
      },
      {
        "label": "Terminaison",
        "why": "Le tableau de pointeurs est terminé par NULL.",
        "cells": [
          "\"a\"",
          "\"bb\"",
          "NULL"
        ],
        "index": 2,
        "metric": "2 mots"
      }
    ]
  },
  "ft_lstadd_front": {
    "title": "Changer la tête d’une liste",
    "subtitle": "Avant : head → B → C → NULL. On insère A.",
    "steps": [
      {
        "label": "Avant insertion",
        "why": "new est un maillon indépendant ; head pointe sur B.",
        "cells": [
          "head",
          "B",
          "C",
          "NULL"
        ],
        "index": 1,
        "metric": "A isolé"
      },
      {
        "label": "Raccordement",
        "why": "On relie A à l’ancienne tête B.",
        "cells": [
          "A",
          "B",
          "C",
          "NULL"
        ],
        "index": 0,
        "metric": "A.next=B"
      },
      {
        "label": "Nouvelle tête",
        "why": "*alst pointe maintenant sur A. Aucune allocation supplémentaire.",
        "cells": [
          "head → A",
          "B",
          "C",
          "NULL"
        ],
        "index": 0,
        "metric": "head=A"
      }
    ]
  },
  "ft_lstclear": {
    "title": "Détruire sans perdre le prochain maillon",
    "subtitle": "Une liste A → B → C, chaque contenu possède son destructeur.",
    "steps": [
      {
        "label": "Avant",
        "why": "On sauvegarde A.next avant de libérer A.",
        "cells": [
          "A",
          "B",
          "C",
          "NULL"
        ],
        "index": 0,
        "metric": "3"
      },
      {
        "label": "Libération A",
        "why": "Le premier maillon disparaît, on avance vers B.",
        "cells": [
          "libéré",
          "B",
          "C",
          "NULL"
        ],
        "index": 1,
        "metric": "2"
      },
      {
        "label": "Libération B",
        "why": "On sauvegarde puis détruit B.",
        "cells": [
          "libéré",
          "libéré",
          "C",
          "NULL"
        ],
        "index": 2,
        "metric": "1"
      },
      {
        "label": "Fin",
        "why": "C est détruit et la tête est remise à NULL.",
        "cells": [
          "libéré",
          "libéré",
          "libéré",
          "NULL"
        ],
        "index": 3,
        "metric": "0"
      }
    ]
  }
}; })();
