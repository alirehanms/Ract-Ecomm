

import React, { useState, useEffect } from "react";
import Layout from "./../../components/Layout/Layout";
import AdminMenu from "./../../components/Layout/AdminMenu";
import toast from "react-hot-toast";
import axios from "axios";
import { Select } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../context/Auth";
const { Option } = Select;

const UpdateProduct = () => {
  const navigate = useNavigate();

  const [auth, setAuth] = useAuth();
   const { slug: id } = useParams();
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
   const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState("");
  const [shipping, setShipping] = useState("");
  const [photo, setPhoto] = useState("");
 

  useEffect(() => {
    axios.defaults.headers.common["Authorization"] = auth?.token
      ? `Bearer ${auth.token}`
      : "";
    // eslint-disable-next-line
  }, [auth?.token]);
  const handlePhotoChange = (e) => {
    setPhoto(e.target.files[0]);
  };

  const getSingleProduct = async () => {
    try {
      const { data } = await axios.get(`http://localhost:3000/product/${id}`);
      console.log("Product data:", data);
      if (data) {
        setName(data.name);
        setDescription(data.description);
        setPrice(data.price);
        setQuantity(data.quantity);
        setShipping(data.shipping ? "1" : "0");

        setCategory(data.categoryid); ////new line
          } else {
            console.log("No product found with ID:", id);
          }
        } catch (error) {
          console.log(error);
        }
       
  };

  useEffect(() => {
    getSingleProduct();
  }, [auth]);

  const getAllCategory = async () => {
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
    getAllCategory();
  }, []);


  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const productData = new FormData();
      productData.append("name", name);
      productData.append("description", description);
      productData.append("price", price);
      productData.append("quantity", quantity);
      //  productData.append("shipping", shipping ? "1" : "0");
      if (photo) {
        productData.append("photo", photo);
      }
      productData.append("categoryid", category);

  // const selectedCategory = categories.find((cat) => cat.name === category);
  // if (selectedCategory) {
  //   productData.append("category", selectedCategory.id);
  // }

      const { data } = await axios.put(
        `http://localhost:3000/product/${id}`,
        productData,
        {
          headers: {
            // "Content-Type": "multipart/form-data",
            "Content-Type": "application/json",
          },
        }
      );

      if (data?.success) {
        toast.error(data?.message);
      } else {
        if (data?.success === false) {
          navigate("/dashboard/admin/products");
        }
        toast.success("Product Updated Successfully");
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };

  // 
  const handleDelete = async () => {
    try {
      const response = await axios.delete(
        `http://localhost:3000/product/${id}`
      );
      const { status } = response;
      console.log("Status:", status); // Log the status code
      toast.success("Category deleted");
      navigate("/dashboard/admin/products");
    
    } catch (error) {
      console.error(error.message);
      toast.error("Something went wrong");
    }
  };
  return (
    <Layout title={"Dashboard - Create Product"}>
      <div className="container-fluid m-3 p-3">
        <div className="row">
          <div className="col-md-3">
            <AdminMenu />
          </div>
          <div className="col-md-9">
            <h1>Update Product</h1>
            <div className="m-1 w-75">
              <Select
                variant="true"
                placeholder="Select a category"
                size="large"
                showSearch
                className="form-select mb-3"
                onChange={(value) => {
                  setCategory(value);
                }}
                value={category}
              >
                {categories?.map((c) => (
                  <Option key={c.id} value={c.id}>
                    {c.name}
                  </Option>
                ))}
              </Select>

              <div className="mb-3">
                <label className="btn btn-outline-secondary col-md-12">
                  {photo ? photo.name : "Upload Photo"}
                  <input
                    type="file"
                    name="photo"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    hidden
                  />
                </label>
              </div>
              <div className="mb-3">
                {photo ? (
                  <div className="text-center">
                    <img
                      src={URL.createObjectURL(photo)}
                      alt="product_photo"
                      height={"200px"}
                      className="img img-responsive"
                    />
                  </div>
                ) : (
                  <div className="text-center">
                    <img
                      src={`http://localhost:3000/product/photo/${id}`}
                      alt="product_photo"
                      height={"200px"}
                      className="img img-responsive"
                    />
                  </div>
                )}
              </div>
              <div className="mb-3">
                <input
                  type="text"
                  value={name}
                  placeholder="write a name"
                  className="form-control"
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <textarea
                  type="text"
                  value={description}
                  placeholder="write a description"
                  className="form-control"
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <input
                  type="number"
                  value={price}
                  placeholder="write a Price"
                  className="form-control"
                  onChange={(e) => setPrice(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <input
                  type="number"
                  value={quantity}
                  placeholder="write a quantity"
                  className="form-control"
                  onChange={(e) => setQuantity(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <Select
                  variant="outlined"
                  value={shipping}
                  placeholder="Select Shipping"
                  size="large"
                  showSearch
                  className="form-select mb-3"
                  onChange={(value) => {
                    const shippingValue = value === "1" ? true : false;
                    setShipping(shippingValue ? "1" : "0");
                  }}
                >
                  <Option value="0">No</Option>
                  <Option value="1">Yes</Option>
                </Select>
              </div>
              <div className="mb-3">
                <button className="btn btn-primary" onClick={handleUpdate}>
                  UPDATE PRODUCT
                </button>
              </div>
              <div className="mb-3">
                <button className="btn btn-danger" onClick={handleDelete}>
                  DELETE PRODUCT
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default UpdateProduct;








