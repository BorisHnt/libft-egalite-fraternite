#!/usr/bin/env python3
"""Libft, Égalité, Fraternité — offline tester for Fedora. Python stdlib only.

Runs Makefile commands on a temporary *copy*. It is not a security sandbox:
Makefile recipes may execute arbitrary commands with the current user's rights.
Only use on source code you trust; never run as root.
"""
from __future__ import annotations

import argparse
import collections
import datetime as dt
import hashlib
import os
import pathlib
import re
import shutil
import signal
import subprocess
import sys
import tempfile
import textwrap
import time

FUNCTIONS = (
    'ft_isalpha ft_isdigit ft_isalnum ft_isascii ft_isprint ft_toupper ft_tolower '
    'ft_strlen ft_memset ft_bzero ft_memcpy ft_memmove ft_strlcpy ft_strlcat '
    'ft_strchr ft_strrchr ft_strncmp ft_memchr ft_memcmp ft_strnstr ft_atoi '
    'ft_calloc ft_strdup ft_substr ft_strjoin ft_strtrim ft_split ft_itoa '
    'ft_strmapi ft_striteri ft_putchar_fd ft_putstr_fd ft_putendl_fd '
    'ft_putnbr_fd ft_lstnew ft_lstadd_front ft_lstsize ft_lstlast '
    'ft_lstadd_back ft_lstdelone ft_lstclear ft_lstiter ft_lstmap'
).split()

DIAGNOSES = {
    'ft_itoa': 'Vérifie zéro, INT_MIN, le signe, le NUL final, la taille de malloc et les valeurs intermédiaires.',
    'ft_split': 'Vérifie les séparateurs consécutifs, le NULL final et la libération de tous les mots.',
    'ft_calloc': 'Contrôle le produit count × size avant de le calculer et les allocations de taille zéro.',
    'ft_strlcat': 'Le troisième argument est la capacité totale ; borne le scan de dest à cette taille.',
    'ft_memmove': 'La direction de copie dépend du chevauchement ; vérifie les deux sens.',
    'ft_strdup': 'Alloue strlen(source)+1 octets et termine la copie par le NUL.',
    'ft_strncmp': 'Le résultat doit conserver le signe de la différence des unsigned char.',
    'ft_strlen': 'Ne compte pas le terminateur NUL et n’utilise pas sizeof sur un pointeur.',
    'ft_lstmap': 'Chaque maillon résultat doit être indépendant, avec nettoyage complet en cas d’échec.',
    'ft_lstclear': 'Lis next avant de libérer le maillon et remets la tête à NULL.',
}

FAULTABLE = {'ft_itoa','ft_strdup','ft_substr','ft_strjoin','ft_strtrim',
             'ft_strmapi','ft_calloc','ft_lstnew','ft_split','ft_lstmap'}

SITE = 'https://borishnt.github.io/libft-egalite-fraternite/#/fonction/'
OUTPUT_MAX = 3500


