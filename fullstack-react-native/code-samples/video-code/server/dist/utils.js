"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendError = (res, code, msg) => {
    res.sendStatus(code);
    res.send({ message: msg });
};
exports.getRandBetween = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
exports.sortCreatedAtDesc = (array) => {
    return array.sort(({ createdAt: a }, { createdAt: b }) => {
        if (a.isAfter(b)) {
            return -1;
        }
        else if (a.isSame(b)) {
            return 0;
        }
        else {
            return 1;
        }
    });
};
//# sourceMappingURL=utils.js.map