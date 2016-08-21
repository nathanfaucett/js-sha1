var isArray = require("@nathanfaucett/is_array"),
    isString = require("@nathanfaucett/is_string"),
    isFunction = require("@nathanfaucett/is_function"),
    fastSlice = require("@nathanfaucett/fast_slice"),
    hex = require("@nathanfaucett/hex_encoding"),
    utf8 = require("@nathanfaucett/utf8_encoding"),
    bin = require("@nathanfaucett/bin_encoding"),
    words = require("@nathanfaucett/words_encoding");


var ARRAY = new Array(80);


module.exports = sha1Wrap;


function sha1Wrap(message, options) {
    var digestbytes = words.wordsToBytes(sha1(message));

    return (
        options && options.asBytes ? digestbytes :
        options && options.asString ? bin.bytesToString(digestbytes) :
        hex.bytesToString(digestbytes)
    );
}

sha1Wrap.blocksize = 16;
sha1Wrap.digestsize = 20;

function sha1(message) {
    var m, l, w, H0, H1, H2, H3, H4, a, b, c, d, e, i, il, j, n, t;

    if (isString(String)) {
        message = utf8.stringToBytes(message);
    } else if (typeof(Buffer) !== "undefined" && isFunction(Buffer.isBuffer) && Buffer.isBuffer(message)) {
        message = fastSlice(message);
    } else if (!isArray(message)) {
        message = message.toString();
    }

    m = words.bytesToWords(message);
    l = message.length * 8;
    w = ARRAY;
    H0 = 1732584193;
    H1 = -271733879;
    H2 = -1732584194;
    H3 = 271733878;
    H4 = -1009589776;

    m[l >> 5] |= 0x80 << (24 - l % 32);
    m[((l + 64 >>> 9) << 4) + 15] = l;

    for (i = 0, il = m.length; i < il; i += 16) {
        a = H0;
        b = H1;
        c = H2;
        d = H3;
        e = H4;

        for (j = 0; j < 80; j++) {
            if (j < 16) {
                w[j] = m[i + j];
            } else {
                n = w[j - 3] ^ w[j - 8] ^ w[j - 14] ^ w[j - 16];
                w[j] = (n << 1) | (n >>> 31);
            }

            t = ((H0 << 5) | (H0 >>> 27)) + H4 + (w[j] >>> 0) + (
                j < 20 ? (H1 & H2 | ~H1 & H3) + 1518500249 :
                j < 40 ? (H1 ^ H2 ^ H3) + 1859775393 :
                j < 60 ? (H1 & H2 | H1 & H3 | H2 & H3) - 1894007588 :
                (H1 ^ H2 ^ H3) - 899497514
            );

            H4 = H3;
            H3 = H2;
            H2 = (H1 << 30) | (H1 >>> 2);
            H1 = H0;
            H0 = t;
        }

        H0 += a;
        H1 += b;
        H2 += c;
        H3 += d;
        H4 += e;
    }

    return [H0, H1, H2, H3, H4];
}
