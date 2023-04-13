// @ts-nocheck
class ApiDTO {
    constructor(arr) {
        this.icao = arr[0];
        this.callsign = arr[1];
        this.origin = arr[2];
        this.long = arr[5];
        this.lat = arr[6];
        this.on_ground = arr[8];

        // this fields are used to estimate flight path until it receives an updated information
        this.velocity = arr[9];
        this.heading = arr[10];
    }

    update(lat, long) {
        this.lat = lat;
        this.long = long;
    }
}

async function init() {

    // work with fixed lat long for development
    const lat = 49.549187;
    const long = 8.439957;
    const distance = 100; // in km

    const boundingBox = getBoundingBox(lat, long, distance);

    // info output
    console.log("---| LocalSky |---");
    console.log("Verison:   0.0.1");
    console.log("boundingBox:   " + boundingBox);

    const params = new Proxy(new URLSearchParams(window.location.search), {
        get: (searchParams, prop) => searchParams.get(prop),
    });
    let value = params.debug;
    let jsonData;

    if(params.debug == undefined) {
        const api = "https://opensky-network.org/api/states/all?" +
            "lamin=" + boundingBox.minLat +
            "&lomin=" + boundingBox.minLong +
            "&lamax=" + boundingBox.maxLat +
            "&lomax=" + boundingBox.maxLong;
    
        const response = await fetch(api);
        jsonData = await response.json();
    }else {
        jsonData = JSON.parse('{"time":1681341206,"states":[["3c5433","BCS48B  ","Germany",1681341206,1681341206,7.1473,50.0068,10050.78,false,264.84,64.33,-0.33,null,9761.22,"1000",false,0],["44cdc5","BEL3326 ","Belgium",1681341206,1681341206,7.9241,49.6011,10965.18,false,220.02,303.17,0,null,10698.48,"1000",false,0],["3c49d4","EWG3001 ","Germany",1681341206,1681341206,9.458,48.7349,1280.16,false,115.47,254.23,-1.3,null,1272.54,"1336",false,0],["406542","EZY67AH ","United Kingdom",1681341206,1681341206,7.5084,49.6738,11582.4,false,221.01,303.8,0,null,11330.94,"3236",false,0],["3c70b0","BCS58L  ","Germany",1681341206,1681341206,7.3626,49.9863,10668,false,265.4,61.65,0.33,null,10347.96,"1000",false,0]]}');
    }
    

    // parse the informations
    const data = parseData(jsonData.states);

    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");
    const numberOfCircles = 5;

    // draw radar circles
    function drawRadarCircle(ctx, centerX, centerY, radius, km) {
        ctx.strokeStyle = 'grey';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
        ctx.stroke();

        // Draw distance label
        ctx.font = '14px Arial';
        ctx.fillStyle = 'grey';
        ctx.fillText(km + ' km', centerX - radius + 4, centerY);
    }

    // convert km to canvas points
    function distanceToCanvasUnits(distanceInKm) {
        const maxDistanceInCanvasUnits = canvas.width / 2;
        return (distanceInKm / distance) * maxDistanceInCanvasUnits;
    }


    // Function to convert coordinates to canvas position
    function coordToCanvasPosition(latitude, longitude) {
        const x = ((longitude - boundingBox.minLong) / (boundingBox.maxLong - boundingBox.minLong)) * canvas.width;
        const y = ((boundingBox.maxLat - latitude) / (boundingBox.maxLat - boundingBox.minLat)) * canvas.height;

        return { x, y };
    }

    // the info box
    function drawInfoBox(ctx, x, y, text) {
        const padding = 5;
        const fontSize = 14;

        ctx.font = `${fontSize}px Arial bold`;
        const textWidth = ctx.measureText(text).width;
        const boxWidth = textWidth + 2 * padding;
        const boxHeight = fontSize + 2 * padding;

        // Calculate the box position
        const boxX = x - boxWidth / 2;
        const boxY = y + padding;

        // Draw box
        ctx.fillStyle = 'rgba(255, 255, 255, 0.0)';
        ctx.fillRect(boxX, boxY, boxWidth, boxHeight);

        // Draw text
        ctx.fillStyle = 'white';
        ctx.fillText(text, boxX + padding, boxY + padding + fontSize);
    }

    // estimate flight route using heading and velocity
    function updatePosition(item, elapsedTime) {
        const R = 6371; // Earth's radius in km
        const distance = (item.velocity * elapsedTime) / 1000; // Convert m/s to km/s and multiply by elapsedTime in seconds
        const deltaLat = (distance * Math.cos(item.heading)) / R;
        const deltaLong = (distance * Math.sin(item.heading)) / (R * Math.cos((Math.PI * item.lat) / 180));

        item.update(item.lat + deltaLat * (180 / Math.PI), item.long + deltaLong * (180 / Math.PI));
        return;
    }

    // draw the aircrafts points
    function drawCanvas(data) {
        // Clear the canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Resize the canvas to match the screen size
        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        //window.addEventListener("resize", resizeCanvas);
        resizeCanvas();

        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;

        // Draw your position as the center of the canvas with a white dot
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(centerX, centerY, 5, 0, 2 * Math.PI);
        ctx.fill();

        // Draw radar circles
        for (let i = 1; i <= numberOfCircles; i++) {
            const distanceInKm = (i / numberOfCircles) * distance;
            const radius = distanceToCanvasUnits(distanceInKm);
            drawRadarCircle(ctx, centerX, centerY, radius, distanceInKm);
        }

        // Draw points with updated positions
        data.forEach((item, index) => {
            console.log(item);
            const position = coordToCanvasPosition(item.lat, item.long);

            ctx.fillStyle = 'blue';
            ctx.beginPath();
            ctx.arc(position.x, position.y, 5, 0, 2 * Math.PI);
            ctx.fill();

            drawInfoBox(ctx, position.x, position.y + 10, item.callsign);
            drawInfoBox(ctx, position.x, position.y + 30, item.origin);
        });
    }

    // inital draw
    drawCanvas(data);

    let elapsedTime = 0;
    const interval = setInterval(() => {
        elapsedTime += 1;

        // Update point positions
        for (const item of data) {
            updatePosition(item, 1);
        }

        // Redraw the canvas with updated positions
        drawCanvas(data);

        // Stop updating after 30 seconds
        if (elapsedTime >= 30) {
            clearInterval(interval);
        }
    }, 1000);
}


