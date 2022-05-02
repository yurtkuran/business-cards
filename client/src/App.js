// bring in dependencies
import { useState } from 'react';
import { Routes, Route, BrowserRouter as Router, Navigate } from 'react-router-dom';
import './css/style.css';

// bring in redux
import { Provider } from 'react-redux';
import store from './state/store';

// bring in components
import Navbar from './components/Navbar/Navbar';
import Home from './components/Home/Home';
import CardForm from './components/Cards/CardForm';
import Upload from './components/Upload/Upload';

// bring in actions

// bring in functions and hooks

// set initial state

function App() {
    const [cartIsEmpty] = useState(false);

    return (
        <Provider store={store}>
            <Router>
                <Navbar />
                <div className='container'>
                    <Routes>
                        <Route path='/' element={<Home />} />

                        <Route path='/cardform' element={<CardForm />} />

                        <Route path='/upload' element={<Upload />} />

                        <Route path='/about/*' element={<h2>About</h2>} />

                        <Route path='/products/:id/*' element={<h2>Products</h2>} />

                        <Route path='/products' element={<h2>Products</h2>} />

                        <Route path='/redirect' element={<Navigate to='/about' />} />

                        <Route path='/checkout' element={cartIsEmpty ? <Navigate to='/products' /> : <p>checkout</p>} />
                    </Routes>
                </div>
            </Router>
        </Provider>
    );
}

export default App;
