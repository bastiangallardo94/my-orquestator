/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import IconLeft from '../../../assets/images/left.svg';
import IconRight from '../../../assets/images/right.svg';
import './PaginationBar.scss'

type PaginationBarProps = {
  page: number;
  pageSize: number;
  totalPages: number;
  totalElements: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
};

export const PaginationBar: React.FC<PaginationBarProps> = ({
  page,
  pageSize,
  totalPages,
  totalElements,
  onPageChange,
  onPageSizeChange,
}) => {
  const [pagesArray, setPagesArray] = useState<number[]>([]);
  const [pagesToShow, setPagesToShow] = useState<number[]>([]);
  const startItem = pageSize * page - pageSize + 1;
  const endItem = pageSize * page > totalElements ? totalElements : pageSize * page;

  useEffect(() => {
    const pageNumbers: number[] = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(i);
    }
    setPagesArray(pageNumbers)
  }, [totalPages]);

  useEffect(() => {
    if (page < 4) {
      setPagesToShow(pagesArray.slice(0, 5))
    } else if (page > totalPages - 3) {
      setPagesToShow(pagesArray.slice(totalPages - 4, totalPages))
    } else {
      setPagesToShow(pagesArray.slice(page - 3, page + 2))

    }
  }, [page, totalPages, pagesArray]);

  return (
    <div className="pagination-bar-container">
      <div className="pagination-group">
        <span className="pagination-label">Items per page:</span>
        <select
          className="pagination-select"
          value={pageSize}
          onChange={(e) => {
            onPageSizeChange(Number(e.target.value));
          }}
        >
          {[10, 15, 20].map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
      </div>
      <div className="pagination-group">
        <span className="pagination-label">Go to:</span>
        <input
          className="pagination-input"
          type="number"
          min={1}
          max={totalPages}
          value={page}
          onChange={(e) => onPageChange(Math.min(Math.max(1, Number(e.target.value)), totalPages))}
        />
      </div>
      <div className="pagination-group range">
        <span>{totalElements === 0 ? '0 of 0' : `${startItem}-${endItem} of ${totalElements}`}</span>
      </div>
      <div className="pagination-pages">
        <button
          className="pagination-btn prev"
          onClick={() => onPageChange(Math.max(1, page - 1))}
          disabled={page === 1}
        >
          <img
            src={IconLeft}
            alt="previous"
            className="mf-block mf-w-[10px] mf-h-[10px]"
            style={{ objectFit: 'cover' }}
          />
        </button>
        {pagesToShow.map((p: number) => (
          <button
            key={p}
            className={`pagination-btn ${p === page ? 'active' : ''}`}
            onClick={() => onPageChange(p)}
          >
            {p}
          </button>
        ))}
        <button
          className="pagination-btn next"
          onClick={() => onPageChange(Math.min(totalPages, page + 1))}
          disabled={page === totalPages}
        >
          <img
            src={IconRight}
            alt="next"
            className="mf-block mf-w-[10px] mf-h-[10px]"
            style={{ objectFit: 'cover' }}
          />
        </button>
      </div>
    </div>
  )
};

