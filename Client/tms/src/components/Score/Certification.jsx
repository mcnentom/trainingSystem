import { useState } from "react";
import { useNavigate } from "react-router-dom";
import cozina from "../../assets/cozina1.png";
import "./Certification.scss";
import { BiChevronDown, BiChevronUp } from "react-icons/bi";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const CertificationPage = () => {
  // const { courseId } = useParams(); // Use useParams to get courseId
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [showCertificate, setShowCertificate] = useState(false);
  const [error, setError] = useState(null);
  const [dateAchieved, setDateAchieved] = useState("");
  const [faqVisibility, setFaqVisibility] = useState(false);
  const [agreed, setAgreed] = useState(false);

  const handleCertificationSubmit = async () => {
    if (!agreed) {
      alert("Please agree with our terms to continue.");
      return;
    }
  
    try {
      const userId = localStorage.getItem("user_id");
      const courseId = localStorage.getItem("course_id")
      const currentDateAchieved = new Date().toISOString();
  
      console.log('Submitting certification:', {
        user_id: parseInt(userId),
        course_id: parseInt(courseId), // Make sure courseId is correctly parsed
        date_achieved: currentDateAchieved,
      });
  
      const response = await fetch("http://localhost:3000/userActions/certifications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: parseInt(userId),
          course_id: parseInt(courseId), // Use courseId from params
          date_achieved: currentDateAchieved,
        }),
      });
  
      if (response.ok) {
        setDateAchieved(currentDateAchieved);
        setShowCertificate(true);
      } else {
        const errorMessage = await response.text();
        setError("Failed to create certification: " + errorMessage);
      }
    } catch (error) {
      setError("An error occurred while creating the certification.");
    }
  };
  

  const handleReturnToAssessment = () => {
    navigate(`/course`);
  };

  const toggleVisibility = () => {
    setFaqVisibility((prev) => !prev);
  };

  const handleDownloadPDF = () => {
    const input = document.querySelector(".CertificatePage");
    html2canvas(input, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");

      const imgWidth = 210;
      const pageHeight = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save("certificate.pdf");
    });
  };

  return (
    <div className="certificationMainDiv">
      <h2>Certification</h2>
      {!showCertificate ? (
        <div className="certificationDetails">
          <p>As a registered entity, Cozina complies with high consent to user privacy protection and our terms and conditions. Please do accept our terms and conditions and proceed to fill in Your Name.</p>
          <div onClick={toggleVisibility}>
            <span>{faqVisibility ? <BiChevronUp className="icon" /> : <BiChevronDown className="icon" />}</span>
          </div>
          {faqVisibility && <p>I agree to terms</p>}
          <label>
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
            />
            I agree to terms and conditions
          </label>
          <label>Full Name:</label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
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
          <button onClick={handleDownloadPDF}>Download as PDF</button>
        </div>
      )}
    </div>
  );
};

export default CertificationPage;
