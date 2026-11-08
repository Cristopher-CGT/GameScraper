async function Normalize(text) {
    let normalizedText = text.replace(/ /g, "-");
    normalizedText = normalizedText.replace(/:/g, "");
    return normalizedText.toLocaleLowerCase();
}
async function searchNintendoApp(name) {
    const url1 = `https://www.nintendo.com/pt-br/store/products/${await Normalize(name)}-switch/`;
    const url2 = `https://www.nintendo.com/pt-br/store/products/${await Normalize(name)}-switch-2/`;
    const result1 = await fetch(url1);
    const result2 = await fetch(url2);
    let switch1 = true;
    let switch2 = true;
    if (!result1.ok) {
        switch1 = false;
    }
    if (!result2.ok) {
        switch2 = false;
    }
    if (!switch1 && !switch2) {
        return "Error: Item not found in Nintendo";
    }
    const price = (switch1 && switch2 ? (await result1.text()).split("v_price=")[2]?.split("\\u0026v_country=BR")[0] + "/" + (await result2.text()).split("v_price=")[2]?.split("\\u0026v_country=BR")[0]
        : (switch1 ? (await result1.text()).split("v_price=")[2]?.split("\\u0026v_country=BR")[0]
            : (await result2.text()).split("v_price=")[2]?.split("\\u0026v_country=BR")[0]));
    const plataform = (switch1 && switch2 ? "Nintendo Switch 1 e 2" : (switch1 ? "Nintendo Switch 1" : "Nintendo Switch 2"));
    return {
        name,
        price: "R$ " + price?.replace(".", ","),
        platform: plataform
    };
}
export default async function searchNintendo(name) {
    return await searchNintendoApp(name);
}
//# sourceMappingURL=nintendo.collector.js.map