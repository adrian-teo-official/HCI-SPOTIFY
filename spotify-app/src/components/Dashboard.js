import {useState, useEffect} from "react";
import AuthAgent from "./AuthAgent";

const Dashboard = ({ code }) => {

    const accessToken = AuthAgent(code);
    const [search, setSearch] = useState("");

    const submitHandler = (e)=>{

        e.preventDefault();
        setSearch(e.target.search.value);
    }


    return (
        <div className="Container d-flex flex-column py-2" style={{ height: "100vh" }}>
            <div className="Search">
                <form onSubmit={submitHandler}>
                    <div className="form-row">
                        <div className="form-group col-lg-4 mr-3">
                            <input className="form-control" name="search"  defaultValue={search} placeholder="Search Songs/Artists" minLength="2" required/>
                        </div>
                        <div className="form-group">
                            <button className="btn btn-outline-primary" style={{transform: 'translateY(10px)'}} type="submit">Search</button>
                        </div>
                    </div>
                </form>
            </div>

            <div className="flex-grow-1 my-2" style={{ overflowY: "auto" }}>
                {search}
            </div>
        </div>
    );
};

export default Dashboard;