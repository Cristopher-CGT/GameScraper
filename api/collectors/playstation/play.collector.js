import { collectorFailure } from '../collector-result.js';
async function searchPlaystationApp(name) {
    try {
        const url = `https://store.playstation.com/store/api/chihiro/00_09_000/tumbler/br/pt/999/${encodeURIComponent(name)}`;
        const response = await fetch(url);
        if (!response.ok) {
            return collectorFailure('Failed to fetch Id from PlayStation API', `${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        let result = collectorFailure("Error", "Item not found in Playstation");
        let trigger = false;
        Object.values(data.links).forEach((game) => {
            if (trigger) {
                return;
            }
            if (!game || typeof game !== 'object') {
                return;
            }
            const gameName = typeof game.name === 'string' ? game.name.toLowerCase() : '';
            const contentType = typeof game.game_contentType === 'string'
                ? game.game_contentType.toLowerCase()
                : '';
            if (!gameName.includes(name.toLowerCase()) || game.parent_name !== undefined || contentType === "conjunto" || !game.default_sku) {
                return;
            }
            let platformPs;
            if (gameName.includes("ps4") && gameName.includes("ps5")) {
                platformPs = "PS4/PS5";
            }
            else {
                platformPs = Array.isArray(game.playable_platform) ? game.playable_platform[0] : undefined;
            }
            if (!platformPs) {
                return;
            }
            trigger = true;
            result = {
                name: name,
                price: game.default_sku.display_price,
                platform: platformPs
            };
        });
        return result;
    }
    catch (error) {
        return collectorFailure('Failed to fetch Id from PlayStation API', error);
    }
}
;
export default async function searchPlaystation(name) {
    return await searchPlaystationApp(name);
}
//# sourceMappingURL=play.collector.js.map