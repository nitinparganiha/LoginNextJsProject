
'use client';

import { useState, useTransition, useEffect } from 'react';
import { createIssue, deleteIssue, getIssues, updateIssueStatus } from '@/actions/issueActions';

export default function DashboardClient() {
    const [issues, setIssues] = useState([]);
    const [filter, setFilter] = useState('All');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isPending, startTransition] = useTransition();

    // Fetch issues on mount and when filter changes
    useEffect(() => {
        startTransition(async () => {
            const data = await getIssues(filter);
            setIssues(data);
        });
    }, [filter]);

    async function handleDelete(id) {
        if (!confirm('Are you sure you want to delete this issue?')) return;

        const result = await deleteIssue(id);
        if (result.success) {
            // Optimistic update
            setIssues(issues.filter(i => i.id !== id));
        } else {
            alert(result.error);
        }
    }

    async function handleStatusUpdate(id, newStatus) {
        const result = await updateIssueStatus(id, newStatus);
        if (result.success) {
            setIssues(issues.map(i => i.id === id ? { ...i, status: newStatus } : i));
        }
    }


    return (
        <div className="space-y-6">
            {/* Header Actions */}
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <h2 className="text-2xl font-bold text-gray-900">Issue Management</h2>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                    Create New Issue
                </button>
            </div>

            {/* Filters */}
            <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-700">Filter by Type:</span>
                <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="block w-48 py-2 pl-3 pr-10 text-base border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-black border"
                >
                    <option value="All">All Types</option>
                    <option value="Cloud Security">Cloud Security</option>
                    <option value="Reteam Assessment">Reteam Assessment</option>
                    <option value="VAPT">VAPT</option>
                </select>
                {isPending && <span className="text-sm text-gray-500">Loading...</span>}
            </div>

            {/* Empty State */}
            {!isPending && issues.length === 0 && (
                <div className="p-12 text-center bg-white rounded-lg shadow">
                    <h3 className="text-sm font-medium text-gray-900">No issues found</h3>
                    <p className="mt-1 text-sm text-gray-500">Get started by creating a new issue.</p>
                </div>
            )}

            {/* Issues Grid */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {issues.map(issue => (
                    <IssueCard
                        key={issue.id}
                        issue={issue}
                        onDelete={handleDelete}
                        onStatusUpdate={handleStatusUpdate}
                    />
                ))}
            </div>

            {/* Create Modal */}
            {isModalOpen && (
                <CreateIssueModal
                    onClose={() => setIsModalOpen(false)}
                    onSuccess={() => {
                        setIsModalOpen(false);
                        // Refresh list
                        startTransition(async () => {
                            const data = await getIssues(filter);
                            setIssues(data);
                        });
                    }}
                />
            )}
        </div>
    );
}

function IssueCard({ issue, onDelete, onStatusUpdate }) {
    const priorityColors = {
        Low: 'bg-green-100 text-green-800',
        Medium: 'bg-yellow-100 text-yellow-800',
        High: 'bg-red-100 text-red-800',
    };

    const statusColors = {
        Open: 'gray',
        'In Progress': 'blue',
        Resolved: 'green',
    };

    return (
        <div className="overflow-hidden bg-white rounded-lg shadow transition hover:shadow-md border border-gray-100">
            <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${priorityColors[issue.priority]}`}>
                        {issue.priority} Priority
                    </span>
                    <span className="text-xs text-gray-500">{new Date(issue.createdAt).toLocaleDateString()}</span>
                </div>

                <div className="mb-2">
                    <span className="text-xs font-semibold tracking-wide text-gray-500 uppercase">{issue.type}</span>
                    <h3 className="mt-1 text-lg font-medium leading-6 text-gray-900">{issue.title}</h3>
                </div>

                <p className="text-sm text-gray-500 mb-4 line-clamp-3">{issue.description}</p>

                <div className="flex items-center justify-between pt-4 mt-4 border-t border-gray-200">
                    <select
                        value={issue.status}
                        onChange={(e) => onStatusUpdate(issue.id, e.target.value)}
                        className="text-xs border-none bg-transparent focus:ring-0 cursor-pointer font-medium text-gray-700"
                    >
                        <option value="Open">Open</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Resolved">Resolved</option>
                    </select>

                    <button
                        onClick={() => onDelete(issue.id)}
                        className="text-xs font-medium text-red-600 hover:text-red-500"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
}

function CreateIssueModal({ onClose, onSuccess }) {
    const [error, setError] = useState(null);

    async function handleSubmit(formData) {
        const result = await createIssue(null, formData);
        if (result?.error) {
            setError(result.error);
        } else {
            onSuccess();
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
            <div className="w-full max-w-lg overflow-hidden bg-white rounded-lg shadow-xl">
                <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                    <h3 className="text-lg font-medium text-gray-900">Create New Issue</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-500">&times;</button>
                </div>

                <form action={handleSubmit} className="p-6 space-y-4">
                    {error && (
                        <div className="p-2 text-sm text-red-600 bg-red-50 rounded">
                            {error}
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Issue Type</label>
                        <select name="type" required className="block w-full mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-black px-3 py-2">
                            <option value="">Select a type...</option>
                            <option value="Cloud Security">Cloud Security</option>
                            <option value="Reteam Assessment">Reteam Assessment</option>
                            <option value="VAPT">VAPT</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Title</label>
                        <input name="title" type="text" required className="block w-full mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-black px-3 py-2" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Description</label>
                        <textarea name="description" rows={3} required className="block w-full mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-black px-3 py-2"></textarea>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Priority</label>
                        <select name="priority" className="block w-full mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-black px-3 py-2">
                            <option value="Low">Low</option>
                            <option value="Medium" selected>Medium</option>
                            <option value="High">High</option>
                        </select>
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            Create Issue
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
