import React from "react";
import { useNavigate, useSearchParams } from 'react-router-dom';

function Artist () {

    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const artistId = searchParams.get('id');

    const handleClick = () => {
        navigate(-1);
    }

    return (
        <div>{`Artist ${artistId}`}<button onClick={handleClick}>Back</button></div>
    )


}


export default Artist;