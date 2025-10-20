import { useEffect, useState } from "react";
import { Link,useNavigate } from "react-router-dom";

const Navbar = () => {
    const navigate = useNavigate();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [admin, setAdmin] = useState<{ name: string } | null>(null);

    useEffect(() => {
        const storedAdmin = localStorage.getItem("student");

        if (storedAdmin) {
            try {
                const parsedAdmin = JSON.parse(storedAdmin);
                setAdmin(parsedAdmin);
                setIsAuthenticated(true);
            } catch (error) {
                console.error("Error parsing admin data:", error);
                setIsAuthenticated(false);
                setAdmin(null);
                localStorage.removeItem("student"); // Remove invalid data
            }
        } else {
            setIsAuthenticated(false);
            setAdmin(null);
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("student");
        setIsAuthenticated(false);
        setAdmin(null);
        navigate("/login");
    };

    return (
        <nav className="bg-blue-600 text-white p-4 shadow-md">
            <div className="container mx-auto flex justify-between items-center">
                <h1 className="text-xl font-bold"><Link to="/home">Student Portal </Link></h1>
            <div>
                {isAuthenticated && admin? (
                        <button onClick={handleLogout} className="bg-red-500 px-4 py-2 rounded hover:bg-red-600"><Link to ="/login">Logout</Link></button>
                ) :  null}
            </div>
            </div>
        </nav>
    );
};

export default Navbar;
