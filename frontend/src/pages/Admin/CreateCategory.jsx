import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout/Layout";
import AdminMenu from "../../components/Layout/AdminMenu";
import toast from "react-hot-toast";
import axios from "axios";
import CategoryForm from "../../components/Form/CategoryForm";
import { useAuth } from "../../context/Auth";
import { Modal } from "antd";

const CreateCategory = () => {
  const [auth] = useAuth();

  const [categories, setCategories] = useState([]);

  const [name, setName] = useState("");

  const [visible, setVisible] = useState(false);

  const [selected, setSelected] = useState(null);

  const [updatedName, setUpdatedName] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !name.trim()) {
      toast.error("Please enter category name");
      return;
    }

    if (!auth?.token) {
      toast.error("You must be logged in to create a category");
      return;
    }

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/v1/category/create-category`,
        { name },
        {
          headers: {
            Authorization: auth.token,
            "Content-Type": "application/json",
          },
        }
      );

      if (res.data?.success) {
        toast.success(`${res.data.category?.name || name} is created`);
        setName("");
        getAllCategory();
      } else {
        toast.error(res.data?.message || "Failed to create category");
      }
    } catch (error) {
      console.log(error?.response || error);
      toast.error("Something went wrong while creating category");
    }
  };

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
      toast.error("Something went wrong getting category");
    }
  };

  useEffect(() => {
    getAllCategory();
  }, []);

  //update category

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!updatedName || !updatedName.trim()) {
      toast.error("Please enter category name");
      return;
    }

    if (!auth?.token) {
      toast.error("You must be logged in to update a category");
      return;
    }

    try {
      const { data } = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/v1/category/update-category/${
          selected._id
        }`,
        { name: updatedName },
        {
          headers: {
            Authorization: auth.token,
            "Content-Type": "application/json",
          },
        }
      );

      if (data.success) {
        toast.success(`${updatedName} is updated`);
        setSelected(null);
        setUpdatedName("");
        setVisible(false);
        getAllCategory();
      } else {
        toast.error(data.message || "Failed to update category");
      }
    } catch (error) {
      console.log(error?.response || error);
      toast.error("Something went wrong while updating category");
    }
  };

  //delete category

  const handleDelete = async (id) => {
    if (!auth?.token) {
      toast.error("You must be logged in to delete a category");
      return;
    }

    try {
      const { data } = await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/v1/category/delete-category/${id}`,
        {
          headers: {
            Authorization: auth.token,
            "Content-Type": "application/json",
          },
        }
      );

      if (data.success) {
        toast.success(data.message);

        getAllCategory();
      } else {
        toast.error(data.message || "Failed to update category");
      }
    } catch (error) {
      console.log(error?.response || error);
      toast.error("Something went wrong while updating category");
    }
  };

  return (
    <Layout title={"Dashboard - Create Category"}>
      <div className="container-fluid p-3 dashboard-page">
        <div className="row">
          <div className="col-md-3">
            <AdminMenu />
          </div>
          <div className="col-md-9">
            <h1>Manage Category</h1>
            <div className="p-3 w-50">
              <CategoryForm
                handleSubmit={handleSubmit}
                value={name}
                setValue={setName}
              />
            </div>
            <div className="w-75">
              <table className="table">
                <thead>
                  <tr>
                    <th scope="col">Name</th>
                    <th scope="col">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {categories?.map((c) => (
                    <tr key={c._id}>
                      <td>{c.name}</td>

                      <td>
                        <button
                          className="btn btn-primary ms-2"
                          onClick={() => {
                            setVisible(true);
                            setUpdatedName(c.name);
                            setSelected(c);
                          }}
                        >
                          Edit
                        </button>

                        <button
                          className="btn btn-danger ms-2"
                          onClick={() => {
                            handleDelete(c._id);
                          }}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <Modal
              onCancel={() => setVisible(false)}
              footer={null}
              open={visible}
            >
              <CategoryForm
                value={updatedName}
                setValue={setUpdatedName}
                handleSubmit={handleUpdate}
              />
            </Modal>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CreateCategory;
