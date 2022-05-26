// references

// bring in dependencies
import { useState } from 'react';
import './home.scss';

// bring in redux

// bring in components
import HomeTable from './HomeTable';
import TagList from './TagList';

// bring in actions

// bring in functions and hooks

// set initial state

const Home = () => {
    const [tagList, setTagList] = useState([]);
    return (
        <>
            <div className='content'>
                <TagList tagList={tagList} setTagList={setTagList} />
                <HomeTable tagList={tagList} />
            </div>
        </>
    );
};

export default Home;
