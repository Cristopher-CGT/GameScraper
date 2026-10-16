export function collectorFailure(source: string, error: unknown): string {
    const detail = error instanceof Error ? error.message : String(error);
    return `${source}: ${detail}`;
}
