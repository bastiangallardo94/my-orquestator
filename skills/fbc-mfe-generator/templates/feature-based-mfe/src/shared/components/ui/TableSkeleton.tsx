import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

interface TableSkeletonProps {
    columns: number;
}

export const TableSkeleton = (props: TableSkeletonProps) => {
    return (
        <div className="table-skeleton">
            {
                [...Array(6)].map((_, index) => (
                    <div className='mf-flex mf-flex-row mf-mt-2' key={index}>
                        {
                            [...Array(props.columns)].map((_, index) => (
                                <TableSkeletonRow key={index} index={index} />
                            ))
                        }
                    </div>
                ))
            }
        </div>
    );
};

interface TableSkeletonRowProps {
    index: number;
}

const TableSkeletonRow = ({index}: TableSkeletonRowProps) => {
    return <div key={index} className='mf-mr-2'><Skeleton  /></div>
}