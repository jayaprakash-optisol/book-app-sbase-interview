import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import Sidebar from "../Sidebar/Sidebar";
import Lottie from "lottie-web";
import { motion } from "framer-motion";

export default function AddBook() {
  const [error, setError] = useState(true);
  const [file, setFile] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(
        "http://localhost:5000/books/upload",
        formData
      );

      if (response?.status === 200) {
        setError(false);
        document.getElementById("file").value = "";
      }
    } catch (error) {
      console.log(error);
    }
  };

  const imgContainer = useRef(null);

  useEffect(() => {
    const container = imgContainer.current;
    if (!container) return;

    const anim = Lottie.loadAnimation({
      container: container,
      renderer: "svg",
      loop: true,
      autoplay: true,
      animationData: require("./../../images/addBook.json"),
    });

    return () => {
      anim.destroy();
    };
  }, []);

  return (
    <>
      <div className="overflow-hidden">
        <div className="row">
          <div className="col-2">
            <div className="position-fixed col-lg-2">
              <Sidebar />
            </div>
          </div>

          <div className="col-md-10  d-flex justify-content-center align-items-center min-vh-100">
            <motion.div
              initial={{ y: -1000 }}
              animate={{ y: 0 }}
              transition={{ duration: 0.2, type: "spring" }}
              className="p-5 w-75 text-center bg-white bg-opacity-25 my-2 shadow rounded-2"
            >
              {/* <div className="w-25 mx-auto" ref={imgContainer}></div> */}
              <p className="fw-bold fs-5">Upload Your Book Data</p>
              <form onSubmit={handleSubmit}>
                <input
                  onChange={(e) => setFile(e.target.files[0])}
                  type="file"
                  className="form-control my-2"
                  id="file"
                  name="path"
                  placeholder="Choose Your Photo"
                />

                <button className=" btn btn-danger w-100 rounded-2 text-light">
                  Upload
                </button>
              </form>
              {!error ? (
                <div className="my-3 alert alert-success">
                  Data Uploaded successfully
                </div>
              ) : null}
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
}
