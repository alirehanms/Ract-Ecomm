import React from "react";
import { useSearch } from "../../context/Search";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const SearchInput = () => {
  const [values, setValues] = useSearch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.get(
        `http://localhost:3000/product/search/${values.keyword}`
      );
      setValues({ ...values, results: data });
      navigate("/search");
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div>
      <form
        className="d-flex search-form"
        role="search"
        onSubmit={handleSubmit}
      >
        <input
          className="form-control me-2"
          type="search"
          placeholder="Search"
          aria-label="Search"
          value={values.keyword}
          onChange={(e) => setValues({ ...values, keyword: e.target.value })}
        />
        <button className="btn btn-outline-success" type="submit">
          Search
        </button>
      </form>
    </div>
  );
};

export default SearchInput;





// import { useHistory } from "react-router-dom";
// import { SearchContext } from "../../context/Search";

// const SearchInput = () => {
//   const [searchTerm, setSearchTerm] = useState("");
//   const { setResults } = useContext(SearchContext);
//   const history = useHistory();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await fetch(
//         `http://localhost:3000/product/search/${searchTerm}`
//       );
//       if (!response.ok) {
//         throw new Error("Failed to search products");
//       }
//       const data = await response.json();
//       setResults(data);
//       history.push(`/search/${searchTerm}`);
//     } catch (error) {
//       console.error("Error:", error);
//     }
//   };

//   return (
//     <form className="d-flex search-form" role="search" onSubmit={handleSubmit}>
//       <input
//         className="form-control me-2"
//         type="search"
//         placeholder="Search"
//         aria-label="Search"
//         value={searchTerm}
//         onChange={(e) => setSearchTerm(e.target.value)}
//       />
//       <button className="btn btn-outline-success" type="submit">
//         Search
//       </button>
//     </form>
//   );
// };

// export default SearchInput;