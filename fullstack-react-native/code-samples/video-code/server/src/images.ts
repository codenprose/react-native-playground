import { Router } from "express";
import { sendError, getRandBetween, sortCreatedAtDesc } from "./utils";
import multer from "multer";
import { genId, expandUrl } from "./app";
import moment from "moment";
import { Moment } from "moment";
import fetch from "node-fetch";

const storage = multer.memoryStorage();
const upload = multer({ storage });

const router = Router();

let USER_UPLOADS: { [key: string]: Upload } = {};
let IMAGES: Image[] = [];

interface Upload {
  id: string;
  createdAt: Moment;
  file: Express.Multer.File;
}

interface Image {
  id: string;
  createdAt: Moment;
  imageUrl: string;
  author: string;
}

interface SeedImage {
  format: string; // "jpeg",
  width: number; // 5616,
  height: number; // 3744,
  filename: string; // "51492538696.jpg",
  id: number; // 0,
  author: string; // "Alejandro Escamilla",
  author_url: string; // "https://alejandroescamilla.com/",
  post_url: string; // "https://unsplash.com/post/51492538696/download-by-alejandro-escamilla"
}

let SEED_IMAGES: Image[] = [];

export const seedImages = () => {
  return fetchSeedImages().then(images => {
    return (IMAGES = IMAGES.concat(images));
  });
};

const fetchSeedImages = (): Promise<Image[]> => {
  if (SEED_IMAGES.length > 0)
    return new Promise(resolve => resolve(SEED_IMAGES));

  return fetch("https://picsum.photos/list")
    .then(r => r.json())
    .then(
      (images: SeedImage[]): Image[] => {
        SEED_IMAGES = sortCreatedAtDesc(
          images.map(({ id, author }) => ({
            id: id.toString(),
            createdAt: moment().subtract({
              hours: getRandBetween(24, 72),
              minutes: getRandBetween(1, 60),
              seconds: getRandBetween(1, 60)
            }),
            imageUrl: `https://picsum.photos/200/300?image=${id}`,
            author
          }))
        );
        return SEED_IMAGES;
      }
    );
};

router.get("/", (req, res) => {
  res.send(
    IMAGES.map(image => ({ ...image, createdAt: +image.createdAt.toDate() }))
  );
});

router.post("/", (req, res) => {
  const { id, createdAt, imageUrl, author } = req.body;
  if (!id || !createdAt || !imageUrl || !author) {
    sendError(
      res,
      400,
      "Request body must include `id`, `createdAt`, `imageUrl` & `author`"
    );
  }
  const parsedCreatedAt = moment(createdAt);
  if (!parsedCreatedAt.isValid()) {
    sendError(res, 400, "Format of `createdAt` is not valid.");
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
  const id = genId();
  if (!req.file) {
    res.sendStatus(400).json({ error: "expected `file` in request " });
    return;
  }
  USER_UPLOADS[id] = {
    file: req.file,
    createdAt: moment(),
    id
  };
  res.send({ url: expandUrl(`/images/uploads/${id}`) });
});

router.get("/uploads", (req, res) => {
  res.send(
    Object.keys(USER_UPLOADS).map(id => {
      const {
        createdAt,
        file: { mimetype }
      } = USER_UPLOADS[id];
      return {
        id,
        mimetype,
        createdAt: createdAt.toString(),
        url: expandUrl(`/images/uploads/${id}`)
      };
    })
  );
});

router.get("/uploads/:id", (req, res) => {
  const { id } = req.params;
  const image = USER_UPLOADS[id];
  if (!image) {
    sendError(
      res,
      400,
      "The id for the image you are requesting was not found. Note that images reset whenever the server restarts."
    );
  }
  const {
    file: { buffer, mimetype }
  } = image;
  res.set("Content-Type", mimetype);
  res.send(buffer);
});

router.get("/test/flush", (req, res) => {
  USER_UPLOADS = {};
  IMAGES = [];
  seedImages().then(() => {
    res.sendStatus(200);
  });
});

export const ImagesController = router;
