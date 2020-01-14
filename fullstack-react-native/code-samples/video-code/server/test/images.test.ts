import request from "supertest";
import { Response } from "supertest";
import app, { genId } from "../src/app";
import fs from "fs";
import path from "path";
import moment from "moment";

const SAMPLE_IMAGE_PATH = path.join(__dirname, "./sample-image.jpg");
const URL_REGEX = /http\:\/\/localhost\:\d+\/images\/uploads\/(\d+)/;

describe("/images", () => {
  beforeEach(done => {
    request(app)
      .get("/images/test/flush")
      .expect(200)
      .end(done);
  });
  it("should return a list of images", done => {
    return request(app)
      .get("/images")
      .expect(200)
      .end((err, res) => {
        if (err) throw err;

        expect(res.body.length).toBeGreaterThan(100);
        const oneDayAgo = moment().subtract({ hours: 23 });
        const recent = res.body.find(i =>
          moment(i.createdAt).isAfter(oneDayAgo)
        );
        expect(recent).toBeUndefined();
        done();
      });
  });

  describe("uploading", () => {
    let file;
    let url;
    let uploadId: undefined | string;
    beforeEach(done => {
      file = fs.createReadStream(SAMPLE_IMAGE_PATH);
      request(app)
        .post("/images/uploads")
        .type("form")
        .attach("image", file)
        .expect(200)
        .end((err, res) => {
          if (err) throw err;

          url = res.body.url;
          expect(url).toMatch(URL_REGEX);
          uploadId = url.match(URL_REGEX)[1];
          done();
        });
    });
    afterEach(() => {
      file.close();
    });
    it("should store the file in memory", done => {
      return request(app)
        .get("/images/uploads")
        .expect(res => {
          let u;
          try {
            u = res.body[0].url;
          } catch (err) {
            throw new Error(
              `Expected array with an object with 'id' and 'url'. Got: ${JSON.stringify(
                res.body
              )}`
            );
          }
          expect(u).toEqual(url);
        })
        .end(done);
    });

    it("should serve the file at url", done => {
      return request(app)
        .get(`/images/uploads/${uploadId}`)
        .expect(200)
        .end((err, res: Response) => {
          if (err) throw err;

          fs.readFile(SAMPLE_IMAGE_PATH, (err, data) => {
            if (err) throw err;

            expect(res.body).toEqual(data);
            done();
          });
        });
    });

    describe("creating a new image post", () => {
      let post;
      beforeEach(done => {
        post = {
          id: genId().toString(),
          createdAt: moment().format(),
          imageUrl: url,
          author: "Marie Kondo"
        };
        request(app)
          .post("/images")
          .send(post)
          .expect(200)
          .end(done);
      });

      it("creates the image at the top of the response", done => {
        done();
        return request(app)
          .get("/images")
          .expect(200)
          .end((err, res: Response) => {
            if (err) throw err;

            // check that the post is there and in right position
            const idx = res.body.findIndex(
              p =>
                p.id === post.id &&
                p.author === post.author &&
                moment(p.createdAt).isSame(post.createdAt)
            );
            expect(idx).toEqual(0);

            // assert the next post has a much earlier timestamp
            const second = res.body[1];
            const { createdAt } = second;
            expect(
              moment(createdAt).isBefore(moment().subtract({ hours: 23 }))
            ).toBe(true);
            done();
          });
      });
    });
  });
});
