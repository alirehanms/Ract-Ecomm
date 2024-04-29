// import React, { useState, useEffect } from "react";
// import Layout from "../components/Layout/Layout";
// import { useAuth } from "../context/Auth";
// import axios from "axios";
// import { Checkbox, Radio } from "antd";

// import {toast} from "react-hot-toast";
// import { Prices } from "../components/Prices";
// import { useNavigate } from "react-router-dom";
// import { useCart } from "../context/Cart";
// const HomePage = () => {
//   const [cart, setCart] = useCart();
//   const navigate = useNavigate();
//   const [auth, setAuth] = useAuth();
//   const [products, setProducts] = useState([]);
//   const [categories, setCategories] = useState([]);
//   const [error, setError] = useState(null);
//   const [checked, setChecked] = useState([]);
//   const [radio, setRadio] = useState([]);
//   const [total, setTotal] = useState(0);
//   const [page, setPage] = useState(1);
//   const [loading, setLoading] = useState(false);

//   const getAllCategories = async () => {
//     try {
//       const { data } = await axios.get("http://localhost:3000/category");
//       if (data?.status === 200 && data.category) {
//         setCategories(data?.category);
//       } else {
//         toast.error(data.message);
//       }
//     } catch (error) {
//       console.log("Error:", error.message);
//       toast.error("Something went wrong");
//     }
//   };
//   useEffect(() => {
//     getAllCategories();
//     getAllProducts();
//     // getTotal();
//   }, []);

//   const getAllProducts = async () => {
//     try {
//       setLoading(true);
//       const response = await axios.get(`http://localhost:3000/product/getall`);
//       setLoading(false);
//       console.log("Product Data:", response);
//       if (response?.data) {
//         setProducts(response?.data);
//       } else {
//         setError("Failed to fetch products");
//       }
//     } catch (error) {
//       console.error("Error:", error.message);
//       setLoading(false);
//       setError("Something went wrong");
//     }
//   };

//   const handleFilter = (value, id) => {
//     let all = [...checked];
//     if (value) {
//       all.push(id);
//     } else {
//       all = all.filter((c) => c !== id);
//     }
//     setChecked(all);
//   };
  
//   const filterProducts = async () => {
//     try {
//       const response = await axios.post(
//         "http://localhost:3000/product/filters",
//         {
//           checked,
//           radio,
//         }
//       );
//       console.log("Filtered Products:", response.data.products);
//       setProducts(response.data.products);
//     } catch (error) {
//       console.error("Error filtering products:", error);
//       setError("Failed to filter products");
//     }
//   };

//   useEffect(() => {
//     if (checked.length || radio.length) {
//       filterProducts();
//     } else {
//       getAllProducts();
//     }
//   }, [checked, radio]);

//   return (
//     <Layout title={"Home Page"}>
//       <div className="row mt-3">
//         <div className="col-md-3">
//           <h4 className="text-center">Filter By Category</h4>
//           <div className="d-flex flex-column">
//             {categories?.map((c) => (
//               <Checkbox
//                 key={c.id}
//                 onChange={(e) => {
//                   handleFilter(e.target.checked, c.id);
//                 }}
//               >
//                 {c.name}
//               </Checkbox>
//             ))}
//           </div>
//           <h4 className="text-center mt-4">Filter By Price</h4>
//           <div className="d-flex flex-column">
//             <Radio.Group
//               onChange={(e) => {
//                 setRadio(e.target.value);
//               }}
//             >
//               {Prices?.map((p) => (
//                 <div key={p.id}>
//                   <Radio value={p.array}>{p.name}</Radio>
//                 </div>
//               ))}
//             </Radio.Group>
//             <div className="d-flex flex-column mt-3">
//               <button
//                 className="btn btn-danger"
//                 onClick={() => window.location.reload()}
//               >
//                 Reset Filters
//               </button>
//             </div>
//           </div>
//         </div>
//         <div className="col-md-9">
//           <h1 className="text-center">All Products</h1>
//           <div className="d-flex flex-wrap">
//             {products?.map((product) => (
//               <div className="col" key={product.id}>
//                 <div className="card" style={{ width: "18rem" }}>
//                   <img
//                     src={`http://localhost:3000/product/photo/${product.id}`}
//                     alt={product.name}
//                     className="card-img-top"
//                     style={{ maxHeight: "200px", objectFit: "cover" }}
//                     onError={(e) => {
//                       e.target.onerror = null; // Prevent further error logs
//                       e.target.src = "path/to/default-image.jpg"; // Replace with the path to your default image
//                     }}
//                     loading="lazy"
//                   />
//                   <div className="card-body">
//                     <h5 className="card-title">{product.name}</h5>
//                     <p className="card-text">{product.description}</p>
//                     <p className="card-text">${product.price}</p>
//                     <button
//                       className="btn btn-primary ms-1"
//                       onClick={() => navigate(`/product/${product.id}`)}
//                     >
//                       More Details
//                     </button>
//                     <button
//                       className="btn btn-secondary ms-1"
//                       onClick={() =>{ setCart([...cart, product])
//                       localStorage.setItem("cart", JSON.stringify([...cart, product]))
//                       toast.success("Added to cart")}}
//                     >
//                       Add To Cart
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>

