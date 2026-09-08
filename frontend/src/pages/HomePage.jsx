import React, { useEffect, useRef, useState } from "react";
import Layout from "../components/Layout/Layout";
import axios from "axios";
import { Button, Checkbox, Radio } from "antd";
import { Prices } from "../components/Prices";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/Cart";
import toast from "react-hot-toast";
import Loader from "../components/common/Loader";

function HomePage() {
  const navigate = useNavigate();

  const [cart, setCart] = useCart();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [checked, setChecked] = useState([]);
  const [radio, setRadio] = useState([]);

  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const nextPageRef = useRef(2);
  const leftoverRef = useRef([]);
  const HOME_PAGE_SIZE = 8;

  //get all category

  const getAllCategory = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/v1/category/get-category`
      );

      if (res.data?.success) {
        setCategories(res.data?.category);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllCategory();
    getTotal();
  }, []);

  //get all products

  const getAllProducts = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/v1/product/product-list/1`
      );
      let items = res.data?.products || [];
      let fetchedPage = 1;

      if (items.length && items.length < HOME_PAGE_SIZE) {
        const res2 = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/v1/product/product-list/2`
        );
        items = [...items, ...(res2.data?.products || [])];
        fetchedPage = 2;
      }

      leftoverRef.current = items.slice(HOME_PAGE_SIZE);
      nextPageRef.current = fetchedPage + 1;
      setLoading(false);
      setProducts(items.slice(0, HOME_PAGE_SIZE));
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  //get total count

  const getTotal = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/v1/product/product-count`
      );
      setTotal(res.data?.total);
    } catch (error) {
      console.log(error);
    }
  };

  const loadMore = async () => {
    try {
      setLoading(true);
      let batch = leftoverRef.current;
      leftoverRef.current = [];

      while (batch.length < HOME_PAGE_SIZE) {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/v1/product/product-list/${
            nextPageRef.current
          }`
        );
        const more = res.data?.products || [];
        nextPageRef.current += 1;
        if (!more.length) break;
        batch = [...batch, ...more];
      }

      leftoverRef.current = batch.slice(HOME_PAGE_SIZE);
      setProducts((prev) => [...prev, ...batch.slice(0, HOME_PAGE_SIZE)]);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  //filter by category

  const handleFilter = (value, id) => {
    let all = [...checked];
    if (value) {
      all.push(id);
    } else {
      all = all.filter((c) => c !== id);
    }
    setChecked(all);
  };

  useEffect(() => {
    if (!checked.length || !radio.length) getAllProducts();
  }, []);

  useEffect(() => {
    if (checked.length || radio.length) filterProduct();
  }, [checked, radio]);

  //get filterd product

  const filterProduct = async () => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/v1/product/product-filters`,
        { checked, radio }
      );
      setProducts(res.data?.products);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Layout title={"All Products - Best offers"}>
      <div className="container-fluid p-3 home-page">
        <div className="row">
          <div className="col-md-3">
            <div className="filter-panel">
            <h5 className="text-center">Filter By Category</h5>
            <div className="d-flex flex-column">
              {categories?.map((c) => (
                <Checkbox
                  key={c._id}
                  onChange={(e) => handleFilter(e.target.checked, c._id)}
                >
                  {c.name}
                </Checkbox>
              ))}
            </div>

            {/* price filter */}

            <h5 className="text-center mt-4">Filter By Price</h5>
            <div className="d-flex flex-column">
              <Radio.Group onChange={(e) => setRadio(e.target.value)}>
                {Prices?.map((p) => (
                  <div key={p._id}>
                    <Radio value={p.array}>{p.name}</Radio>
                  </div>
                ))}
              </Radio.Group>
            </div>

            <div className="d-flex flex-column">
              <button
                className="btn btn-danger mt-4"
                onClick={() => window.location.reload()}
              >
                RESET FILTERS
              </button>
            </div>
            </div>
          </div>

          <div className="col-md-9 products-panel">
            <h1 className="text-center">All Products</h1>
            {loading && products.length === 0 ? (
              <Loader />
            ) : (
              <>
            <div className="product-grid">
              {products?.map((p) => (
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
                    <p className="card-text product-price"> ₹ {p.price}</p>
                    <button
                      className="btn btn-primary me-1"
                      onClick={() => navigate(`/product/${p.slug}`)}
                    >
                      More Details
                    </button>
                    <button
                      className="btn btn-secondary ms-1"
                      onClick={() => {
                        setCart([...cart, p]);
                        localStorage.setItem(
                          "cart",
                          JSON.stringify([...cart, p])
                        );
                        toast.success("Item Added to cart");
                      }}
                    >
                      ADD TO CART
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="m-2 p-3 text-center">
              {products && products.length > 0 && products.length < total && (
                <Button
                  className="btn btn-warning"
                  onClick={(e) => {
                    e.preventDefault();
                    loadMore();
                  }}
                >
                  {loading ? "Loading..." : "Load More"}
                </Button>
              )}
            </div>
              </>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default HomePage;
