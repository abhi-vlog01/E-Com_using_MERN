import React, { useEffect, useState } from "react";
import Layout from "../components/Layout/Layout";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/Cart";
import toast from "react-hot-toast";

const ProductDetails = () => {
  const navigate = useNavigate();
  const params = useParams();
  const [cart, setCart] = useCart();
  const [product, setProduct] = useState({});
  const [relatedProducts, setRelatedProducts] = useState([]);

  const addToCart = (item) => {
    setCart([...cart, item]);
    localStorage.setItem("cart", JSON.stringify([...cart, item]));
    toast.success("Item Added to cart");
  };

  //get single product
  const productDetails = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/v1/product/get-product/${
          params.slug
        }`
      );
      setProduct(res.data?.product);
      getSimilarProducts(res.data?.product._id, res.data?.product.category._id);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (params?.slug) productDetails();
  }, [params?.slug]);

  //get similar products

  const getSimilarProducts = async (pid, cid) => {
    try {
      const res = await axios.get(
        `${
          import.meta.env.VITE_API_URL
        }/api/v1/product/related-product/${pid}/${cid}`
      );
      setRelatedProducts(res.data?.products);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Layout>
      <div className="container-fluid p-3">
        <div className="row">
          <div className="col-md-6">
            <img
              src={`${
                import.meta.env.VITE_API_URL
              }/api/v1/product/product-photo/${product._id}`}
              className="card-img-top"
              alt={product.name}
            />
          </div>
          <div className="col-md-6">
            <h1 className="text-center">Product Details</h1>
            <h6>Name : {product.name}</h6>
            <h6>Description : {product.description}</h6>
            <h6>Price : ₹ {product.price}</h6>
            <h6>Category : {product.category?.name}</h6>
            <button
              className="btn btn-secondary ms-1"
              onClick={() => addToCart(product)}
            >
              ADD TO CART
            </button>
          </div>
        </div>
        <hr />
        <div className="row container">
          <h5>Similar Products</h5>
          {relatedProducts.length < 1 && (
            <p className="text-center">No Similar Products Found</p>
          )}
          <div className="d-flex flex-wrap">
            {relatedProducts?.map((p) => (
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
                  <p className="card-text">
                    {p.description.substring(0, 30)}...
                  </p>
                  <p className="card-text"> ₹ {p.price}</p>
                  <button
                    className="btn btn-primary me-1"
                    onClick={() => navigate(`/product/${p.slug}`)}
                  >
                    More Details
                  </button>
                  <button
                    className="btn btn-secondary ms-1"
                    onClick={() => addToCart(p)}
                  >
                    ADD TO CART
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProductDetails;
