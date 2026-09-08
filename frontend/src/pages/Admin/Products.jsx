import React, { useEffect, useState } from "react";
import AdminMenu from "../../components/Layout/AdminMenu";
import Layout from "../../components/Layout/Layout";
import axios from "axios";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

const Products = () => {
  const [products, setProducts] = useState([]);

  //get all products

  const getAllProdducts = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/v1/product/get-product`
      );
      setProducts(res.data.product);
    } catch (error) {
      console.log(error);
      toast.error("Somthing went wrong");
    }
  };

  useEffect(() => {
    getAllProdducts();
  }, []);

  return (
    <Layout>
      <div className="container-fluid p-3 dashboard-page">
        <div className="row">
          <div className="col-md-3">
            <AdminMenu />
          </div>
          <div className="col-md-9">
            <h1 className="text-center">All Products List</h1>

            <div className="product-grid">
              {products?.map((p) => (
                <Link
                  to={`/dashboard/admin/product/${p.slug}`}
                  key={p._id}
                  className="product-link"
                >
                  <div className="card m-2" style={{ width: "18rem" }}>
                    <img
                      src={`${
                        import.meta.env.VITE_API_URL
                      }/api/v1/product/product-photo/${p._id}`}
                      className="card-img-top"
                      alt={p.name}
                    />
                    <div className="card-body">
                      <h5 className="card-title">{p.name}</h5>
                      <p className="card-text">{p.description}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Products;
