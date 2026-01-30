import { Row, Col, Dropdown } from 'react-bootstrap';
import Card from 'react-bootstrap/Card';
import { Tag, ThreeDots } from 'react-bootstrap-icons';
import type { BookmarkItem } from '../Pages/Bookmarks';
import BookmarkTags from './BookmarkTags';
import { useUser } from '../Context/UserContext';
import { useNavigate } from 'react-router';
import type { NavigateFunction } from 'react-router';

interface removeHandlerProps {
    id: string | null,
    changeFlag: React.Dispatch<React.SetStateAction<boolean>>,
    setUser: React.Dispatch<React.SetStateAction<string | null>>
    navigate: NavigateFunction
};

const removeHandler = async ({ id, changeFlag, setUser, navigate }: removeHandlerProps) => {
    try {
        const response = await fetch('http://localhost:5225/bookmarks/delete/Alice/' + id, {
            method: "DELETE",
            credentials: "include"
        });

        if (!response.ok) throw new Error("Response failed\n");
        if (response.ok) {
            changeFlag(prev => !prev);
        } else {
            setUser(null);
            navigate('/login');
        }
    } catch (error) {
        console.error(error);
    }
};
const CardBookmark = ({ bookmark }: { bookmark: BookmarkItem }): React.ReactNode => {
    const { setUser, changeFlag } = useUser();
    const navigate = useNavigate();
    const updateCard = (id: string): void => {
        navigate(`/bookmarks/update/${id}`);
    };

    return (
        <Col className="d-flex justify-content-center gy-5">
            <Card className="p-2" style={{ width: '18rem', height: "20rem" }}>
                
                <Card.Title>
                    <Row className="m-0">
                        <Col className="col-10 p-0">
                            <strong className="fs-5">{bookmark.title}</strong>
                        </Col>
                        <Col className='col-2 p-0'>
                            <Dropdown className="d-flex justify-content-end">
                                <Dropdown.Toggle className="p-1"><ThreeDots /></Dropdown.Toggle>
                                <Dropdown.Menu>
                                    <Dropdown.Item onClick={() => removeHandler({ id: bookmark.id, changeFlag, setUser, navigate })}>Remove</Dropdown.Item>
                                    <Dropdown.Item onClick={() => updateCard(bookmark.id)}>Update</Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        </Col>
                    </Row>
                </Card.Title>

                <Card.Subtitle>
                    <Card.Link className='fw-light' style={ { fontSize: '12px' }} href={bookmark.url}>{bookmark.url}</Card.Link>
                </Card.Subtitle>

                <Card.Body className='d-flex flex-column px-0 py-2'>
                    <Row className='flex-grow-1'>
                        <Col className="fw-semibold">
                            <p>{bookmark.description}</p>
                        </Col>
                    </Row>
                    <Row>
                        <Col className="col-auto pe-1">
                            <Tag />
                        </Col>

                        {bookmark.tags?.map((tag, index) => (
                            <BookmarkTags key={index} tag={tag} />
                        ))}

                    </Row>
                </Card.Body>

                <Card.Footer>
                    <small className="text-muted">Date Added: {bookmark.dateAdded}</small>
                </Card.Footer>
            </Card>
        </Col>
        
    );
};

export default CardBookmark;
