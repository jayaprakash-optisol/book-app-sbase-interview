import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Sidebar from "../Sidebar/Sidebar";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

export default function Book() {
  const [bookData, setBookData] = useState([]);
  const [duration, setDuration] = useState(null);
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);

  let allURLParams = useParams();

  async function getBookData() {
    let { data } = await axios.get(
      `http://localhost:5000/books/book/${allURLParams.id}`
    );
    setBookData(data[0]);
  }

  console.log("bookData", bookData);

  const issueBook = async (e) => {
    try {
      const { data } = await axios.post("http://localhost:5000/book/issue", {
        bookId: bookData._id,
        issuedDurationInDays: duration,
      });
      console.log(data);
      if (data?.message === "success") {
        getBookData();
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getBookData();
  }, []);
  return (
    <>
      <Modal
        show={show}
        onHide={handleClose}
        animation={true}
        size="md"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Issue Book</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form className="py-3">
            <input
              onChange={(e) => setDuration(e.target.value)}
              className="form-control w-100"
              name="path"
              placeholder="Enter The Duration"
              type="number"
            />
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button
            variant="danger"
            className="text-white"
            onClick={() => {
              handleClose();
              issueBook();
            }}
          >
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
      <div className="overflow-hidden">
        <div className="row">
          <div className="col-2">
            <div className="position-fixed col-lg-2">
              <Sidebar />
            </div>
          </div>

          <div className="col-10 px-lg-5 px-2 my-3">
            <div className="row">
              <div className="col-lg-4">
                <div className="p-5">
                  <img
                    className="w-100 rounded-2"
                    src={`${bookData?.bookPhoto}`}
                    alt=""
                  />
                  <h4 className="text-center p-3 pb-0 fw-bolder">
                    {bookData?.title}
                  </h4>
                  <p className="text-center text-secondary fw-light">
                    {bookData.publisher}
                  </p>
                </div>
              </div>
              <div className="col-lg-8 my-1">
                <div className="p-lg-5 px-5">
                  <p className="d-none d-lg-block">
                    <span className="fw-bold">Genre</span> : {bookData.genre}
                  </p>
                  <p className="d-none d-lg-block">
                    <span className="fw-bold">Deleted</span> :{" "}
                    {bookData.isDeleted ? "Yes" : "No"}
                  </p>
                  <p className="text-secondary d-none d-lg-block fs-6">
                    <span className="fw-bold text-black">Description</span> :{" "}
                    {`${bookData.title} doing a thing for its inherent satisfaction rather than external rewards—is the key to success and satisfaction in any endeavor. A legendary performance coach shares his simple, proven, and fun methods for cultivating and keeping it. To be productive and optimistic about our personal and professional lives, we want to feel that we can understand and influence what is happening around us today, and that we have a reliable insight into what will happen tomorrow. We also require a rich, supportive, and secure social life. As more of us work remotely and the frequency of our in-person contact decreases, this desire for connection and trust has only become more important; the social drive is so strong that our body temperature drops when we feel excluded. To satisfy our psychological needs in today’s professional world, we must pursue them consciously and purposefully—but unfortunately, most of us don't know how to do so effectively.`}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
