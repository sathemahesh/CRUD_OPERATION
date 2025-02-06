import axios from "axios";

// Create an Axios instance
const api = axios.create({
    baseURL: "https://jsonplaceholder.typicode.com"
});

// Get all posts (Read)
export const getPost = () => {
    return api.get("/posts");
};

// Create a new post (Create)
export const createPost = (newPost) => {
    return api.post("/posts", newPost); // Make sure the body structure matches what your API expects
};

// Delete a post by ID (Delete)
export const deletePost = (id) => {
    return api.delete(`/posts/${id}`);
};

// Update an existing post by ID (Update)
export const updatePost = (id, updatedPost) => {
    return api.put(`/posts/${id}`, updatedPost);
};
