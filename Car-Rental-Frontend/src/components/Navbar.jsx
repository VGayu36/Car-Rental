import { Link } from "react-router-dom";
import Logo from "../images/logo/logo.png";
import { useState, useEffect } from "react";
import { Navbar, Nav, Container, Button } from "react-bootstrap";
import { FaBars, FaTimes } from "react-icons/fa";

function CustomNavbar() {
  const [expanded, setExpanded] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); 

  
  useEffect(() => {
    const storedLoginStatus = localStorage.getItem("isLoggedIn");
    if (storedLoginStatus === "true") {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, []);


  
  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn"); 
    setIsLoggedIn(false); 
  };

  return (
    <Navbar expand="lg" expanded={expanded} bg="light" variant="light">
      <Container>
        <Navbar.Brand as={Link} to="/" onClick={() => setExpanded(false)}>
          <img src={Logo} alt="logo" width="120" />
        </Navbar.Brand>

        <Navbar.Toggle
          aria-controls="basic-navbar-nav"
          onClick={() => setExpanded(expanded ? false : "expanded")}
        >
          {expanded ? <FaTimes /> : <FaBars />}
        </Navbar.Toggle>

        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto h2 gap-5 fw-bolder">
            <Nav.Link as={Link} to="/" onClick={() => setExpanded(false)}>
              Home
            </Nav.Link>
            <Nav.Link as={Link} to="/about" onClick={() => setExpanded(false)}>
              About
            </Nav.Link>
            <Nav.Link as={Link} to="/models" onClick={() => setExpanded(false)}>
              Models
            </Nav.Link>
            <Nav.Link as={Link} to="/testimonials" onClick={() => setExpanded(false)}>
              Testimonials
            </Nav.Link>
            <Nav.Link as={Link} to="/team" onClick={() => setExpanded(false)}>
              Our Team
            </Nav.Link>
            <Nav.Link as={Link} to="/contact" onClick={() => setExpanded(false)}>
              Contact
            </Nav.Link>
          </Nav>

          {/* Conditional Rendering for Sign In / Register or Logout */}
          {!isLoggedIn ? (
            <div className="d-flex gap-2 ms-5">
              <Button variant="outline-primary" className="fs-4" as={Link} to="/Login" onClick={() => setExpanded(false)}>
                Sign In
              </Button>
              <Button variant="primary" className="fs-4" as={Link} to="/Signup" onClick={() => setExpanded(false)}>
                Register
              </Button>
            </div>
          ) : (
            <div className="d-flex gap-2 ms-5">
              <Button variant="outline-danger" className="fs-4" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default CustomNavbar;