class Report:
    def __init__(self, mode: str, seed: int, source: pathlib.Path):
        self.mode = mode
        self.seed = seed
        self.source = source
        self.sections: dict[str, list[tuple[str, str, str]]] = collections.OrderedDict()

    def add(self, section: str, status: str, title: str, detail: str = ''):
        self.sections.setdefault(section, []).append((status, title, detail.strip()))
        print(f'[{status:<4}] {section}: {title}', flush=True)

    def render(self) -> str:
        all_entries = [row for rows in self.sections.values() for row in rows]
        counts = collections.Counter(row[0] for row in all_entries)
        width = 78
        now = dt.datetime.now().astimezone().strftime('%Y-%m-%d %H:%M:%S %z')
        lines = [
            '=' * width,
            ' LIBFT, ÉGALITÉ, FRATERNITÉ — TESTER FEDORA',
            '=' * width,
            f'Date          : {now}',
            f'Répertoire    : {self.source}',
            f'Mode          : {self.mode.upper()}',
            f'Seed          : {self.seed}',
            f'Tests/conform.: {len(all_entries)} éléments (PASS + FAIL + WARN + SKIP)',
            f'Résumé        : {counts["PASS"]} PASS | {counts["FAIL"]} FAIL | '
            f'{counts["WARN"]} WARN | {counts["SKIP"]} SKIP',
            '',
            'IMPORTANT : PASS ne prouve pas la correction universelle. Les tests hardcore',
            'restent distincts des obligations officielles de la version 1.1 du sujet.',
        ]
        for name, entries in self.sections.items():
            lines.extend(['', '-' * width, name.upper(), '-' * width])
            for status, title, detail in entries:
                lines.append(f'[{status:<4}] {title}')
                if detail:
                    for block in detail.splitlines():
                        if block.startswith(('Fiche : ', 'Reproduction : ')):
                            lines.append('    ' + block)
                        else:
                            lines.extend(textwrap.wrap(block, width=74, initial_indent='    ',
                                                       subsequent_indent='    ',
                                                       replace_whitespace=False,
                                                       drop_whitespace=False) or ['    '])
        lines += ['', '-' * width]
        if counts['FAIL']:
            lines.append('BILAN : des erreurs ont été détectées. Consulte les sections FAIL.')
        else:
            lines.append('BILAN : aucun échec détecté sur les vérifications exécutées.')
        if counts['WARN'] or counts['SKIP']:
            lines.append('ATTENTION : certaines vérifications sont absentes ou partielles.')
        lines += ['=' * width, '']
        return '\n'.join(lines)


def run(cmd: list[str], cwd: pathlib.Path | None, timeout: int = 30,
        env: dict | None = None) -> tuple[int, str]:
    proc = None
    try:
        proc = subprocess.Popen(cmd, cwd=cwd, stdout=subprocess.PIPE,
                                stderr=subprocess.STDOUT, text=True,
                                errors='replace', start_new_session=True,
                                env=env)
        output, _ = proc.communicate(timeout=timeout)
        return proc.returncode, output[-OUTPUT_MAX:]
    except subprocess.TimeoutExpired:
        if proc:
            os.killpg(proc.pid, signal.SIGKILL)
            output, _ = proc.communicate()
            return 124, (output or '')[-1000:] + '\nCommande interrompue (timeout).'
        return 124, 'Commande interrompue (timeout).'
    except OSError as exc:
        return 127, str(exc)


def stat_map(directory: pathlib.Path) -> dict[str, tuple[int, int]]:
    files = [directory / 'libft.a', *directory.rglob('*.o')]
    return {str(path.relative_to(directory)): (path.stat().st_mtime_ns,
                                               path.stat().st_size)
            for path in files if path.is_file()}


def safe_copy(src: pathlib.Path, dst: pathlib.Path, report: Report) -> bool:
    total = 0
    files = []
    for path in src.rglob('*'):
        relative = path.relative_to(src)
        if any(part in {'.git', 'results', 'node_modules', '.venv'} for part in relative.parts):
            continue
        if path.is_symlink():
            report.add('Structure', 'FAIL', 'Lien symbolique détecté',
                       f'{relative} : refuse de copier les symlinks dans le répertoire de test.')
            return False
        if not path.is_file():
            continue
        if path.suffix in {'.o','.a','.so'} or path.name == 'a.out':
            continue  # Always perform a clean build in the scratch copy.
        size = path.stat().st_size
        if size > 5 * 1024 * 1024:
            report.add('Structure', 'FAIL', 'Fichier trop volumineux', str(relative))
            return False
        total += size
        files.append((path, relative))
    if total > 30 * 1024 * 1024 or len(files) > 700:
        report.add('Structure', 'FAIL', 'Projet trop volumineux pour la V1',
                   f'{len(files)} fichiers et {total} octets.')
        return False
    for path, relative in files:
        target = dst / relative
        target.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(path, target)
    report.add('Structure', 'PASS', 'Sources copiées dans un dossier temporaire',
               'Les cibles clean/fclean/re ne modifient pas ton dossier libft d’origine.')
    return True