//           <div className="m-2 p-3">
//             {products && products.length < total && (
//               <button
//                 className="btn btn-warning"
//                 onClick={(e) => {
//                   e.preventDefault();
//                   setPage(page + 1);
//                 }}
//               >
//                 {loading ? "Loading..." : "Loadmore"}
//               </button>
//             )}
//           </div>
//         </div>
//       </div>
//     </Layout>
//   );
// };

// export default HomePage;

import React, { useState, useEffect } from "react";
import Layout from "../components/Layout/Layout";
import { useAuth } from "../context/Auth";
import axios from "axios";
import { Checkbox, Radio } from "antd";
import { toast } from "react-hot-toast";
import { Prices } from "../components/Prices";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/Cart";
import "../styles/Homepage.css";
const HomePage = () => {
  const [cart, setCart] = useCart();
  const navigate = useNavigate();
  const [auth, setAuth] = useAuth();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);
  const [checked, setChecked] = useState([]);
  const [radio, setRadio] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const getAllCategories = async () => {
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
    getAllCategories();
    getAllProducts();
  }, []);

  const getAllProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:3000/product/getall`);
      setLoading(false);
      if (response?.data) {
        setProducts(response?.data);
      } else {
        setError("Failed to fetch products");
      }
    } catch (error) {
      console.error("Error:", error.message);
      setLoading(false);
      setError("Something went wrong");
    }
  };

  const handleFilter = (value, id) => {
    let all = [...checked];
    if (value) {
      all.push(id);
    } else {
      all = all.filter((c) => c !== id);
    }
    setChecked(all);
  };

  const filterProducts = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3000/product/filters",
        {
          checked,
          radio,
        }
      );
      setProducts(response.data.products);
    } catch (error) {
      console.error("Error filtering products:", error);
      setError("Failed to filter products");
    }
  };

  useEffect(() => {
    if (checked.length || radio.length) {
      filterProducts();
    } else {
      getAllProducts();
    }
  }, [checked, radio]);

  return (
    <Layout title={"Home Page"}>
      {/* banner image */}
      <img
        src="/images/banner.png"
        className="banner-img"
        alt="bannerimage"
        width={"100%"}
      />
      {/* banner image */}
      <div className="container-fluid  row mt-3 home-page">
        <div className="col-md-3 filters">
          <h4 className="text-center">Filter By Category</h4>
          <div className="d-flex flex-column">
            {categories?.map((c) => (
              <Checkbox
                key={c.id}
                onChange={(e) => {
                  handleFilter(e.target.checked, c.id);
                }}
              >
                {c.name}
              </Checkbox>
            ))}
          </div>
          <h4 className="text-center mt-4">Filter By Price</h4>
          <div className="d-flex flex-column">
            <Radio.Group
              onChange={(e) => {
                setRadio(e.target.value);
              }}
            >
              {Prices?.map((p) => (
                <div key={p.id}>
                  <Radio value={p.array}>{p.name}</Radio>
                </div>
              ))}
            </Radio.Group>
            <div className="d-flex flex-column mt-3">
              <button
                className="btn btn-danger"
                onClick={() => window.location.reload()}
              >
                Reset Filters
              </button>
            </div>
          </div>
        </div>
        <div className="col-md-9">
          <h1 className="text-center">All Products</h1>
          <div className="d-flex flex-wrap">
            {products?.map((product) => (
              <div className="col" key={product.id}>
                <div className="card" style={{ width: "18rem" }}>
                  <img
                    src={`http://localhost:3000/product/photo/${product.id}`}
                    alt={product.name}
                    className="card-img-top"
                    style={{ maxHeight: "200px", objectFit: "cover" }}
                    onError={(e) => {
                      e.target.onerror = null; // Prevent further error logs
                      e.target.src = "path/to/default-image.jpg"; // Replace with the path to your default image
                    }}
                    loading="lazy"
                  />
                  <div className="card-body">
                    <h5 className="card-title">{product.name}</h5>
                    <p className="card-text">{product.description}</p>
                    <p className="card-text">${product.price}</p>
                    <button
                      className="btn btn-info ms-1"
                      onClick={() => navigate(`/product/${product.id}`)}
                    >
                      More Details
                    </button>
                    <button
                      className="btn btn-dark ms-1"
                      onClick={() => {
                        setCart([...cart, product]);
                        localStorage.setItem(
                          "cart",
                          JSON.stringify([...cart, product])
                        );
                        toast.success("Added to cart");
                      }}
                    >
                      Add To Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="m-2 p-3">
            {products && products.length < total && (
              <button
                className="btn btn-warning"
                onClick={(e) => {
                  e.preventDefault();
                  setPage(page + 1);
                }}
              >
                {loading ? "Loading..." : "Loadmore"}
              </button>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default HomePage;

