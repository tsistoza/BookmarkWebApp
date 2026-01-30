import { Col } from 'react-bootstrap';

const BookmarkTags = ({ tag }: { tag: string }) => {
    return (
        <Col className="col-auto px-1">
            <p className="m-0 text-" style={ { fontSize: '10px' } }>{tag}</p>
        </Col>
    );
};

export default BookmarkTags;
