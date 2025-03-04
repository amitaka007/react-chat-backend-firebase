import { Cloudinary } from "@cloudinary/url-gen";

const cloudinary = new Cloudinary({
  cloud: {
    cloudName: "duafpzkdx",
  },
  url: {
    secure: true, // Ensures HTTPS URLs
  },
});

export default cloudinary;
