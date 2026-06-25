import { readFileSync, statSync } from "node:fs";
import { dirname, resolve } from "node:path";

export const allowedPrefixes = [
  "feature/",
  "feat/",
  "fix/",
  "hotfix/",
  "chore/",
  "refactor/",
  "perf/",
  "docs/",
  "test/",
  "ci/",
  "style/"
] as const;

const resolveGitDir = (): string => {
  const dotGitPath = resolve(process.cwd(), ".git");

  if (statSync(dotGitPath).isDirectory()) {
    return dotGitPath;
  }

  const gitDirPointer = readFileSync(dotGitPath, "utf8").trim();
  const gitDirPrefix = "gitdir:";

  if (!gitDirPointer.startsWith(gitDirPrefix)) {
    throw new Error("Nao foi possivel localizar o diretorio do Git.");
  }

  const gitDir = gitDirPointer.slice(gitDirPrefix.length).trim();
  return resolve(dirname(dotGitPath), gitDir);
};

export const getCurrentBranchName = (): string => {
  const headFilePath = resolve(resolveGitDir(), "HEAD");
  const headContent = readFileSync(headFilePath, "utf8").trim();
  const branchRefPrefix = "ref: refs/heads/";

  if (headContent.startsWith(branchRefPrefix)) {
    return headContent.slice(branchRefPrefix.length);
  }

  return "HEAD";
};

export const isDetachedHead = (branchName: string): boolean => branchName === "HEAD";

export const hasAllowedPrefix = (branchName: string): boolean =>
  allowedPrefixes.some((prefix) => branchName.startsWith(prefix));

export const formatErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === "string") {
    return error;
  }

  try {
    return JSON.stringify(error);
  } catch {
    return "Erro desconhecido ao validar o nome da branch.";
  }
};

export const getInvalidBranchMessageLines = (branchName: string): string[] => {
  const suggestedName = "feat/nome-da-sua-branch";

  return [
    "",
    "Erro: o nome da branch nao segue o padrao esperado.",
    `Branch atual: ${branchName}`,
    "",
    "Prefixos permitidos:",
    ...allowedPrefixes.map((prefix) => `- ${prefix}`),
    "",
    "Exemplo valido:",
    `- ${suggestedName}`,
    "",
    "Como corrigir o nome da branch mantendo seus commits:",
    "1. Renomeie a branch atual:",
    `   git branch -m ${suggestedName}`,
    "2. Confirme que voce esta na branch correta:",
    "   git branch --show-current",
    "3. Faca o push da branch renomeada:",
    `   git push -u origin ${suggestedName}`,
    "",
    "Se existir uma operacao do Git em andamento, conclua ou aborte antes:",
    "   git status",
    "   git revert --continue",
    "   git revert --abort",
    ""
  ];
};

export type ValidationDependencies = {
  exit?: (code: number) => void;
  getBranchName?: () => string;
  logError?: (message: string) => void;
};

const printLines = (lines: string[], logError: (message: string) => void): void => {
  lines.forEach((line) => logError(line));
};

export const runBranchNameValidation = ({
  exit = (code: number) => {
    process.exit(code);
  },
  getBranchName = getCurrentBranchName,
  logError = (message: string) => {
    console.error(message);
  }
}: ValidationDependencies = {}): void => {
  try {
    const branchName = getBranchName();

    if (isDetachedHead(branchName)) {
      logError("Aviso: repositorio em detached HEAD. Push bloqueado.");
      exit(1);
      return;
    }

    if (!hasAllowedPrefix(branchName)) {
      printLines(getInvalidBranchMessageLines(branchName), logError);
      exit(1);
      return;
    }
  } catch (error: unknown) {
    logError("Erro ao validar o nome da branch.");
    logError(formatErrorMessage(error));
    exit(1);
  }
};

if (require.main === module) {
  runBranchNameValidation();
}
