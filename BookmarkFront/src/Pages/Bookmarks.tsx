import { useEffect, useState } from "react";
import CardBookmark from "../Components/CardBookmark"
import { Container, Row, Col, Button, Form } from 'react-bootstrap';
import { useUser } from "../Context/UserContext";
import { useNavigate } from "react-router";
import { ArrowLeftShort } from "react-bootstrap-icons";

export interface BookmarkItem {
    id: string,
    user: string,
    dateAdded: string,
    title: string,
    url: string,
    description: string | null,
    tags: string[] | null
};

export interface BookmarkProp {
    data: BookmarkItem[]
};

const Bookmarks = () => {
    const [data, fetchData] = useState<BookmarkItem[]>([]);
    const [tags, setTags] = useState<string | null>(null);
    const { user, setUser, flag, changeFlag } = useUser();
    const navigate = useNavigate();

    useEffect(() => { 
        const getData = async() => {
            try {
                const response = await fetch(`http://localhost:5225/bookmarks/${user}`, {
                                        method: "GET",
                                        credentials: 'include'
                                    });
                if(!response.ok) throw new Error("RESPONSE NOT OK");
                const contentType = response.headers.get("content-type");
                if(!contentType || !contentType.includes("application/json"))
                    throw new TypeError("INVALID RESOURCE");
                
                if (response.ok) {
                    const result = await response.json();
                    fetchData(result);
                } else {
                    throw new Error('API ERROR');
                    setUser(null);
                    navigate('/login');
                }
                
            } catch (error) {
                console.log(error);
            }
        }

        if (!user)
            navigate('/login');
        else 
            getData();
    }, [flag, user, setUser, navigate]);

    const sortByTag = async (): Promise<void> => {
        if (!tags) {
            changeFlag(prev => !prev);
            return;
        }
        if (tags.length <= 0){
            changeFlag(prev => !prev);
            return;
        }
        const tagList = tags?.replaceAll(",", "-").replaceAll(" ", "");
        try {
            const response = await fetch(`http://localhost:5225/bookmarks/${user}/sortby/${tagList}`, {
                method: "GET",
                credentials: 'include'
            });

            if (response.ok) {
                const result = await response.json();
                fetchData(result);
            } else {
                throw new Error('FAILED TO FETCH DATA');
            }
        } catch (error) {
            console.error(error);
        }
    }


    return (
        <>
            <Row className="m-0 flex-grow-1 justify-content-center">
                <Col>
                <Row className="p-0 py-2 m-0 flex-shrink-1 justify-content-center">
                    <Col className="col-8 ">
                        <Form.Control className="h-10" size="lg" type="text" placeholder="Get Bookmarks By Tag..." onChange={(event) => setTags(event.target.value)} />
                        <Form.Text className="text-muted">Separate tags with commas, (e.g. 1, 2, 3). To clear, empty tag bar, and click the button.</Form.Text>
                    </Col>
                    <Col className="col-1">
                        <Button onClick={sortByTag}><ArrowLeftShort /></Button>
                    </Col>
                </Row>
                {

                    (data.length <= 0) ? 
                    <>
                        <Container className="h-75">
                            <Row>
                                <h6 className="text-center">No Bookmarks</h6>
                            </Row>
                            <Row className="justify-content-center">
                                <Col className="col-auto">
                                    <Button onClick={() => navigate('/bookmarks/add')}>Add</Button>
                                </Col>
                            </Row>
                        </Container>
                    </> :
                    <>
                        <Row xs={2} md={4} lg={5} className="m-0 flex-grow-1 justify-content-center">
                            {data.map((bookmark, index) => (
                                <CardBookmark key={index} bookmark={bookmark} />
                            ))}
                        </Row>
                    </>
                }
                </Col>
            </Row>
        </>
    );
};

export default Bookmarks;
