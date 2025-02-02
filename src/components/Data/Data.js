import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import FileTable from "../Table/FileTable";

function Data({ setVersions }) {
    const { category } = useParams();
    const [file, setFile] = useState([]); 
    const [loading, setLoading] = useState(true);
    useEffect(() => {
      setVersions([]);
      axios.get(`http://localhost:8000/api/${category}/`)
        .then((response) => {
          setVersions(response.data.versions || []);
          setFile(response.data.files || []);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Fail to retrieve versions", error);
          setLoading(false);
        });
      }, [category]);

    if (loading) {
      return <p>Loading...</p>;
    }

    return (
        <div>
          <FileTable initialFiles={file} />
        </div>
    )
}

export default Data;