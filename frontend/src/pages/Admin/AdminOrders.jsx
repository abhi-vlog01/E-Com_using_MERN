import React, { useState, useEffect } from "react";
import AdminMenu from "../../components/Layout/AdminMenu";
import Layout from "../../components/Layout/Layout";
import { useAuth } from "../../context/Auth";
import moment from "moment";
import axios from "axios";
import { Select } from "antd";
const { Option } = Select;

const AdminOrders = () => {
  const [auth, setAuth] = useAuth();

  const [status, setStatus] = useState([
    "Not Process",
    "Processing",
    "Shipped",
    "Deliverd",
    "Cancel",
  ]);

  const [changeStatus, setChangeStatus] = useState("");

  const [orders, setOrders] = useState([]);

  const getOrders = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/v1/auth/all-orders`,
        {
          headers: {
            Authorization: auth.token,
          },
        }
      );
      setOrders(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (auth?.token) getOrders();
  }, [auth?.token]);

  const handleChange = async (orderId, value) => {
    try {
      const res = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/v1/auth/order-status/${orderId}`,
        { status: value },
        {
          headers: {
            Authorization: auth.token,
          },
        }
      );
      getOrders();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Layout title={"All Orders Data"}>
      <div className="container-fluid p-3 dashboard-page">
        <div className="row">
          <div className="col-md-3">
            <AdminMenu />
          </div>
          <div className="col-md-9">
            <h1 className="text-center">All Orders</h1>
            {orders?.map((order, idx) => {
              return (
                <div className="border shadow">
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
                        <td>{idx + 1}</td>
                        <td>
                          <Select
                            bordered={false}
                            onChange={(value) => handleChange(order._id, value)}
                            defaultValue={order?.status}
                          >
                            {status.map((s, i) => (
                              <Option key={i} value={s}>
                                {s}
                              </Option>
                            ))}
                          </Select>
                        </td>
                        <td>{order?.buyer?.name}</td>
                        <td>{moment(order?.createAt).fromNow()}</td>
                        <td>{order?.payment.success ? "Success" : "Failed"}</td>
                        <td>{order?.products?.length}</td>
                      </tr>
                    </tbody>
                  </table>
                  <div className="container">
                    {order?.products?.map((p, i) => (
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
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminOrders;
