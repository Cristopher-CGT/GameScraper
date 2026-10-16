import searchEpic from '../collectors/epic/epic.collector.js';
import searchGog from '../collectors/gog/gog.collector.js';
import searchNintendo from '../collectors/nintendo/nintendo.collector.js';
import searchPlaystation from '../collectors/playstation/play.collector.js';
import searchSteam from '../collectors/steam/steam.collector.js';
import searchXbox from '../collectors/xbox/xbox.collector.js';

export async function searchService(name: string) {
    const data = await Promise.all([
        searchEpic(name),
        searchGog(name),
        searchNintendo(name),
        searchPlaystation(name),
        searchSteam(name),
        searchXbox(name)
    ]);

    const results: object[] = [];
    data.forEach(game => {
        if (game !== null && typeof game === 'object' && !Array.isArray(game)) {
            results.push(game);
        }
    });

    return results;
}