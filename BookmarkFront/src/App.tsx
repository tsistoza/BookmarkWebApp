import './App.css';
import { Row } from 'react-bootstrap';
import Header from './Components/Header';
import { Route, Routes } from 'react-router';
import Bookmarks from './Pages/Bookmarks';
import UpdateWrapper from './Wrappers/UpdateWrapper';
import Login from './Pages/Login';
import Register from './Pages/Register';
import NotFound from './Pages/NotFound';
import Landing from './Pages/Landing';
import AddBookmark from './Pages/AddBookmark';

function App() {
  return (
    <>
      <Row className='m-0'>
        <Header />
      </Row>
      <Routes>
        <Route path='/' element={<Landing />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/bookmarks' element={<Bookmarks />} />
        <Route path='/bookmarks/add' element={<AddBookmark />} />
        <Route path='/bookmarks/update/:id' element={<UpdateWrapper />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

export default App;
