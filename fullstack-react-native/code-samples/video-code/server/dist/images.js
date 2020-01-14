"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const utils_1 = require("./utils");
const multer_1 = __importDefault(require("multer"));
const app_1 = require("./app");
const moment_1 = __importDefault(require("moment"));
const node_fetch_1 = __importDefault(require("node-fetch"));
const storage = multer_1.default.memoryStorage();
const upload = multer_1.default({ storage });
const router = express_1.Router();
let USER_UPLOADS = {};
let IMAGES = [];
let SEED_IMAGES = [];
exports.seedImages = () => {
    return fetchSeedImages().then(images => {
        return (IMAGES = IMAGES.concat(images));
    });
};
const fetchSeedImages = () => {
    if (SEED_IMAGES.length > 0)
        return new Promise(resolve => resolve(SEED_IMAGES));
    return node_fetch_1.default("https://picsum.photos/list")
        .then(r => r.json())
        .then((images) => {
        SEED_IMAGES = utils_1.sortCreatedAtDesc(images.map(({ id, author }) => ({
            id: id.toString(),
            createdAt: moment_1.default().subtract({
                hours: utils_1.getRandBetween(24, 72),
                minutes: utils_1.getRandBetween(1, 60),
                seconds: utils_1.getRandBetween(1, 60)
            }),
            imageUrl: `https://picsum.photos/200/300?image=${id}`,
            author
        })));
        return SEED_IMAGES;
    });
};
router.get("/", (req, res) => {
    res.send(IMAGES.map(image => (Object.assign({}, image, { createdAt: +image.createdAt.toDate() }))));
});
router.post("/", (req, res) => {
    const { id, createdAt, imageUrl, author } = req.body;
    if (!id || !createdAt || !imageUrl || !author) {
        utils_1.sendError(res, 400, "Request body must include `id`, `createdAt`, `imageUrl` & `author`");
    }
    const parsedCreatedAt = moment_1.default(createdAt);
    if (!parsedCreatedAt.isValid()) {
        utils_1.sendError(res, 400, "Format of `createdAt` is not valid.");
    }
    IMAGES.unshift({
        id: id.toString(),
        imageUrl,
        author,
        createdAt: parsedCreatedAt
    });
    res.sendStatus(200);
});
router.post("/uploads", upload.single("image"), (req, res) => {
    const id = app_1.genId();
    if (!req.file) {
        res.sendStatus(400).json({ error: "expected `file` in request " });
        return;
    }
    USER_UPLOADS[id] = {
        file: req.file,
        createdAt: moment_1.default(),
        id
    };
    res.send({ url: app_1.expandUrl(`/images/uploads/${id}`) });
});
router.get("/uploads", (req, res) => {
    res.send(Object.keys(USER_UPLOADS).map(id => {
        const { createdAt, file: { mimetype } } = USER_UPLOADS[id];
        return {
            id,
            mimetype,
            createdAt: createdAt.toString(),
            url: app_1.expandUrl(`/images/uploads/${id}`)
        };
    }));
});
router.get("/uploads/:id", (req, res) => {
    const { id } = req.params;
    const image = USER_UPLOADS[id];
    if (!image) {
        utils_1.sendError(res, 400, "The id for the image you are requesting was not found. Note that images reset whenever the server restarts.");
    }
    const { file: { buffer, mimetype } } = image;
    res.set("Content-Type", mimetype);
    res.send(buffer);
});
router.get("/test/flush", (req, res) => {
    USER_UPLOADS = {};
    IMAGES = [];
    exports.seedImages().then(() => {
        res.sendStatus(200);
    });
});
exports.ImagesController = router;
//# sourceMappingURL=images.js.map