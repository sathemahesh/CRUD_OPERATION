import { useEffect, useState } from "react";
import { getPost, createPost, deletePost, updatePost } from "../api/PostApi";
import '../App.css';

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

   
    const handleCreate = async () => {
        try {
            if (newPost.title && newPost.body) {
                const newPostData = { id: Date.now(), ...newPost }; 
                const updatedData = [...data, newPostData];
                setData(updatedData);
                saveToLocalStorage(updatedData); 
                setNewPost({ title: "", body: "" }); 
            }
        } catch (error) {
            console.error("Error creating post:", error);
        }
    };


    const handleDelete = async (id) => {
        try {
            const updatedData = data.filter(post => post.id !== id);
            setData(updatedData);
            saveToLocalStorage(updatedData); 
        } catch (error) {
            console.error("Error deleting post:", error);
        }
    };

    
    const handleEdit = (id) => {
        const postToEdit = data.find(post => post.id === id);
        setEditPostId(id);
        setNewPost({ title: postToEdit.title, body: postToEdit.body }); 
    };

  
    const handleUpdate = async () => {
        if (editPostId) {
            try {
                const updatedPost = { title: newPost.title, body: newPost.body };
                const updatedData = data.map(post => (post.id === editPostId ? { ...post, ...updatedPost } : post));
                setData(updatedData);
                saveToLocalStorage(updatedData); // Save the updated data to localStorage
                setEditPostId(null);
                setNewPost({ title: "", body: "" }); // Reset form after update
            } catch (error) {
                console.error("Error updating post:", error);
            }
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

            {/* List of Posts */}
            <ul>
                {data.map((curElem, index) => {
                    const { id, body, title } = curElem;
                    return (
                        <li key={id}>
                            <p className="post-number">#{index + 1}</p>
                            <p><strong>{title}</strong></p>
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
