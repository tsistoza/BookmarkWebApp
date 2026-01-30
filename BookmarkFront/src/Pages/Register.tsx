import type { ReactNode } from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Row, Col, Form, Button, Alert } from 'react-bootstrap';
import { useUser } from '../Context/UserContext';
import type { creds } from './Login';

const Register = (): ReactNode => {
    const { setUser } = useUser();
    const [form, setForm] = useState<creds>({
        username: "",
        password: ""
    });
    const [errorFlag1, setError1] = useState<boolean>(false);
    const [errorFlag2, setError2] = useState<boolean>(false);
    const [apiError, setError3] = useState<Error>();

    const navigate = useNavigate();

    const formChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setForm({...form,
            [event.target.name]: event.target.value
        });
    };

    const resetFlags = (): void => {
        setError1(false);
        setError2(false);
    }

    const submitHandler = async (): Promise<void> => {
        resetFlags();
        if (form.username.length < 4) {
            setError1(true);
            return;
        }
        if (form.password.length < 8) {
            setError2(true);
            return;
        }

        try {
            const response = await fetch('http://localhost:5225/auth/register', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(form),
                credentials: 'include'
            });

            if (response.ok) {
                setUser(form.username);
                navigate("/bookmarks");
            }
            else {
                setError3(new Error("USERNAME HAS BEEN TAKEN"));
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <Row className="m-0 flex-grow-1 justify-content-center align-items-center">
            <Col className="d-flex justify-content-center">
                <Form className="col-3">
                    <Form.Group>
                        <Form.Label>Username</Form.Label>
                        <Form.Control name="username" type="text" placeholder="Enter Username" onChange={formChange} />
                        <Form.Text className="text-muted">At least 4 characters</Form.Text>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Password</Form.Label>
                        <Form.Control name="password" type="password" placeholder="Enter Password" onChange={formChange} />
                        <Form.Text className="text-muted">8+ characters</Form.Text>
                    </Form.Group>
                    <Form.Group>
                        <Button onClick={submitHandler}>Register</Button>
                        {errorFlag1 && <Alert>INVALID USERNAME</Alert>}
                        {errorFlag2 && <Alert>PASSWORD IS TOO SHORT</Alert>}
                        {apiError && <Alert>{apiError.toString()}</Alert>}
                    </Form.Group>
                </Form>
            </Col>
        </Row>
    );
};

export default Register;
