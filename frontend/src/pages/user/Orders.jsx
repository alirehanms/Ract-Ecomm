


// // import React, { useState, useEffect } from "react";
// // import Layout from "../../components/Layout/Layout";
// // import UserMenu from "../../components/Layout/UserMenu";
// // import axios from "axios";
// // import { useAuth } from "../../context/Auth";
// // import moment from "moment";

// // const Orders = () => {
// //   const [orders, setOrders] = useState([]);
// //   const [auth, setAuth] = useAuth();

// //   const getOrders = async () => {
// //     try {
// //       if (!auth?.user?.id) {
// //         // If user ID is not available, return
// //         return;
// //       }
// //       const { data } = await axios.get("http://localhost:3000/orders");
// //       console.log(data);
// //       // Filter orders based on the logged-in user's ID
// //       const userOrders = data.filter(
// //         (order) => order.buyer_id === auth.user.id
// //       );
// //       setOrders(userOrders);
// //     } catch (error) {
// //       console.log(error);
// //     }
// //   };

// //   useEffect(() => {
// //     if (auth?.token) getOrders();
// //   }, [auth?.token]);

// //   return (
// //     <Layout title={"Your Orders"}>
// //       <div className="container-fluid p-3 m-3 dashboard">
// //         <div className="row">
// //           <div className="col-md-3">
// //             <UserMenu />
// //           </div>
// //           <div className="col-md-9">
// //             <h1 className="text-center">All Orders</h1>
// //             <table className="table">
// //               <thead>
// //                 <tr>
// //                   <th scope="col">User ID</th>
// //                   <th scope="col">Status</th>
// //                   <th scope="col">Buyer</th>
// //                   <th scope="col">Date</th>
// //                   <th scope="col">Payment</th>
// //                   <th scope="col">Total Quantity</th>
// //                 </tr>
// //               </thead>
// //               <tbody>
// //                 {orders?.map((o, i) => (
// //                   <tr key={o.id}>
// //                     <td>{o?.buyer?.id}</td>
// //                     <td>{o?.status}</td>
// //                     <td>{o?.buyer?.name}</td>
// //                     <td>{moment(o?.createdAt).fromNow()}</td>
// //                     <td>{o?.payment?.success ? "Success" : "Failed"}</td>
// //                     <td>
// //                       {o?.products?.reduce((total, p) => total + p.quantity, 0)}
// //                     </td>
// //                   </tr>
// //                 ))}
// //               </tbody>
// //             </table>
// //           </div>
// //         </div>
// //       </div>
// //     </Layout>
// //   );
// // };

// // export default Orders;




// import React, { useState, useEffect } from "react";
// import Layout from "../../components/Layout/Layout";
// import UserMenu from "../../components/Layout/UserMenu";
// import axios from "axios";
// import { useAuth } from "../../context/Auth";
// import moment from "moment";

// const Orders = () => {
//   const [orders, setOrders] = useState([]);
//   const [auth, setAuth] = useAuth();

//   const getOrders = async () => {
//     try {
//       if (!auth?.user?.id) {
        

//         // If user ID is not available, return
//         return;

//       }
//       const { data } = await axios.get("http://localhost:3000/orders");
//       // console.log(data);
//       console.log("Orders data:", orders);

//       // Filter orders based on the logged-in user's ID
//       const userOrders = data.filter(
//         (order) => order.buyer_id === auth.user.id
//       );
//       setOrders(userOrders);
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   useEffect(() => {
//     if (auth?.token) getOrders();
//   }, [auth?.token]);
// console.log("Authenticated user:", auth.user);
//   return (
//     <Layout title={"Your Orders"}>
//       <div className="container-fluid p-3 m-3 dashboard">
//         <div className="row">
//           <div className="col-md-3">
//             <UserMenu />
//           </div>
//           <div className="col-md-9">
//             <h1 className="text-center">All Orders</h1>
//             <table className="table">
//               <thead>
//                 <tr>
//                   <th scope="col">User ID</th>
//                   <th scope="col">Status</th>
//                   <th scope="col">Buyer</th>
//                   <th scope="col">Date</th>
//                   <th scope="col">Payment</th>
//                   <th scope="col">Total Quantity</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {orders?.map((o, i) => (
//                   <tr key={o.id}>
//                     <td>{o?.buyer?.id}</td>
//                     <td>{o?.status}</td>
//                     <td>{o?.buyer?.name}</td>
//                     <td>{moment(o?.createdAt).fromNow()}</td>
//                     <td>{o?.payment?.success ? "Success" : "Failed"}</td>
//                     <td>
//                       {o?.products?.length > 0
//                         ? o?.products.reduce(
//                             (total, p) => total + p.quantity,
//                             0
//                           )
//                         : 0}
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </div>
//     </Layout>
//   );
// };

// export default Orders;

import React, { useState, useEffect } from "react";
import Layout from "../../components/Layout/Layout";
import UserMenu from "../../components/Layout/UserMenu";
import axios from "axios";
import { useAuth } from "../../context/Auth";
import moment from "moment";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [auth, setAuth] = useAuth();

  const getOrders = async () => {
    try {
      if (!auth?.user?.id) {
        // If user ID is not available, return
        return;
      }
      const { data } = await axios.get("http://localhost:3000/orders");
      // console.log(data);
      console.log("Orders data:", data);


       const userOrders = data.filter(
         (order) => order.buyer_id === auth.user.id
       );
      // Set orders including product details
      setOrders(userOrders);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (auth?.token) getOrders();
  }, [auth?.token]);

  return (
    <Layout title={"Your Orders"}>
      <div className="container-fluid p-3 m-3 dashboard">
        <div className="row">
          <div className="col-md-3">
            <UserMenu />
          </div>
          <div className="col-md-9">
            <h1 className="text-center">All Orders</h1>
            {orders.map((order) => (
              <div key={order.id}>
                <div>
                  <h3>Order ID: {order.id}</h3>
                  <p>Status: {order.status}</p>
                  <p>Date: {moment(order.createdAt).fromNow()}</p>
                  {order.products && order.products.length > 0 && (
                    <div>
                      <p>
                        Total Quantity:{" "}
                        {order.products.reduce(
                          (total, p) => total + p.quantity,
                          0
                        )}
                      </p>
                      <div className="row">
                        {order.products.map((product) => (
                          <div className="col-md-3" key={product._id}>
                            <div className="card">
                              <img
                                src={`http://localhost:3000/product/photo/${product._id}`}
                                className="card-img-top"
                                alt={product.name}
                              />
                              <div className="card-body">
                                <h5 className="card-title">{product.name}</h5>
                                <p className="card-text">
                                  {product.description}
                                </p>
                                <p className="card-text">
                                  Price: {product.price}
                                </p>
                                <p className="card-text">
                                  Quantity: {product.quantity}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                <hr />
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Orders;
