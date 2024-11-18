// src/components/BookCar.js
import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import CarAudi from "../images/cars-big/audia1.jpg";
import CarGolf from "../images/cars-big/golf6.jpg";
import CarToyota from "../images/cars-big/toyotacamry.jpg";
import CarBmw from "../images/cars-big/bmw320.jpg";
import CarMercedes from "../images/cars-big/benz.jpg";
import CarPassat from "../images/cars-big/passatcc.jpg";

const BookCar = () => {
  const [modal, setModal] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMessages, setErrorMessages] = useState({});
  const [searchParams] = useSearchParams(); 
  const session_id = searchParams.get('session_id'); 
  const navigate = useNavigate(); 

  const cityOptions = [
    "Mumbai", "Bangalore", "Kolkata", "Chennai", "Hyderabad", "Pune", "Ahmedabad",
    "Chandigarh", "Jaipur", "Lucknow", "Kanpur", "Surat", "Visakhapatnam", "Indore",
    "Coimbatore", "Madurai", "Patna", "Vadodara", "Nasik", "Bhopal", "Delhi", "Noida", 
    "Gurugram", "Amritsar", "Agra", "Ranchi", "Trivandrum", "Vijayawada", "Rajkot", "Bodhgaya"
];

const cityCostMap = {
    "Mumbai-Bangalore": 8000,
    "Mumbai-Kolkata": 12000,
    "Mumbai-Chennai": 9500,
    "Mumbai-Hyderabad": 7000,
    "Mumbai-Pune": 1500,
    "Mumbai-Ahmedabad": 3000,
    "Bangalore-Chennai": 3100,
    "Bangalore-Hyderabad": 4000,
    "Bangalore-Pune": 6500,
    "Kolkata-Chennai": 7500,
    "Kolkata-Hyderabad": 8500,
    "Chennai-Hyderabad": 3500,
    "Chennai-Bangalore": 2000,
    "Madurai-Chennai": 3000,
    "Madurai-Bangalore": 3500,
    "Hyderabad-Pune": 5500,
    "Pune-Ahmedabad": 4500,
    "Jaipur-Delhi": 2500,
    "Lucknow-Kanpur": 1000,
    "Surat-Ahmedabad": 2000,
    "Visakhapatnam-Chennai": 4500,
    "Indore-Bhopal": 1500,
    "Coimbatore-Madurai": 1200,
    "Patna-Lucknow": 3500,
    "Vadodara-Ahmedabad": 1300,
    "Nasik-Mumbai": 2200,
    "Bhopal-Indore": 1500,
    "Delhi-Noida": 800,
    "Delhi-Gurugram": 1000,
    "Delhi-Amritsar": 3500,
    "Agra-Delhi": 1500,
    "Chandigarh-Amritsar": 2000,
    "Pune-Bangalore": 6500,
    "Bangalore-Coimbatore": 2500,
    "Kolkata-Patna": 3000,
    "Chennai-Coimbatore": 2000,
    "Kochi-Trivandrum": 1500,
    "Kochi-Bangalore": 4000,
    "Lucknow-Varanasi": 2000,
    "Nagpur-Mumbai": 3500,
    "Hyderabad-Coimbatore": 3500,
    "Jaipur-Agra": 1800,
    "Surat-Vadodara": 1000,
    "Rajkot-Ahmedabad": 1200,
    "Madurai-Kochi": 1500,
    "Chennai-Puducherry": 2000,
    "Hyderabad-Vijayawada": 1500,
    "Kolkata-Ranchi": 2500,
    "Patna-Bodhgaya": 1500,
    "Agra-Jaipur": 2000,
    "Mumbai-Gurugram": 4000,
    "Delhi-Bhopal": 4500,
    "Mumbai-Delhi": 6000,
    "Chennai-Pune": 3000,
    "Hyderabad-Delhi": 5000,
    "Bangalore-Rajkot": 7000,
    "Kolkata-Kochi": 5000,
    "Jaipur-Bhopal": 3000,
    "Noida-Gurugram": 500,
    "Surat-Kochi": 6000,
    "Nagpur-Pune": 5500,
    "Kochi-Chennai": 2000,
    "Rajkot-Mumbai": 7000,
    "Indore-Vijayawada": 4000,
    "Chennai-Kochi": 3000
};

  
  const [carType, setCarType] = useState("");
  const [pickUp, setPickUp] = useState("");
  const [dropOff, setDropOff] = useState("");
  const [pickTime, setPickTime] = useState("");
  const [dropTime, setDropTime] = useState("");
  const [carImg, setCarImg] = useState("");


  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [age, setAge] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [zipcode, setZipCode] = useState("");

  
  useEffect(() => {
    const storedLoginStatus = localStorage.getItem("isLoggedIn");
    setIsLoggedIn(storedLoginStatus === "true");

    if (storedLoginStatus === "true") {
      axios.get('http://localhost:5050/api/bookings/user/')
        .then(response => {
          console.log('Bookings:', response.data);
          setBookings(response.data);
        })
        .catch(error => {
          console.error('Error fetching bookings:', error.response?.data || error.message);
        });
    }
  }, []);

  const calculateCost = () => {
    const route = `${pickUp}-${dropOff}`;
    return cityCostMap[route] || "Cost not available for this route";
  };

  const openModal = (e) => {
    e.preventDefault();
    const newErrorMessages = {};
    if (!pickUp) newErrorMessages.pickUp = "Pick-up location is required.";
    if (!dropOff) newErrorMessages.dropOff = "Drop-off location is required.";
    if (!pickTime) newErrorMessages.pickTime = "Pick-up time is required.";
    if (!dropTime) newErrorMessages.dropTime = "Drop-off time is required.";
    if (!carType) newErrorMessages.carType = "Car type is required.";
    if (Object.keys(newErrorMessages).length > 0) {
      setErrorMessages(newErrorMessages);
    } else {
      setModal(true);
      setErrorMessages({});
    }
  };

  useEffect(() => {
    document.body.style.overflow = modal ? "hidden" : "auto";
  }, [modal]);

  const confirmBooking = async () => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      console.error("Invalid userId:", userId);
      return;
    }

    const bookingData = {
      carType,
      pickUp,
      dropOff,
      pickTime,
      dropTime,
      userDetails: {
        name,
        lastName,
        phone,
        age,
        email,
        address,
        city,
        zipcode
      },
      userId
    };

    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5050/api/bookings', bookingData);
      console.log('Booking confirmed:', response.data);
      setModal(false);
      // alert("Payment Successfull")
      
       window.location.href = response.data.url;
      // const sessionId = response.data.session_id; 
      // navigate(`/success?session_id=${sessionId}`); 

    } catch (error) {
      console.error("There was an error creating the booking!", error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCar = (e) => {
    setCarType(e.target.value);
    setCarImg(e.target.value);
  };

  const handlePick = (e) => {
    setPickUp(e.target.value);
  };

  const handleDrop = (e) => {
    setDropOff(e.target.value);
  };

  const handlePickTime = (e) => {
    setPickTime(e.target.value);
  };

  const handleDropTime = (e) => {
    setDropTime(e.target.value);
  };

  const handleName = (e) => {
    setName(e.target.value);
  };

  const handleLastName = (e) => {
    setLastName(e.target.value);
  };

  const handlePhone = (e) => {
    setPhone(e.target.value);
  };

  const handleAge = (e) => {
    setAge(e.target.value);
  };

  const handleEmail = (e) => {
    setEmail(e.target.value);
  };

  const handleAddress = (e) => {
    setAddress(e.target.value);
  };

  const handleCity = (e) => {
    setCity(e.target.value);
  };

  const handleZip = (e) => {
    setZipCode(e.target.value);
  };

  let imgUrl;
  switch (carImg) {
    case "Audi A1 S-Line":
      imgUrl = CarAudi;
      break;
    case "VW Golf 6":
      imgUrl = CarGolf;
      break;
    case "Toyota Camry":
      imgUrl = CarToyota;
      break;
    case "BMW 320 ModernLine":
      imgUrl = CarBmw;
      break;
    case "Mercedes-Benz GLK":
      imgUrl = CarMercedes;
      break;
    case "VW Passat CC":
      imgUrl = CarPassat;
      break;
    default:
      imgUrl = "";
  }

  return (
    <>
      <section id="booking-section" className="book-section">
        <div
          onClick={openModal}
          className={`modal-overlay ${modal ? "active-modal" : ""}`}
        ></div>

        <div className="container">
          <div className="book-content">
            <div className="book-content__box">
              <h2>Book a car</h2>

              <p className="error-message">
                All fields required! <i className="fa-solid fa-xmark"></i>
              </p>

              <form className="box-form">
                <div className="box-form__car-type">
                  <label>
                    <i className="fa-solid fa-car"></i> &nbsp; Select Your Car
                    Type <b>*</b>
                  </label>
                  <select value={carType} onChange={handleCar}>
                    <option>Select your car type</option>
                    <option value="Audi A1 S-Line">Audi A1 S-Line</option>
                    <option value="VW Golf 6">VW Golf 6</option>
                    <option value="Toyota Camry">Toyota Camry</option>
                    <option value="BMW 320 ModernLine">
                      BMW 320 ModernLine
                    </option>
                    <option value="Mercedes-Benz GLK">Mercedes-Benz GLK</option>
                    <option value="VW Passat CC">VW Passat CC</option>
                  </select>
                </div>

                <div className="box-form__car-type">
                  <label>
                    <i className="fa-solid fa-location-dot"></i> &nbsp; Pick-up <b>*</b>
                  </label>
                  <select value={pickUp} onChange={handlePick}>
                    <option value="">Select pick-up location</option>
                    {cityOptions.map((city) => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>

                <div className="box-form__car-type">
                  <label>
                    <i className="fa-solid fa-location-dot"></i> &nbsp; Drop-off <b>*</b>
                  </label>
                  <select value={dropOff} onChange={handleDrop}>
                    <option value="">Select drop-off location</option>
                    {cityOptions.map((city) => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>

                <div className="box-form__car-time">
                  <label htmlFor="picktime">
                    <i className="fa-regular fa-calendar-days "></i> &nbsp;
                    Pick-up-Time <b>*</b>
                  </label>
                  <input
                    id="picktime"
                    value={pickTime}
                    onChange={handlePickTime}
                    type="date"
                  ></input>
                </div>

                <div className="box-form__car-time">
                  <label htmlFor="droptime">
                    <i className="fa-regular fa-calendar-days "></i> &nbsp;
                    Drop-off-Time <b>*</b>
                  </label>
                  <input
                    id="droptime"
                    value={dropTime}
                    onChange={handleDropTime}
                    type="date"
                  ></input>
                </div>

                <button onClick={openModal} type="submit">
                  Search
                </button>
                <p className="h3">Total Cost: {calculateCost()}</p>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Modal ------------------------------------ */}
      <div className={`booking-modal ${modal ? "active-modal" : ""}`}>
        {/* Title */}
        <div className="booking-modal__title">
          <h2>Complete Reservation</h2> <i onClick={openModal} className="fa-solid fa-xmark"></i>
        </div>
        {/* Message */}
        <div className="booking-modal__message">
          <h4>
            <i className="fa-solid fa-circle-info"></i> Upon completing this
            reservation enquiry, you will receive:
          </h4>
          <p>
            Your rental voucher to produce on arrival at the rental desk and a
            toll-free customer support number.
          </p>
        </div>
        {/* Car Info */}
        <div className="booking-modal__car-info">
          <div className="dates-div">
            <div className="booking-modal__car-info__dates">
              <h5>Location & Date</h5>
              <span>
                <i className="fa-solid fa-location-dot"></i>
                <div>
                  <h6>Pick-Up Date & Time</h6>
                  <p>
                    {pickTime} /{" "}
                    <input type="time" className="input-time"></input>
                  </p>
                </div>
              </span>
            </div>

            <div className="booking-modal__car-info__dates">
              <span>
                <i className="fa-solid fa-location-dot"></i>
                <div>
                  <h6>Drop-Off Date & Time</h6>
                  <p>
                    {dropTime} /{" "}
                    <input type="time" className="input-time"></input>
                  </p>
                </div>
              </span>
            </div>

            <div className="booking-modal__car-info__dates">
              <span>
                <i className="fa-solid fa-calendar-days"></i>
                <div>
                  <h6>Pick-Up Location</h6>
                  <p>{pickUp}</p>
                </div>
              </span>
            </div>

            <div className="booking-modal__car-info__dates">
              <span>
                <i className="fa-solid fa-calendar-days"></i>
                <div>
                  <h6>Drop-Off Location</h6>
                  <p>{dropOff}</p>
                </div>
              </span>
              <p className="h3">Total Cost: {calculateCost()}</p>
            </div>
          </div>
          <div className="booking-modal__car-info__model">
            <h5>
              <span>Car -</span> {carType}
            </h5>
            {imgUrl && <img src={imgUrl} alt="car_img" />}
          </div>
        </div>
        {/* Personal Info */}
        <div className="booking-modal__person-info">
          <h4>Personal Information</h4>
          <form className="info-form">
            <div className="info-form__2col">
              <span>
                <label>
                  First Name <b>*</b>
                </label>
                <input
                  value={name}
                  onChange={handleName}
                  type="text"
                  placeholder="Enter your first name"
                ></input>
                <p className="error -modal">This field is required.</p>
              </span>

              <span>
                <label>
                  Last Name <b>*</b>
                </label>
                <input
                  value={lastName}
                  onChange={handleLastName}
                  type="text"
                  placeholder="Enter your last name"
                ></input>
                <p className="error-modal">This field is required.</p>
              </span>

              <span>
                <label>
                  Phone Number <b>*</b>
                </label>
                <input
                  value={phone}
                  onChange={handlePhone}
                  type="tel"
                  placeholder="Enter your phone number"
                ></input>
                <p className="error-modal">This field is required.</p>
              </span>

              <span>
                <label>
                  Age <b>*</b>
                </label>
                <input
                  value={age}
                  onChange={handleAge}
                  type="number"
                  placeholder=""
                ></input>
                <p className="error-modal">This field is required.</p>
              </span>
            </div>

            <div className="info-form__1col">
              <span>
                <label>
                  Email <b>*</b>
                </label>
                <input
                  value={email}
                  onChange={handleEmail}
                  type="email"
                  placeholder="Enter your email address"
                ></input>
                <p className="error-modal">This field is required.</p>
              </span>

              <span>
                <label>
                  Address <b>*</b>
                </label>
                <input
                  value={address}
                  onChange={handleAddress}
                  type="text"
                  placeholder="Enter your street address"
                ></input>
                <p className="error-modal">This field is required.</p>
              </span>
            </div>

            <div className="info-form__2col">
              <span>
                <label>
                  City <b>*</b>
                </label>
                <input
                  value={city}
                  onChange={handleCity}
                  type="text"
                  placeholder="Enter your city"
                ></input>
                <p className="error-modal">This field is required.</p>
              </span>

              <span>
                <label>
                  Zip Code <b>*</b>
                </label>
                <input
                  value={zipcode}
                  onChange={handleZip}
                  type="text"
                  placeholder="Enter your zip code"
                ></input>
                <p className="error-modal">This field is required.</p>
              </span>
            </div>
            <p className="h3">Total Cost: {calculateCost()}</p>

            <span className="info-form__checkbox">
              <input type="checkbox"></input>
              <p>Please send me the latest news and updates</p>
            </span>

            <div className="reserve-button">
              <button type="button" onClick={confirmBooking} disabled={loading}>
                {loading ? "Reserving..." : "Reserve Now"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};




const SuccessPage = () => {
  const [searchParams] = useSearchParams();
  const publishableKey = process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY;
  const session_id = searchParams.get('session_id');
  const [message, setMessage] = useState('Confirming payment...');

  useEffect(() => {
    const checkPaymentStatus = async () => {
        try {
            const response = await axios.get(`http://localhost:5050/api/bookings/confirmpayment?session_id=${session_id}`);
            setMessage(`Payment confirmed! Booking ID: ${response.data.booking._id}`);
            alert("Payment Successful");
        } catch (error) {
            console.error('Payment confirmation failed:', error);
            setMessage('Payment confirmation failed. Please contact support.');
        } finally {
          
            setTimeout(() => {
                navigate("/");  
            }, 500);  
        }
    };

    if (session_id) {
        checkPaymentStatus();
    }
}, [session_id, navigate]);

  return (
    <div className="success-page">
       <h1>{message || "Processing your payment..."}</h1>
      {/* Display the Publishable Key if needed */}
      <p>Your Publishable Key: {publishableKey}</p>
    </div>
  );
};



export default BookCar;

export { SuccessPage };