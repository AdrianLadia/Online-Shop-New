import algoliasearch from 'algoliasearch/lite';
import { InstantSearch,SearchBox,Hits,Highlight } from 'react-instantsearch';

const searchClient = algoliasearch('76EORE6QK0', '0e6dc7a5569e2944b1acc6ed629966c0');



function SearchBarAlgolia() {
  return (
    <InstantSearch searchClient={searchClient} indexName="starPackProducts">
        <SearchBox/>
        <Hits/>
        {/* <Highlight attribute="name" hit={hit} /> */}
      {/* ... */}
    </InstantSearch>
  );
}

export default SearchBarAlgolia;
