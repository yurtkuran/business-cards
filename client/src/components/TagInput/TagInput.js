// references
// https://www.npmjs.com/package/react-tag-autocomplete
// https://github.com/i-like-robots/react-tags
// https://codesandbox.io/s/react-tag-autocomplete-xsfd9

// bring in dependencies
import { useRef, useCallback } from 'react';
import PropTypes from 'prop-types';
import ReactTags from 'react-tag-autocomplete';
import './tagInput.scss';

// bring in redux

// bring in components

// bring in actions

// bring in functions and hooks

// set initial state

const TagInput = ({ tags, setTags, suggestions }) => {
    const reactTags = useRef();

    const onDelete = useCallback(
        (tagIndex) => {
            setTags(tags.filter((_, i) => i !== tagIndex));
        },
        [tags, setTags]
    );

    const onAddition = useCallback(
        (newTag) => {
            setTags([...tags, newTag]);
        },
        [tags, setTags]
    );

    return (
        <ReactTags
            ref={reactTags}
            tags={tags}
            allowNew
            suggestions={suggestions}
            minQueryLength={1}
            autoresize={false}
            onDelete={onDelete}
            onAddition={onAddition}
            delimiters={['Enter', 'Tab', ',', ';']}
        />
    );
};

TagInput.propTypes = {
    tags: PropTypes.array.isRequired,
    setTags: PropTypes.func.isRequired,
};

export default TagInput;
