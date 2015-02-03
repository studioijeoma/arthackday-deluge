var width = window.innerWidth;
var height = window.innerHeight;

setup();
draw();
// drawEnd()

function setup() {
    var canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;

    document.body.appendChild(canvas)

    context = canvas.getContext('2d');

    word = 'SEVENTYFIVE'

    wordHeight = width * .11 //context.measureText(word).width  
    context.font = 'bold ' + wordHeight + 'px Helvetica Neue, Helvetica, Arial, sans-serif';

    words = [
        'UNITED STATES',
        'MEXICO',
        'BRAZIL',
        'IRAN',
        'ISLAMIC REPUBLIC',
        'TURKEY',
        'EGYPT',
        'NIGERIA',
        'CONGO',
        // 'DEMOCRATIC REPUBLIC',
        'ETHIOPIA',
        'TANZANIA',
        'CHINA',
        'PAKISTAN',
        'PHILLIPPINES',
        'VIETNAM',
        'INDONESIA',
        'THAILAND',
        'MYANMAR',
        'BANGLADESH',
        // 'RUSSIAN FEDERATION'
        'RUSSIA',
        'RURAL',
        'LOW INCOME',
        'ELDERLY',
        'ILLITERATE',
        'FEMALE',
        'INCENTIVES',
        'AFFORDABILITY',
        'USER CAPABILITY',
        'INFRASTRUCTURE'
    ];

    letterWordRepeat = 2;

    letterCount = 0;
    wordCount = 0;

    wordDuration = 75;
    // wordDuration = 25;

    titleDuration = 10250;
    titleLetterDuration = 500;
    captionDuration = 1000;

    currentLetter = '';
    currentWord = '';

    ended = false;

    backgroundColor = 255;

    setupSequence();
}

function setupSequence() {
    MOTION.removeAll();

    titleLetters = []

    titleLettersSequence = new MOTION.Sequence();

    titleLettersSequence.add(new MOTION.Tween(captionDuration)
        .add('captionColor', [0, 255])
        .add('titleColor', [0, 255]))

    titleLettersSequence.add(new MOTION(titleDuration))
        // titleLettersSequence.add(new MOTION.Tween('captionColor', [255, 0], captionDuration))

    // for (var i = word.length - 1; i >= 0; i--) {
    //     var l = {
    //         letter: word.charAt(i),
    //         offset: context.measureText(word.substring(0, i)).width,
    //     }
    //     titleLetters.push(l)
    //     titleLettersSequence.add(new MOTION.Tween(l, 'color', [255, 0], titleLetterDuration))
    // }

    // titleLettersSequence.onEnd(setupSequence)
    titleLettersSequence
        .onStart(function() {
            backgroundTween = new MOTION.Tween('backgroundColor', [0, 255], this.duration()).play()
        }).onEnd(function() {
            ended = false;
            lettersSequence.play()
        })

    letters = [];
    letters.offset = context.measureText(word).width / 2;

    letters.x = width / 2 - letters.offset;
    letters.y = height / 2;

    for (var i = 0; i < word.length; i++) {
        var letter = word.charAt(i);
        var letterWords = [];

        for (var j in words)
            for (var k in words[j])
                if (words[j][k] === letter)
                    for (var l = 0; l < letterWordRepeat; l++)
                        letterWords.push({
                            word: words[j],
                            index: k,
                            offset: context.measureText(words[j].substring(0, k)).width
                        })

        letters.push({
            letter: letter,
            offset: context.measureText(word.substring(0, i)).width,
            words: shuffle(letterWords)
        })
    }

    lettersSequence = new MOTION.Sequence();

    for (var i in letters) {
        for (var j in letters[i].words) {
            var m = new MOTION(wordDuration).onStart(function() {
                currentLetter = this.letter;
                currentWord = this.word;
            });
            m.letter = letters[i];
            m.word = letters[i].words[j];

            lettersSequence.add(m)
        }
    }

    lettersSequence
        .onStart(function() {
            backgroundTween = new MOTION.Tween('backgroundColor', [255, 0], this.duration()).play()
        })
        .onEnd(function() {
            ended = true;
            titleLettersSequence.play();
        })
        .play()

    // titleLettersSequence.play().onEnd(function() {});
}

