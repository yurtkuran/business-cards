// references
// https://codesandbox.io/s/github/tannerlinsley/react-table/tree/v7/examples/editable-data

// bring in dependencies
import { useEffect, useMemo, useCallback, Fragment, useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { useTable, useSortBy, useGlobalFilter } from 'react-table';
import './tags.scss';

// bring in redux
import { connect } from 'react-redux';

// bring in components
import Modal from '../Modal/Modal';

// bring in actions
import { getTagsWithCount, updateTag, setCurrent, clearCurrent, deleteTag } from '../../state/tags/tagActions';
import { getCards } from '../../state/cards/cardActions';

// bring in functions and hooks

// set initial state

// Create an editable cell renderer
const EditableCell = ({
    value: initialValue,
    row,
    column: { id: field },
    updateMyData, // This is a custom function that we supplied to our table instance
}) => {
    // console.log(row);

    // destructuire
    const {
        index,
        original: { _id, [field]: originalValue },
    } = row;

    // We need to keep and update the state of the cell normally
    const [value, setValue] = useState(initialValue);

    const onChange = (e) => {
        setValue(e.target.value);
    };

    // We'll only update the external data when the input is blurred
    const onBlur = () => {
        updateMyData(_id, index, field, value, originalValue, setValue);
    };

    // If the initialValue is changed external, sync it up with our state
    useEffect(() => {
        setValue(initialValue);
    }, [initialValue]);

    return <input className='test' value={value} onChange={onChange} onBlur={onBlur} />;
};

// display for error message
const ErrorMessage = ({ message }) => {
    return (
        <>
            <h6 className='text-danger mb-1'>{message}</h6>
        </>
    );
};

const Table = ({ columns, data, renderRowSubComponent, setSelectedImg, updateMyData, skipPageReset }) => {
    // Use the state and functions returned from useTable to build your UI
    const { getTableProps, getTableBodyProps, headerGroups, prepareRow, rows, visibleColumns } = useTable(
        {
            columns,
            data,
            updateMyData,
            autoResetPage: !skipPageReset,
        },
        useGlobalFilter,
        useSortBy
    );

    // render table UI
    return (
        <>
            <table {...getTableProps()} className='table table-sm table-bordered table-hover'>
                <thead>
                    {headerGroups.map((headerGroup) => (
                        <tr {...headerGroup.getHeaderGroupProps()}>
                            {headerGroup.headers.map((column) => (
                                <th
                                    {...column.getHeaderProps(column.getSortByToggleProps())}
                                    {...column.getHeaderProps({ className: column.headerClassName })}
                                    width={column.width}
                                >
                                    {column.render('Header')}
                                    <span>
                                        {column.isSorted ? (
                                            column.isSortedDesc ? (
                                                <i className='far fa-caret-square-down pl-2'></i>
                                            ) : (
                                                <i className='far fa-caret-square-up pl-2'></i>
                                            )
                                        ) : (
                                            ''
                                        )}
                                    </span>
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody {...getTableBodyProps()}>
                    {rows.map((row, i) => {
                        prepareRow(row);
                        return (
                            <Fragment key={i}>
                                <tr {...row.getRowProps()}>
                                    {row.cells.map((cell) => {
                                        return <td {...cell.getCellProps({ className: cell.column.className })}>{cell.render('Cell')}</td>;
                                    })}
                                </tr>
                                {row.isExpanded ? (
                                    <tr>
                                        <td className='card-detail p-3' colSpan={visibleColumns.length}>
                                            {renderRowSubComponent(row.original, setSelectedImg)}
                                        </td>
                                    </tr>
                                ) : null}
                            </Fragment>
                        );
                    })}
                </tbody>
            </table>
        </>
    );
};

const Tags = ({
    card: { cards, loading: cardsLoading },
    tag: { tags, current, loading: tagsLoading },
    getCards,
    getTagsWithCount,
    updateTag,
    setCurrent,
    clearCurrent,
    deleteTag,
}) => {
    // state to hold error message
    const [errorMessage, setErrorMessage] = useState('');

    // load all cards and tags when component loads
    useEffect(() => {
        getCards();
        getTagsWithCount();
    }, [getCards, getTagsWithCount]);

    // modal props
    const [show, setShow] = useState(false);
    const [message, setMessage] = useState([]);

    // hande delete confirmation
    const onModalClose = (action = '') => {
        setShow(false);
        if (action === 'delete') deleteTag(current._id);
        clearCurrent();
    };

    // confirm delete modal
    const handleDelete = useCallback(
        (data) => {
            // destructure
            const { _id, name } = data;
            setCurrent(_id);
            setMessage(`Delete <span class='text-danger'>${name}</span>?`);
            setShow(true);
        },
        [setCurrent]
    );

    const [skipPageReset, setSkipPageReset] = useState(false);

    // When our cell renderer calls updateMyData, we'll use
    // the rowIndex, columnId and new value to update the
    // original data
    const updateMyData = (_id, rowIndex, field, value, originalValue, setValue) => {
        console.log({ _id, rowIndex, field, value, originalValue });

        // We also turn on the flag to not reset the page
        setSkipPageReset(true);

        // reset error message
        setErrorMessage('');

        // validate input
        if (value === tags[rowIndex].name) {
            console.log('no change');
            return;
        }

        // value cannot be blank
        if (value.trim() === '') {
            setErrorMessage('blank disallowed');
            setValue(originalValue);
            return;
        }

        // value cannot be a duplicate
        if (tags.filter((tag) => tag[field].toUpperCase() === value.toUpperCase()).length) {
            setErrorMessage('duplicates not allowed');
            setValue(originalValue);
            return;
        }

        updateTag(_id, value);

        console.log('data update');
    };

    // build columns
    const columns = useMemo(
        () => [
            {
                Header: 'Tag',
                accessor: 'name',
                headerClassName: 'text-left',
                className: 'text-left',
                disableGlobalFilter: false,
                width: '60px',
                Cell: EditableCell,
            },
            {
                Header: 'Count',
                accessor: 'count',
                headerClassName: 'text-center',
                className: 'text-center',
                disableGlobalFilter: true,
                disableSortBy: false,
                width: '30px',
                Cell: (count) => (count.value > 0 ? count.value : 0),
            },
            {
                Header: () => null, // No header
                accessor: 'delete',
                width: '10px',
                className: 'text-center',
                Cell: ({ row }) => {
                    return (
                        <Link to={'#'} onClick={() => handleDelete(row.original)} className={row.original.count > 0 ? 'disabled-link' : ''}>
                            <i className={`far fa-trash-alt text-secondary ${row.original.count > 0 ? 'text-dark-light-7' : ''}`}></i>
                        </Link>
                    );
                },
            },
        ],
        [handleDelete]
    );

    return (
        <div className='tag-wrapper'>
            <Modal show={show} onClose={onModalClose} title={'Confirm Deletion'}>
                <div dangerouslySetInnerHTML={{ __html: message }}></div>
            </Modal>
            <ErrorMessage message={errorMessage} />
            {!tagsLoading && tags.length > 0 && <Table columns={columns} data={tags} updateMyData={updateMyData} skipPageReset={skipPageReset} />}
        </div>
    );
};

const mapStateToProps = (state) => ({
    card: state.card,
    tag: state.tag,
});

const mapDispatchToProps = {
    getCards,
    getTagsWithCount,
    updateTag,
    setCurrent,
    clearCurrent,
    deleteTag,
};

Tags.propTypes = {
    getCards: PropTypes.func.isRequired,
    getTagsWithCount: PropTypes.func.isRequired,
    updateTag: PropTypes.func.isRequired,
    setCurrent: PropTypes.func.isRequired,
    clearCurrent: PropTypes.func.isRequired,
    deleteTag: PropTypes.func.isRequired,
    card: PropTypes.object.isRequired,
    tag: PropTypes.object.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(Tags);
