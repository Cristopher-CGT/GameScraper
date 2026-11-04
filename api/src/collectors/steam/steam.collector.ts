import { collectorFailure } from '../collector-result.js';

async function searchSteamId(name: string) {
    try {
        const url = `https://store.steampowered.com/api/storesearch/?term=${encodeURIComponent(name)}&l=portuguese&cc=br`;
        const response = await fetch(url);
        if (!response.ok) {
            return collectorFailure('Failed to fetch ID from Steam API', `${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        const foundItem = data.items.find((item: any) => item.name.toLocaleLowerCase() === name.toLocaleLowerCase());

        if(!foundItem) {
            return collectorFailure('Error', 'Item not found in Steam');
        }
        return String(foundItem.id);
    } catch (error) {
        return collectorFailure('Failed to fetch ID from Steam API', error);
    }
}

async function searchSteamApp(appId: string) {
    try {
        const url = `https://store.steampowered.com/api/appdetails?appids=${encodeURIComponent(appId)}&l=portuguese&cc=br`;
        const response = await fetch(url);
        if (!response.ok) {
            return collectorFailure('Failed to fetch data from Steam API', `${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        const price = data[appId].data.price_overview.final_formatted;
        
        return {
            name: data[appId].data.name,
            price: price,
            platform: "Steam"
        };
    } catch (error) {
        return collectorFailure('Failed to fetch data from Steam API', error);
    }
}

export default async function searchSteam(name: string) {
    const idResult = await searchSteamId(name);
    if (idResult.includes("Error: ")) {
        return idResult;
    }
    return await searchSteamApp(idResult);;
}