function draw(time) {
    requestAnimationFrame(draw);

    MOTION.update(time);

    context.fillStyle = bw(backgroundColor);
    context.fillRect(0, 0, width, height);

    if (!ended) {
        context.font = 'bold ' + wordHeight + 'px Helvetica Neue, Helvetica, Arial, sans-serif';
        context.textAlign = "start";

        context.fillStyle = bw(lettersSequence.position() * 255);
        context.fillText(currentWord.word, letters.x + currentLetter.offset - currentWord.offset, letters.y)

        context.fillStyle = 'white'
        context.fillText(currentLetter.letter, letters.x + currentLetter.offset, letters.y)
    } else {
        context.font = 'bold ' + wordHeight + 'px Helvetica Neue, Helvetica, Arial, sans-serif';
        context.textAlign = "left";

        // if (titleLettersSequence.getCurrentIndex() < 3) {
        context.fillStyle = bw(titleColor)
        context.fillText(word, letters.x, letters.y)
            // } else {
            //     for (var i in titleLetters) {
            //         context.fillStyle = bw(titleLetters[i].color)
            //         context.fillText(titleLetters[i].letter, letters.x + titleLetters[i].offset, letters.y)
            //     }
            // }

        context.font = 'bold 21px Helvetica Neue, Helvetica, Arial, sans-serif';
        context.textAlign = "center";
        context.fillStyle = bw(captionColor)
        context.fillText('percent of the 4.4 billion people offline worldwide are in 20 countries', width / 2, letters.y + 42)
        context.fillText('including the U.S., which has 50 million; 1 of out of 6 people in the U.S....', width / 2, letters.y + 70)
    }
}

function pause() {
    lettersSequence.pause();
    backgroundTween.pause();
}

function resume() {
    if (!lettersSequence.isPlaying()) {
        lettersSequence.resume();
        backgroundTween.resume();
    }
}

document.body.addEventListener('mousemove', function(e) {
    if (ended) return false;

    if (e.clientY > height / 2 - wordHeight && e.clientY < height / 2) {
        pause();
    } else {
        resume();
    }
}, false)

document.body.addEventListener('touchstart', function(e) {
    e.preventDefault();
    pause();
}, false);
document.body.addEventListener('touchend', function(e) {
    e.preventDefault();
    resume();
}, false);
document.body.addEventListener('touchmove', function(e) {
    e.preventDefault();
}, false);

function bw(c, a) {
    r = g = b = (c | 0);
    a = (a) ? a : 1;
    return 'rgba(' + r + ',' + g + ',' + b + ',' + a + ')'
}

function shuffle(array) {
    var currentIndex = array.length,
        temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}



// Filters = {};
// Filters.getPixels = function(img) {
//     var c = this.getCanvas(img.width, img.height);
//     var ctx = c.getContext('2d');
//     ctx.drawImage(img);
//     return ctx.getImageData(0, 0, c.width, c.height);
// };

// Filters.getCanvas = function(w, h) {
//     var c = document.createElement('canvas');
//     c.width = w;
//     c.height = h;
//     return c;
// };

// Filters.filterImage = function(filter, image, var_args) {
//     var args = [this.getPixels(image)];
//     for (var i = 2; i < arguments.length; i++) {
//         args.push(arguments[i]);
//     }
//     return filter.apply(null, args);
// };

// Filters.convolute = function(pixels, weights, opaque) {
//     var side = Math.round(Math.sqrt(weights.length));
//     var halfSide = Math.floor(side / 2);
//     var src = pixels.data;
//     var sw = pixels.width;
//     var sh = pixels.height;
//     // pad output by the convolution matrix
//     var w = sw;
//     var h = sh;
//     var output = Filters.createImageData(w, h);
//     var dst = output.data;
//     // go through the destination image pixels
//     var alphaFac = opaque ? 1 : 0;
//     for (var y = 0; y < h; y++) {
//         for (var x = 0; x < w; x++) {
//             var sy = y;
//             var sx = x;
//             var dstOff = (y * w + x) * 4;
//             // calculate the weighed sum of the source image pixels that
//             // fall under the convolution matrix
//             var r = 0,
//                 g = 0,
//                 b = 0,
//                 a = 0;
//             for (var cy = 0; cy < side; cy++) {
//                 for (var cx = 0; cx < side; cx++) {
//                     var scy = sy + cy - halfSide;
//                     var scx = sx + cx - halfSide;
//                     if (scy >= 0 && scy < sh && scx >= 0 && scx < sw) {
//                         var srcOff = (scy * sw + scx) * 4;
//                         var wt = weights[cy * side + cx];
//                         r += src[srcOff] * wt;
//                         g += src[srcOff + 1] * wt;
//                         b += src[srcOff + 2] * wt;
//                         a += src[srcOff + 3] * wt;
//                     }
//                 }
//             }
//             dst[dstOff] = r;
//             dst[dstOff + 1] = g;
//             dst[dstOff + 2] = b;
//             dst[dstOff + 3] = a + alphaFac * (255 - a);
//         }
//     }
//     return output;
// };

// Filters.filterImage(Filters.convolute, image, [1 / 9, 1 / 9, 1 / 9,
//     1 / 9, 1 / 9, 1 / 9,
//     1 / 9, 1 / 9, 1 / 9
// ]);
