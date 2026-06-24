# Padrao de nomes de branch

Este repositorio bloqueia `git push` localmente via `husky` quando a branch nao segue um dos prefixos abaixo:

- `feature/`
- `feat/`
- `fix/`
- `hotfix/`
- `chore/`
- `refactor/`
- `perf/`
- `docs/`
- `test/`
- `ci/`
- `style/`

## Exemplo valido

```bash
feat/ajusta-validacao-de-branch
```

## O que acontece no push

Ao executar `git push`, o hook `pre-push` roda `npm run validate:branch-name`.
Se a branch nao estiver no padrao, o push e bloqueado.

## Como migrar commits para uma branch nova

Se voce ja tiver commits em uma branch com nome incorreto, use:

```bash
git switch -c feat/nome-da-sua-branch
git branch --show-current
git push -u origin feat/nome-da-sua-branch
```

Se quiser remover a branch antiga localmente depois:

```bash
git switch main
git branch -D nome-antigo-da-branch
```