def audit_structure(path: pathlib.Path, report: Report) -> bool:
    if not path.exists() or not path.is_dir():
        report.add('Structure', 'FAIL', 'Dossier libft introuvable',
                   'Place Makefile, libft.h et tes ft_*.c directement dans libft/.')
        return False
    for filename in ('Makefile', 'libft.h'):
        if (path / filename).is_file():
            report.add('Structure', 'PASS', filename + ' trouvé')
        else:
            report.add('Structure', 'FAIL', filename + ' manquant')
    present = {p.stem for p in path.glob('ft_*.c') if p.is_file()}
    missing = [x for x in FUNCTIONS if x not in present]
    report.add('Structure', 'PASS' if not missing else 'WARN',
               f'{len(present)}/43 fichiers ft_*.c présents',
               'Manquants : ' + ', '.join(missing) if missing else 'Tous les fichiers standard sont présents.')
    other = [x.name for x in path.glob('*.c') if not x.name.startswith('ft_')]
    if other:
        report.add('Structure', 'WARN', 'Sources non ft_ à examiner', ', '.join(other))
    return True


def audit_makefile(directory: pathlib.Path, report: Report) -> pathlib.Path | None:
    if not (directory / 'Makefile').is_file():
        report.add('Makefile', 'FAIL', 'Makefile absent')
        return None
    content = (directory / 'Makefile').read_text(encoding='utf-8', errors='replace')
    if '-std=c99' in content:
        report.add('Makefile', 'FAIL', 'Flag -std=c99 interdit dans le sujet v1.1')
    else:
        report.add('Makefile', 'PASS', 'Pas de -std=c99 textuel détecté',
                   'Une commande indirecte peut échapper à ce contrôle statique.')
    rc, preview = run(['make', '-B', '-n', 'all'], directory, 12)
    if rc == 0:
        flags = [flag for flag in ('-Wall', '-Wextra', '-Werror')
                 if not re.search(r'(?<!\S)' + re.escape(flag) + r'(?!\w)', preview)]
        if flags:
            report.add('Makefile', 'WARN', 'Flags non visibles dans le make -n',
                       'Impossible de confirmer : ' + ', '.join(flags) + '. Inspection indicative seulement.')
        else:
            report.add('Makefile', 'PASS', '-Wall -Wextra -Werror visibles dans make -n')
        if re.search(r'(^|\s)(libtool)(\s|$)', preview):
            report.add('Makefile', 'FAIL', 'libtool utilisé pour créer la bibliothèque',
                       'Le sujet impose ar.')
        elif re.search(r'(^|\s)(ar|/\S*/ar)(\s|$)', preview):
            report.add('Makefile', 'PASS', 'Commande ar visible dans les recettes')
        else:
            report.add('Makefile', 'WARN', 'Commande ar non visible dans make -n',
                       'Confirmer manuellement que la bibliothèque est créée avec ar.')
    else:
        report.add('Makefile', 'WARN', 'Prévisualisation make -n indisponible', preview)
    code, output = run(['make', '--no-print-directory', 'all'], directory, 40)
    archive = directory / 'libft.a'
    if code or not archive.is_file():
        report.add('Makefile', 'FAIL', 'make all / libft.a', output or 'Archive non créée.')
        return None
    report.add('Makefile', 'PASS', 'make all crée libft.a')
    rc, out = run(['ar', 't', str(archive)], directory, 15)
    if rc == 0:
        members = [line.strip() for line in out.splitlines() if line.strip()]
        if members and all(m.endswith('.o') for m in members):
            report.add('Makefile', 'PASS', f'Archive ar valide ({len(members)} objets)')
        else:
            report.add('Makefile', 'FAIL', 'Membres de libft.a inattendus', out)
    else:
        report.add('Makefile', 'FAIL', 'libft.a n’est pas une archive ar valide', out)
    before = stat_map(directory)
    code, output = run(['make', '--no-print-directory', 'all'], directory, 25)
    if code:
        report.add('Makefile', 'FAIL', 'Deuxième make all', output)
    elif before == stat_map(directory):
        report.add('Makefile', 'PASS', 'Aucun relink superflu après make all')
    else:
        report.add('Makefile', 'FAIL', 'Relink ou recompilation inutile détectée',
                   'Les timestamps/taille de libft.a ou des .o ont changé sans modification de source.')
    sources = sorted(directory.glob('ft_*.c'))
    if sources:
        target = sources[0]
        old_stamp = archive.stat().st_mtime_ns
        new_stamp = max(time.time_ns(),target.stat().st_mtime_ns + 1000000000)
        os.utime(target, ns=(new_stamp,new_stamp))
        code, output = run(['make', '--no-print-directory','all'],directory,35)
        if code:
            report.add('Makefile','FAIL','Recompilation après touch d’une source',output)
        elif archive.stat().st_mtime_ns > old_stamp:
            report.add('Makefile','PASS','Source modifiée → archive reconstruite')
        else:
            report.add('Makefile','FAIL','Modification de source non détectée',
                       'make all doit reconstruire libft.a si une source change.')
    code, output = run(['make', '--no-print-directory', 'libft.a'], directory, 25)
    report.add('Makefile', 'PASS' if code == 0 else 'FAIL', 'Cible $(NAME) / libft.a', output if code else '')
    code, output = run(['make', '--no-print-directory', 'clean'], directory, 30)
    if code:
        report.add('Makefile', 'FAIL', 'make clean', output)
    elif list(directory.rglob('*.o')):
        report.add('Makefile', 'FAIL', 'make clean laisse des .o')
    elif not archive.exists():
        report.add('Makefile', 'FAIL', 'make clean a supprimé libft.a')
    else:
        report.add('Makefile', 'PASS', 'make clean enlève les objets et garde libft.a')
    code, output = run(['make', '--no-print-directory', 'fclean'], directory, 30)
    if code or archive.exists() or list(directory.rglob('*.o')):
        report.add('Makefile', 'FAIL', 'make fclean', output or 'Objets ou libft.a encore présents.')
    else:
        report.add('Makefile', 'PASS', 'make fclean enlève objets et archive')
    code, output = run(['make', '--no-print-directory', 're'], directory, 40)
    if code or not archive.is_file():
        report.add('Makefile', 'FAIL', 'make re', output or 'libft.a non créée.')
        return None
    report.add('Makefile', 'PASS', 'make re reconstruit libft.a')
    return archive


