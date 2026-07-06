import React from "react";
import Layout from "../components/Layout/Layout";
import toast from "react-hot-toast";

import DropIn from "braintree-web-drop-in-react";

import { useAuth } from "../context/Auth";
import { useCart } from "../context/Cart";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { useEffect } from "react";

const CartPage = () => {
  const [auth, setAuth] = useAuth();
  const [cart, setCart] = useCart();

  const [clientToken, setClientToken] = useState("");
  const [instance, setInstance] = useState("");
  const [showPaymentForm, setShowPaymentForm] = useState(false);

  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const getCartTotal = () => {
    if (!cart?.length) return 0;
    return cart.reduce((total, item) => total + item.price, 0);
  };

  const canCheckout =
    auth?.token && auth?.user?.address && cart?.length > 0;

  //total price

  const totalPrice = () => {
    try {
      return getCartTotal().toLocaleString("en-IN", {
        style: "currency",
        currency: "INR",
      });
    } catch (error) {
      console.log(error);
    }
  };

  //remove item from cart

  const removeCartItem = (pid) => {
    try {
      let myCart = [...cart];
      let index = myCart.findIndex((item) => item._id === pid);
      myCart.splice(index, 1);
      setCart(myCart);
      localStorage.setItem("cart", JSON.stringify(myCart));
      toast.success("Cart Item remove Successfully");
    } catch (error) {
      console.log(error);
    }
  };

  //get payment gateway token

  const getToken = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/v1/product/braintree/token`
      );
      setClientToken(res.data?.clientToken);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getToken();
  }, [auth?.token]);

  useEffect(() => {
    if (!canCheckout) {
      setShowPaymentForm(false);
      setInstance("");
    }
  }, [canCheckout]);

  const openPaymentForm = () => {
    setShowPaymentForm(true);
    setInstance("");
  };

  //handle payments

  const handlePayment = async () => {
    try {
      setLoading(true);
      const { nonce } = await instance.requestPaymentMethod();

      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/v1/product/braintree/payment`,
        {
          nonce,
          cart,
        },
        {
          headers: {
            Authorization: auth.token,
          },
        }
      );
      setLoading(false);
      localStorage.removeItem("cart");
      setCart([]);
      navigate("/dashboard/user/orders");
      toast.success("Payment completed successfully");
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="container">
        <div className="row">
          <div className="col-md-12">
            <h1 className="text-center bg-light p-2 mb-1">
              {`Hello ${auth?.token && auth?.user?.name}`}
            </h1>

            <h4 className="text-center">
              {cart?.length
                ? `You have ${cart.length} items in your cart ${
                    auth?.token ? "" : "Please login to checkout"
                  }`
                : "Your cart is empty"}
            </h4>
          </div>
        </div>
        <div className="row">
          <div className="col-md-8">
            {cart?.map((p) => (
              <div className="row mb-2 p-3 card flex-row">
                <div className="col-md-4">
                  <img
                    src={`${
                      import.meta.env.VITE_API_URL
                    }/api/v1/product/product-photo/${p._id}`}
                    className="card-img-top"
                    alt={p.name}
                  />
                </div>
                <div className="col-md-8">
                  <h6>{p.name}</h6>
                  <p>{p.description}</p>
                  {/* .substring(0, 30)}... */}
                  <p>Price : ₹ {p.price}</p>
                  <button
                    className="btn btn-danger"
                    onClick={() => removeCartItem(p._id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="col-md-4 text-center">
            <h2>Cart Summary</h2>
            <p>Total | Checkout | Payment</p>
            <hr />
            <h4>Total : {totalPrice()}</h4>

            {auth?.user?.address ? (
              <>
                <div className="mb-3">
                  <h4>Current Address</h4>
                  <h5>{auth?.user?.address}</h5>
                  <button
                    className="btn btn-outline-warning"
                    onClick={() => navigate("/dashboard/user/profile")}
                  >
                    Update Address
                  </button>
                </div>
              </>
            ) : (
              <div className="mb-3">
                {auth?.token ? (
                  <button
                    className="btn btn-outline-warning"
                    onClick={() => navigate("/dashboard/user/profile")}
                  >
                    Update Address
                  </button>
                ) : (
                  <button
                    className="btn btn-outline-warning"
                    onClick={() => navigate("/login", { state: "/cart" })}
                  >
                    Please login to checkout
                  </button>
                )}
              </div>
            )}

            <div className="mt-2">
              {canCheckout && clientToken ? (
                <>
                  {!showPaymentForm ? (
                    <button
                      className="btn btn-primary mb-2"
                      onClick={openPaymentForm}
                    >
                      Make Payment
                    </button>
                  ) : (
                    <>
                      <DropIn
                        key={`${getCartTotal()}-${clientToken}`}
                        options={{
                          authorization: clientToken,
                          paymentOptionPriority: ["card"],
                        }}
                        onInstance={(instance) => setInstance(instance)}
                      />
                      <button
                        className="btn btn-primary mb-2"
                        onClick={handlePayment}
                        disabled={loading || !instance}
                      >
                        {loading ? "Processing..." : "Make Payment"}
                      </button>
                    </>
                  )}
                </>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CartPage;
