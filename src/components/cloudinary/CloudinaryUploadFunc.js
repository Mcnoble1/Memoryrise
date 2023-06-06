export const CloudinaryUploadFunc = (options, callback) => {
  try {
    console.log({ options, callback });
    window.cloudinary.createUploadWidget(options, callback);
  } catch (err) {
    console.log(err.message);
  }
};