def fallback_build(directory: pathlib.Path, report: Report, scratch: pathlib.Path) -> pathlib.Path | None:
    sources = sorted(directory.glob('*.c'))
    if not sources:
        report.add('Compilation', 'SKIP', 'Aucun .c, compilation de secours impossible')
        return None
    out = scratch / 'fallback'
    out.mkdir(exist_ok=True)
    objs = []
    for source in sources:
        obj = out / (source.stem + '.o')
        cmd = ['cc','-Wall','-Wextra','-Werror', '-I',str(directory),'-c',str(source),'-o',str(obj)]
        rc, text = run(cmd, out, 20)
        if rc:
            report.add('Compilation','FAIL',f'Compilation de secours : {source.name}',text)
            return None
        objs.append(str(obj))
    archive = out / 'libft.a'
    rc, text = run(['ar','rcs',str(archive),*objs],out,20)
    if rc:
        report.add('Compilation','FAIL','Création d’archive de secours',text)
        return None
    report.add('Compilation','WARN','Archive de secours créée sans Makefile',
               'Les tests sont possibles, mais ne valident PAS le Makefile de l’étudiant.')
    return archive


def audit_header(directory: pathlib.Path, root: pathlib.Path, report: Report):
    header = directory / 'libft.h'
    if not header.is_file():
        report.add('Header', 'FAIL', 'Impossible de vérifier libft.h absent')
        return
    for name in ('header_multiple.c','header_contract.c'):
        rc, out = run(['cc','-Wall','-Wextra','-Werror','-pedantic',
                       '-I',str(directory),'-fsyntax-only',str(root/'tests'/name)],directory,15)
        label = ('Inclusion multiple / guards' if name == 'header_multiple.c'
                 else 'Prototypes des 43 fonctions et définition de t_list')
        report.add('Header','PASS' if rc==0 else 'FAIL',label,out if rc else '')
    content = header.read_text(encoding='utf-8',errors='replace')
    if re.search(r'\brestrict\b',content):
        report.add('Header','FAIL','Mot-clef restrict présent dans libft.h',
                   'Le sujet v1.1 interdit restrict dans les prototypes.')
    else:
        report.add('Header','PASS','Aucun restrict textuel détecté')


