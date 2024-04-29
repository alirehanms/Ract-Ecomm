
import React from "react";
import { useCart } from "../context/Cart";
import { useAuth } from "../context/Auth";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout/Layout";
import "../styles/CartStyles.css";
import axios from "axios";

const Cart = () => {
  const [auth, setAuth] = useAuth();
  const [cart, setCart] = useCart();
  const navigate = useNavigate();

  // Total price calculation
  const totalPrice = () => {
    try {
      let total = 0;
      cart?.map((item) => {
        total = total + item.price;
      });
      return total.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
      });
    } catch (error) {
      console.log(error);
    }
  };

  // Remove item from cart
  const removeCartItem = (pid) => {
    try {
      let myCart = [...cart];
      let index = myCart.findIndex((item) => item.id === pid);
      myCart.splice(index, 1);
      setCart(myCart);
      localStorage.setItem("cart", JSON.stringify(myCart));
    } catch (error) {
      console.log(error);
    }
  };

  // Handle edit address
  const handleEditAddress = () => {
    if (auth && auth.user && auth.user.id) {
      navigate(`/dashboard/user/profile/${auth.user.id}`);
    }
  };

  // Handle order confirmation
  const confirmOrder = async () => {
    try {
      // Calculate total quantity of all products in the cart
      let totalQuantity = 0;
      cart.forEach((item) => {
        totalQuantity += item.quantity;
      });

      // Map cart items to product IDs
      const productIds = cart.map((item) => item.id);

      // Make a POST request to create the order
      await axios.post("http://localhost:3000/orders", {
        buyerId: auth.user.id,
        productId: productIds,
        quantity: totalQuantity,
      });

      // Redirect to user orders page
      navigate("/dashboard/user/orders");
    } catch (error) {
      console.error("Error confirming order:", error);
    }
  };

  return (
    <Layout>
      <div className="row">
        <div className="col-md-12">
          <h1 className="text-center bg-light p-2 mb-1">
            {!auth?.user ? "Hello Guest" : `Hello ${auth?.user?.name}`}
            <p className="text-center">
              {cart?.length
                ? `You Have ${cart.length} items in your cart ${
                    auth?.token ? "" : "please login to checkout !"
                  }`
                : " Your Cart Is Empty"}
            </p>
          </h1>
        </div>
      </div>
      <hr />
      <div className="container">
        <div className="row">
          <div className="col-md-7 p-0 m-0">
            {cart?.map((p) => (
              <div className="row mb-2 p-3 card flex-row" key={p.id}>
                <div className="col-md-4">
                  <img
                    src={`http://localhost:3000/product/photo/${p.id}`}
                    
                    className="card-img-top"
                    alt={p.name}
                    width="100%"
                    height={"130px"}
                  />
                </div>
                <div className="col-md-8">
                  <p>{p.name}</p>
                  <p>{p.description.substring(0, 30)}</p>
                  <p>Price : {p.price}</p>
                  <button
                    className="btn btn-danger"
                    onClick={() => removeCartItem(p.id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="col-md-4 text-center">
            <h4>Cart Summary</h4>
            <p>Total | Checkout | Payment</p>
            <hr />
            <h4>Total: {totalPrice()}</h4>
            {auth?.user?.address ? (
              <>
                <div className="mt-3">
                  <h4>Current Address</h4>
                  <h5>{auth?.user?.address}</h5>
                  {/* Conditionally render the "Edit Address" button */}
                  {auth.user.id === auth.user.id && (
                    <button
                      className="btn btn-outline-warning"
                      onClick={handleEditAddress}
                    >
                      Edit Address
                    </button>
                  )}
                </div>
              </>
            ) : (
              <div className="mb-3">
                {auth?.token ? (
                  <button
                    className="btn btn-outline-warning"
                    onClick={() => navigate("/dashboard/user/profile")}
                  >
                    Update
                  </button>
                ) : (
                  <button
                    className="btn btn-outline-warning"
                    onClick={() => navigate("/login", { state: "/cart" })}
                  >
                    Login to checkout
                  </button>
                )}
              </div>
            )}
            {cart.length > 0 && (
              <button className="btn btn-primary" onClick={confirmOrder}>
                Confirm Order
              </button>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Cart;