function getBoundingBox(lat, long, distance) {

    // Calculate the boundaries
    const R = 6371; // Earth's radius in km

    const deltaLat = distance / R;
    const deltaLong = distance / (R * Math.cos((Math.PI * lat) / 180));

    const minLat = lat - deltaLat * (180 / Math.PI);
    const maxLat = lat + deltaLat * (180 / Math.PI);
    const minLong = long - deltaLong * (180 / Math.PI);
    const maxLong = long + deltaLong * (180 / Math.PI);
    return {
        minLat: minLat,
        maxLat: maxLat,
        minLong: minLong,
        maxLong: maxLong
    };
}


function parseData(raw) {

    const parsedData = [];

    for (let i = 0; i < raw.length; i++) {
        const dto = new ApiDTO(raw[i]);
        parsedData.push(dto);
    }

    return parsedData;
}


// Function to update the point's position based on heading, velocity, and elapsed time
function updatePosition(coord, heading, velocity, elapsedTime) {
    const R = 6371; // Earth's radius in km
    const distance = (velocity * elapsedTime) / 1000; // Convert m/s to km/s and multiply by elapsedTime in seconds
    const deltaLat = (distance * Math.cos(heading)) / R;
    const deltaLong = (distance * Math.sin(heading)) / (R * Math.cos((Math.PI * coord.lat) / 180));

    return {
        lat: coord.lat + deltaLat * (180 / Math.PI),
        long: coord.long + deltaLong * (180 / Math.PI),
    };
}



init();

// update information from api every 30 seconds
const update = setInterval(() => {
    init();
}, 30100);
