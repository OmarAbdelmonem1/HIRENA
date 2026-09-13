export default function Pagination({
  page,
  totalPages,
  onPageChange,
  firstPage = 1,
}) {
  const pages = Array.from({ length: totalPages }, (_, index) => index + firstPage);

  return (
    <div className="pagination">
      <button
        disabled={page === firstPage}
        onClick={() => onPageChange(Math.max(firstPage, page - 1))}
        aria-label="Previous page"
      >
        ‹
      </button>
      {pages.map((pageNumber) => (
        <button
          key={pageNumber}
          className={pageNumber === page ? "active" : ""}
          onClick={() => onPageChange(pageNumber)}
        >
          {pageNumber}
        </button>
      ))}
      <button
        disabled={page === firstPage + totalPages - 1}
        onClick={() =>
          onPageChange(Math.min(firstPage + totalPages - 1, page + 1))
        }
        aria-label="Next page"
      >
        ›
      </button>
    </div>
  );
}
