import { collectorFailure } from '../collector-result.js';
async function searchEpicId(name) {
    try {
        const url = `https://api.egdata.app/search/natural-language`;
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "query": name,
            })
        });
        if (!response.ok) {
            return collectorFailure('Failed to fetch Id from Epic Games API', `${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        let trigger = false;
        let result = collectorFailure("Error", "Item not found in Epic Games");
        Object.values(data.matches).forEach((match) => {
            if (trigger) {
                return;
            }
            else if (match.offer.offerType.toLocaleLowerCase() !== "base_game" || match.offer.title.toLocaleLowerCase() !== name.toLocaleLowerCase()) {
                return collectorFailure('Error', 'Item not found in Epic Games');
            }
            trigger = true;
            result = String(match.offer.id);
        });
        return result;
    }
    catch (error) {
        return collectorFailure('Failed to fetch Id from Epic Games API', error);
    }
}
async function searchEpicApp(appId, name) {
    try {
        const url = `https://api.egdata.app/offers/${appId}/price?country=BR`;
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });
        if (!response.ok) {
            return collectorFailure('Failed to fetch price data from Epic Games API', `${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        const formattedPrice = 'R$ ' + String(data.price.discountPrice).slice(0, -2) + ',' + String(data.price.discountPrice).slice(-2);
        return {
            name: name,
            price: formattedPrice,
            platform: "Epic Games"
        };
    }
    catch (error) {
        return collectorFailure('Failed to fetch price data from Epic Games API', error);
    }
}
export default async function searchEpic(name) {
    const idResult = await searchEpicId(name);
    if (idResult.startsWith('Error: ')) {
        return idResult;
    }
    return await searchEpicApp(idResult, name);
}
//# sourceMappingURL=epic.collector.js.map