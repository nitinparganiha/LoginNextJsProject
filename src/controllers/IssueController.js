
import IssueService from '@/services/IssueService';
import IssueRepository from '@/repositories/IssueRepository';
import IssueValidator from '@/validators/IssueValidator';
import { getSession } from '@/lib/auth';

class IssueController {
    constructor() {
        this.issueService = new IssueService(new IssueRepository());
        this.issueValidator = new IssueValidator();
    }

    async _checkAuth() {
        const session = await getSession();
        if (!session) {
            throw new Error('Unauthorized');
        }
        return session;
    }

    async create(formData) {
        try {
            const session = await this._checkAuth();
            const issueData = this.issueValidator.validateCreate(formData);
            await this.issueService.create(session.user.id, issueData);
            return { success: true };
        } catch (error) {
            return { error: error.message };
        }
    }

    async delete(issueId) {
        try {
            const session = await this._checkAuth();
            await this.issueService.delete(session.user.id, issueId);
            return { success: true };
        } catch (error) {
            return { error: error.message };
        }
    }

    async updateStatus(issueId, newStatus) {
        try {
            const session = await this._checkAuth();
            await this.issueService.updateStatus(session.user.id, issueId, newStatus);
            return { success: true };
        } catch (error) {
            return { error: error.message };
        }
    }

    async getIssues(filterType) {
        // Allows bypassing strict session check if returning empty array is preferred, but let's keep it secure.
        // This might be called from a Client Component via useTransition invoking the server action which calls this.
        // Or mainly from server action.
        // For getIssues, return data directly.
        const session = await getSession();
        if (!session) return [];

        const issues = await this.issueService.getAll(session.user.id, filterType);

        // Serialize Mongoose docs
        return issues.map(issue => ({
            id: issue._id.toString(),
            title: issue.title,
            description: issue.description,
            type: issue.type,
            priority: issue.priority,
            status: issue.status,
            createdAt: issue.createdAt,
        }));
    }
}

export default IssueController;
