import axios from "axios";
import React, { useEffect, useState } from "react";
import Sidebar from "../Sidebar/Sidebar";
import { motion } from "framer-motion";

export default function RemovedBooks() {
  const [allBooks, setAllBooks] = useState("");

  async function getDataFromURL() {
    let { data } = await axios.get("http://localhost:5000/books/removed-books");
    setAllBooks(data);
  }

  async function returnBook(id) {
    await axios.patch(`http://localhost:5000/books/add/${id}`);
    getDataFromURL();
  }

  useEffect(() => {
    getDataFromURL();
  }, []);

  return (
    <>
      <div className="overflow-hidden">
        <div className="row">
          <div className="col-2 ">
            <div className="position-fixed col-lg-2">
              <Sidebar />
            </div>
          </div>

          <div className="col-10 px-5 ps-0 ps-lg-5 my-1 ">
            <div className="text-center mt-5 mb-2">
              <motion.h2
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ delay: 0.5, duration: 1 }}
                className="fw-bold p-3"
              >
                Deleted Books
              </motion.h2>
            </div>
            <motion.table
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 2 }}
              className="table border border-2 border-opacity-50 border-secondary text-center table-striped border table-hover table-responsive"
              border=""
            >
              <thead>
                <tr>
                  <th>#</th>
                  <th>Title</th>
                  <th>Genre</th>
                  <th>Publisher</th>
                  <th>Removed On</th>
                  <th>Return to Store</th>
                </tr>
              </thead>
              <tbody>
                {allBooks?.length ? (
                  allBooks &&
                  allBooks.map((book, index) => (
                    <motion.tr
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: index * 0.1 || 0.1 }}
                      key={book.id}
                    >
                      <td className="d-none d-md-table-cell">{index + 1}</td>
                      <td>{book.title}</td>
                      <td>{book.genre}</td>
                      <td>{book.publisher}</td>
                      <td>{new Date(book.deletedAt).toLocaleDateString()}</td>
                      <td>
                        <button
                          onClick={() => {
                            returnBook(book.id);
                          }}
                          className="btn btn-secondary"
                        >
                          Return
                        </button>
                      </td>
                    </motion.tr>
                  ))
                ) : (
                  <tr>
                    <td className="fw-bold" colSpan={6}>
                      No Deleted Books Found
                    </td>{" "}
                  </tr>
                )}
              </tbody>
            </motion.table>
          </div>
        </div>
      </div>
    </>
  );
}
