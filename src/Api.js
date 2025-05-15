const API_URL_DEV = "http://localhost:8082/api";



export async function fetchLocationFromAddress(address) {
    const formdata = new FormData();    
    formdata.append("address", address);
    const response = await fetch(`${API_URL_DEV}/geolocation/coordinates`, {
        method: "POST",
        body: formdata
    });

    //return type json {latitude: number, longitude: number}

    return response.json();
}


export async function fetchEvaluation(latitude, longitude, constructionYear, floorCount) {
    const body = {
        buildingAge: parseInt(constructionYear),
        floorCount: parseInt(floorCount),
        location: {
            latitude: parseFloat(latitude.toFixed(3)),
            longitude: parseFloat(longitude.toFixed(3))
        }
    };
    
    const response = await fetch(`${API_URL_DEV}/building/evaluate`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    });

    const data = await response.json();
    console.log(data, "response");

    return data;
}
