

import React, { useState, useEffect } from "react";
import Layout from "../../components/Layout/Layout";
import AdminMenu from "../../components/Layout/AdminMenu";
import { toast } from "react-toastify";
import axios from "axios";
import CategoryForm from "../../components/Form/CategoryForm";
import { useAuth } from "../../context/Auth";
import { Modal } from "antd";

const CreateCategory = () => {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");

  const [auth, setAuth] = useAuth();
  const [visible, setVisible] = useState(false);
  const [selected, setSelected] = useState(null);
  const [updatedName, setUpdatedName] = useState("");

  // Ensure that the token in the axios headers is updated when the user or token state changes
  useEffect(() => {
    axios.defaults.headers.common["Authorization"] = auth?.token
      ? `Bearer ${auth.token}`
      : "";
    // eslint-disable-next-line
  }, [auth?.token]);
        ////////////////////POST////////////////
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        "http://localhost:3000/category",
        {
          name,
        },
        {
          headers: {
            "Content-Type": "application/json",
            /////new
          },
        }
      );
      console.log(data);
      if (data?.status === 201 && data.category) {
        toast.success(`${name} is created`);
        setName("");
        console.log("okkkkkkkk");
        getallCategory();
        setCategories((prevCategory) => [...prevCategory, data.category]);
      } else {
        toast(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(
        "Something went wrong in input form  category already exists"
      );
    }
  };

/////////////////////GET ALL////////////////////
  const getallCategory = async () => {
    try {
      const { data } = await axios.get("http://localhost:3000/category");
      if (data?.status === 200 && data.category) {
        setCategories(data?.category);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log("Error:", error.message);
      toast.error("Something went wrong");
    }
  };

  useEffect(() => {
    getallCategory();
  }, [auth]);

           /////////Update/////////
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.put(
        `http://localhost:3000/category/${selected.id}`,
        {
          name: updatedName,
        }
      );
      console.log(data);
      if (data?.status === 201 && data?.category) {
        toast.success("category updated");
        getallCategory();
        setSelected(null);
        setUpdatedName("");
        console.log("okkkkkkkk");
      } else {
        // toast.error("something went wrong");?
      }
    } catch (error) {
      toast.error("sommmmm");
    }
  };

/////////////DELETE///////////////////
  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(
        `http://localhost:3000/category/${id}`
      );
      const { status } = response;
      console.log("Status:", status); // Log the status code
      toast.success("Category deleted");
      getallCategory();
    } catch (error) {
      console.error(error.message);
      toast.error("Something went wrong");
    }
  };

  return (
    <Layout title={"Dashboard - Create Category"}>
      <div className="container-fluid m-3 p-3">
        <div className="row">
          <div className="col-md-3">
            <AdminMenu />
          </div>
          <div className="col-md-9">
            <h1>Manage Category</h1>
            <div className="p-3">
              <CategoryForm
                handleSubmit={handleSubmit}
                value={name}
                setValue={setName}
              />
            </div>
            <div className="w-75">
              <table className="table">
                <thead>
                  <tr>
                    <th scope="col">Name</th>
                    <th scope="col">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {categories?.map((c) => (
                    <>
                      <tr key={c.id}>
                        <td>{c.name}</td>
                        <td>
                          <button
                            className="btn btn-primary ms-2"
                            onClick={() => {
                              setVisible(true);
                              setUpdatedName(c.name);
                              setSelected(c);
                            }}
                          >
                            Edit
                          </button>
                          <button
                            className="btn btn-danger ms-2"
                            onClick={() => {
                              handleDelete(c.id);
                            }}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    </>
                  ))}
                </tbody>
              </table>
            </div>
            <Modal
              onCancel={() => setVisible(false)}
              footer={null}
              open={visible}
            >
              <CategoryForm
                value={updatedName}
                setValue={setUpdatedName}
                handleSubmit={handleUpdate}
              />
            </Modal>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CreateCategory;
