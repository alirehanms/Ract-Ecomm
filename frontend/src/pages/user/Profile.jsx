import React, { useState, useEffect } from "react";
import UserMenu from "../../components/Layout/UserMenu";
import Layout from "../../components/Layout/Layout";
import axios from "axios";
import { useAuth } from "../../context/Auth";
import toast, { Toaster } from "react-hot-toast";
import { useParams, useNavigate } from "react-router-dom";

const Profile = () => {
  // Context
  const [auth, setAuth] = useAuth();
  const navigate = useNavigate();
  // State
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const { id } = useParams();

  // Fetch user data
  useEffect(() => {
    if (auth && auth.user) {
      const { email, name, phone, address } = auth.user;
      setName(name);
      setPhone(phone);
      setEmail(email);
      setAddress(address);
    }
  }, [auth]);

  // Form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const userData = {
      name,
      email,
      password,
      phone,
      address,
    };

    await axios
      .put(`http://localhost:3000/user/${id}`, userData)
      .then((response) => {
        // console.log("ok", response.data);
        setAuth({ ...auth, user: response.data });
        localStorage.setItem(
          "auth",
          JSON.stringify({ ...auth, user: response.data })
        );
        toast.success("Profile Updated Successfully");
      })
      .catch((reason) => {
        toast.error(reason.response.data.message);
        // console.log("error", reason.response.data.message);
      });
  };

  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      <Layout title={"Your Profile"}>
        <div className="container-fluid m-3 p-3 dashboard">
          <div className="row">
            <div className="col-md-3">
              <UserMenu />
            </div>
            <div className="col-md-8">
              <div className="form-container" style={{ marginTop: "-40px" }}>
                <form onSubmit={handleSubmit}>
                  <h4 className="title">USER PROFILE</h4>
                  <div className="mb-3">
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="form-control"
                      id="nameInput"
                      placeholder="Enter Your Name"
                      autoFocus
                    />
                  </div>
                  <div className="mb-3">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="form-control"
                      id="emailInput"
                      placeholder="Enter Your Email "
                      disabled
                    />
                  </div>
                  <div className="mb-3">
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="form-control"
                      id="passwordInput"
                      placeholder="Enter Your Password"
                    />
                  </div>
                  <div className="mb-3">
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="form-control"
                      id="phoneInput"
                      placeholder="Enter Your Phone"
                    />
                  </div>
                  <div className="mb-3">
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="form-control"
                      id="addressInput"
                      placeholder="Enter Your Address"
                    />
                  </div>

                  <button type="submit" className="btn btn-primary">
                    UPDATE
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default Profile;
