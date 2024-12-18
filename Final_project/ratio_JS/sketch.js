function setup() {
    createCanvas(950, 600, WEBGL);
    angleMode(DEGREES);
    colorMode(RGB, 1);
    frameRate(0);
}

function paintCircle(dataArray, r, iter) {
    const dir = [-1, 1];

    for (let i = 0; i < MAX_FREQ_BUFFER; i+=DETAIL){
        let angle = (i/MAX_FREQ_BUFFER)*180;
        let index = i;
        
        const x = r*cos(angle);
        const y = -dataArray[index];
        const z = r*sin(angle);
        
        fill(0.7, (MAX_FREQ_BUFFER-i)/MAX_FREQ_BUFFER*0.5, 0, (HISTORY_COUNT-iter)/HISTORY_COUNT);
        
        push();
        translate(x, y, z);
        box(15, y, 15);
        pop();
    }

    for (let i = 0; i <= MAX_FREQ_BUFFER; i+=DETAIL){
        let angle = -1*(i/MAX_FREQ_BUFFER)*180;
        let index = i;
        
        const x = r*cos(angle);
        const y = -dataArray[index];
        const z = r*sin(angle);
        
        fill(0.7, (MAX_FREQ_BUFFER-i)/MAX_FREQ_BUFFER*0.5, 0, (HISTORY_COUNT-iter)/HISTORY_COUNT);
        
        push();
        translate(x, y, z);
        box(15, y, 15);
        pop();
    }
}

function paintLinear(dataArray, r, iter){
    // beginShape(LINES);
    for (let i = 0; i < MAX_FREQ_BUFFER; i+=DETAIL){
        const x = -1000 + 2000*(i/MAX_FREQ_BUFFER);
        const y = -dataArray[i];
        const z = 1000-r;
        
        fill(i/MAX_FREQ_BUFFER, (MAX_FREQ_BUFFER-i)/MAX_FREQ_BUFFER, (MAX_FREQ_BUFFER-i)/MAX_FREQ_BUFFER, (HISTORY_COUNT-iter)/HISTORY_COUNT);
        
        push();
        translate(x, y, z);
        box(15, y, 15);
        // vertex(x, y, z);
        pop();
    }
    // endShape();
}

function draw() {
    if (STARTED === true){
        background(0.1,0.1,0.1,0.5);
        orbitControl();
        noStroke();
    
        translate(0, 100, 0);
    
        const myDataArray = normalizer.getData();
        history.add(myDataArray);
    
        const n = history.history.length;
        for (let i = 0; i < n; i++){
            push();
    
            if (MODE === 'CIRCLE'){
                paintCircle(history.history[i], DISTANCE*(i+1), i); 
            }else if(MODE == 'LINEAR'){
                paintLinear(history.history[i], DISTANCE*(i+1), i);
            }
            pop();
        }
    }
}