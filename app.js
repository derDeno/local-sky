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

let debug = false;

async function init() {

    // work with fixed lat long for development
    const lat = 49.549187;
    const long = 8.439957;
    const distance = 100; // in km
    const showOnGround = false;

    const boundingBox = getBoundingBox(lat, long, distance);    

    const params = new Proxy(new URLSearchParams(window.location.search), {
        get: (searchParams, prop) => searchParams.get(prop),
    });
    debug = params.debug == undefined ? false : true;

    let jsonData;

    if(!debug) {
        const api = "https://opensky-network.org/api/states/all?" +
            "lamin=" + boundingBox.minLat +
            "&lomin=" + boundingBox.minLong +
            "&lamax=" + boundingBox.maxLat +
            "&lomax=" + boundingBox.maxLong;
    
        const response = await fetch(api);
        jsonData = await response.json();
    }else {
        console.log("---| LocalSky |---");
        console.log("Verison:   0.0.1");
        console.log("DEBUG MODE");
        console.log("boundingBox:   " + boundingBox);
        console.log("SAMPLE DATA");

        jsonData = JSON.parse('{"time":1681393749,"states":[["407a06","EZY9253 ","United Kingdom",1681393747,1681393747,9.4284,49.8349,10668,false,232.16,133.56,0,null,10370.82,"5233",false,0],["3c666c","DLH1PP  ","Germany",1681393747,1681393749,8.5674,50.0443,null,true,0,70.31,null,null,null,"1000",false,0],["3c65c3","DLH1UX  ","Germany",1681393749,1681393749,8.5924,50.0415,205.74,false,71.77,249.88,-3.25,null,198.12,"5260",false,0],["3c5ee6","EWG6K   ","Germany",1681393748,1681393748,9.3395,48.7124,822.96,false,79.09,252.98,-4.23,null,822.96,"1373",false,0],["3c65c4","DLH85E  ","Germany",1681393748,1681393748,9.308,49.6272,3070.86,false,146.97,6.23,-3.9,null,3009.9,"1000",false,0],["3d1283","DEFGL   ","Germany",1681393749,1681393749,9.7933,49.3398,1554.48,false,75.95,130.05,0.33,null,1531.62,"3722",false,0],["3c6744","DLH111  ","Germany",1681393748,1681393748,9.4539,49.8127,3550.92,false,148.79,306,-6.18,null,3505.2,"1000",false,0],["3c6749","DLH4A   ","Germany",1681393747,1681393747,8.6908,50.0649,609.6,false,72.92,249.78,-4.23,null,601.98,"1000",false,0],["3c6752","DLH8W   ","Germany",1681393744,1681393744,8.5341,50.0369,null,true,7.72,67.5,null,null,null,"1000",false,0],["3c6750","DLH1FN  ","Germany",1681393508,1681393508,8.5701,50.0444,null,true,4.37,157.5,null,null,null,"1000",false,0],["3c674d","DLH52H  ","Germany",1681393742,1681393748,8.6218,50.0669,563.88,false,13.38,70.31,null,null,556.26,"1000",false,0],["3d24b9","DEMDT   ","Germany",1681393749,1681393749,8.4814,49.2879,518.16,false,49.01,249.09,-4.55,null,510.54,"7000",false,0],["3c6589","DLH62T  ","Germany",1681393748,1681393748,9.3269,50.0003,1851.66,false,135.37,316.54,-4.55,null,1821.18,"1000",false,0],["3c6588","DLH839  ","Germany",1681393749,1681393749,8.5162,50.0417,null,true,14.92,250.31,null,null,null,"3513",false,0],["3c6595","DLH8RY  ","Germany",1681393748,1681393749,8.9333,50.1165,1318.26,false,123.52,301.37,-3.9,null,1303.02,"1000",false,0],["3c64a2","DLH65N  ","Germany",1681393747,1681393748,7.5482,49.8965,6355.08,false,221.61,283.42,3.25,null,6195.06,"0630",false,0],["3c64ad","DLH73N  ","Germany",1681393748,1681393748,9.0939,50.1468,1417.32,false,130.26,283.71,-6.83,null,1394.46,"5567",false,0],["505e93","OMFTS   ","Slovakia",1681393735,1681393735,8.5553,50.0295,null,true,0,157.5,null,null,null,null,false,0],["44d9b6","FYG71M  ","Belgium",1681393748,1681393748,8.4721,50.2147,11879.58,false,249.37,94.85,0.33,null,11567.16,"1000",false,0],["3c6654","DLH7LK  ","Germany",1681393748,1681393748,9.157,50.2223,2346.96,false,129.91,223.56,-4.23,null,2301.24,"1344",false,0],["3cf14e","DCSRM   ","Germany",1681393742,1681393747,9.4038,48.7243,1127.76,false,110.18,255.12,-6.83,null,1112.52,"1267",false,0],["3dd410","DHAOE   ","Germany",1681393491,1681393561,8.065,48.8446,541.02,false,67.49,146.19,2.6,null,548.64,"7012",false,0],["3c6483","DLH21W  ","Germany",1681393748,1681393748,9.1766,49.3514,4297.68,false,193.13,12.15,-5.2,null,4206.24,"1000",false,0],["3c644a","DLH9C   ","Germany",1681393749,1681393749,9.177,48.7631,5486.4,false,177.32,5.66,0,null,5356.86,"1000",false,0],["3fbdfc","JOKER13 ","Germany",1681393748,1681393748,9.6057,49.6294,495.3,false,45.1,304.78,-0.33,null,487.68,null,false,0],["3dd464","DHARK   ","Germany",1681393748,1681393748,8.0719,49.0572,541.02,false,64.92,176.82,1.63,null,548.64,"7000",false,0],["440181","EJU4082 ","Austria",1681393747,1681393748,7.899,50.2906,11887.2,false,235.63,144.96,0,null,11597.64,"1000",false,0],["3dd37a","DHAIK   ","Germany",1681393744,1681393744,9.2791,49.6124,601.98,false,34.14,173.95,-0.33,null,594.36,null,false,0],["4bb286","THY80H  ","Turkey",1681393747,1681393747,8.0403,50.2037,10058.4,false,228.68,106.6,0,null,9753.6,"0103",false,0],["44ce6a","BEL3NB  ","Belgium",1681393748,1681393749,8.8583,48.7117,10050.78,false,213.76,145.39,0.33,null,9753.6,"1000",false,0],["3d2d85","DEPMJ   ","Germany",1681393748,1681393748,8.5361,49.1426,1851.66,false,44.53,319.69,3.25,null,1828.8,"4452",false,0],["4855d1","KLM67B  ","Kingdom of the Netherlands",1681393748,1681393748,8.5542,49.6435,10668,false,226.76,155.47,-0.65,null,10332.72,"1000",false,0],["3c6d43","ITY227  ","Germany",1681393749,1681393749,8.4831,48.9119,10058.4,false,224.83,142.34,-0.33,null,9730.74,"0564",false,0],["4baa6c","THY7VP  ","Turkey",1681393748,1681393749,9.2119,48.6906,434.34,true,11.83,73.12,null,null,null,"6426",false,0],["02a194","TAR745  ","Tunisia",1681393749,1681393749,8.5772,49.8053,2735.58,false,143.55,159.88,12.03,null,2682.24,"2505",false,0],["3d323f","DERGX   ","Germany",1681393697,1681393711,7.4034,50.3258,1127.76,false,25.95,283.76,-0.33,null,1043.94,"7000",false,0],["406669","EZY13VM ","United Kingdom",1681393749,1681393749,9.2691,49.8052,10965.18,false,235.75,301.44,0,null,10668,"3226",false,0],["4d00c6","LGL22FQ ","Luxembourg",1681393749,1681393749,8.8184,49.7064,7315.2,false,155.3,293.42,0,null,7132.32,"1000",false,0],["3006b5","DLA77P  ","Italy",1681393667,1681393667,8.5598,50.0406,null,true,10.8,70.31,null,null,null,"1000",false,0],["4ba9c3","THY4SU  ","Turkey",1681393711,1681393711,8.5708,50.0464,null,true,0,90,null,null,null,null,false,0],["3d4107","DEWWL   ","Germany",1681393749,1681393749,8.1309,49.9413,701.04,false,61.39,76.43,-3.9,null,685.8,"7000",false,0],["3d0fa6","DEEEG   ","Germany",1681393742,1681393742,7.8433,49.5358,2110.74,false,62.01,157.05,5.53,null,2087.88,"4451",false,0],["448c6a","OOCCJ   ","Belgium",1681393749,1681393749,8.4805,49.9639,1333.5,false,100.86,271.46,22.43,null,1325.88,null,false,0],["300393","DLA7AE  ","Italy",1681393620,1681393620,8.5944,50.047,null,true,10.29,345.94,null,null,null,"1000",false,0],["44065b","AUA212  ","Austria",1681393710,1681393710,8.566,50.0451,null,true,0,115.31,null,null,null,"1000",false,0],["3c4dd1","DLH5PF  ","Germany",1681393749,1681393749,8.6242,50.0674,586.74,false,65.45,249.29,-5.53,null,571.5,"1000",false,0],["3444ca","VLG29DW ","Spain",1681393748,1681393749,9.1962,48.688,null,true,1.54,165.94,null,null,null,"3541",false,0],["3c4dc1","DLH8YA  ","Germany",1681393749,1681393749,9.6159,49.5189,6096,false,189.63,292.32,0,null,5935.98,"1000",false,0],["4bb852","PGT1AT  ","Turkey",1681393747,1681393747,8.5562,50.0416,null,true,10.8,250.31,null,null,null,null,false,0],["406a62","EXS45RA ","United Kingdom",1681393748,1681393749,8.7534,49.4749,11582.4,false,231.02,327.09,0,null,11300.46,"0606",false,0],["3c5461","DLH163  ","Germany",1681393749,1681393749,9.3714,50.3918,2606.04,false,145.92,232.16,-7.8,null,2560.32,"1000",false,0],["3c66e5","DLH05Y  ","Germany",1681393748,1681393748,9.1456,49.1542,10447.02,false,242.89,114.39,-10.08,null,10195.56,"1000",false,0],["3c66a8","DLH3CF  ","Germany",1681393749,1681393749,9.344,49.8549,3048,false,146.36,3.43,-1.95,null,3009.9,"1000",false,0],["3c66ac","DLH92F  ","Germany",1681393744,1681393744,8.5829,50.0486,null,true,7.46,70.31,null,null,null,"5360",false,0],["3c66aa","DLH5J   ","Germany",1681393747,1681393748,8.5227,50.1325,2468.88,false,94.54,250.28,-4.88,null,2453.64,"1000",false,0],["3c66b2","OCN4AF  ","Germany",1681393721,1681393743,8.5743,50.0487,167.64,true,0,216.56,null,null,null,"5374",false,0]]}');
        console.log(jsonData);
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

            if(debug) console.log(item);

            if(!showOnGround && item.on_ground) {
                return;
            }

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
