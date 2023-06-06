import React, { useCallback, useState, useMemo, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import styles from "./Uploader.module.css";
import axios from "axios";
import { CircularProgress, Modal, Paper } from "@mui/material";

const images = { "image/*": [".png", ".jpg", ".jpeg", ".gif", ".webp", ".svg"] };
const videos = { "video/*": [".mpg", ".mp4", ".3gp", ".avi", ".mkv", ".wmv"] };
const audios = {
  "audio/*": [".mp3", ".wav", ".aac", ".amr", ".ogg", ".aiff", ".m4a", ".flac", ".opus"],
};

const Uploader = ({ openUploader, setOpenUploader, saveMedia, folder, source }) => {
  const [selectedMedia, setSelectedMedia] = useState([]);
  const [uploadStatus, setUploadStatus] = useState("");
  const [showProgress, setShowProgress] = useState(false);
  const [error, setError] = useState("");

  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    if (acceptedFiles.length > 2) {
      setError("You have exceeded the max number of files!");
      alert("You have exceeded the max number of files!");
      return;
    }
    acceptedFiles.forEach((file) => {
      setSelectedMedia((prevState) => [...prevState, file]);
    });
  }, []);

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject,
    acceptedFiles,
    fileRejections,
  } = useDropzone({
    // onDrop,
    accept: source == "images" ? images : source == "videos" ? videos : audios,
    // multiple: true,
    maxFiles: 2,
  });

  const acceptedFileItems = acceptedFiles.map((file) => {
    setSelectedMedia((prevState) => [...prevState, file]);
  });

  const fileRejectionItems = fileRejections.map(({ file, errors }) => (
    <li key={file.path}>
      {file.path} - {file.size} bytes
      <ul>
        {errors.map((e) => (
          <li key={e.code}>{e.message}</li>
        ))}
      </ul>
    </li>
  ));

  const onUpload = async () => {
    setUploadStatus("Uploading....");
    setShowProgress(true);
    const formData = new FormData();
    formData.append("folder", folder);

    selectedMedia.forEach((image) => {
      formData.append("file", image);
    });

    try {
      const response = await axios.post("/api/cloudinary/upload", formData);
      // console.log(response.data);

      // setUrls(response.data.urls);

      for (let url in response.data.urls) {
        await saveMedia(url);
      }

      setUploadStatus("upload successful");
      setShowProgress(false);

      setTimeout(() => {
        setSelectedMedia([]);
        setOpenUploader(false);
      }, 1000);
    } catch (error) {
      console.log("imageUpload" + error);
      setUploadStatus("Upload failed..");
      setShowProgress(false);
    }
  };

  const style = useMemo(
    () => ({
      ...(isDragAccept ? { borderColor: "#00e676" } : {}),
      ...(isDragReject ? { borderColor: "#ff1744" } : {}),
    }),
    [isDragAccept, isDragReject]
  );

  const handleCloseUploader = () => {
    setOpenUploader(false);
  };

  return (
    <Modal open={openUploader} onClose={handleCloseUploader}>
      <Paper
        sx={{
          padding: "30px",
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "80%",
          backgroundColor: "#fff",
          border: "2px solid #000",
          boxShadow: 24,
          p: 4,
        }}
      >
        <div className={styles.container}>
          <div className={styles.dropzone} {...getRootProps({ style })}>
            <input {...getInputProps()} />
            {isDragActive ? (
              <p>Drop file(s) here ...</p>
            ) : (
              <p>Drag and drop file(s) here, or click to select files</p>
            )}
          </div>
          <div className={styles.images} sx={{ minHeight: "400px" }}>
            {selectedMedia.length > 0 &&
              selectedMedia.map((url, index) => {
                console.log({ url });

                if (source == "images") {
                  debugger;
                  return <img src={`${URL.createObjectURL(url)}`} key={index} alt="" />;
                } else if (source == "videos") {
                  return (
                    <video
                      width="250"
                      height="250"
                      controls
                      style={{ paddingRight: "40px" }}
                      key={index}
                    >
                      <source src={`${URL.createObjectURL(url)}`} />
                      Your browser does not support the video tag.
                    </video>
                  );
                } else {
                  return (
                    <audio width="250" height="200" controls>
                      <source src={`${URL.createObjectURL(url)}`} />
                      Your browser does not support the audio element.
                    </audio>
                  );
                }
              })}
          </div>
          {selectedMedia.length > 0 && (
            <div className={styles.btn} style={{ float: "right" }}>
              {showProgress ? (
                <CircularProgress />
              ) : (
                <button onClick={onUpload}>Upload image(s)</button>
              )}

              <p>{uploadStatus}</p>
            </div>
          )}

          <ul style={{ color: "green" }}>{acceptedFileItems}</ul>
          <ul style={{ color: "red" }}>{fileRejectionItems}</ul>
        </div>
      </Paper>
    </Modal>
  );
};

export default Uploader;

//https://cloudinary.com/blog/guest_post/upload-images-with-react-dropzone
