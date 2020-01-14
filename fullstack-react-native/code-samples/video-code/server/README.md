## API Reference

Boot:

```
$ yarn
$ yarn run dev
```

### `GET /images`

Returns a list of all images, sorted `createdAt` descending. Is pre-seeded with images from `unsplash.it`. Stock images will have a `createdAt` greater than one day ago.

#### Request

```bash
curl localhost:3000/images
```

#### Response

```json
[
  {
    "id": "1047",
    "createdAt": 1538499598819,
    "imageUrl": "https://picsum.photos/200/300?image=1047",
    "author": "sergee bee"
  },
  {
    "id": "1018",
    "createdAt": 1538499598819,
    "imageUrl": "https://picsum.photos/200/300?image=1018",
    "author": "Andrew Ridley"
  },
  {
    "id": "998",
    "createdAt": 1538499598819,
    "imageUrl": "https://picsum.photos/200/300?image=998",
    "author": "Joanna Kosinska"
  }
  // ...
]
```

### `POST /images/uploads`

Upload a new image file. The request must be a `multipart/form-data` request (`enctype=multipart/form-data`). The name of the image field is `image`.

#### Request

Here's how you can upload the test image from the root directory with `curl`:

```bash
curl -F 'image=@test/sample-image.jpg' http://localhost:3000/images/uploads
```

### `POST /images`

Create a new image post.

#### Request

Expects a body with attributes:

```
id, createdAt, imageUrl, author
```

We use the Moment library to parse. `createdAt` must pass `moment(createdAt).isValid()`. [See more here](https://momentjs.com/docs/#/parsing/string/).

#### Response

None. Status `200`.

#### Response

The `url` of the uploaded image file:

```bash
{"url":"http://localhost:3000/images/uploads/1"}
```

The `url` here is what you'll send as `imageUrl` in your `POST /images` request.

### `GET /images/uploads`

Lists out all uploaded images. Probably not needed for client app.

#### Request

```bash
curl http://localhost:3000/images/uploads
```

#### Response

```json
[
  {
    "id": "1",
    "mimetype": "image/jpeg",
    "createdAt": 1538499598819,
    "url": "http://localhost:3000/images/uploads/1"
  },
  {
    "id": "2",
    "mimetype": "image/jpeg",
    "createdAt": 1538499598819,
    "url": "http://localhost:3000/images/uploads/2"
  }
]
```

### `GET /images/uploads/:id`

This serves the raw image data.