def audit_symbols(archive: pathlib.Path, report: Report) -> set[str]:
    rc, output = run(['nm','-g','--defined-only',str(archive)],None,15)
    if rc:
        report.add('Symboles','FAIL','Lecture nm impossible',output)
        return set()
    defined = [match.group(1) for line in output.splitlines()
               if (match := re.search(r'\b[TDBW]\s+(ft_[A-Za-z0-9_]+)\s*$',line))]
    count = collections.Counter(defined)
    present = set(defined)
    missing = [name for name in FUNCTIONS if name not in present]
    report.add('Symboles','PASS' if not missing else 'FAIL',
               f'{len(FUNCTIONS)-len(missing)}/43 fonctions attendues exportées',
               'Manquantes : '+', '.join(missing) if missing else '')
    duplicate = sorted(name for name, n in count.items() if n > 1)
    if duplicate:
        report.add('Symboles','FAIL','Symboles ft_ définis plusieurs fois',', '.join(duplicate))
    unexpected = sorted(present-set(FUNCTIONS))
    if unexpected:
        report.add('Symboles','WARN','Symboles ft_ supplémentaires',', '.join(unexpected))
    return present


def audit_norm(directory: pathlib.Path, report: Report):
    if not shutil.which('norminette'):
        report.add('Norminette','SKIP','Norminette indisponible',
                   'Installe-la si nécessaire ; aucun PASS n’est attribué à cette vérification.')
        return
    files=[str(p) for p in sorted(directory.glob('*.c'))]
    files.extend(str(p) for p in sorted(directory.glob('*.h')))
    if not files:
        report.add('Norminette','SKIP','Aucun fichier à analyser')
        return
    rc,out=run(['norminette',*files],directory,45)
    report.add('Norminette','PASS' if rc==0 else 'FAIL',
               f'Analyse des {len(files)} sources et headers',out if rc else '')


def build_sanitized(directory: pathlib.Path, scratch: pathlib.Path,
                    report: Report) -> pathlib.Path | None:
    sources=sorted(directory.glob('*.c'))
    if not sources:
        report.add('Sanitizers','SKIP','Pas de sources pour ASan/UBSan')
        return None
    out=scratch/'sanitized'
    out.mkdir(exist_ok=True)
    objs=[]
    for source in sources:
        dest=out/(source.stem+'.o')
        cmd=['cc','-Wall','-Wextra','-Werror','-g','-O1',
             '-fsanitize=address,undefined','-fno-omit-frame-pointer',
             '-I',str(directory),'-c',str(source),'-o',str(dest)]
        rc,log=run(cmd,out,20)
        if rc:
            report.add('Sanitizers','FAIL',f'Compilation instrumentée : {source.name}',log)
            return None
        objs.append(str(dest))
    archive=out/'libft.a'
    rc,log=run(['ar','rcs',str(archive),*objs],out,20)
    if rc:
        report.add('Sanitizers','FAIL','Création archive instrumentée',log)
        return None
    report.add('Sanitizers','PASS','Compilation instrumentée ASan + UBSan')
    return archive


