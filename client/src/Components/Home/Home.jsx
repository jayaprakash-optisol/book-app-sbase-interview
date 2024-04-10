import axios from "axios";
import React, { useEffect, useState } from "react";
import Loading from "../Loading/Loading";
import Sidebar from "../Sidebar/Sidebar";
import BookItem from "./BookItem";
import { motion } from "framer-motion";

export default function Home() {
  const [allBooks, setAllBooks] = useState([]);
  const [bookName, setBookName] = useState("");
  const [loading, setLoading] = useState(false);

  async function getDataFromURL() {
    setLoading(true);
    let { data } = await axios.get("http://localhost:5000/books/get");
    setAllBooks(data);
    setLoading(false);
  }

  async function searchBooksByName() {
    setLoading(true);
    let { data } = await axios.get(
      `http://localhost:5000/books/get/${bookName}`
    );
    setAllBooks(data);
    setLoading(false);
  }

  useEffect(() => {
    getDataFromURL();
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

          <div className="col-10 px-lg-5 px-2 my-3">
            <motion.span
              initial={{ y: -150 }}
              animate={{ y: 0 }}
              transition={{ delay: 0.2, duration: 1 }}
              className="mx-auto pe-5 pe-lg-0 p d-flex align-items-center justify-content-center"
            >
              <input
                onChange={(e) => {
                  setBookName(e.target.value);
                }}
                type="search"
                className="form-control d-inline my-4"
                placeholder="Enter Book Name ..."
                name="name"
                id="name"
              />
              <button
                onClick={searchBooksByName}
                className="btn btn-danger text-white d-inline-block ms-3 h-50"
              >
                search
              </button>
            </motion.span>
            <div className="row">
              {allBooks.length ? (
                allBooks.map((book, index) => (
                  <BookItem
                    key={index}
                    _id={book.id}
                    name={book.title}
                    category={book.category}
                    publisher={book.publisher}
                    bookPhoto={book.bookPhoto}
                    isIssued={book.isDeleted}
                  />
                ))
              ) : (
                <div className="text-center fs-4 fw-bold">No Books Found</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
