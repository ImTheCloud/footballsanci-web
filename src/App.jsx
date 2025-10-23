import { useEffect, useState } from "react";
import { db } from "../services/firebase.js";
import { collection, getDocs } from "firebase/firestore";

function App() {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        async function fetchData() {
            const snapshot = await getDocs(collection(db, "users"));
            setUsers(snapshot.docs.map(doc => doc.data()));
        }
        fetchData();
    }, []);

    return (
        <div>
            <h1>Utilisateurs</h1>
            {users.map((u, i) => (
                <p key={i}>{u.name}</p>
            ))}
        </div>
    );
}

export default App;