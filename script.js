var clickCount = document.getElementById("clickCount")
var avgCpsCount = document.getElementById("avg-cps")
var topCpsCount = document.getElementById("top-cps")
var particles = document.getElementById("particles");

let measuringTime = 0.5;
let clicks = 0;
let averageCps = 0;
let highestCps = 0;
let consistency = 0;
let currentClicks = 0;
let totalIntervals = 0;

window.onload = function()
{
    document.addEventListener("click",onClick);
    setInterval(onTick,measuringTime*1000)
    setInterval(animFrame,5)

}

function hsv2rgb(h, s, v) {
    var r, g, b, i, f, p, q, t;
    if (arguments.length === 1) {
        s = h.s, v = h.v, h = h.h;
    }
    i = Math.floor(h * 6);
    f = h * 6 - i;
    p = v * (1 - s);
    q = v * (1 - f * s);
    t = v * (1 - (1 - f) * s);
    switch (i % 6) {
        case 0: r = v, g = t, b = p; break;
        case 1: r = q, g = v, b = p; break;
        case 2: r = p, g = v, b = t; break;
        case 3: r = p, g = q, b = v; break;
        case 4: r = t, g = p, b = v; break;
        case 5: r = v, g = p, b = q; break;
    }
    return "rgb(" + Math.round(r * 255) +"," + Math.round(g * 255) + "," + Math.round(b * 255) + ")";
}

let popResistance = 2;
let popRecoil = 3000;
let popRecoilScale = 40;
let popAmplifier = 500;
pv = 0;
p=0;

function onClick(e)
{
    pv = -Math.pow(popResistance,-p/popRecoilScale)*popAmplifier;
    clicks++;
    currentClicks++;
    clickCount.textContent=clicks;
    let r = Math.floor(clicks/100)*0.1;
    document.body.style.backgroundColor = hsv2rgb(r,1,1);
    createBubble(e);
}

function createBubble(e)
{
    var x = e.pageX;
    var y = e.pageY;
    var particle = document.createElement("img");
    particle.draggable = "false";
    particle.src="bubble.png";
    particle.className="particle";
    particle.style.top=y+"px";
    particle.style.left=x+"px";
    setTimeout(function(){
        particle.remove();
    },1000)
    particles.append(particle);
}
function onTick()
{
    if (currentClicks > 0)
    {
        let thisCps = currentClicks/measuringTime;
        if (thisCps>highestCps)
        {
            highestCps = thisCps;
            topCpsCount.textContent = "Highest CPS: "+highestCps;
        }
        totalIntervals++;
        averageCps = Math.round((clicks/totalIntervals)/measuringTime);
        avgCpsCount.textContent = "Average CPS: " + averageCps;
        currentClicks=0;
    }
}

function animFrame()
{
    pv+=(5/1000)*popRecoil;
    p-=pv*(5/1000);
    if (p <= 0)
    {
        p = 0;
        if (pv < 0)
            pv = 0;
    }
    clickCount.style.fontSize=(300+p)+"px";
}