import { describe, expect, it, vi } from "vitest";

import {
  formatErrorMessage,
  getInvalidBranchMessageLines,
  hasAllowedPrefix,
  isDetachedHead,
  runBranchNameValidation
} from "./validate-branch-name";

describe("validate-branch-name", () => {
  it("should accept a branch name with an allowed prefix", () => {
    expect(hasAllowedPrefix("chore/update-branch-policy")).toBe(true);
  });

  it("should reject a branch name with a disallowed prefix", () => {
    expect(hasAllowedPrefix("invalid/update-branch-policy")).toBe(false);
  });

  it("should detect detached HEAD state", () => {
    expect(isDetachedHead("HEAD")).toBe(true);
    expect(isDetachedHead("chore/update-branch-policy")).toBe(false);
  });

  it("should build guidance lines for an invalid branch name", () => {
    const lines = getInvalidBranchMessageLines("invalid/update-branch-policy");

    expect(lines).toContain("Erro: o nome da branch nao segue o padrao esperado.");
    expect(lines).toContain("Prefixos permitidos:");
    expect(lines).toContain("- chore/");
    expect(lines).toContain("1. Renomeie a branch atual:");
    expect(lines).toContain("   git branch -m feat/nome-da-sua-branch");
  });

  it("should format error instances using the error message", () => {
    expect(formatErrorMessage(new Error("git command failed"))).toBe("git command failed");
  });

  it("should format string errors as-is", () => {
    expect(formatErrorMessage("git command failed")).toBe("git command failed");
  });

  it("should format plain objects as JSON", () => {
    expect(formatErrorMessage({ reason: "git command failed" })).toBe(
      '{"reason":"git command failed"}'
    );
  });

  it("should log guidance and exit when the branch name is invalid", () => {
    const logError = vi.fn<(message: string) => void>();
    const exit = vi.fn<(code: number) => void>();

    runBranchNameValidation({
      exit,
      getBranchName: () => "invalid/update-branch-policy",
      logError
    });

    expect(exit).toHaveBeenCalledWith(1);
    expect(logError).toHaveBeenCalledWith("Erro: o nome da branch nao segue o padrao esperado.");
    expect(logError).toHaveBeenCalledWith("Branch atual: invalid/update-branch-policy");
    expect(logError).toHaveBeenCalledWith("   git branch -m feat/nome-da-sua-branch");
  });

  it("should log an error and exit when running in detached HEAD", () => {
    const logError = vi.fn<(message: string) => void>();
    const exit = vi.fn<(code: number) => void>();

    runBranchNameValidation({
      exit,
      getBranchName: () => "HEAD",
      logError
    });

    expect(exit).toHaveBeenCalledWith(1);
    expect(logError).toHaveBeenCalledWith("Aviso: repositorio em detached HEAD. Push bloqueado.");
  });

  it("should log the formatted error and exit when branch lookup throws", () => {
    const logError = vi.fn<(message: string) => void>();
    const exit = vi.fn<(code: number) => void>();

    runBranchNameValidation({
      exit,
      getBranchName: () => {
        throw new Error("git command failed");
      },
      logError
    });

    expect(exit).toHaveBeenCalledWith(1);
    expect(logError).toHaveBeenNthCalledWith(1, "Erro ao validar o nome da branch.");
    expect(logError).toHaveBeenNthCalledWith(2, "git command failed");
  });

  it("should not log errors or exit when the branch name is valid", () => {
    const logError = vi.fn<(message: string) => void>();
    const exit = vi.fn<(code: number) => void>();

    runBranchNameValidation({
      exit,
      getBranchName: () => "chore/update-branch-policy",
      logError
    });

    expect(exit).not.toHaveBeenCalled();
    expect(logError).not.toHaveBeenCalled();
  });
});
