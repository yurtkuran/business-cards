// references

// bring in dependencies
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

// bring in redux
import { connect } from 'react-redux';

// bring in components

// bring in actions
import { getTagsWithCount } from '../../state/tags/tagActions';

// bring in functions and hooks

// set initial state

const TagItem = ({ tag: { name, count }, tagList, handleSelectTag }) => {
    const [selected, setSelected] = useState(false);

    useEffect(() => {
        if (!tagList.includes(name) && name !== 'All') {
            setSelected(false);
            return;
        }

        if (tagList.length && name === 'All') {
            setSelected(false);
            return;
        }

        if (name === 'None' && tagList.length > 1) {
            setSelected(false);
            return;
        }

        if (tagList.length === 0 && name === 'All') {
            setSelected(true);
            return;
        }
    }, [tagList, name]);

    const handleClick = () => {
        setSelected(!selected);
        handleSelectTag(name);
    };

    return (
        <div
            className={`tag-item ${selected ? 'btn-outline-secondary text-primary' : 'btn-secondary text-light'} btn-sm mb-1 py-1 `}
            onClick={handleClick}
        >
            {name}
            {count > 0 && <span className='bg-light text-primary'>{count}</span>}
        </div>
    );
};

const TagList = ({ tagList, setTagList, getTagsWithCount, tag: { tags, loading: tagsLoading }, card: { cards } }) => {
    // load tag list when component loads
    useEffect(() => {
        getTagsWithCount();
    }, [getTagsWithCount]);

    // determine how many cards do not have at least one tag
    const [noneCount, setNoneCount] = useState(0);

    useEffect(() => {
        setNoneCount(() => cards?.filter((card) => card.tags.length === 0).length);
    }, [cards]);

    const handleClick = (name) => {
        if (name === 'All') {
            setTagList([]);
            return;
        }

        if (name === 'None') {
            setTagList(['None']);
            return;
        }

        setTagList((prevTagList) => {
            return prevTagList.includes(name) ? prevTagList.filter((tag) => tag !== name) : [name].filter((tag) => tag !== 'None');
        });
    };

    return (
        <div className='tag-list bg-secondary-light-4'>
            <h4 className='my-2'>TagList</h4>
            <TagItem tag={{ name: 'All', count: cards?.length }} tagList={tagList} handleSelectTag={handleClick} />
            {!tagsLoading && tags.map((tag, idx) => <TagItem key={idx} tag={tag} tagList={tagList} handleSelectTag={handleClick} />)}
            {noneCount !== 0 && <TagItem tag={{ name: 'None', count: noneCount }} tagList={tagList} handleSelectTag={handleClick} />}
        </div>
    );
};

const mapStateToProps = (state) => ({
    tag: state.tag,
    card: state.card,
});

const mapDispatchToProps = {
    getTagsWithCount,
};

TagList.propTypes = {
    setTagList: PropTypes.func.isRequired,
    getTagsWithCount: PropTypes.func.isRequired,
    tag: PropTypes.object.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(TagList);
