"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const images_1 = require("./images");
images_1.seedImages();
exports.app = express_1.default();
exports.app.use(express_1.default.json());
const port = process.env.NODE_ENV === "test" ? 3105 : process.env.PORT || 3000;
exports.app.set("port", port);
exports.expandUrl = (path) => `http://localhost:${port}${path}`;
exports.app.use("/images/", images_1.ImagesController);
exports.genId = ((i) => () => (i++).toString())(1);
exports.app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}/`);
});
exports.default = exports.app;
//# sourceMappingURL=app.js.map