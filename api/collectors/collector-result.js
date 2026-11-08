export function collectorFailure(source, error) {
    const detail = error instanceof Error ? error.message : String(error);
    return `${source}: ${detail}`;
}
//# sourceMappingURL=collector-result.js.map