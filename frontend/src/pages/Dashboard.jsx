//import {useLocation} from 'react-router-dom';

import LinkCard from "../components/LinkCard";
import "../linkCard.css";
import "../dashboard.css"
import { useEffect, useState } from "react";
import { CircularProgress } from "@mui/material";

const Dashboard = () => {

    const [longLink, setLongLink] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const links = JSON.parse(localStorage.getItem("ulinks"));

    useEffect(() => {
        setTimeout(() => {
            setError(null);
            setSuccess(null);
        }, 3000);
    }, [error, success]);
    
    const handleSubmit = async(e) => {
        e.preventDefault();

        try{
            setLoading(true);
            let res = await fetch("http://localhost:5000/api/v1/auth/refresh",
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include"
            });

            let data = await res.json();
            if (data.error){
                console.log(data);
                setError(data.error.msg);
            }

            const token = data.token;

            res = await fetch("http://localhost:5000/api/v1/links", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    longLink
                }),
                credentials: "include"
            });

            data = await res.json();
            if (data.error || data.errors){
                console.log(data);
                setError(data.errors[0].msg);
                return
            };

            setSuccess("URL added successfully")

        }catch(error){
            console.log(error);
        } finally{
            setLoading(false);
        }
    }

    return (
        <div className="dashboard-great">
            <div className="dashboard-body">
                <h1 className="dashboard-title">DashBoard</h1>
                <h2 className="welcome-dashboard">Welcome</h2>
                <div className="form-link">
                    <form onSubmit={handleSubmit}>
                        <input 
                        type="text"
                        placeholder="longlink"
                        name="longLink"
                        id="longlink"
                        autoComplete="off"
                        className="input-add-longlink"
                        onChange={(e) => {
                            setLongLink(e.target.value)
                        }}
                        value={longLink}
                        />
                        <div className="add-button-and-loading">
                            <button type="submit" className="button-add-link">Add</button>
                            {
                                loading && <CircularProgress />
                            }
                            {
                                error && <p className="text-danger">{error}</p>
                            }
                            {
                                success && <p className="text-success">{success}</p>
                            }
                        </div>
                    </form>
                </div>
                <ul className="links-list">
                    {
                        links.map((link, index) => {
                            return <LinkCard key={index} longLink={link.longLink} nanoLink={link.nanoLink} />
                        })
                    }
                </ul>
            </div>
        </div>
    )
};

export default Dashboard;