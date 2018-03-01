var directionsService = new google.maps.DirectionsService();

// generates the html for the needed box entities
function genBlocks() {

    for (h=0; h<50; h++){
        var box = document.createElement('a-box');
        //var anim = document.createElement('a-animation');
        box.addEventListener( "mouseenter", function() {box.setAttribute("position",{ x: 0, y:5, z: 0});});
        document.querySelector('a-scene').appendChild(box);
        box.setAttribute('id', 'b'+h);
        document.getElementById('b'+h).innerHTML = `<a-animation attribute="scale" dur="1500" from="0 0 0" to="1 1 1" easing="ease-in-out-quart" repeat="indefinite"></a-animation>`;
    }
}

function calcRoute(start, end) {

  var request = {
    origin: start,
    destination: end,
    travelMode: 'DRIVING'
  };
  directionsService.route(request, function(result, status) {
    if (status == 'OK') {
      pointsArray = result.routes[0].overview_path;
      for (i=0; i<pointsArray.length; i++){
        (function (i){
            setTimeout(function (){

                lat = pointsArray[i].lat()
                lng = pointsArray[i].lng()
                document.getElementById("i").src = 'https://maps.googleapis.com/maps/api/streetview?size=300x150&location='+lat+','+lng+'&heading=100&pitch=28&scale=2&key=AIzaSyCuTLLwkFCteq_ZVqLPpZTlyygI0DkXRxU';
                document.querySelector('#svim').setAttribute('material', {src: 'https://maps.googleapis.com/maps/api/streetview?size=300x150&location='+lat+','+lng+'&heading=100&pitch=28&scale=2&key=AIzaSyCuTLLwkFCteq_ZVqLPpZTlyygI0DkXRxU'})
                rgbCode = getAverageRGB(document.getElementById('i'));
                //console.log(rgbCode);

                colorVar = 'rgb('+rgbCode[3].r+','+rgbCode[3].g+','+rgbCode[3].b+')';
                var boxID =0;
                for (col=0; col<5; col++){
                    for (row=0; row<10; row++){
                        box = document.querySelector(`#b${boxID}`)
                        boxColorVar = 'rgb('+rgbCode[0][boxID]+','+rgbCode[1][boxID]+','+rgbCode[2][boxID]+')';
                        //console.log(boxColorVar);
                        box.setAttribute('position', {x: -4.5+row, y: .5+col, z: -5});
                        box.setAttribute('scale', {x: 0, y: 0, z: 0});
                        box.setAttribute('material',{ color: boxColorVar});
                        boxID++;
                        //console.log(boxID);
                    }

                }
                //document.body.style.backgroundColor = colorVar;

                document.querySelector('#sky').setAttribute('material',{ color: colorVar});
                //document.querySelector('#sky').setAttribute('material', {src: 'https://maps.googleapis.com/maps/api/streetview?size=300x150&location='+lat+','+lng+'&heading=100&pitch=28&scale=2&key=AIzaSyCuTLLwkFCteq_ZVqLPpZTlyygI0DkXRxU'});

                //document.getElementById("skyTexture").style.color = 'rgb('+rgb.r+','+rgb.g+','+rgb.b+')';
            }, 800*i);
        })(i);
      };
    };
  });
}

function getAverageRGB(imgEl) {

    var blockSize = 10, // only visit every 10 pixels
        defaultRGB = {r:1,g:0,b:0}, // for non-supporting envs
        canvas = document.createElement('canvas'),
        context = canvas.getContext && canvas.getContext('2d'),
        data, width, height,
        i = -4,
        length,
        rgb = {r:0,g:0,b:0},
        avgrgb = {r:0,g:0,b:0},
        count = 0;
        red = [];
        green = [];
        blue = [];

    if (!context) {
        return defaultRGB;
    }

    height = canvas.height = imgEl.naturalHeight || imgEl.offsetHeight || imgEl.height;
    width = canvas.width = imgEl.naturalWidth || imgEl.offsetWidth || imgEl.width;

    context.drawImage(imgEl, 0, 0);

    try {
        data = context.getImageData(0, 0, width, height);
    } catch(e) {
        /* security error, img on diff domain */alert('x');
        return defaultRGB;
    }

    length = data.data.length;

    while ( (i += blockSize * 4) < length ) {
        ++count;
        red.push(data.data[i]);
        rgb.r += data.data[i];
        rgb.g += data.data[i+1];
        green.push(data.data[i+1]);
        rgb.b += data.data[i+2];
        blue.push(data.data[i+2]);
    }

    // ~~ used to floor values
    rgb.r = ~~(rgb.r/count);
    rgb.g = ~~(rgb.g/count);
    rgb.b = ~~(rgb.b/count);
    redavg = [];
    grnavg = [];
    bluavg = [];
    console.log(red.length);
    for (i=0; i<4500; i+=90){
        raccum = 0;
        gaccum = 0;
        baccum = 0;
        for (j=0; j<10; j++){
            raccum += red[i+j];

            gaccum += green[i+j];

            baccum += blue[i+j];

        }
        redavg.push(~~(raccum/10));
        grnavg.push(~~(gaccum/10));
        bluavg.push(~~(baccum/10));
    }
    console.log(redavg.length);
    return [redavg.reverse(), grnavg.reverse(), bluavg.reverse(), rgb];

}

function playTrip(){

    genBlocks();
    calcRoute("mountain view", "san francisco");
}
alert("This project is in progress. Please use the WebVR-enabled Firefox browser.");
playTrip();