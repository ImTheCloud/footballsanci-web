import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../services/firebase.js";
import Section from "../components/Section";

function Ranking() {
    const [seasons, setSeasons] = useState([]);
    const [selectedSeason, setSelectedSeason] = useState("");
    const [players, setPlayers] = useState([]);
    const [loading, setLoading] = useState(true);

    // 🔹 Charger la liste des saisons
    useEffect(() => {
        const fetchSeasons = async () => {
            const seasonsSnapshot = await getDocs(collection(db, "seasons"));
            const seasonList = seasonsSnapshot.docs.map(doc => doc.id).sort();
            setSeasons(seasonList);
            if (seasonList.length > 0) {
                setSelectedSeason(seasonList[seasonList.length - 1]); // Dernière saison par défaut
            }
        };
        fetchSeasons();
    }, []);

    // 🔹 Charger les joueurs de la saison sélectionnée
    useEffect(() => {
        if (!selectedSeason) return;
        const fetchPlayers = async () => {
            setLoading(true);
            try {
                const playersSnapshot = await getDocs(
                    collection(db, `seasons/${selectedSeason}/players`)
                );
                const playerList = playersSnapshot.docs
                    .map(doc => ({ id: doc.id, ...doc.data() }))
                    .sort((a, b) => a.rank - b.rank);
                setPlayers(playerList);
            } catch (error) {
                console.error("Erreur de récupération des joueurs :", error);
            } finally {
                setLoading(false);
            }
        };
        fetchPlayers();
    }, [selectedSeason]);

    return (
        <Section title="Ranking">
            <div style={styles.controls}>
                <label htmlFor="season">Saison :</label>
                <select
                    id="season"
                    value={selectedSeason}
                    onChange={(e) => setSelectedSeason(e.target.value)}
                    style={styles.select}
                >
                    {seasons.map((s) => (
                        <option key={s} value={s}>{s}</option>
                    ))}
                </select>
            </div>

            {loading ? (
                <p style={styles.loading}>Chargement des joueurs...</p>
            ) : (
                <div style={styles.grid}>
                    {players.map((player) => (
                        <div key={player.id} style={styles.card}>
                            <h3 style={styles.name}>{player.name}</h3>
                            <p style={styles.rank}>🏅 Rang : {player.rank}</p>
                            <div style={styles.stats}>
                                <p><strong>Points :</strong> {player.points}</p>
                                <p><strong>Matchs :</strong> {player.matches}</p>
                                <p><strong>Victoires :</strong> {player.wins}</p>
                                <p><strong>Défaites :</strong> {player.losses}</p>
                                <p><strong>Nuls :</strong> {player.draws}</p>
                                <p><strong>Winrate :</strong> {player.winrate}%</p>
                                <p><strong>Valeur :</strong> {player.value}</p>
                                <p><strong>Bonus 5 Goal :</strong> {player.bonus5goal}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </Section>
    );
}

const styles = {
    controls: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "10px",
        marginBottom: "30px",
    },
    select: {
        padding: "6px 10px",
        fontSize: "1rem",
        borderRadius: "6px",
        border: "1px solid #ccc",
    },
    loading: {
        textAlign: "center",
        color: "#555",
    },
    grid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
        gap: "20px",
    },
    card: {
        background: "white",
        borderRadius: "12px",
        padding: "20px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        transition: "transform 0.2s, box-shadow 0.2s",
    },
    name: {
        textAlign: "center",
        marginBottom: "5px",
        color: "#222",
    },
    rank: {
        textAlign: "center",
        color: "#777",
        marginBottom: "15px",
    },
    stats: {
        fontSize: "0.9rem",
        lineHeight: "1.5",
    },
};

export default Ranking;