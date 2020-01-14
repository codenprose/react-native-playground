import express from "express";

import { ImagesController, seedImages } from "./images";

seedImages();

export const app = express();
app.use(express.json());

const port = process.env.NODE_ENV === "test" ? 3105 : process.env.PORT || 3000;
app.set("port", port);

export const expandUrl = (path: string) => `http://localhost:${port}${path}`;

app.use("/images/", ImagesController);

export const genId = ((i: number) => () => (i++).toString())(1);

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/`);
});

export default app;
