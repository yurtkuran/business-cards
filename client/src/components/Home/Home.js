import { useState, useMemo, useCallback, Fragment } from 'react';

// bring in dependencies
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useTable, useSortBy, usePagination, useGlobalFilter, useAsyncDebounce, useExpanded } from 'react-table';
import '../Cards/cards.scss';

// bring in redux
import { connect } from 'react-redux';

// bring in components
import Modal from '../Modal/Modal';
import CardDetail from '../CardDetail/CardDetail';
import ModalImg from '../ModalImg/ModalImg';

// bring in actions
import { getCards, setCurrent, clearCurrent, deleteCard } from '../../state/cards/cardActions';

// bring in functions and hooks

// set initial state

// Define a default UI for filtering
const GlobalFilter = ({ preGlobalFilteredRows, globalFilter, setGlobalFilter }) => {
    const count = preGlobalFilteredRows.length;
    const [value, setValue] = useState(globalFilter);
    const onChange = useAsyncDebounce((value) => {
        setGlobalFilter(value || undefined);
    }, 200);

    return (
        <div className='mb-1 form-wrapper'>
            <input
                type='text'
                className='form-control'
                value={value || ''}
                onChange={(e) => {
                    setValue(e.target.value);
                    onChange(e.target.value);
                }}
                placeholder={`Search ${count} records...`}
            />
        </div>
    );
};

const Table = ({ columns, data, renderRowSubComponent, setSelectedImg }) => {
    // Use the state and functions returned from useTable to build your UI
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        prepareRow,
        page,
        canPreviousPage,
        canNextPage,
        pageOptions,
        pageCount,
        gotoPage,
        nextPage,
        previousPage,
        state,
        preGlobalFilteredRows,
        setGlobalFilter,
        setPageSize,
        state: { pageIndex, pageSize },
        visibleColumns,
    } = useTable(
        {
            columns,
            data,
            initialState: { pageIndex: 0 },
        },
        useGlobalFilter,
        useSortBy,
        useExpanded,
        usePagination
    );

    // render table UI
    return (
        <>
            <GlobalFilter preGlobalFilteredRows={preGlobalFilteredRows} globalFilter={state.globalFilter} setGlobalFilter={setGlobalFilter} />

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
                    {page.map((row, i) => {
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
            {(canPreviousPage || canNextPage) && (
                <div style={PaginationStyles} className='mt-1'>
                    <div>
                        <button className='btn btn-sm btn-outline-primary mr-1' onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
                            <i className='fas fa-angle-double-left pt-1'></i>
                        </button>
                        <button className='btn btn-sm btn-outline-primary mr-1' onClick={() => previousPage()} disabled={!canPreviousPage}>
                            <i className='fas fa-angle-left pt-1'></i>
                        </button>
                        <button className='btn btn-sm btn-outline-primary mr-1' onClick={() => nextPage()} disabled={!canNextPage}>
                            <i className='fas fa-angle-right pt-1'></i>
                        </button>
                        <button className='btn btn-sm btn-outline-primary' onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
                            <i className='fas fa-angle-double-right pt-1'></i>
                        </button>
                    </div>
                    <div className='page-index'>
                        <strong>
                            {pageIndex + 1} of {pageOptions.length}
                        </strong>
                    </div>
                    <div className='page-index'>
                        <select
                            className='form-control'
                            value={pageSize}
                            onChange={(e) => {
                                setPageSize(Number(e.target.value));
                            }}
                        >
                            {[10, 20, 30, 40, 50].map((pageSize) => (
                                <option key={pageSize} value={pageSize}>
                                    Show {pageSize}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            )}
        </>
    );
};

export const Home = ({ card: { cards, current, loading }, getCards, setCurrent, clearCurrent, deleteCard }) => {
    // load all business cards when component loads
    useMemo(() => {
        getCards();
        // clearCurrent();
    }, [getCards, clearCurrent]);

    // function to render row sub components
    const renderRowSubComponent = useCallback((data, setSelectedImg) => {
        return <CardDetail data={data} setSelectedImg={setSelectedImg} />;
    }, []);

    // modal props
    const [show, setShow] = useState(false);
    const [message, setMessage] = useState([]);
    const [selectedImg, setSelectedImg] = useState(null);

    // hande delete confirmation
    const onModalClose = (action = '') => {
        setShow(false);
        if (action === 'delete') deleteCard(current._id);
        clearCurrent();
    };

    // confirm delete modal
    const handleDelete = useCallback((data) => {
        // destructure
        const { _id, firstName, lastName, company } = data;
        setCurrent(_id);
        setMessage(`Delete <span class='text-danger'>${firstName} ${lastName}</span>?`);
        setShow(true);
    }, []);

    // build columns
    const columns = useMemo(
        () => [
            {
                Header: () => null, // No header
                id: 'expander', // It needs an ID
                width: '20px',
                className: 'text-center',
                Cell: ({ row }) => (
                    <span {...row.getToggleRowExpandedProps()}>
                        {row.isExpanded ? <i className='far fa-caret-square-down'></i> : <i className='far fa-caret-square-right'></i>}
                    </span>
                ),
            },
            {
                Header: 'First',
                accessor: 'firstName',
                headerClassName: 'text-left',
                className: 'text-left',
                disableGlobalFilter: false,
                width: '60px',
            },
            {
                Header: 'Last',
                accessor: 'lastName',
                headerClassName: 'text-left',
                className: 'text-left',
                disableFilters: false,
                width: '60px',
            },
            {
                Header: 'Company',
                accessor: 'company',
                headerClassName: 'text-left',
                className: 'text-left',
                disableGlobalFilter: false,
                disableSortBy: false,
                width: '30px',
            },
            {
                Header: () => null, // No header
                accessor: 'edit',
                width: '10px',
                className: 'text-center',

                // prettier-ignore
                Cell: ({row: {original: { _id }},
                }) => {
                    return (
                        <Link to={'/cardform'} onClick={() => setCurrent(_id)}>
                            <i className='far fa-edit text-secondary'></i>
                        </Link>
                    );
                },
            },
            {
                Header: () => null, // No header
                accessor: 'delete',
                width: '10px',
                className: 'text-center',
                Cell: ({ row }) => {
                    return (
                        <Link to={'#'} onClick={() => handleDelete(row.original)}>
                            <i className='far fa-trash-alt text-secondary'></i>
                        </Link>
                    );
                },
            },
        ],
        []
    );

    return (
        <div className='home-wrapper'>
            <Modal show={show} onClose={onModalClose} title={'Confirm Deletion'}>
                <div dangerouslySetInnerHTML={{ __html: message }}></div>
            </Modal>
            <Table columns={columns} data={cards} renderRowSubComponent={renderRowSubComponent} setSelectedImg={setSelectedImg} />
            {selectedImg && <ModalImg selectedImg={selectedImg} setSelectedImg={setSelectedImg} />}
        </div>
    );
};

Home.propTypes = {
    getCards: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
    card: state.card,
    getCards: PropTypes.func.isRequired,
    setCurrent: PropTypes.func.isRequired,
    clearCurrent: PropTypes.func.isRequired,
    deleteCard: PropTypes.func.isRequired,
});

const mapDispatchToProps = {
    getCards,
    setCurrent,
    clearCurrent,
    deleteCard,
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);

const PaginationStyles = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
};
