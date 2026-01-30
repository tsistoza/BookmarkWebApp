import { Row, Col, Container, Button } from 'react-bootstrap';
import { useUser } from '../Context/UserContext';
import type { ReactNode } from 'react';
import { useNavigate } from 'react-router';

const Landing = (): ReactNode => {
    const { user } = useUser();
    const navigate = useNavigate();

    return (
        <>
        <Container className="m-0 flex-grow-1 text-center align-content-center" fluid>
            <Row className="justify-content-center align-items-center ">
                <h1>Welcome!</h1>
            </Row>
            <Row className="justify-content-center">
                <Col className="col-8"><hr /></Col>
            </Row>
            <Row xs={1} className="justify-content-center">
                {
                    !user && 
                    <>
                        <Col className="col-3 px-4">
                            <p>Please login to view your bookmarks</p>
                            <Button onClick={() => navigate('/login')}>Login</Button>
                        </Col>
                        <Col className="col-3 px-4">
                            <p>If you dont have an account you can register here</p>
                            <Button onClick={() => navigate('/register')}>Register</Button>
                        </Col>
                    </>
                }
                {
                    user &&
                    <Col className="col-auto">
                        <p>This a bookmark website where you can store your bookmarks online</p>
                        <p>To see your bookmarks go here</p>
                        <Button onClick={() => navigate('/bookmarks')}>Bookmarks</Button>
                    </Col>
                }
            </Row>
        </Container>
        </>
    );
};

export default Landing;
