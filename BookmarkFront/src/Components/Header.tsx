import { Col, Container, Button, Nav, Navbar } from 'react-bootstrap';
import { useUser } from '../Context/UserContext';
import { useNavigate, Link } from 'react-router';

const Header = () => {
    const { user, setUser } = useUser();
    const navigate = useNavigate();
    const logoutHandler = async(): Promise<void> => {
        try {
            await fetch('http://localhost:5225/auth/logout', {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: 'include'
            });

            setUser(null);
            navigate('/login');
        } catch(error) {
            console.log(error);
        }
    };

    return (
        <Navbar bg="dark" data-bs-theme="dark">
            <Container fluid>
                <Col className="d-flex justify-content-start">
                    <Navbar.Brand className="px-4 py-0">Bookmark Manager</Navbar.Brand>
                    <Nav>
                        {user && <Nav.Link as={Link} to="/bookmarks">Bookmarks</Nav.Link>}
                        {user && <Nav.Link as={Link} to="/bookmarks/add">Add Bookmark</Nav.Link>}
                    </Nav>
                </Col>
                    {user == null &&
                        <Col className="d-flex col-auto px-1">
                            <Button onClick={() => navigate("/login")}>Login</Button>
                        </Col>}
                    {user == null &&
                        <Col className="d-flex col-auto px-1">
                            <Button onClick={() => navigate("/register")}>Register</Button>
                        </Col>}
                    {user != null && 
                        <Col className="d-flex col-auto px-1">
                            <p className=" my-auto p-0 px-2 text-muted">{user}</p>
                            <Button onClick={logoutHandler}>Logout</Button>
                        </Col>}
            </Container>
        </Navbar>
    );
};

export default Header;
