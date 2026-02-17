import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { LogOut, User, Menu, X, Plus, Search, Trash2, Edit } from "lucide-react";
import apiClient from "../api";
import toast from "react-hot-toast";

const Dashboard = () => {
    const { user, logout, updateProfile } = useAuth(); // Assuming updateProfile is added to context
    const [todos, setTodos] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false); // New state for profile edit
    const [currentTodo, setCurrentTodo] = useState(null);
    const [formData, setFormData] = useState({ title: "", description: "", status: "pending", priority: "medium" });
    const [profileData, setProfileData] = useState({ name: "", email: "", bio: "", password: "" }); // Profile form data
    const [searchQuery, setSearchQuery] = useState("");
    const [filterStatus, setFilterStatus] = useState("all");

    useEffect(() => {
        fetchTodos();
        if (user) {
            setProfileData({
                name: user.name || "",
                email: user.email || "",
                bio: user.bio || "",
                password: ""
            });
        }
    }, [user]);

    const fetchTodos = async () => {
        try {
            const { data } = await apiClient.get("/todos");
            setTodos(data);
        } catch (error) {
            console.error("Failed to fetch todos", error);
        }
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleProfileChange = (e) => {
        setProfileData({ ...profileData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (currentTodo) {
                await apiClient.put(`/todos/${currentTodo._id}`, formData);
                toast.success("Todo updated");
            } else {
                await apiClient.post("/todos/create", formData);
                toast.success("Todo created");
            }
            setIsModalOpen(false);
            setCurrentTodo(null);
            setFormData({ title: "", description: "", status: "pending", priority: "medium" });
            fetchTodos();
        } catch (error) {
            toast.error("Operation failed");
        }
    };

    const handleProfileSubmit = async (e) => {
        e.preventDefault();
        try {
            const updateData = { ...profileData };
            if (!updateData.password) delete updateData.password; // Don't send empty password

            const result = await updateProfile(updateData);
            if (result.success) {
                toast.success("Profile updated successfully");
                setIsProfileModalOpen(false);
            } else {
                toast.error(result.message);
            }
        } catch (error) {
            toast.error("Failed to update profile");
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure?")) {
            try {
                await apiClient.delete(`/todos/${id}`);
                toast.success("Todo deleted");
                fetchTodos();
            } catch (error) {
                toast.error("Delete failed");
            }
        }
    };

    const openEditModal = (todo) => {
        setCurrentTodo(todo);
        setFormData({ title: todo.title, description: todo.description, status: todo.status, priority: todo.priority });
        setIsModalOpen(true);
    };

    const filteredTodos = todos.filter(todo => {
        const matchesSearch = todo.title.toLowerCase().includes(searchQuery.toLowerCase()) || todo.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = filterStatus === "all" || todo.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Navbar */}
            <nav className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <h1 className="text-2xl font-bold text-indigo-600">TaskFlow</h1>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-2 text-gray-700 cursor-pointer hover:text-indigo-600" onClick={() => setIsProfileModalOpen(true)}>
                                <User size={20} />
                                <span className="hidden md:inline font-medium">{user?.name}</span>
                            </div>
                            <button onClick={logout} className="p-2 rounded-md hover:bg-gray-100 text-gray-600 hover:text-red-500 transition-colors" title="Logout">
                                <LogOut size={20} />
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
                {/* Profile Section Summary */}
                <div className="bg-white rounded-lg shadow p-6 mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-xl font-bold text-gray-800">Welcome back, {user?.name}!</h2>
                        <p className="text-gray-500">{user?.bio || "Ready to productivity?"}</p>
                    </div>
                     <button
                        onClick={() => {
                            setCurrentTodo(null);
                            setFormData({ title: "", description: "", status: "pending", priority: "medium" });
                            setIsModalOpen(true);
                        }}
                        className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
                    >
                        <Plus size={20} className="mr-2" />
                        New Task
                    </button>
                </div>

                {/* Filters */}
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search tasks..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <select
                        className="px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                    >
                        <option value="all">All Status</option>
                        <option value="pending">Pending</option>
                        <option value="in-progress">In Progress</option>
                        <option value="completed">Completed</option>
                    </select>
                </div>

                {/* Todo Grid */}
                {filteredTodos.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-gray-500 text-lg">No tasks found. Create one to get started!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredTodos.map((todo) => (
                            <div key={todo._id} className="bg-white rounded-lg shadow hover:shadow-md transition-shadow p-6 border-l-4"
                                style={{ borderLeftColor: todo.status === 'completed' ? '#10B981' : todo.status === 'in-progress' ? '#F59E0B' : '#EF4444' }}>
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="text-lg font-semibold text-gray-800 line-clamp-1">{todo.title}</h3>
                                    <span className={`px-2 py-1 text-xs rounded-full font-medium
                                        ${todo.priority === 'high' ? 'bg-red-100 text-red-800' :
                                          todo.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                          'bg-green-100 text-green-800'}`}>
                                        {todo.priority}
                                    </span>
                                </div>
                                <p className="text-gray-600 mb-4 line-clamp-2 h-12">{todo.description}</p>
                                <div className="flex justify-between items-center mt-4">
                                     <span className={`text-xs font-semibold uppercase tracking-wider ${
                                         todo.status === 'completed' ? 'text-green-600' :
                                         todo.status === 'in-progress' ? 'text-yellow-600' : 'text-red-500'
                                     }`}>
                                         {todo.status}
                                     </span>
                                     <div className="flex space-x-2">
                                        <button onClick={() => openEditModal(todo)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded bg-transparent">
                                            <Edit size={18} />
                                        </button>
                                        <button onClick={() => handleDelete(todo._id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded bg-transparent">
                                            <Trash2 size={18} />
                                        </button>
                                     </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>

            {/* Task Create/Edit Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 transition-opacity">
                    <div className="bg-white rounded-lg w-full max-w-md p-6 shadow-xl transform transition-all scale-100">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold text-gray-900">{currentTodo ? "Edit Task" : "New Task"}</h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                                <X size={24} />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Title</label>
                                <input name="title" value={formData.title} onChange={handleInputChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Description</label>
                                <textarea name="description" value={formData.description} onChange={handleInputChange} required rows="3" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Status</label>
                                    <select name="status" value={formData.status} onChange={handleInputChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500">
                                        <option value="pending">Pending</option>
                                        <option value="in-progress">In Progress</option>
                                        <option value="completed">Completed</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Priority</label>
                                    <select name="priority" value={formData.priority} onChange={handleInputChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500">
                                        <option value="low">Low</option>
                                        <option value="medium">Medium</option>
                                        <option value="high">High</option>
                                    </select>
                                </div>
                            </div>
                            <button type="submit" className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 mt-4">
                                {currentTodo ? "Update Task" : "Create Task"}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Profile Edit Modal */}
            {isProfileModalOpen && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 transition-opacity">
                    <div className="bg-white rounded-lg w-full max-w-md p-6 shadow-xl transform transition-all scale-100">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold text-gray-900">Edit Profile</h3>
                            <button onClick={() => setIsProfileModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                                <X size={24} />
                            </button>
                        </div>
                        <form onSubmit={handleProfileSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Name</label>
                                <input name="name" value={profileData.name} onChange={handleProfileChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Email</label>
                                <input name="email" type="email" value={profileData.email} onChange={handleProfileChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Bio</label>
                                <textarea name="bio" value={profileData.bio} onChange={handleProfileChange} rows="3" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">New Password (leave blank to keep current)</label>
                                <input name="password" type="password" value={profileData.password} onChange={handleProfileChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500" placeholder="********" />
                            </div>
                            <button type="submit" className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 mt-4">
                                Save Changes
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
