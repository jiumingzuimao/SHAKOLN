function initPagination(itemSelector, containerId) {
    document.addEventListener('DOMContentLoaded', function() {
        const itemsPerPage = 10;
        const totalItems = document.querySelectorAll(itemSelector).length;
        const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
        const pagination = document.getElementById(containerId);
        let currentPage = 1;

        function renderPagination() {
            pagination.innerHTML = '';

            const prevPage = document.createElement('button');
            prevPage.className = 'pagination-btn' + (currentPage <= 1 ? ' disabled' : '');
            prevPage.textContent = 'Previous';
            prevPage.addEventListener('click', () => {
                if (currentPage > 1) {
                    currentPage--;
                    renderPagination();
                }
            });
            pagination.appendChild(prevPage);

            for (let i = 1; i <= Math.min(8, totalPages); i++) {
                const pageBtn = document.createElement('button');
                pageBtn.className = 'pagination-btn' + (i === currentPage ? ' active' : '');
                pageBtn.textContent = i;
                pageBtn.addEventListener('click', () => {
                    if (i !== currentPage) {
                        currentPage = i;
                        renderPagination();
                    }
                });
                pagination.appendChild(pageBtn);
            }

            if (totalPages > 8) {
                const ellipsis = document.createElement('span');
                ellipsis.className = 'pagination-ellipsis';
                ellipsis.textContent = '...';
                pagination.appendChild(ellipsis);

                const lastPageNum = document.createElement('button');
                lastPageNum.className = 'pagination-btn' + (currentPage === totalPages ? ' active' : '');
                lastPageNum.textContent = totalPages;
                lastPageNum.addEventListener('click', () => {
                    if (currentPage !== totalPages) {
                        currentPage = totalPages;
                        renderPagination();
                    }
                });
                pagination.appendChild(lastPageNum);
            }

            const nextPage = document.createElement('button');
            nextPage.className = 'pagination-btn' + (currentPage >= totalPages ? ' disabled' : '');
            nextPage.textContent = 'Next';
            nextPage.addEventListener('click', () => {
                if (currentPage < totalPages) {
                    currentPage++;
                    renderPagination();
                }
            });
            pagination.appendChild(nextPage);

            const jumpContainer = document.createElement('div');
            jumpContainer.className = 'pagination-jump';
            
            const jumpText = document.createElement('span');
            jumpText.textContent = 'Go to';
            jumpContainer.appendChild(jumpText);

            const pageInput = document.createElement('input');
            pageInput.type = 'text';
            pageInput.className = 'pagination-input';
            pageInput.value = currentPage;

            const pageText = document.createElement('span');
            pageText.textContent = 'Page';
            jumpContainer.appendChild(pageText);

            const jumpBtn = document.createElement('button');
            jumpBtn.className = 'pagination-jump-btn';
            jumpBtn.textContent = 'Go';

            const jumpToPage = () => {
                const pageNum = parseInt(pageInput.value);
                if (pageNum >= 1 && pageNum <= totalPages) {
                    currentPage = pageNum;
                    renderPagination();
                }
            };

            jumpBtn.addEventListener('click', jumpToPage);
            pageInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    jumpToPage();
                }
            });

            jumpContainer.appendChild(pageInput);
            jumpContainer.appendChild(pageText);
            jumpContainer.appendChild(jumpBtn);
            pagination.appendChild(jumpContainer);
        }

        renderPagination();
    });
}