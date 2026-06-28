import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../services/axiosInstance";

function EditGame() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [genre, setGenre] = useState("");
    const [developer, setDeveloper] = useState("");
    const [publisher, setPublisher] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [downloadLink, setDownloadLink] = useState("");
    const [releaseDate, setReleaseDate] = useState("");

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchGame = async () => {
            try {
                const res = await axiosInstance.get(
                    `/games/${id}`
                );

                const game = res.data;

                setTitle(game.title || "");
                setDescription(
                    game.description || ""
                );
                setGenre(game.genre || "");
                setDeveloper(
                    game.developer || ""
                );
                setPublisher(
                    game.publisher || ""
                );
                setImageUrl(
                    game.imageUrl || ""
                );
                setDownloadLink(
                    game.downloadLink || ""
                );

                if (game.releaseDate) {
                    setReleaseDate(
                        game.releaseDate.split(
                            "T"
                        )[0]
                    );
                }

            } catch (error) {
                console.log(error);
                alert(
                    "Failed to load game"
                );
            } finally {
                setLoading(false);
            }
        };

        fetchGame();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {

            await axiosInstance.put(
                `/games/${id}`,
                {
                    title,
                    description,
                    genre,
                    developer,
                    publisher,
                    imageUrl,
                    downloadLink,
                    releaseDate
                }
            );

            alert(
                "Game updated successfully"
            );

            navigate("/games");

        } catch (error) {

            console.log(error);

            alert(
                error.response?.data
                    ?.message ||
                "Failed to update game"
            );
        }
    };

    if (loading) {
        return <h2>Loading...</h2>;
    }

    return (
        <div className="container">

            <h1>Edit Game</h1>

            <form
                onSubmit={handleSubmit}
            >

                <div>
                    <label>
                        Title
                    </label>

                    <input
                        type="text"
                        value={title}
                        onChange={(e) =>
                            setTitle(
                                e.target.value
                            )
                        }
                        required
                    />
                </div>

                <div>
                    <label>
                        Description
                    </label>

                    <textarea
                        rows="5"
                        value={
                            description
                        }
                        onChange={(e) =>
                            setDescription(
                                e.target.value
                            )
                        }
                        required
                    />
                </div>

                <div>
                    <label>
                        Genre
                    </label>

                    <input
                        type="text"
                        value={genre}
                        onChange={(e) =>
                            setGenre(
                                e.target.value
                            )
                        }
                        required
                    />
                </div>

                <div>
                    <label>
                        Developer
                    </label>

                    <input
                        type="text"
                        value={
                            developer
                        }
                        onChange={(e) =>
                            setDeveloper(
                                e.target.value
                            )
                        }
                    />
                </div>

                <div>
                    <label>
                        Publisher
                    </label>

                    <input
                        type="text"
                        value={
                            publisher
                        }
                        onChange={(e) =>
                            setPublisher(
                                e.target.value
                            )
                        }
                    />
                </div>

                <div>
                    <label>
                        Cover Image URL
                    </label>

                    <input
                        type="text"
                        value={
                            imageUrl
                        }
                        onChange={(e) =>
                            setImageUrl(
                                e.target.value
                            )
                        }
                    />
                </div>

                {imageUrl && (
                    <div>
                        <img
                            src={
                                imageUrl
                            }
                            alt="Preview"
                            width="200"
                        />
                    </div>
                )}

                <div>
                    <label>
                        Download Link
                    </label>

                    <input
                        type="text"
                        value={
                            downloadLink
                        }
                        onChange={(e) =>
                            setDownloadLink(
                                e.target.value
                            )
                        }
                        placeholder="Official download URL"
                    />
                </div>

                <div>
                    <label>
                        Release Date
                    </label>

                    <input
                        type="date"
                        value={
                            releaseDate
                        }
                        onChange={(e) =>
                            setReleaseDate(
                                e.target.value
                            )
                        }
                    />
                </div>

                <button
                    type="submit"
                >
                    Update Game
                </button>

            </form>

        </div>
    );
}

export default EditGame;