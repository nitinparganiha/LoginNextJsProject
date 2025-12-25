
import database from '@/lib/Database';

class IssueService {
    constructor(issueRepository) {
        this.issueRepository = issueRepository;
    }

    async create(userId, issueData) {
        await database.connect();
        return await this.issueRepository.create({ ...issueData, userId });
    }

    async delete(userId, issueId) {
        await database.connect();
        const issue = await this.issueRepository.findById(issueId);

        if (!issue) {
            throw new Error('Issue not found');
        }

        if (issue.userId.toString() !== userId) {
            throw new Error('Unauthorized to delete this issue');
        }

        return await this.issueRepository.deleteById(issueId);
    }

    async updateStatus(userId, issueId, newStatus) {
        await database.connect();
        const issue = await this.issueRepository.findById(issueId);

        if (!issue) {
            throw new Error('Issue not found');
        }

        if (issue.userId.toString() !== userId) {
            throw new Error('Unauthorized to update this issue');
        }

        return await this.issueRepository.updateStatus(issueId, newStatus);
    }

    async getAll(userId, filterType) {
        await database.connect(); // Ensure connection for reads too
        return await this.issueRepository.findAllByUserId(userId, filterType);
    }
}

export default IssueService;
