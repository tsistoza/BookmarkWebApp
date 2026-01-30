import { Row, Col, Form, Button, Alert } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import type { BookmarkItem } from './Bookmarks';
import { useNavigate } from 'react-router';
import NotFound from './NotFound';
import { useUser } from '../Context/UserContext';



const UpdateBookmark = ({ id }: { id: string | undefined }) => {
    const { user } = useUser();
    const navigate = useNavigate();

    const [error, setError] = useState<Error | null>(null);
    const [bookmark, setBookmark] = useState<BookmarkItem>();
    const [formData, setFormData] = useState<BookmarkItem>({
        "id": "",
        "user": "",
        "dateAdded": "",
        "title": "",
        "url": "",
        description: null,
        "tags": []
    });

    useEffect(() => {
        const grabBookmark = async () => {
            if (!user) {
                navigate('/login');
                return;
            }
            try {
                const response = await fetch(`http://localhost:5225/bookmarks/${user}/${id}`, {
                    method: "GET",
                    credentials: "include"
                });

                if (response.ok) {
                    const result = await response.json();
                    setBookmark(result);
                    setFormData(result);
                } else {
                    throw new Error("FAILED TO GET BOOKMARK");
                }
            } catch (error) {
                console.error(error);
            }
        };

        grabBookmark();
    }, [id, user, navigate]);

    const formChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setFormData({...formData,
            [event.target.name]: event.target.value
        });
    };

    const formTags = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        const tagArr: string[] | null = event.target.value.split(",");
        setFormData({...formData,
            tags: tagArr
        });
    };
    
    const submitHandler = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (bookmark == undefined) return;
        if (formData.title.length < 5 || formData.title.length > 15) {
            setError(new Error('Title is too short or too long'));
            return;
        }
        try {
            const response = await fetch(`http://localhost:5225/bookmarks/update/${user}/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData),
                credentials: 'include'
            });

            if (response.ok)
                navigate('/bookmarks');
            else 
                throw new Error("FAILED TO UPDATE");
        } catch (error) {
            console.error(error);
        }
    };
    
    return (
        <>
        {
            (bookmark == undefined) ? <NotFound /> :

            <>
                <Row xs={2} md={4} lg={5} className="flex-grow-1 justify-content-center align-items-center">
                    <Col>
                        <Form onSubmit={submitHandler}>
                            <Form.Group controlId="updateTitlek">
                                <Form.Label>Title</Form.Label>
                                <Form.Control name="title" type="text" defaultValue={bookmark.title} onChange={formChange} />
                            </Form.Group>
                            <Form.Group controlId="updateURL">
                                <Form.Label>URL</Form.Label>
                                <Form.Control name="url" type="text" defaultValue={bookmark.url} onChange={formChange}/>
                            </Form.Group>
                            <Form.Group controlId="updateDescription">
                                <Form.Label>Description</Form.Label> 

                                { bookmark.description && 
                                    <Form.Control name="description" type="text" as="textarea" 
                                                    rows={3} defaultValue={bookmark.description} onChange={formChange} />}
                                { !bookmark.description && 
                                <Form.Control name="description" type="text" as="textarea" 
                                                rows={3} placeholder='EMPTY' onChange={formChange} />}

                            </Form.Group>
                            <Form.Group controlId="updateTags">
                                <Form.Label>Tags</Form.Label>
                                <Form.Control name="tags" type="text" onChange={formTags} defaultValue={bookmark.tags?.join(", ")}/>
                                <Form.Text className="text-muted">e.g. code, hello, world</Form.Text>
                            </Form.Group>
                            <Button type="submit">Submit</Button>
                            {error && <Alert>{error.message}</Alert>}
                        </Form>
                    </Col>
                </Row>
            </>
        }
        </>
    );
};

export default UpdateBookmark;
