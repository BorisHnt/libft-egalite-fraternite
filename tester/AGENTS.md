# Libft Tester — contributor rules

- Fedora and GNU tooling are the only supported platform for this initial release.
- Never modify the student's original `libft/` directory. Work from a temporary copy.
- Never silently install software, send telemetry, upload source code, or open network connections.
- Keep all reports local in `results/*.txt`; never silently delete historical reports.
- Distinguish official contract requirements from optional stricter checks.
- Never assert that a passed check implies a grade, nor fabricate successful test outcomes.
- Every function case must use valid input according to its documented contract.
- Maintain individually compiled tests so an unfinished function cannot block unrelated tests.
- Treat Makefiles and compiled code as potentially dangerous: temporary copies do not provide sandboxing. Document trust requirements.
- Use deterministic random seeds and print reproduction instructions.
- Do not add copyrighted official subject text to the repository.
- Keep dependencies on Python's stdlib and Fedora's standard CLI tooling when possible.