def functional_tests(root: pathlib.Path, directory: pathlib.Path, archive: pathlib.Path,
                     present: set[str], report: Report, scratch: pathlib.Path,
                     mode: str, seed: int, only: str | None, sanitized: bool):
    runners=scratch/('runner_sanitized' if sanitized else 'runner_standard')
    runners.mkdir(exist_ok=True)
    selected=[only] if only else FUNCTIONS
    for name in selected:
        if name not in present:
            report.add('Fonctions','SKIP',name,'Pas de symbole exporté dans libft.a.')
            continue
        binary=runners/name
        cmd=['cc','-Wall','-Wextra','-Werror','-I',str(directory),
             '-DTEST_'+name,str(root/'tests'/'harness.c'),str(root/'tests'/'functions.c'),
             str(archive),'-o',str(binary)]
        if sanitized:
            cmd[1:1]=['-fsanitize=address,undefined','-fno-omit-frame-pointer','-g','-O1']
        rc,log=run(cmd,runners,20)
        section='Sanitizers' if sanitized else 'Fonctions'
        if rc:
            report.add(section,'FAIL',name+' : compilation/link du test',log)
            continue
        env=os.environ.copy()
        if sanitized:
            env['LIBFT_TEST_SANITIZE']='1'
            env['ASAN_OPTIONS']='detect_leaks=1:abort_on_error=1:detect_stack_use_after_return=1'
            env['UBSAN_OPTIONS']='halt_on_error=1:print_stacktrace=1'
        level={'standard':0,'strict':1,'hardcore':2}[mode]
        rc,out=run([str(binary),str(level),str(seed)],runners,
                   timeout=75 if mode=='hardcore' else 35,env=env)
        if rc:
            report.add(section,'FAIL',name+' : exécution du test',out)
            continue
        results=[line.split('\t',2) for line in out.splitlines()
                 if line.startswith(('PASS\t','FAIL\t'))]
        if not results:
            report.add(section,'FAIL',name+' : aucune sortie de test',out)
            continue
        ok=sum(p[0]=='PASS' for p in results)
        failures=[p for p in results if p[0]=='FAIL']
        if not failures:
            report.add(section,'PASS',f'{name} : {ok}/{len(results)} scénarios')
        else:
            descriptions=' ; '.join(p[1]+' — '+p[2] for p in failures)
            hint=DIAGNOSES.get(name,'Vérifie les paramètres, la valeur de retour, et les préconditions documentées.')
            detail=(descriptions+'\nPiste : '+hint+'\nFiche : '+SITE+name+
                    '\nReproduction : ./test.sh --mode '+mode+' --function '+name+' --seed '+str(seed))
            report.add(section,'FAIL',f'{name} : {ok}/{len(results)} scénarios',detail)


