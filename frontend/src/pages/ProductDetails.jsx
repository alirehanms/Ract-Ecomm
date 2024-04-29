
import React, { useState, useEffect } from "react";
import axios from "axios";
import Layout from "../components/Layout/Layout";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

const ProductDetails = () => {
  const params = useParams();
  const [product, setProduct] = useState({});
  const [relatedProducts, setRelatedProducts] = useState([]);

  useEffect(() => {
    if (params?.slug) getProduct();
  }, []);

  const getProduct = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/product/${params.slug}`
      );
      if (response?.status === 200) {
        setProduct(response.data);
        getRelatedProducts(response.data.id, response.data.category.id);
      }
    } catch (error) {
      console.log("Error:", error.message);
      toast.error("Something went wrong");
    }
  };

  const getRelatedProducts = async (productId, categoryId) => {
    try {
      const response = await axios.get(
        `http://localhost:3000/product/related/${productId}/${categoryId}`
      );
      console.log(response);
      if (response?.status === 200) {
        setRelatedProducts(response.data.products);
      }
    } catch (error) {
      console.log("Error:", error.message);
      toast.error("Something went wrong");
    }
  };

  useEffect(() => {
    if (product.id) {
      getRelatedProducts(product.id, product.category?.id);
    }
  }, [product.id]);

  return (
    <Layout>
      <div className="row container">
        <div className="col-md-4">
          <div
            className="card mt-4 d-flex justify-content-center align-items-center"
            style={{ width: "18rem", height: "18rem" }}
          >
            <img
              src={`http://localhost:3000/product/photo/${product.id}`}
              alt={product.name}
              className="card-img-top"
              style={{ maxHeight: "200px", objectFit: "cover" }}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "path/to/default-image.jpg";
              }}
              loading="lazy"
            />
          </div>
        </div>
        <div className="col-md-4 mt-5">
          <h1 className="text-center">Product Details</h1>
          <h6> Name : {product.name}</h6>
          <h6> description : {product.description}</h6>

          <h6> Price : ${product.price}</h6>
          <h6>Category: {product.category?.name}</h6>
          <button className="btn btn-secondary ms-1">Add TO Cart</button>
        </div>
      </div>
      <div className="row">
        <h1 className="">Related Products</h1>
        {relatedProducts.length < 1 && <p>No Similar Products</p>}
        {relatedProducts.map((relatedProduct) => (
          <div className="col-md-3 mt-5" key={relatedProduct.id}>
            <div className="card">
              <img
                src={`http://localhost:3000/product/photo/${relatedProduct.id}`}
                alt={relatedProduct.name}
                className="card-img-top"
                style={{ maxHeight: "200px", objectFit: "cover" }}
              />
              <div className="card-body">
                <h5 className="card-title">{relatedProduct.name}</h5>
                <p className="card-text">{relatedProduct.description}</p>
                <p className="card-text">Price: ${relatedProduct.price}</p>
                <button className="btn btn-secondary">Add To Cart</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Layout>
  );
};

export default ProductDetails;
