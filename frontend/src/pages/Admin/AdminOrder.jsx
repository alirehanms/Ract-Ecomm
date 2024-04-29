// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import AdminMenu from "../../components/Layout/AdminMenu";
// import Layout from "../../components/Layout/Layout";
// import { useAuth } from "../../context/Auth";
// import moment from "moment";
// import { Select } from "antd";
// const { Option } = Select;
// const AdminOrder = () => {
//   const [status, setStatus] = useState([
//     "Not Process",
//     "Processing",
//     "Shipped",
//     "delivered",
//     "cancel",
//   ]);
//   const [orders, setOrders] = useState([]);
//   const [auth, setAuth] = useAuth();
//   const [products, setProducts] = useState({});

//   useEffect(() => {
//     if (auth?.token) getOrders();
//   }, [auth?.token]);

//   const getOrders = async () => {
//     try {
//       const { data } = await axios.get("http://localhost:3000/orders");
//       console.log("Orders with status:", data);

//       const ordersWithStatus = data.map((order) => ({
//         ...order,
//         status: localStorage.getItem(`order_${order.id}`) || "Not Process",
//       }));
//       console.log("Orders with updated status:", ordersWithStatus);

//       setOrders(ordersWithStatus);

//       // Fetch products data
//       const productsData = await axios.get(
//         "http://localhost:3000/product/getall"
//       );
//       console.log("Products:", productsData.data);
//       //  const productsMap = {};
//       //  productsData.data.forEach((product) => {
//       //    productsMap[product.id] = product;
//       //  });
//       setProducts(productsData.data); // Update products state with the fetched data
//     } catch (error) {
//       console.log("Error fetching orders:", error);
//     }
//   };

//   const handleChange = async (orderId, value) => {
//     try {
//       // Update the status in local storage
//       localStorage.setItem(`order_${orderId}`, value);

//       // Make an API call to update the status in the database
//       const response = await axios.put(
//         `http://localhost:3000/orders/${orderId}`,
//         {
//           status: value,
//         }
//       );
//       console.log("Status updated successfully:", response.data);

//       // Update the state to reflect the changes
//       setOrders((prevOrders) =>
//         prevOrders.map((order) =>
//           order.id === orderId ? { ...order, status: value } : order
//         )
//       );
//     } catch (error) {
//       console.error("Error updating status:", error.response || error);
//     }
//   };

//   return (
//     <Layout title={"All Orders Data"}>
//       <div className="row dashboard">
//         <div className="col-md-3">
//           <AdminMenu />
//         </div>
//         <div className="col-md-9">
//           <h1 className="text-center">All Orders</h1>
//           {orders?.map((o, i) => {
//             return (
//               <div className="border shadow" key={o.id}>
//                 <table className="table">
//                   <thead>
//                     <tr>
//                       <th scope="col">#</th>
//                       <th scope="col">Status</th>
//                       <th scope="col">Buyer</th>
//                       <th scope="col">Date</th>
//                       <th scope="col">Payment</th>
//                       <th scope="col">Quantity</th>
//                     </tr>
//                   </thead>

//                   <tbody>
//                     <tr>
//                       <td>{i + 1}</td>
//                       <td>
//                         <Select
//                           variant="default"
//                           onChange={(value) => handleChange(o.id, value)}
//                           value={orders?.status} // Use value instead of defaultValue
//                         >
//                           {status.map((s) => (
//                             <Option key={s} value={s}>
//                               {s}
//                             </Option>
//                           ))}
//                         </Select>
//                       </td>
//                       <td>{orders?.buyer?.name}</td>
//                       <td>{moment(orders?.createdAt).fromNow()}</td>
//                       <td>{orders?.payment?.success ? "Success" : "Failed"}</td>
//                       <td>{orders?.products?.length}</td>
//                     </tr>
//                   </tbody>
//                 </table>
//                 <div className="container">
//                   {Array.isArray(orders.products) &&
//                     orders.products.map((p, j) => {
//                       const product = products.find(
//                         (prod) => prod.id === p.product_id
//                       );
//                       return (
//                         <div className="row mb-2 p-3 card flex-row" key={j}>
//                           <div className="col-md-4">
//                             {product && (
//                               <img
//                                 src={`http://localhost:3000/product/photo/${product.id}`}
//                                 className="card-img-top"
//                                 alt={product.name}
//                                 width="100px"
//                                 height="100px"
//                               />
//                             )}
//                           </div>
//                           <div className="col-md-8">
//                             {product && (
//                               <>
//                                 <p>{product.name}</p>
//                                 <p>{product.description.substring(0, 30)}</p>
//                                 <p>Price : {product.price}</p>
//                               </>
//                             )}
//                           </div>
//                         </div>
//                       );
//                     })}
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       </div>
//     </Layout>
//   );
// };