def fault_tests(root: pathlib.Path, directory: pathlib.Path, archive: pathlib.Path,
                present: set[str], report: Report, scratch: pathlib.Path,
                mode: str, seed: int, only: str | None, sanitized: bool = False):
    if mode not in ('strict','hardcore'):
        return
    section='Pannes malloc instrumentées' if sanitized else 'Échecs malloc simulés'
    selected = [only] if only else sorted(FAULTABLE)
    out=scratch/('faults_sanitized' if sanitized else 'faults')
    out.mkdir(exist_ok=True)
    for name in selected:
        if name not in FAULTABLE:
            continue
        if name not in present:
            report.add(section,'SKIP',name,'Fonction absente')
            continue
        binary=out/name
        cmd=['cc','-Wall','-Wextra','-Werror','-I',str(directory),
             '-DTEST_'+name,str(root/'tests'/'harness.c'),
             str(root/'tests'/'faults.c'),str(root/'tests'/'malloc_wrap.c'),
             '-Wl,--wrap=malloc',str(archive),'-o',str(binary)]
        if sanitized:
            cmd[1:1]=['-fsanitize=address,undefined','-fno-omit-frame-pointer','-g','-O1']
        rc, log=run(cmd,out,20)
        if rc:
            report.add(section,'FAIL',name+' : link des tests de panne',log)
            continue
        env=os.environ.copy()
        if sanitized:
            env['LIBFT_TEST_SANITIZE']='1'
            env['ASAN_OPTIONS']='detect_leaks=1:abort_on_error=1'
            env['UBSAN_OPTIONS']='halt_on_error=1:print_stacktrace=1'
        rc, outtext=run([str(binary),'1',str(seed)],out,35,env=env)
        results=[line.split('\t',2) for line in outtext.splitlines()
                 if line.startswith(('PASS\t','FAIL\t'))]
        if rc or not results:
            report.add(section,'FAIL',name+' : exécution',outtext)
            continue
        failures=[r for r in results if r[0]=='FAIL']
        if failures:
            report.add(section,'FAIL',name+' : '+str(len(failures))+' échecs',
                       ' ; '.join(r[1]+': '+r[2] for r in failures))
        else:
            report.add(section,'PASS',name+' : '+str(len(results))+' scénarios')


def inspect_itoa_allocation(root: pathlib.Path, directory: pathlib.Path,
                            archive: pathlib.Path, present: set[str],
                            report: Report, scratch: pathlib.Path, mode: str,
                            only: str | None):
    if mode != 'hardcore' or 'ft_itoa' not in present:
        return
    if only is not None and only != 'ft_itoa':
        return
    dest = scratch / 'malloc_efficiency'
    cmd = ['cc','-Wall','-Wextra','-Werror','-I',str(directory),
           str(root/'tests'/'efficiency.c'),str(root/'tests'/'malloc_wrap.c'),
           '-Wl,--wrap=malloc',str(archive),'-o',str(dest)]
    code, log = run(cmd,scratch,20)
    if code:
        report.add('Audit pédagogique','WARN','Mesure des allocations de ft_itoa indisponible',log)
        return
    code, data = run([str(dest)],scratch,15)
    if code:
        report.add('Audit pédagogique','WARN','Mesure des allocations de ft_itoa interrompue',data)
        return
    values = []
    for line in data.strip().splitlines():
        try:
            requested, required = map(int,line.split('\t'))
        except ValueError:
            continue
        if requested:
            values.append((requested,required))
    if len(values)!=3:
        report.add('Audit pédagogique','WARN','malloc de ft_itoa non observable',
                   'Ce contrôle indicatif ne sait pas mesurer toutes les stratégies d’allocation.')
        return
    excessive=[(a,b) for a,b in values if a > 2*b]
    if excessive:
        report.add('Audit pédagogique','WARN','Allocation ft_itoa sensiblement plus grande que nécessaire',
                   '; '.join(f'{a} octets demandés, {b} nécessaires' for a,b in excessive) +
                   '. Ce n’est PAS une violation du sujet : aucune taille minimale n’est imposée.')
    else:
        report.add('Audit pédagogique','PASS','Aucune surallocation importante observée sur ft_itoa',
                   'Ce contrôle est indicatif et ne prouve pas la sûreté de l’allocation.')


