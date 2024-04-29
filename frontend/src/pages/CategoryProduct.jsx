



import React, { useEffect, useState } from "react";
import Layout from "../components/Layout/Layout";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";

const CategoryProduct = () => {
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState({});
  const { slug } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/product/related-products/${slug}`
        );
        if (response?.status === 200) {
          setProducts(response.data.products);
          setCategory(response.data.products[0]?.category || {});
        }
      } catch (error) {
        console.log("Error:", error.message);
        toast.error("Something went wrong");
      }
    };

    if (slug) {
      fetchData();
    }
  }, [slug]);

  return (
    <Layout>
      <div className="container mt-3 text-center">
        <h1>Category - {category.name}</h1>
        {products.length > 0 && <h2>{products.length} products found</h2>}
        <div className="row">
          {products.map((product) => (
            <div className="col-md-4 mb-4" key={product.id}>
              <div className="card">
                <img
                  src={`http://localhost:3000/product/photo/${product.id}`}
                  className="card-img-top"
                  alt={product.name}
                />
                <div className="card-body">
                  <h5 className="card-title">{product.name}</h5>
                  <p className="card-text">{product.description}</p>
                  <p className="card-text">Price: ${product.price}</p>
                  <Link
                    to={`/product/${product.id}`}
                    className="btn secondary btn-primary ms-1"
                  >
                    More Details
                  </Link>
                  <button className="btn btn-secondary ms-1">Add to Cart</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default CategoryProduct;
