import { Row, Col, Form, Button, Alert } from 'react-bootstrap';
import { useUser } from '../Context/UserContext';
import { useEffect, useState, type ReactNode } from 'react';
import { useNavigate } from 'react-router';

export interface creds {
    username: string,
    password: string
};

const Login = (): ReactNode => {
    const [form, setForm] = useState<creds>({
        username: "",
        password: ""
    });
    const [error, setError] = useState<Error | undefined>();

    const { user, setUser } = useUser();
    const navigate = useNavigate();

    const formChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setForm({...form,
            [event.target.name]: event.target.value
        });
    };

    const submitHandler = async (): Promise<void> => {
        setError(undefined);
        try {
            const response = await fetch('http://localhost:5225/auth/login', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(form),
                credentials: 'include'
            });

            if (response.ok) {
                setUser(form.username);
                navigate('/');
            }
            else
                setError(new Error("FAILED AUTHENTICATION\n"))

        } catch (error) {
            console.error(error);
        }
        return;
    };

    return (
        <Row className="m-0 flex-grow-1 justify-content-center align-items-center">
            <Col className="d-flex justify-content-center">
                <Form className="col-3">
                    <Form.Group>
                        <Form.Label>Username</Form.Label>
                        <Form.Control name="username" type="text" placeholder="Enter Username" onChange={formChange} />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Password</Form.Label>
                        <Form.Control name="password" type="password" placeholder="Enter Password" onChange={formChange} />
                    </Form.Group>
                    <Form.Group>
                        <Button onClick={submitHandler}>Login</Button>
                        {error && <Alert>{error.toString()}</Alert>}
                    </Form.Group>
                </Form>
            </Col>
        </Row>
    );
};

export default Login;
