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

## Como corrigir o nome da branch mantendo os commits

Se voce ja tiver commits em uma branch com nome incorreto, prefira renomear a branch atual:

```bash
git branch -m feat/nome-da-sua-branch
git branch --show-current
git push -u origin feat/nome-da-sua-branch
```

## Se houver uma operacao Git em andamento

Comandos como `git switch -c ...` podem falhar durante `revert`, `merge`, `rebase` ou `cherry-pick`.
Antes de tentar corrigir o nome da branch, confira o estado com:

```bash
git status
```

Se houver um `revert` em andamento, por exemplo, finalize ou aborte a operacao antes:

```bash
git revert --continue
git revert --abort
```
