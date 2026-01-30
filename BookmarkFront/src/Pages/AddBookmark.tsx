import type { ReactNode } from 'react';
import { useState, useEffect } from 'react';
import { Row, Col, Form, Button, Alert } from 'react-bootstrap';
import { useUser } from '../Context/UserContext';
import { useNavigate } from 'react-router';

interface NewBookmark {
    user: string,
    dateAdded: string,
    title: string,
    url: string,
    description: string | null,
    tags: string[] | null
};

const AddBookmark = (): ReactNode => {
    const { user, setUser } = useUser();
    const [error, setError] = useState<Error | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) navigate('/login');
    }, [user, navigate]);

    const [form, setForm] = useState<NewBookmark>({
        user: user!,
        dateAdded: new Date().toISOString().slice(0,10),
        title: "",
        url: "",
        description: null,
        tags: null
    });

    const formChange = (event: React.ChangeEvent<HTMLTextAreaElement>): void => {
        setForm({...form,
            [event.target.name]: event.target.value
        });
    };

    const formTags = (event: React.ChangeEvent<HTMLTextAreaElement>): void => {
        const tagStrings: string[] | null = event.target.value.split(",");
        setForm({...form,
            tags: tagStrings
        });
    };

    const submitHandler = async(): Promise<void> => {
        if (form.title.length < 5 || form.title.length > 15) {
            setError(new Error('Title is too short, or too long'));
            return;
        }
        try {
            const response = await fetch('http://localhost:5225/bookmarks/add', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(form),
                credentials: 'include'
            });

            if (response.ok) {
                navigate('/bookmarks');
            } else {
                setUser(null);
                navigate('/login');
            }

        } catch (error) {
            console.log(error);
        }
    };

    return (
        <Row md={2} lg={10} className="flex-grow-1 justify-content-center align-items-center">
            <Col>
                <Form>
                    <Form.Group controlId="updateTitlek">
                        <Form.Label>Title</Form.Label>
                        <Form.Control name="title" type="text" placeholder='Title of Bookmark' onChange={formChange} />
                        <Form.Text className="text-muted">Title must be between 5-15 characters</Form.Text>
                    </Form.Group>
                    <Form.Group controlId="updateURL">
                        <Form.Label>URL</Form.Label>
                        <Form.Control name="url" type="url" placeholder='URL of bookmark' onChange={formChange}/>
                    </Form.Group>
                    <Form.Group controlId="updateDescription">
                        <Form.Label>Description</Form.Label>
                        <Form.Control name="description" as="textarea" rows={3} onChange={formChange} />
                    </Form.Group>
                    <Form.Group controlId="updateTags">
                        <Form.Label>Tags</Form.Label>
                        <Form.Control name="tags" type="text" placeholder='Enter Tags' onChange={formTags} />
                        <Form.Text className="text-muted">e.g. code, hello, world</Form.Text>
                    </Form.Group>
                    <Button onClick={submitHandler}>Submit</Button>
                    {error && <Alert>{error.message}</Alert>}
                </Form>
            </Col>
        </Row>
    );
};

export default AddBookmark;
