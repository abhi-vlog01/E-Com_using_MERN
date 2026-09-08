import React from "react";
import Layout from "./../components/Layout/Layout";

const Policy = () => {
  return (
    <Layout title={"Privacy Policy"}>
      <div className="row contactus">
        <div className="col-md-6 ">
          <img
            src="/images/contactus.jpeg"
            alt="contactus"
            style={{ width: "100%" }}
          />
        </div>
        <div className="col-md-4">
          <p>
            We value your privacy. Any personal information collected on this
            website, such as name, email, or browsing data, is used only to
            enhance your experience. We do not sell or share your data with
            third parties except as required by law. Cookies may be used to
            improve functionality and analytics. By using this site, you agree
            to our privacy practices.
          </p>
          <p>
            For more details, contact us at
            <b> www.help@ecommerceapp.com</b>
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default Policy;
