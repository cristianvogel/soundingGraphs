<script>
    export let pageCurrent, pageCount, pageBreak ;
</script>

<nav class="pagination is-rounded" role="navigation" aria-label="pagination">
    <a class="pagination-previous">Previous</a>
    <a class="pagination-next">Next page</a>
    <ul class="pagination-list">
        <li><a class="pagination-link" aria-label="Goto page 1">1</a></li>
        <li><span class="pagination-ellipsis">&hellip;</span></li>
        <li><a class="pagination-link" aria-label="Goto page {pageBreak}">{pageBreak}</a></li>
        <li><a class="pagination-link is-current" aria-label="Page {pageCurrent}" aria-current="page">{pageCurrent}</a></li>
        <li><a class="pagination-link" aria-label="Goto page 47">{pageCurrent+pageBreak}</a></li>
        <li><span class="pagination-ellipsis">&hellip;</span></li>
        <li><a class="pagination-link" aria-label="Goto page {pageCount}">{pageCount}</a></li>
    </ul>
</nav>
