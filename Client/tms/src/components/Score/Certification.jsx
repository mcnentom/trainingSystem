import { useState } from "react";
import { useNavigate } from "react-router-dom";
import cozina from "../../assets/cozina1.png";
import "./Certification.scss";
import { BiChevronDown } from "react-icons/bi";
import { BiChevronUp } from "react-icons/bi";

const CertificationPage = () => {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [showCertificate, setShowCertificate] = useState(false);
  const [error, setError] = useState(null);
  const [dateAchieved, setDateAchieved] = useState("");
  const [faqVisibility, setFaqVisibility] = useState(false);
  const [ agreedToTerms, setAgreedToTerms]= useState(false)

  const handleCertificationSubmit = async () => {
    if (!agreedToTerms) {
        alert("Please agree to our terms to continue.");
        return;
      }
    try {
      const userId = localStorage.getItem("user_id");
      const courseId = localStorage.getItem("course_id");
      const currentDateAchieved = new Date().toISOString();

      // Make a POST request to the API endpoint to create a new certification
      const response = await fetch(
        "http://localhost:3000/userActions/certifications",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_id: parseInt(userId),
            course_id: parseInt(courseId),
            date_achieved: currentDateAchieved,
          }),
        }
      );

      if (response.ok) {
        // Certification created successfully
        setDateAchieved(currentDateAchieved);
        setShowCertificate(true);
      } else {
        // Handle error response
        const errorMessage = await response.text();
        console.log(errorMessage);
        setError("Failed to create certification: " + errorMessage);
      }
    } catch (error) {
      console.error("Error creating certification:", error);
      setError("An error occurred while creating the certification.");
    }
  };

  const handleReturnToAssessment = () => {
    navigate(`/course`);
  };
  const toggleVisibility = () => {
    setFaqVisibility(prevState => !prevState)
  };

  return (
    <div className="certificationMainDiv">
      <h2>Certification</h2>
      {!showCertificate ? (
        <div className="certificationDetails">
          <p>
            As a registered entity,Cozina complies with high consent to user
            privacy protection and our terms and conditions. Please do accept
            our terms and condition and proceed to fill in Your Name{" "}
          </p>
          <div>
            <div onClick={() => toggleVisibility()} className="termsDiv">
              <span className="clickArrow">
                {faqVisibility ? (
                  <BiChevronUp className="icon" />
                ) : (
                  <BiChevronDown className="icon" />
                )}
              </span>
              <p>Terms And Conditions</p>
            </div>
            {faqVisibility && (
              <p className="termsContent">
                I agree to terms
              </p>
            )}
            <p className="faqContent">
              <input
                type="checkbox"
                id="termsCheckbox"
                checked={agreedToTerms}
                onChange={() => setAgreedToTerms(!agreedToTerms)}
              />
              <label htmlFor="termsCheckbox"> I agree to the terms and conditions</label>
            </p>
          </div>
          <label>Full Name:</label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="NameInputField"
          />
          <button onClick={handleCertificationSubmit}>Submit</button>
          {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
      ) : (
        <div className="CertificatePage">
          <div className="heading">
            <img src={cozina} alt="logo" />
            <h1>Cozina</h1>
          </div>
          <p>{dateAchieved}</p>
          <p>{fullName}</p>
          <button onClick={handleReturnToAssessment}>Return to Courses</button>
        </div>
      )}
    </div>
  );
};

export default CertificationPage;
