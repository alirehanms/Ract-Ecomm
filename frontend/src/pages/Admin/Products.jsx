
// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import toast from "react-hot-toast";
// import { Link } from "react-router-dom";
// import Layout from "../../components/Layout/Layout";
// import AdminMenu from "../../components/Layout/AdminMenu";

// const Products = () => {
//   const [products, setProducts] = useState([]);
//   const [error, setError] = useState(null);

//   const getAllProducts = async () => {
//     try {
//       const response = await axios.get("http://localhost:3000/product");
//       console.log("Product Data:", response);
//       if (response?.data) {
//         setProducts(response?.data);
//       } else {
//         setError("Failed to fetch products");
//       }
//     } catch (error) {
//       console.error("Error:", error.message);
//       setError("Something went wrong");
//     }
//   };

//   useEffect(() => {
//     getAllProducts();
//   }, []);

//   useEffect(() => {
//     console.log("Displaying products:", products);
//   }, [products]);

//   return (
//     <Layout>
//       <div className="row dashboard">
//         <div className="col-md-3">
//           <AdminMenu />
//         </div>
//         <div className="col-md-9">
//           <h1 className="text-center">All Products List</h1>
//           <div className="row row-cols-1 row-cols-md-3 g-4">
//             {error ? (
//               <div>Error: {error}</div>
//             ) : (
//               products.map((product) => (
//                 <div className="col" key={product.id}>
//                   <Link
//                     to={`/dashboard/admin/product/${product.id}`}
//                     className="product-link"
//                   >
//                     <div className="card" style={{ width: "18rem" }}>
//                       <img
//                         src={`http://localhost:3000/product/photo/${product.id}`}
//                         alt={product.name}
//                         className="card-img-top"
//                         style={{ maxHeight: "200px", objectFit: "cover" }}
//                         onError={(e) => {
//                           e.target.onerror = null; // Prevent further error logs
//                           e.target.src = "path/to/default-image.jpg"; // Replace with the path to your default image
//                         }}
//                         loading="lazy" // Improve performance by loading images as they appear in the viewport
//                       />
//                       <div className="card-body">
//                         <h5 className="card-title">{product.name}</h5>
//                         <p className="card-text">{product.description}</p>
//                       </div>
//                     </div>
//                   </Link>
//                 </div>
//               ))
//             )}
//           </div>
//         </div>
//       </div>
//     </Layout>
//   );
// };

// export default Products;













import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import Layout from "../../components/Layout/Layout";
import AdminMenu from "../../components/Layout/AdminMenu";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);

  const getAllProducts = async () => {
    try {
      const response = await axios.get("http://localhost:3000/product/getall");
      if (response?.data) {
        setProducts(response?.data);
      } else {
        setError("Failed to fetch products");
      }
    } catch (error) {
      console.error("Error:", error.message);
      setError("Something went wrong");
    }
  };

  const getAllCategories = async () => {
    try {
      const response = await axios.get("http://localhost:3000/category");
      if (response?.data) {
        setCategories(response?.data);
      } else {
        setError("Failed to fetch categories");
      }
    } catch (error) {
      console.error("Error:", error.message);
      setError("Something went wrong");
    }
  };

  useEffect(() => {
    getAllProducts();
    getAllCategories();
  }, []);

  return (
    <Layout>
      <div className="row dashboard">
        <div className="col-md-3">
          <AdminMenu />
        </div>
        <div className="col-md-9">
          <h1 className="text-center">All Products List</h1>
          <div className="row row-cols-1 row-cols-md-3 g-4">
            {error ? (
              <div>Error: {error}</div>
            ) : (
              products.map((product) => (
                <div className="col" key={product.id}>
                  <Link
                    to={{
                      pathname: `/dashboard/admin/product/${product.id}`,
                      state: { product, categories },
                    }}
                    className="product-link"
                  >
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
                        loading="lazy" // Improve performance by loading images as they appear in the viewport
                      />
                      <div className="card-body">
                        <h5 className="card-title">{product.name}</h5>
                        <p className="card-text">{product.description}</p>
                      </div>
                    </div>
                  </Link>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Products;