def main() -> int:
    parser=argparse.ArgumentParser(description='Libft Tester Fedora — compilation, Makefile, header et 43 fonctions.')
    parser.add_argument('--root',type=pathlib.Path,required=True,help=argparse.SUPPRESS)
    parser.add_argument('--mode',choices=('standard','strict','hardcore'),
                        help='Niveau ; demandé au lancement interactif (défaut standard).')
    parser.add_argument('--function',dest='only',choices=FUNCTIONS,
                        help='Tester uniquement une fonction (les contrôles de projet sont conservés).')
    parser.add_argument('--seed',type=int,default=42,help='Graine reproductible pour les cas aléatoires.')
    parser.add_argument('--no-open',action='store_true',help='Ne pas ouvrir le rapport avec less.')
    parser.add_argument('--list',action='store_true',help='Afficher les 43 fonctions.')
    args=parser.parse_args()
    if args.list:
        print('\n'.join(FUNCTIONS))
        return 0
    if args.mode is None:
        args.mode = 'standard'
        if sys.stdin.isatty() and sys.stdout.isatty():
            print('\nLibft Tester — choisis ton niveau :')
            print('  1. Standard  — contrat, compilation, Makefile et fonctions')
            print('  2. Strict    — + sanitizers et pannes d’allocation')
            print('  3. Hardcore  — + campagnes aléatoires plus nombreuses')
            try:
                answer = input('Mode [1] : ').strip()
            except EOFError:
                answer = ''
            args.mode = {'1':'standard','2':'strict','3':'hardcore',
                         'standard':'standard','strict':'strict',
                         'hardcore':'hardcore','':'standard'}.get(answer.lower(),'standard')
    root=args.root.resolve()
    libft=root/'libft'
    results=root/'results'
    results.mkdir(exist_ok=True)
    report=Report(args.mode,args.seed,libft)
    for tool in ['python3','cc','make','ar','nm']:
        if not shutil.which(tool):
            report.add('Environnement','FAIL',f'Commande {tool} absente',
                       'Fedora : installer les outils de développement nécessaires.')
        else:
            report.add('Environnement','PASS',f'{tool} disponible')
    if audit_structure(libft,report):
        with tempfile.TemporaryDirectory(prefix='libft-tester-') as tmp:
            scratch=pathlib.Path(tmp)
            copy=scratch/'libft'
            copy.mkdir()
            if safe_copy(libft,copy,report):
                audit_header(copy,root,report)
                audit_norm(copy,report)
                archive=audit_makefile(copy,report)
                if archive is None:
                    archive=fallback_build(copy,report,scratch)
                if archive:
                    symbols=audit_symbols(archive,report)
                    functional_tests(root,copy,archive,symbols,report,scratch,args.mode,args.seed,args.only,False)
                    fault_tests(root,copy,archive,symbols,report,scratch,args.mode,args.seed,args.only)
                    inspect_itoa_allocation(root,copy,archive,symbols,report,scratch,args.mode,args.only)
                    if args.mode in ('strict','hardcore'):
                        sanitized_archive=build_sanitized(copy,scratch,report)
                        if sanitized_archive:
                            filtered=audit_symbols(sanitized_archive,report)
                            functional_tests(root,copy,sanitized_archive,filtered,report,scratch,
                                             args.mode,args.seed,args.only,True)
                            fault_tests(root,copy,sanitized_archive,filtered,report,scratch,
                                        args.mode,args.seed,args.only,True)
    stamp=dt.datetime.now().strftime('%Y-%m-%d_%H-%M-%S')
    destination=results/(stamp+'.txt')
    counter=1
    while destination.exists():
        destination=results/(stamp+'_'+str(counter)+'.txt')
        counter+=1
    destination.write_text(report.render(),encoding='utf-8')
    print('\nRapport : '+str(destination),flush=True)
    totals=collections.Counter(row[0] for rows in report.sections.values() for row in rows)
    print('Bilan : {} PASS | {} FAIL | {} WARN | {} SKIP'.format(
          totals['PASS'],totals['FAIL'],totals['WARN'],totals['SKIP']),flush=True)
    if not args.no_open and sys.stdin.isatty() and sys.stdout.isatty():
        if shutil.which('less'):
            subprocess.run(['less','-R',str(destination)],check=False)
        else:
            print('Conseil : ouvre '+str(destination)+' avec ton éditeur de texte.')
    failed=any(row[0]=='FAIL' for rows in report.sections.values() for row in rows)
    return 1 if failed else 0


if __name__ == '__main__':
    try:
        sys.exit(main())
    except KeyboardInterrupt:
        print('\nInterrompu par l’utilisateur.',file=sys.stderr)
        sys.exit(130)
