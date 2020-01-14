const API_ROOT = 'http://localhost:3000';
let id = 0;

export const fetchImages = async () => {
  const response = await fetch(`${API_ROOT}/images`);
  const images = await response.json();

  return images;
};

export const uploadImage = async uri => {
  const form = new FormData();

  form.append('image', {
    uri,
    type: 'image/jpg',
    name: 'image.jpg',
  });

  const response = await fetch(`${API_ROOT}/images/uploads`, {
    method: 'POST',
    headers: {
      'Content-type': 'multipart/form-data',
    },
    body: form,
  });

  if (response.status !== 200) {
    throw new Error(`Something went wrong, the status is ${response.status}`);
  }

  const { url } = await response.json();

  return postImage(url);
};

export const postImage = async imageUrl => {
  const params = {
    id: `${Date.now()}${id++}`,
    imageUrl,
    createdAt: Date.now(),
    author: 'Me',
  };

  const response = await fetch(`${API_ROOT}/images`, {
    method: 'POST',
    headers: {
      'Content-type': 'application/json',
    },
    body: JSON.stringify(params),
  });

  await new Promise(resolve => setTimeout(resolve, 3000));

  if (response.status !== 200) {
    throw new Error(`Something went wrong, the status is ${response.status}`);
  }
};

export const getImageFromId = id =>
  `https://unsplash.it/${600}/${600}?image=${id}`;
