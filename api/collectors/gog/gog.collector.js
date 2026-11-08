import { collectorFailure } from '../collector-result.js';
async function searchGogId(name) {
    try {
        const url = `https://catalog.gog.com/v1/catalog?query=${encodeURIComponent(name)}&limit=5`;
        const response = await fetch(url);
        if (!response.ok) {
            return collectorFailure('Failed to fetch Id from GOG API', `${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        let trigger = false;
        let result = collectorFailure('Error', 'Item not found in GOG');
        Object.values(data.products).forEach((product) => {
            if (trigger) {
                return;
            }
            else if (product.title.toLowerCase() !== name.toLowerCase()) {
                return;
            }
            trigger = true;
            result = String(product.id);
        });
        return result;
    }
    catch (error) {
        return collectorFailure('Failed to fetch Id from GOG API', error);
    }
}
async function searchGogApp(appId, name) {
    try {
        const url = `https://api.gog.com/products/2093619782/prices?countryCode=BR`;
        const response = await fetch(url);
        if (!response.ok) {
            return collectorFailure('Failed to fetch price data from GOG API', `${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        let formattedPrice = (String(data._embedded.prices[0].finalPrice)).split(' ')[0];
        formattedPrice = "R$ " + formattedPrice?.slice(0, -2) + ',' + formattedPrice?.slice(-2);
        return {
            name: name,
            price: formattedPrice,
            platform: "GOG"
        };
    }
    catch (error) {
        return collectorFailure('Failed to fetch price data from GOG API', error);
    }
}
export default async function searchGog(name) {
    const idResult = await searchGogId(name);
    if (idResult.startsWith('Error: ')) {
        return idResult;
    }
    return await searchGogApp(idResult, name);
}
//# sourceMappingURL=gog.collector.js.map