// export default AdminOrder;





import React, { useState, useEffect } from "react";
import axios from "axios";
import AdminMenu from "../../components/Layout/AdminMenu";
import Layout from "../../components/Layout/Layout";
import { useAuth } from "../../context/Auth";
import moment from "moment";
import { Select } from "antd";
const { Option } = Select;
const AdminOrder = () => {
  const [status, setStatus] = useState([
    "Not Process",
    "Processing",
    "Shipped",
    "delivered",
    "cancel",
  ]);
  const [orders, setOrders] = useState([]);
  const [auth, setAuth] = useAuth();
  const [changedStatus, setChangedStatus] = useState("");

  useEffect(() => {
    if (auth?.token) getOrders();
  }, [auth?.token]);

  const getOrders = async () => {
    try {
      const { data } = await axios.get("http://localhost:3000/orders");
      console.log("Orders with status:", data);

      const ordersWithStatus = data.map((order) => ({
        ...order,
        status: localStorage.getItem(`order_${order.id}`) || "Not Process",
      }));
      console.log("Orders with updated status:", ordersWithStatus);

      setOrders(ordersWithStatus); // Set orders after fetching them
      // Fetch products data
      const productsData = await axios.get(
        "http://localhost:3000/product/getall"
      );
      console.log("Products:", productsData.data);
    } catch (error) {
      console.log("Error fetching orders:", error);
    }
  };

  const handleChange = async (orderId, value) => {
    try {
      localStorage.setItem(`order_${orderId}`, value);
      const response = await axios.put(
        `http://localhost:3000/orders/${orderId}`,
        {
          status: value,
        }
      );
      console.log("Status updated successfully:", response.data);
      setChangedStatus(value); // Set changedStatus state
    } catch (error) {
      console.error("Error updating status:", error.response || error);
    }
  };

  return (
    <Layout title={"All Orders Data"}>
      <div className="row dashboard">
        <div className="col-md-3">
          <AdminMenu />
        </div>
        <div className="col-md-9">
          <h1 className="text-center">All Orders</h1>
          {orders &&
            orders.map((o, i) => (
              <div className="border shadow" key={o.id}>
                <table className="table">
                  <thead>
                    <tr>
                      <th scope="col">#</th>
                      <th scope="col">Status</th>
                      <th scope="col">Buyer</th>
                      <th scope="col">Date</th>
                      <th scope="col">Payment</th>
                      <th scope="col">Quantity</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{i + 1}</td>
                      <td>
                        <Select
                          variant="default"
                          onChange={(value) => handleChange(o.id, value)}
                          value={o?.status || ""} // Use value instead of defaultValue
                        >
                          {status.map((s, index) => (
                            <Option key={index} value={s}>
                              {s}
                            </Option>
                          ))}
                        </Select>
                      </td>
                      <td>{o?.buyer?.name}</td>
                      <td>{moment(o?.createdAt).fromNow()}</td>
                      {/* <td>{orders?.payment?.success ? "Success" : "Failed"}</td> */}
                      <td>{o?.products?.length}</td>
                    </tr>
                  </tbody>
                </table>
                <div className="container">
                  {Array.isArray(o.products) &&
                    o.products.map((p, j) => {
                      const product = product.find(
                        (prod) => prod.id === p.product_id
                      );
                      return (
                        <div className="row mb-2 p-3 card flex-row" key={j}>
                          <div className="col-md-4">
                            {product && (
                              <img
                                src={`http://localhost:3000/product/photo/${product.id}`}
                                className="card-img-top"
                                alt={product.name}
                                width="100px"
                                height="100px"
                              />
                            )}
                          </div>
                          <div className="col-md-8">
                            {product && (
                              <>
                                <p>{product.name}</p>
                                <p>{product.description.substring(0, 30)}</p>
                                <p>Price : {product.price}</p>
                              </>
                            )}
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            ))}
        </div>
      </div>
    </Layout>
  );
};

export default AdminOrder;
