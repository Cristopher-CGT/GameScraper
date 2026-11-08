async function searchXboxId(name) {
    const url = `https://displaycatalog.mp.microsoft.com/v7.0/productFamilies/autosuggest?market=BR&languages=pt-BR&query=${encodeURIComponent(name)}&platformdependencyname=windows.xbox&productFamilyNames=Games,Apps`;
    const response = await fetch(url);
    const data = await response.json();
    let result = null;
    let trigger = false;
    Object.values(data.Results).forEach((value) => {
        if (value.Products[0].Title.toLocaleLowerCase() !== name.toLocaleLowerCase() || trigger) {
            return;
        }
        result = value.Products[0].ProductId;
        trigger = true;
    });
    return result;
}
async function searchXboxApp(appId) {
    const url = `https://displaycatalog.mp.microsoft.com/v7.0/products?bigIds=${encodeURIComponent(appId)}&market=BR&languages=pt-BR`;
    const response = await fetch(url);
    const data = await response.json();
    const listPrice = data.Products[0]?.DisplaySkuAvailabilities[0]?.Availabilities[0]?.OrderManagementData.Price.ListPrice;
    const msrp = data.Products[0]?.DisplaySkuAvailabilities[0]?.Availabilities[0]?.OrderManagementData.Price.MSRP;
    return {
        name: data.Products[0].LocalizedProperties[0].ProductTitle,
        price: "R$ " + String(listPrice).replace('.', ','),
        platform: "Xbox/Microsoft Store"
    };
}
export default async function searchXbox(name) {
    const idResult = await searchXboxId(name);
    if (idResult === null) {
        return "Error: Item not found in Xbox/Microsoft Store";
    }
    return await searchXboxApp(idResult);
}
//# sourceMappingURL=xbox.collector.js.map