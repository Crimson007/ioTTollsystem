import React from 'react';

const Contact = () => {
  return (
    <div className="container my-5">
      <h1 className="text-center mb-4">Need any Help?</h1>
      <p className="lead text-center mb-5">
        For any questions, feedback, or technical support, don’t hesitate to reach out! Our team is here to guide you through the registration process, verification steps, and any issues with toll processing. Common topics include how to register your vehicle, check verification status, and update account details. For additional support, refer to our FAQs or contact us directly for further assistance. We’re committed to making your experience smooth and straightforward.
      </p>

      <h2 className="mb-3"><strong>Contacts</strong></h2>
      <div className="row">
        <div className="col-md-4 mb-4">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Gideon Gathua Maina</h5>
              <p className="card-text">
                <strong>Email:</strong> maina.gideon@students.kyu.ac.ke<br />
                <strong>Phone:</strong> +254 790 802553
              </p>
            </div>
          </div>
        </div>
        
        <div className="col-md-4 mb-4">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Millicent Mbuka</h5>
              <p className="card-text">
                <strong>Email:</strong> mbuka.millicent@students.kyu.ac.ke<br />
                <strong>Phone:</strong> +254 743 280830
              </p>
            </div>
          </div>
        </div>

        <div className="col-md-4 mb-4">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Tonyblair Odhiambo</h5>
              <p className="card-text">
                <strong>Email:</strong> odhiambo.tonyblair@students.kyu.ac.ke<br />
                <strong>Phone:</strong> +254 115 992682
              </p>
            </div>
          </div>
        </div>
      </div>

      <p className="text-center mt-5">
        Thank you for helping us improve tolling and traffic management.
      </p>
    </div>
  );
};

export default Contact;
