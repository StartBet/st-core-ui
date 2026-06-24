import { execSync } from "node:child_process";

const allowedPrefixes = [
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

const getCurrentBranchName = (): string => {
  return execSync("git rev-parse --abbrev-ref HEAD", {
    encoding: "utf8"
  }).trim();
};

const isDetachedHead = (branchName: string): boolean => branchName === "HEAD";

const hasAllowedPrefix = (branchName: string): boolean =>
  allowedPrefixes.some((prefix) => branchName.startsWith(prefix));

const formatErrorMessage = (error: unknown): string => {
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

const printErrorAndExit = (branchName: string): never => {
  const suggestedName = "feat/nome-da-sua-branch";

  console.error("");
  console.error("Erro: o nome da branch nao segue o padrao esperado.");
  console.error(`Branch atual: ${branchName}`);
  console.error("");
  console.error("Prefixos permitidos:");
  allowedPrefixes.forEach((prefix) => console.error(`- ${prefix}`));
  console.error("");
  console.error("Exemplo valido:");
  console.error(`- ${suggestedName}`);
  console.error("");
  console.error("Como migrar seus commits para uma nova branch:");
  console.error("1. Crie a nova branch a partir da branch atual:");
  console.error(`   git switch -c ${suggestedName}`);
  console.error("2. Confirme que voce esta na branch nova:");
  console.error("   git branch --show-current");
  console.error("3. Faca o push da branch nova:");
  console.error(`   git push -u origin ${suggestedName}`);
  console.error("4. Se quiser remover a branch antiga localmente depois:");
  console.error(`   git switch main && git branch -D ${branchName}`);
  console.error("");
  process.exit(1);
};

try {
  const branchName = getCurrentBranchName();

  if (isDetachedHead(branchName)) {
    console.error("Aviso: repositorio em detached HEAD. Push bloqueado.");
    process.exit(1);
  }

  if (!hasAllowedPrefix(branchName)) {
    printErrorAndExit(branchName);
  }
} catch (error: unknown) {
  console.error("Erro ao validar o nome da branch.");
  console.error(formatErrorMessage(error));
  process.exit(1);
}
