const updateItem = require("../dynamodb/updateItem");

const formattedImages = (body) =>
  body.images.map((image) => {
    if (!image.alt) {
      return {
        M: {
          image_url: {
            S: image,
          },
          alt: {
            S: `${body.brand.toLowerCase()}-${body.model.toLowerCase()}-${body.model_number.toLowerCase()}-dial-${body.dial.toLowerCase()}-bezel-${body.bezel.toLowerCase()}`,
          },
        },
      };
    } else {
      return {
        M: {
          image_url: {
            S: image.image_url,
          },
          alt: {
            S: image.alt,
          },
        },
      };
    }
  });

const formatParams = (body) => {
  let params = {};
  const keys = Object.keys(body);
  keys.forEach((key) => {
    params[key] = {
      S: body[key],
    };
  });

  params = {
    ...params,
    timestamp: {
      S: new Date().toISOString(),
    },
    colorway: {
      S: `${body.model_number.toLowerCase()}-${body.dial.toLowerCase()}-${body.bezel.toLowerCase()}`,
    },
  };

  if (params.images) {
    params.images = {
      L: formattedImages(body),
    };
  }

  return params;
};

module.exports = async (body) => {
  let params = {
    Item: formatParams(body),
  };
  const result = await updateItem(params, "watchInventory");
  return result;
};
