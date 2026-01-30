import { Row, Col } from 'react-bootstrap';
import type { ReactNode } from 'react';

const NotFound = (): ReactNode => {
    return (
        <Row className="m-0 flex-grow-1 text-center align-items-center">
            <Col className="">
                <h1>NOT FOUND</h1>
            </Col>
        </Row>
    );
};

export default NotFound;
