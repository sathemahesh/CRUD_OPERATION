import { useEffect, useState } from "react";
import { getPost } from "../api/PostApi";
import "../App.css";

export const Posts = () => {
    const [data, setData] = useState([]);
    const [newPost, setNewPost] = useState({ title: "", body: "" });
    const [editPostId, setEditPostId] = useState(null);

    const getPostData = async () => {
        try {
            const savedPosts = localStorage.getItem("posts");
            if (savedPosts) {
                setData(JSON.parse(savedPosts));
            } else {
                const res = await getPost();
                setData(res.data);
                localStorage.setItem("posts", JSON.stringify(res.data));
            }
        } catch (error) {
            console.error("Error fetching posts:", error);
        }
    };

    const saveToLocalStorage = (newData) => {
        localStorage.setItem("posts", JSON.stringify(newData));
    };

    const handleCreate = () => {
        if (newPost.title && newPost.body) {
            const newPostData = { id: Date.now(), ...newPost };
            const updatedData = [newPostData, ...data];
            setData(updatedData);
            saveToLocalStorage(updatedData);
            setNewPost({ title: "", body: "" });
        }
    };

    const handleDelete = (id) => {
        const updatedData = data.filter((post) => post.id !== id);
        setData(updatedData);
        saveToLocalStorage(updatedData);
    };

    const handleEdit = (id) => {
        const postToEdit = data.find((post) => post.id === id);
        setEditPostId(id);
        setNewPost({ title: postToEdit.title, body: postToEdit.body });
    };

    const handleUpdate = () => {
        if (editPostId) {
            const updatedPost = { title: newPost.title, body: newPost.body };
            const updatedData = data.map((post) =>
                post.id === editPostId ? { ...post, ...updatedPost } : post
            );
            setData(updatedData);
            saveToLocalStorage(updatedData);
            setEditPostId(null);
            setNewPost({ title: "", body: "" });
        }
    };

    useEffect(() => {
        getPostData();
    }, []);

    return (
        <section className="section-post">
            {/* Create / Edit Form */}
            <div className="form-container">
                <input
                    type="text"
                    value={newPost.title}
                    onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                    placeholder="Post Title"
                />
                <textarea
                    value={newPost.body}
                    onChange={(e) => setNewPost({ ...newPost, body: e.target.value })}
                    placeholder="Post Body"
                />
                <button onClick={editPostId ? handleUpdate : handleCreate}>
                    {editPostId ? "Update Post" : "Create Post"}
                </button>
            </div>

            {/* Responsive Card Layout */}
            <ul className="post-container">
                {data.map((curElem, index) => {
                    const { id, body, title } = curElem;
                    return (
                        <li key={id} className="post-card">
                            <p className="post-number">#{index + 1}</p>
                            <h3>{title}</h3>
                            <p>{body}</p>
                            <div className="actions">
                                <button onClick={() => handleEdit(id)}>Edit</button>
                                <button onClick={() => handleDelete(id)}>Delete</button>
                            </div>
                        </li>
                    );
                })}
            </ul>
        </section>
    );
};
